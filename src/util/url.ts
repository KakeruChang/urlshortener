export async function checkURLIsValid(url: string): Promise<boolean> {
  if (typeof url !== "string") return false;

  try {
    new URL(url);
  } catch (_err) {
    return false;
  }
  const response = await fetch("/api/check-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });

  const result = await response.json();

  return !!result.isValid;
}
