import TextInput from "@/components/TextInput";
import { Mode, InputContent } from "@/model/User";
import { selectProfileData } from "@/reducer/User";
import { useAppDispatch } from "@/store";
import { loginThunk } from "@/thunks/UserThunk";
import classNames from "classnames";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useSelector } from "react-redux";

const modeList: Mode[] = ["login", "signup"];

export default function LoginSignup() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [mode, setMode] = useState<Mode>("login");
  const [input, setInput] = useState<InputContent>({
    account: "",
    password: "",
    name: "",
  });
  const error = useSelector(selectProfileData).error;

  const submitHandler = useCallback(async () => {
    if (!input.account || !input.password) {
      return;
    }
    dispatch(
      loginThunk({
        mode,
        input,
      })
    )
      .unwrap()
      .then(() => {
        router.push("/member");
      })
      .catch((err) => {
        console.warn(err);
      });
  }, [dispatch, input, mode, router]);

  return (
    <>
      <Head>
        <title>Login</title>
        <meta name="description" content="URL Shortener" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="px-24">
        <div className="flex w-full mt-24 justify-center flex-col items-center">
          <div className="tabs mt-24 mb-4">
            {modeList.map((item) => (
              <button
                className={classNames("tab tab-bordered", {
                  "tab-active": item === mode,
                })}
                onClick={() => {
                  setMode(item);
                }}
                key={item}
              >
                {item}
              </button>
            ))}
          </div>
          <TextInput
            value={input.account}
            onChange={(newInput) => {
              setInput((prev) => ({ ...prev, account: newInput }));
            }}
            id="Account"
          />
          <TextInput
            value={input.password}
            onChange={(newInput) => {
              setInput((prev) => ({ ...prev, password: newInput }));
            }}
            id="Password"
            type="password"
          />
          {mode === "signup" ? (
            <TextInput
              value={input.name}
              onChange={(newInput) => {
                setInput((prev) => ({ ...prev, name: newInput }));
              }}
              id="Name"
            />
          ) : null}
          {error ? <p className="text-error">{error}</p> : null}
          <button
            className="btn btn-success mt-12"
            disabled={!input.account || !input.password}
            onClick={submitHandler}
          >
            {mode}
          </button>
        </div>
      </main>
    </>
  );
}
