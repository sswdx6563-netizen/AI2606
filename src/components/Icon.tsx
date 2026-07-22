import type { Category } from "../types/quiz";

type IconName = Category["icon"] | "book" | "check" | "close" | "arrow" | "home" | "note" | "target" | "pencil" | "calendar" | "chevron";

export function Icon({ name, size = 24 }: { name: IconName; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  const paths: Record<IconName, React.ReactNode> = {
    book: <><path d="M3.5 5.5c3.2-.8 5.8-.1 8.5 2v12c-2.7-2.1-5.3-2.8-8.5-2V5.5Z"/><path d="M20.5 5.5c-3.2-.8-5.8-.1-8.5 2v12c2.7-2.1 5.3-2.8 8.5-2V5.5Z"/><path d="m8.2 11.5 1.5 1.5 3.1-3.4"/></>,
    brain: <><path d="M9.2 4.2a3 3 0 0 0-5 2.2 3.2 3.2 0 0 0-.1 6.2 3.4 3.4 0 0 0 5.1 4.2V4.2Z"/><path d="M14.8 4.2a3 3 0 0 1 5 2.2 3.2 3.2 0 0 1 .1 6.2 3.4 3.4 0 0 1-5.1 4.2V4.2Z"/><path d="M9.2 8H7.4M9.2 13H6.5M14.8 8h1.8M14.8 13h2.7"/></>,
    database: <><ellipse cx="12" cy="5" rx="7" ry="3"/><path d="M5 5v6c0 1.7 3.1 3 7 3s7-1.3 7-3V5M5 11v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/></>,
    chart: <><path d="M4 19V5M4 19h16"/><path d="m7 15 4-4 3 2 5-7"/><path d="M16 6h3v3"/></>,
    scale: <><path d="M12 3v17M6 6h12M5 6 2.5 12h5L5 6ZM19 6l-2.5 6h5L19 6ZM3 12c.4 2 3.6 2 4 0M17 12c.4 2 3.6 2 4 0M8 21h8"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    close: <path d="m6 6 12 12M18 6 6 18"/>,
    arrow: <path d="m5 12 14 0m-5-5 5 5-5 5"/>,
    home: <><path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10M9 20v-6h6v6"/></>,
    note: <><path d="M5 3h14v18H5z"/><path d="M8 8h8M8 12h8M8 16h5"/></>,
    target: <><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><path d="M12 2v3M22 12h-3"/></>,
    pencil: <><path d="m4 20 4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10L4 20Z"/><path d="m14 7 3 3"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18"/></>,
    chevron: <path d="m9 6 6 6-6 6"/>,
  };

  return <svg {...common}>{paths[name]}</svg>;
}
