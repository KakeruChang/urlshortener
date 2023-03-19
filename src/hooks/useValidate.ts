import { useAppDispatch } from "@/store";
import { validateThunk } from "@/thunks/UserThunk";
import { useEffect } from "react";

export default function useValidate() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(validateThunk());
  }, [dispatch]);

  return null;
}
