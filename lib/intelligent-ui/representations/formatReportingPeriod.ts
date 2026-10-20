/** Fixed English labels keep server and browser ICU range spacing out of hydration. */
export function formatReportingPeriod(start: string, end: string): string {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const [startYear, startMonth, startDay] = start.split("-").map(Number);
  const [endYear, endMonth, endDay] = end.split("-").map(Number);
  const first = `${months[startMonth - 1]} ${startDay}`;
  const last = `${months[endMonth - 1]} ${endDay}`;
  if (start === end) return `${first}, ${startYear}`;
  if (startYear !== endYear)
    return `${first}, ${startYear} – ${last}, ${endYear}`;
  if (startMonth !== endMonth) return `${first} – ${last}, ${startYear}`;
  return `${first}–${endDay}, ${startYear}`;
}
