import { SelectorRootState } from "@/model/Common";
import { MemberUrlContent } from "@/model/Url";
import {
  deleteShortUrlThunk,
  getShortUrlsThunk,
  loginThunk,
  logoutThunk,
  updateOgDataThunk,
  validateThunk,
} from "@/thunks/UserThunk";
import { createSlice } from "@reduxjs/toolkit";

interface MemberContent {
  urls: MemberUrlContent[];
  error: string;
}

interface ProfileContent {
  user: {
    name: string;
    account: string;
    id: string;
  } | null;
  token: string;
  error: string;
}
export interface UserState {
  profile: ProfileContent;
  member: MemberContent;
}

const initialState: UserState = {
  profile: {
    user: null,
    token: "",
    error: "",
  },
  member: {
    urls: [],
    error: "",
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.profile.error = "";
      })
      .addCase(loginThunk.fulfilled, (state, { payload }) => {
        state.profile.token = payload.token;
        state.profile.user = payload.user;
      })
      .addCase(loginThunk.rejected, (state, { payload }) => {
        if (typeof payload === "string") {
          state.profile.error = payload;
        } else {
          state.profile.error = "Some error happened at loginThunk.";
        }
      })
      .addCase(logoutThunk.pending, (state) => {
        state.profile.error = "";
        state.profile.token = "";
        state.profile.user = null;
      })
      .addCase(getShortUrlsThunk.pending, (state) => {
        state.member.error = "";
      })
      .addCase(getShortUrlsThunk.fulfilled, (state, { payload }) => {
        state.member.urls = payload.urls;
      })
      .addCase(getShortUrlsThunk.rejected, (state, { payload }) => {
        if (typeof payload === "string") {
          state.member.error = payload;
        } else {
          state.member.error = "Some error happened at getShortUrlsThunk.";
        }
      })
      .addCase(deleteShortUrlThunk.pending, (state) => {
        state.member.error = "";
      })
      .addCase(deleteShortUrlThunk.fulfilled, (state, { payload }) => {
        state.member.urls = payload.urls;
      })
      .addCase(deleteShortUrlThunk.rejected, (state, { payload }) => {
        if (typeof payload === "string") {
          state.member.error = payload;
        } else {
          state.member.error = "Some error happened at deleteShortUrlThunk.";
        }
      })
      .addCase(updateOgDataThunk.pending, (state) => {
        state.member.error = "";
      })
      .addCase(updateOgDataThunk.fulfilled, (state, { payload }) => {
        state.member.urls = payload.urls;
      })
      .addCase(updateOgDataThunk.rejected, (state, { payload }) => {
        if (typeof payload === "string") {
          state.member.error = payload;
        } else {
          state.member.error = "Some error happened at updateOgDataThunk.";
        }
      })
      .addCase(validateThunk.fulfilled, (state, { payload }) => {
        const user = payload;
        if (!user) {
          state.profile.user = null;
        } else {
          state.profile.user = payload;
        }
      })
      .addCase(validateThunk.rejected, (state, { payload }) => {
        state.profile.user = null;
        if (typeof payload === "string") {
          state.member.error = payload;
        } else {
          state.member.error = "Some error happened at validateThunk.";
        }
      });
  },
});

export default userSlice.reducer;

export type SelectorState = SelectorRootState<UserState, "user">;

export function selectProfileData(state: SelectorState): ProfileContent {
  return state.user.profile;
}

export function selectMemberData(state: SelectorState): MemberContent {
  return state.user.member;
}
