// Format seconds to mm:ss (e.g. 214 → "3:34")
export function formatDuration(seconds: number): string {
  if (!seconds || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// Format a date to "MMM DD, YYYY" (e.g. "Jan 24, 2026")
export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day:   "numeric",
    year:  "numeric",
  });
}

// Format large numbers (e.g. 1200 → "1.2K")
export function formatCount(count: number): string {
  if (count < 1000) return count.toString();
  if (count < 1_000_000) return `${(count / 1000).toFixed(1)}K`;
  return `${(count / 1_000_000).toFixed(1)}M`;
}

// Truncate long text with ellipsis
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return `${text.slice(0, length)}...`;
}