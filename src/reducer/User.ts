import { SelectorRootState } from "@component/model/Common";
import { loginThunk } from "@component/thunks/UserThunk";
import { createSlice } from "@reduxjs/toolkit";

export interface UserState {
  name: string;
  token: string;
  error: string;
}

const initialState: UserState = {
  name: "",
  token: "",
  error: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(loginThunk.fulfilled, (state, { payload }) => {
        state.token = payload.token;
        state.name = payload.name;
        state.error = "";
      })
      .addCase(loginThunk.rejected, (state, { payload }) => {
        if (typeof payload === "string") {
          state.error = payload;
        } else {
          state.error = "Some error happened.";
        }
      });
  },
});

export default userSlice.reducer;

export type SelectorState = SelectorRootState<UserState, "user">;

export function selectUserName(state: SelectorState): string {
  return state.user.name;
}

export function selectUserError(state: SelectorState): string {
  return state.user.error;
}
