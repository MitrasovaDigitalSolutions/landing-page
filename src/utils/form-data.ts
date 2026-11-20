export function readFormString(
  formData: FormData,
  key: string,
  fallback = ""
): string {
  const value = formData.get(key);
  if (typeof value === "string") {
    return value.trim();
  }
  return fallback;
}
