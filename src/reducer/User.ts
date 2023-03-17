import { SelectorRootState } from "@component/model/Common";
import { loginThunk } from "@component/thunks/UserThunk";
import { createSlice } from "@reduxjs/toolkit";

export interface UserState {
  token: string;
  error: string;
}

const initialState: UserState = {
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

export function selectToken(state: SelectorState): string {
  return state.user.token;
}

export function selectUserError(state: SelectorState): string {
  return state.user.error;
}
