type LocalStorageKey = "token";

function setItem<T>(key: LocalStorageKey, item: T) {
  localStorage.setItem(key, JSON.stringify(item));
}

export function getItem<T>(key: LocalStorageKey): T | undefined {
  try {
    const result = localStorage.getItem(key);
    if (result) {
      return JSON.parse(result) as T;
    }
    return undefined;
  } catch (_err) {
    return undefined;
  }
}

export function setToken(token: string) {
  setItem("token", token);
}

export function getToken(): string {
  return getItem("token") ?? "";
}
