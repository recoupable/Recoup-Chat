export function formatTime(seconds: number): string {
  const value = Math.max(0, Math.floor(Number.isFinite(seconds) ? seconds : 0));
  const minutes = Math.floor(value / 60);
  const remainder = String(value % 60).padStart(2, "0");
  return value < 3600
    ? `${minutes}:${remainder}`
    : `${Math.floor(value / 3600)}:${String(minutes % 60).padStart(2, "0")}:${remainder}`;
}
