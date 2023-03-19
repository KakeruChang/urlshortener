import { selectProfileData } from "@/reducer/User";
import { useAppDispatch } from "@/store";
import { logoutThunk } from "@/thunks/UserThunk";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

export default function Navbar() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const profile = useSelector(selectProfileData);

  const logoutHandler = () => {
    dispatch(logoutThunk())
      .unwrap()
      .catch((err) => {
        console.warn("logoutHandler", err);
      })
      .finally(() => {
        router.push("/");
      });
  };

  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <Link href="/" as="/" className="btn btn-ghost normal-case text-xl">
          Home
        </Link>
        {profile.name ? (
          <>
            <Link
              href="/member"
              as="/member"
              className="btn btn-ghost normal-case text-xl"
            >
              Member
            </Link>
            <span className="ml-6">Hi,{profile.name}~</span>
          </>
        ) : null}
      </div>
      <div className="navbar-center hidden lg:flex">
        <h1 className="text-3xl font-black">URL Shortener</h1>
      </div>
      <div className="navbar-end">
        {profile.name ? (
          <button className="btn" onClick={logoutHandler}>
            Log out
          </button>
        ) : (
          <Link href="/login" as="/login" className="btn">
            Log in
          </Link>
        )}
      </div>
    </div>
  );
}
