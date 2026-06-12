/** Stable date formatting for SSR + client (avoids locale hydration mismatches). */
const dateTimeOpts: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "UTC",
};

const dateOpts: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZone: "UTC",
};

export function formatDateTime(value: string | Date): string {
  return new Date(value).toLocaleString("en-US", dateTimeOpts);
}

export function formatDate(value: string | Date): string {
  return new Date(value).toLocaleDateString("en-US", dateOpts);
}
