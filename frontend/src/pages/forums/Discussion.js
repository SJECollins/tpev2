import React from "react";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { Link } from "react-router-dom";
import Tooltip from "../../components/Tooltip";

const Discussion = (props) => {
  const {
    id,
    owner,
    profile_id,
    profile_image,
    title,
    content,
    added_on,
    updated_on,
    replies_count,
  } = props;

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;

  return (
    <div className="Borders PlantCard">
      <Link to={`/discussion/${id}`}>
        <h3 className="px-2 inline-links">{title}</h3>
      </Link>
      <hr />
      <div className="p-2">
        <p className="truncate">{content}</p>
      </div>
      <hr />
      <div className="w-full">
        <div className="flex flex-row justify-between">
          {is_owner ? (
            <div className="p-2">
              <p className="text-xs">
                You posted this, {added_on}
                <br />
                Last edited: {updated_on}
              </p>
            </div>
          ) : (
            <p className="text-xs p-2">
              Posted by
              <Link to={`/profile/${profile_id}`}>
                <img
                  src={profile_image}
                  alt={owner}
                  className="w-10 h-10 object-contain"
                />{" "}
                {owner}
              </Link>
              , {added_on} <br />
              Last edited: {updated_on}
            </p>
          )}
          <span className="flex flex-row justify-end p-2">
            <Tooltip
              message={"Number of replies"}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                  />
                </svg>
              }
            />
            {replies_count}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Discussion;
