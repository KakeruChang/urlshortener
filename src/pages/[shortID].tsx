import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";

export default function ShortUrl() {
  const router = useRouter();
  const { shortID } = router.query;

  useEffect(() => {
    if (shortID) {
      window.location.href = `/api/${shortID}`;
    }
  }, [shortID]);

  return null;
}
