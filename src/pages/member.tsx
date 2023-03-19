import Navbar from "@/components/Navbar";
import UpdateOgBlock from "@/components/UpdateOgBlock";
import { selectMemberData, selectProfileData } from "@/reducer/User";
import { useAppDispatch } from "@/store";
import { getShortUrlsThunk } from "@/thunks/UserThunk";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function Member() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const shortUrlList = useSelector(selectMemberData).urls;
  const profile = useSelector(selectProfileData);

  useEffect(() => {
    dispatch(getShortUrlsThunk())
      .unwrap()
      .catch((err) => {
        console.warn(err);
      });
  }, [dispatch]);

  useEffect(() => {
    if (!profile.name) {
      router.push("/");
    }
  }, [profile.name, router]);

  return (
    <>
      <Navbar />
      <div className="p-24">
        {shortUrlList?.map((url) => (
          <UpdateOgBlock
            shortUrl={url.shortUrl}
            title={url.title}
            description={url.description}
            times={url.times}
            image={url.image}
            key={url.shortUrl}
          />
        ))}
      </div>
    </>
  );
}
