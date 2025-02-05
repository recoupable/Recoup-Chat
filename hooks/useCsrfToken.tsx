export function useCsrfToken() {
  if (typeof document === "undefined") {
    return "";
  }

  const meta = document.querySelector('meta[name="csrf-token"]');

  if (!meta) {
    return "";
  }

  return meta.getAttribute("content") ?? "";
}
