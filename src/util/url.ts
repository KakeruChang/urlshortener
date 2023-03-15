export async function checkURLIsValid(url: string): Promise<boolean> {
  if (typeof url !== "string") return false;

  try {
    new URL(url);
    return true;
  } catch (_err) {
    return false;
  }

  // return fetch(url)
  //   .then((response) => {
  //     return response.status === 200;
  //   })
  //   .catch(() => {
  //     return false;
  //   });
}
