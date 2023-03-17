import { Mode, InputContent } from "@component/model/User";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface loginAPIResult {
  token: string;
}

export interface loginThunkParams {
  mode: Mode;
  input: InputContent;
}

export const loginThunk = createAsyncThunk<loginAPIResult, loginThunkParams>(
  "login",
  async ({ input, mode }, context) => {
    axios;
    try {
      const response = await axios.post<{ token: string }>(
        `/api/${mode}`,
        input
      );

      return { token: response.data.token };
    } catch (error) {
      console.warn("loginThunk error", error);
      return context.rejectWithValue((error as Error)?.message);
    }
  }
);
