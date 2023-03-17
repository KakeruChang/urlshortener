import axios from "@component/axios";
import { Mode, InputContent } from "@component/model/User";
import { setToken } from "@component/util/storage";
import { createAsyncThunk } from "@reduxjs/toolkit";

interface loginAPIResult {
  token: string;
  name: string;
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
      const response = await axios.post<loginAPIResult>(`/${mode}`, input);
      const { token, name } = response.data;
      if (typeof token === "string") {
        setToken(token);
      }

      return { token, name };
    } catch (error) {
      console.warn("loginThunk error", error);
      return context.rejectWithValue((error as Error)?.message);
    }
  }
);
