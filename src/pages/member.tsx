import { selectMemberData } from "@component/reducer/User";
import { useAppDispatch } from "@component/store";
import {
  deleteShortUrlThunk,
  getShortUrlsThunk,
} from "@component/thunks/UserThunk";
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

  const deleteShortUrl = (shortUrl: string) => {
    const result = confirm("Are you sure to delete this short url?");
    if (result) {
      dispatch(deleteShortUrlThunk({ shortUrl }));
    }
  };

  return (
    <div className="p-24">
      {shortUrlList?.map((url) => (
        <div
          className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box mb-12"
          key={url.shortUrl}
        >
          <input type="checkbox" />
          <div className="collapse-title text-xl font-medium">
            {url.shortUrl}
          </div>
          <div className="collapse-content">
            <button
              className="btn btn-outline btn-error"
              onClick={() => {
                deleteShortUrl(url.shortUrl);
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
