import axios from "@component/axios";

export async function checkURLIsValid(url: string): Promise<boolean> {
  if (typeof url !== "string") return false;

  try {
    new URL(url);
  } catch (_err) {
    return false;
  }

  const result = (await axios.post<{ isValid: boolean }>("/check-url", { url }))
    .data;

  return !!result.isValid;
}
