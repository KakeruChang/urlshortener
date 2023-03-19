import UpdateOgBlock from "@/components/UpdateOgBlock";
import { selectMemberData } from "@/reducer/User";
import { useAppDispatch } from "@/store";
import { getShortUrlsThunk } from "@/thunks/UserThunk";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function Member() {
  const dispatch = useAppDispatch();
  const shortUrlList = useSelector(selectMemberData).urls;

  useEffect(() => {
    dispatch(getShortUrlsThunk())
      .unwrap()
      .catch((err) => {
        console.warn(err);
      });
  }, [dispatch]);

  return (
    <div className="p-24">
      {shortUrlList?.map((url) => (
        <UpdateOgBlock
          shortUrl={url.shortUrl}
          title={url.title}
          description={url.description}
          image={url.image}
          key={url.shortUrl}
        />
      ))}
    </div>
  );
}
