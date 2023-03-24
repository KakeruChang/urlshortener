import axios from "@/axios";
import { MemberUrlContent } from "@/model/Url";
import { Mode, InputContent, UserWithoutPWD } from "@/model/User";
import { getToken, setToken } from "@/util/storage";
import { createAsyncThunk } from "@reduxjs/toolkit";

interface LoginAPIResult {
  token: string;
  user: UserWithoutPWD;
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
      const { token, user } = response.data;
      if (typeof token === "string") {
        setToken(token);
      }

      return { token, user };
    } catch (error) {
      console.warn("loginThunk error", error);
      return context.rejectWithValue((error as Error)?.message);
    }
  }
);

export const logoutThunk = createAsyncThunk<undefined, undefined>(
  "logout",
  async (_args, context) => {
    try {
      setToken("");
      await axios.get("/logout");

      return undefined;
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
  user?: UserWithoutPWD;
}

export const validateThunk = createAsyncThunk<
  UserWithoutPWD | undefined,
  undefined
>("validate", async (_args, context) => {
  try {
    const token = getToken();
    if (!token) return undefined;

    const response = await axios.get<ValidateAPIResult>("/validate");
    const user = response.data.user;

    return user;
  } catch (error) {
    console.warn("validateThunk error", error);
    return context.rejectWithValue((error as Error)?.message);
  }
});
