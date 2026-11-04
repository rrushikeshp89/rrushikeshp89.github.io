"""Generate public/flow-lines.svg, the static decorative art behind the hero.

A 2D incompressible Navier-Stokes run (fluidsim, ns2d solver) decays from seeded random noise into
a few coherent vortices. Evenly spaced streamlines are then traced through the final velocity
field and written as one compact SVG path. Nothing here runs in the browser: the site ships the
SVG only. Re-run with:

    python -m venv .venv && .venv/Scripts/pip install -r requirements.txt   (Windows)
    .venv/Scripts/python generate.py

Output is deterministic for a given SEED.
"""

from __future__ import annotations

import os
import sys
import tempfile
from pathlib import Path

import numpy as np

SEED = 11
GRID = 128
T_END = 12.0
VISCOSITY = 1e-3

VIEW_W, VIEW_H = 1200, 800
SEPARATION = 26.0  # minimum distance between streamlines, in viewBox units
STEP = 4.0  # integration step, in viewBox units
MIN_POINTS = 12
MIN_EXTENT = 40.0  # drop tiny closed loops: bounding-box diagonal below this, in viewBox units
MAX_POINTS = 260

OUTPUT = Path(__file__).resolve().parents[2] / "public" / "flow-lines.svg"


def simulate_velocity() -> tuple[np.ndarray, np.ndarray]:
    """Run the decaying-turbulence simulation and return (ux, uy) on the GRID x GRID mesh."""
    os.environ.setdefault("FLUIDSIM_PATH", tempfile.mkdtemp(prefix="fluidsim-"))
    from fluidsim.solvers.ns2d.solver import Simul

    np.random.seed(SEED)
    params = Simul.create_default_params()
    params.oper.nx = params.oper.ny = GRID
    params.oper.Lx = params.oper.Ly = 2 * np.pi
    params.nu_2 = VISCOSITY
    params.init_fields.type = "noise"
    params.time_stepping.t_end = T_END
    params.output.HAS_TO_SAVE = False
    params.output.sub_directory = "flow-lines"
    params.short_name_type_run = "art"

    sim = Simul(params)
    sim.time_stepping.start()
    return np.asarray(sim.state.get_var("ux")), np.asarray(sim.state.get_var("uy"))


def make_sampler(ux: np.ndarray, uy: np.ndarray):
    """Bilinear, periodic sampling of the unit flow direction at viewBox coordinates."""
    ny, nx = ux.shape
    scale = nx / VIEW_W  # the viewBox maps onto the top 2/3 of the square domain

    def direction(x: float, y: float) -> tuple[float, float] | None:
        gx, gy = x * scale, y * scale
        i0, j0 = int(np.floor(gx)) % nx, int(np.floor(gy)) % ny
        i1, j1 = (i0 + 1) % nx, (j0 + 1) % ny
        fx, fy = gx - np.floor(gx), gy - np.floor(gy)

        def lerp(field: np.ndarray) -> float:
            top = field[j0, i0] * (1 - fx) + field[j0, i1] * fx
            bottom = field[j1, i0] * (1 - fx) + field[j1, i1] * fx
            return float(top * (1 - fy) + bottom * fy)

        vx, vy = lerp(ux), lerp(uy)
        speed = np.hypot(vx, vy)
        if speed < 1e-9:
            return None
        return vx / speed, vy / speed

    return direction


class Occupancy:
    """A coarse grid that answers "is there already a line near this point?"."""

    def __init__(self, cell: float) -> None:
        self.cell = cell
        self.cells: dict[tuple[int, int], list[tuple[float, float]]] = {}

    def _key(self, x: float, y: float) -> tuple[int, int]:
        return int(x // self.cell), int(y // self.cell)

    def is_free(self, x: float, y: float, distance: float) -> bool:
        kx, ky = self._key(x, y)
        for dx in (-1, 0, 1):
            for dy in (-1, 0, 1):
                for px, py in self.cells.get((kx + dx, ky + dy), ()):
                    if (px - x) ** 2 + (py - y) ** 2 < distance**2:
                        return False
        return True

    def add(self, points: list[tuple[float, float]]) -> None:
        for x, y in points:
            self.cells.setdefault(self._key(x, y), []).append((x, y))


def inside(x: float, y: float) -> bool:
    return 0 <= x <= VIEW_W and 0 <= y <= VIEW_H


def trace(seed: tuple[float, float], direction, occupied: Occupancy) -> list[tuple[float, float]]:
    """Integrate forwards and backwards (midpoint rule) until the line leaves, stalls or crowds."""
    halves = []
    for sign in (1.0, -1.0):
        x, y = seed
        points: list[tuple[float, float]] = []
        for _ in range(MAX_POINTS // 2):
            first = direction(x, y)
            if first is None:
                break
            mid = direction(x + sign * first[0] * STEP / 2, y + sign * first[1] * STEP / 2)
            if mid is None:
                break
            x, y = x + sign * mid[0] * STEP, y + sign * mid[1] * STEP
            if not inside(x, y) or not occupied.is_free(x, y, SEPARATION * 0.5):
                break
            points.append((x, y))
        halves.append(points)
    forward, backward = halves
    return [*reversed(backward), seed, *forward]


def extent(line: list[tuple[float, float]]) -> float:
    xs, ys = zip(*line)
    return float(np.hypot(max(xs) - min(xs), max(ys) - min(ys)))


def streamlines(direction) -> list[list[tuple[float, float]]]:
    rng = np.random.default_rng(SEED)
    occupied = Occupancy(SEPARATION)
    seeds = [
        (x + rng.uniform(-6, 6), y + rng.uniform(-6, 6))
        for y in np.arange(SEPARATION / 2, VIEW_H, SEPARATION)
        for x in np.arange(SEPARATION / 2, VIEW_W, SEPARATION)
    ]
    rng.shuffle(seeds)

    lines = []
    for seed in seeds:
        if not occupied.is_free(*seed, SEPARATION):
            continue
        line = trace(seed, direction, occupied)
        if len(line) >= MIN_POINTS and extent(line) >= MIN_EXTENT:
            occupied.add(line)
            lines.append(line)
    return lines


def to_path(line: list[tuple[float, float]]) -> str:
    """Absolute first point, then relative integer steps (every other point) to keep it small."""
    points = [(round(x), round(y)) for x, y in line[::2]]
    start_x, start_y = points[0]
    steps = []
    for (ax, ay), (bx, by) in zip(points, points[1:]):
        if (bx, by) != (ax, ay):
            steps.append(f"{bx - ax} {by - ay}")
    return f"M{start_x} {start_y}l" + " ".join(steps)


def main() -> int:
    ux, uy = simulate_velocity()
    lines = streamlines(make_sampler(ux, uy))
    path = "".join(to_path(line) for line in lines)
    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {VIEW_W} {VIEW_H}">'
        f'<path d="{path}" fill="none" stroke="#000" stroke-width="1.4" '
        'stroke-linecap="round" stroke-linejoin="round"/></svg>\n'
    )
    OUTPUT.write_text(svg, encoding="utf-8", newline="
")
    print(f"{len(lines)} streamlines, {len(svg.encode()) / 1024:.1f} kB -> {OUTPUT}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
