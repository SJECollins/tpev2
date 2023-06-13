import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { axiosReq, axiosRes } from "../../api/axiosDefaults";

const ProfileSubs = () => {
  const { id } = useParams();
  const [watchList, setWatchList] = useState({ results: [] });
  const [followList, setFollowList] = useState({ results: [] });

  useEffect(() => {
    const handleMount = async () => {
      try {
        const [{ data: watching }, { data: following }] = await Promise.all[
          (axiosReq.get(`/watch-list/?owner=${id}`),
          axiosReq.get(`/follow-list/?owner=${id}`))
        ];
        setWatchList({ results: watching });
        setFollowList({ results: following });
      } catch (err) {
        console.log(err);
      }
    };
    handleMount();
  }, [id]);

  const handleDelete = async (event) => {
    if (event.target.name === "watching") {
      const newWatchList = watchList.filter(
        (watched) => watched.id !== event.target.value
      );
      setWatchList({ results: newWatchList });
    } else if (event.target.name === "following") {
      const newFollowList = followList.filter(
        (followed) => followed.id !== event.target.value
      );
      setFollowList({ results: newFollowList });
    }
    try {
      await axiosRes.delete(`/${event.target.name}/${event.target.value}/`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h4>Watched Ads: </h4>
      {watchList.results.length > 0 ? (
        <ul>
          {watchList.results.map((watched) => (
            <li key={watched.id}>
              <Link to="/">{watched.ad_title}</Link>
              <button
                type="button"
                className="links"
                name="watching"
                value={watched.id}
                onClick={(event) => handleDelete(event)}
              >
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5 inline-block"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>You're not watching any ads.</p>
      )}
      <hr />
      <h4>Followed Discussions: </h4>
      {followList.results.length > 0 ? (
        <ul>
          {followList.results.map((followed) => (
            <li key={followed.id}>
              <Link to="/">{followed.discussion_title}</Link>
              <button
                type="button"
                className="links"
                name="following"
                value={followed.id}
                onClick={(event) => handleDelete(event)}
              >
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5 inline-block"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>You're not following any discussions.</p>
      )}
    </div>
  );
};

export default ProfileSubs;
