"use client";

import { useId, useState } from "react";
import {
  DEMO_FIELD_LABELS,
  DEMO_FIELDS,
  DEMO_PEOPLE,
  DEMO_ROLE_LABELS,
  DEMO_ROLES,
  type DemoRole,
} from "@/content/roleDemo";
import { cellFor, isViewer, summarise, visiblePeople } from "@/lib/permissions-demo";

interface RoleSwitchProps {
  liveDemoHref: string;
}

/**
 * Grove HRMS in miniature: pick a role and the sample directory shows only what that role may
 * see. A native radio group (arrow keys move between roles), a real table, and a status line
 * that announces the change. Works the same with or without motion; nothing animates.
 */
export function RoleSwitch({ liveDemoHref }: RoleSwitchProps) {
  const [role, setRole] = useState<DemoRole>("employee");
  const groupName = useId();
  const people = visiblePeople(role, DEMO_PEOPLE);
  const summary = summarise(role, DEMO_PEOPLE);
  const roleLabel = DEMO_ROLE_LABELS[role];

  return (
    <div className="rounded-slip border border-rule bg-paper p-4 sm:p-6">
      <fieldset>
        <legend className="font-medium">View the directory as</legend>
        <div className="mt-3 grid grid-cols-3 gap-1 rounded-chip border border-rule p-1 sm:inline-flex">
          {DEMO_ROLES.map((option) => (
            <label key={option} className="relative">
              <input
                type="radio"
                name={groupName}
                value={option}
                checked={role === option}
                onChange={() => setRole(option)}
                className="peer sr-only"
              />
              <span className="inline-flex min-h-11 w-full cursor-pointer items-center justify-center rounded-chip px-1 text-center text-small whitespace-nowrap transition-colors duration-200 peer-checked:bg-accent peer-checked:text-on-accent peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent hover:bg-accent-soft peer-checked:hover:bg-accent sm:px-4">
                {DEMO_ROLE_LABELS[option]}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div
        role="region"
        aria-label={`Sample directory as seen by ${roleLabel}`}
        tabIndex={0}
        className="mt-5 overflow-x-auto rounded-chip"
      >
        <table className="w-full min-w-[34rem] border-collapse text-left text-small">
          <caption className="sr-only">
            Sample directory as seen by {roleLabel}. Illustrative data.
          </caption>
          <thead>
            <tr className="border-b border-rule text-ink-muted">
              <th scope="col" className="py-2 pr-4 font-medium">
                Person
              </th>
              <th scope="col" className="py-2 pr-4 font-medium">
                Team
              </th>
              {DEMO_FIELDS.map((field) => (
                <th key={field} scope="col" className="py-2 pr-4 font-medium">
                  {DEMO_FIELD_LABELS[field]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {people.map((person) => (
              <tr key={person.id} className="border-b border-rule last:border-0">
                <th scope="row" className="py-2.5 pr-4 font-medium">
                  {person.name}
                  {isViewer(role, person) ? (
                    <span className="ml-2 font-normal text-ink-muted">(you)</span>
                  ) : null}
                  {person.status === "offboarded" ? (
                    <span className="ml-2 font-normal text-ink-muted">(offboarded)</span>
                  ) : null}
                </th>
                <td className="py-2.5 pr-4">{person.team}</td>
                {DEMO_FIELDS.map((field) => {
                  const cell = cellFor(role, person, field, DEMO_PEOPLE);
                  return (
                    <td key={field} className="py-2.5 pr-4">
                      {cell.visible ? (
                        <span className="font-mono">{cell.value}</span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-ink-muted">
                          <LockIcon />
                          Restricted
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p role="status" className="mt-4 text-small text-ink-muted">
        As {roleLabel}: {summary.shownPeople} of {summary.totalPeople} people shown,{" "}
        {summary.restrictedCells === 0
          ? "nothing restricted"
          : `${summary.restrictedCells} fields restricted`}
        .
      </p>
      <p className="mt-3 text-small">
        <span className="font-medium">Enforced on the server, not hidden in the UI.</span> This
        table is an illustration with made-up people;{" "}
        <a
          href={liveDemoHref}
          rel="noopener noreferrer"
          data-inline-target=""
          className="text-accent underline decoration-accent/50 underline-offset-[0.2em] hover:decoration-2"
        >
          try the real permissions in the Grove HRMS live demo
        </a>
        .
      </p>
    </div>
  );
}

function LockIcon() {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 16 16" className="size-3.5" fill="none">
      <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
