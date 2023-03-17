export interface ResponseContent {
  message?: string;
}

export type SelectorRootState<NestedState, Key extends string> = {
  [key in Key]: NestedState;
};
