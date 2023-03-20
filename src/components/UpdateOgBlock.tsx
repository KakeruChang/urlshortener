import { MemberUrlContent } from "@/model/Url";
import { useAppDispatch } from "@/store";
import { deleteShortUrlThunk, updateOgDataThunk } from "@/thunks/UserThunk";
import { getBasicUrl } from "@/util/url";
import classNames from "classnames";
import { useState } from "react";
import TextInput from "./TextInput";

export default function UpdateOgBlock({
  shortUrl,
  title,
  description,
  image,
  times,
}: MemberUrlContent) {
  const dispatch = useAppDispatch();
  const [ogData, setOgData] = useState({
    title: title ?? "",
    description: description ?? "",
    image: image ?? "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const submittable = !!(ogData.title && ogData.description && ogData.image);

  const deleteShortUrl = () => {
    const result = confirm("Are you sure to delete this short url?");
    if (result) {
      dispatch(deleteShortUrlThunk({ shortUrl }));
    }
  };

  const updateOgData = () => {
    if (!isEditing) {
      setIsEditing(true);
    } else {
      if (submittable) {
        const result = confirm("Are you sure to update this og data?");
        if (result) {
          dispatch(updateOgDataThunk({ shortUrl, ...ogData })).finally(() => {
            setIsEditing(false);
          });
        }
      }
    }
  };

  return (
    <div className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box mb-12">
      <input type="checkbox" />
      <div className="collapse-title text-xl font-medium">
        {getBasicUrl() + shortUrl}
        <div className="badge badge-secondary badge-outline ml-6">{`number of uses: ${
          times ?? 0
        }`}</div>
      </div>
      <div className="collapse-content">
        <div className="flex">
          <button
            className="btn btn-outline btn-error mr-5"
            onClick={() => {
              deleteShortUrl();
            }}
          >
            Delete
          </button>
          <button
            className="btn btn-accent"
            onClick={updateOgData}
            disabled={!submittable}
          >
            {isEditing ? "Update" : "Edit"}
          </button>
        </div>
        <TextInput
          id="ogTitle"
          value={ogData.title}
          onChange={(newInput) => {
            setOgData((prev) => ({ ...prev, title: newInput }));
          }}
          disabled={!isEditing}
        />
        <TextInput
          id="ogDescription"
          value={ogData.description}
          onChange={(newInput) => {
            setOgData((prev) => ({ ...prev, description: newInput }));
          }}
          disabled={!isEditing}
        />
        <TextInput
          id="ogImage"
          value={ogData.image}
          onChange={(newInput) => {
            setOgData((prev) => ({ ...prev, image: newInput }));
          }}
          disabled={!isEditing}
        />
        <div
          className={classNames(
            "w-[600px] h-[400px]",
            "bg-no-repeat bg-contain"
          )}
          style={{ backgroundImage: `url(${ogData.image})` }}
        />
      </div>
    </div>
  );
}
