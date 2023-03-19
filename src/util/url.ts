import axios from "@/axios";

export async function checkURLIsValid(url: string): Promise<boolean> {
  if (typeof url !== "string") return false;

  try {
    new URL(url);
  } catch (_err) {
    return false;
  }

  const result = (
    await axios.post<{ is_valid: boolean }>("/check-url", { url })
  ).data;

  return !!result.is_valid;
}

export function getBasicUrl() {
  const url = new URL(location.href);
  return `${url.origin}/`;
}
