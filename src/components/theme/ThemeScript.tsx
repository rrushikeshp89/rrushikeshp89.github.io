import { THEME_SCRIPT } from "@/lib/theme-script";

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />;
}
