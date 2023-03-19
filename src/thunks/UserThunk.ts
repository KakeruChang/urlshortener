import axios from "@/axios";
import { MemberUrlContent } from "@/model/Url";
import { Mode, InputContent } from "@/model/User";
import { setToken } from "@/util/storage";
import { createAsyncThunk } from "@reduxjs/toolkit";

interface LoginAPIResult {
  token: string;
  name: string;
}

export interface loginThunkParams {
  mode: Mode;
  input: InputContent;
}

export const loginThunk = createAsyncThunk<LoginAPIResult, loginThunkParams>(
  "login",
  async ({ input, mode }, context) => {
    try {
      const response = await axios.post<LoginAPIResult>(`/${mode}`, input);
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

interface LogoutAPIResult {
  token: string;
}

export const logoutThunk = createAsyncThunk<LogoutAPIResult, undefined>(
  "logout",
  async (_args, context) => {
    try {
      const response = await axios.get<LogoutAPIResult>("/logout");
      const { token } = response.data;
      if (typeof token === "string") {
        setToken(token);
      }

      return { token };
    } catch (error) {
      console.warn("logoutThunk error", error);
      return context.rejectWithValue((error as Error)?.message);
    }
  }
);

interface GetShortUrlsApiResult {
  urls: MemberUrlContent[];
}

export const getShortUrlsThunk = createAsyncThunk<
  GetShortUrlsApiResult,
  undefined
>("getShortUrls", async (_args, context) => {
  try {
    const response = await axios.get<GetShortUrlsApiResult>("/member");

    return response.data;
  } catch (error) {
    console.warn("getShortUrlsThunk error", error);
    return context.rejectWithValue((error as Error)?.message);
  }
});

interface DeleteShortUrlThunkParams {
  shortUrl: string;
}

export const deleteShortUrlThunk = createAsyncThunk<
  GetShortUrlsApiResult,
  DeleteShortUrlThunkParams
>("deleteShortUrl", async ({ shortUrl }, context) => {
  try {
    const response = await axios.delete<GetShortUrlsApiResult>(
      `/member/${shortUrl}`
    );

    return response.data;
  } catch (error) {
    console.warn("deleteShortUrlThunk error", error);
    return context.rejectWithValue((error as Error)?.message);
  }
});

interface UpdateOgDataThunkParams {
  shortUrl: string;
  title: string;
  description: string;
  image: string;
}

export const updateOgDataThunk = createAsyncThunk<
  GetShortUrlsApiResult,
  UpdateOgDataThunkParams
>("updateOgData", async (args, context) => {
  try {
    const response = await axios.put<GetShortUrlsApiResult>("/member", args);

    return response.data;
  } catch (error) {
    console.warn("updateOgDataThunk error", error);
    return context.rejectWithValue((error as Error)?.message);
  }
});

interface ValidateAPIResult {
  name?: string;
}

export const validateThunk = createAsyncThunk<string, undefined>(
  "validate",
  async (_args, context) => {
    try {
      const response = await axios.get<ValidateAPIResult>("/validate");
      const { name } = response.data;

      return name ?? "";
    } catch (error) {
      console.warn("validateThunk error", error);
      return context.rejectWithValue((error as Error)?.message);
    }
  }
);
