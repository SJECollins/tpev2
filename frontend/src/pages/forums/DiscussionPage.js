import React, { useEffect, useState, useMemo } from "react";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { useParams, Link } from "react-router-dom";
import { axiosReq, axiosRes } from "../../api/axiosDefaults";
import Tooltip from "../../components/Tooltip";
import Reply from "./Reply";
import ReplyCreate from "./ReplyCreate";
import Pagination from "../../components/Pagination";

let pageSize = 10;

const DiscussionPage = () => {
  const [forumData, setForumData] = useState({ results: [] });
  const [discussion, setDiscussion] = useState({ results: [] });
  const {
    id,
    owner,
    profile_id,
    profile_image,
    forum,
    title,
    content,
    added_on,
    updated_on,
    open,
    replies_count,
  } = discussion?.results[0] || {};
  const [replies, setReplies] = useState({ results: [] });
  const [currentPage, setCurrentPage] = useState(1);
  const [showReply, setShowReply] = useState(false);
  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;
  const { discussionID } = useParams();

  useEffect(() => {
    const handleMount = async () => {
      try {
        const [{ data: forum }, { data: discussion }, { data: replies }] =
          await Promise.all([
            axiosReq.get(`/forums/?discussion=${discussionID}`),
            axiosReq.get(`/discussion/${discussionID}`),
            axiosReq.get(`/replies/?discussion=${discussionID}`),
          ]);
        setForumData({ results: forum });
        setDiscussion({ results: [discussion] });
        setReplies({ results: replies });
      } catch (err) {
        console.log(err);
      }
    };
    handleMount();
  }, [discussionID]);

  const handleDelete = async () => {
    try {
      await axiosRes.patch(`/discussion/${discussionID}`, {
        title: "Deleted",
        content: "Discussion deleted by user",
      });
      setDiscussion((prevDiscussion) => ({
        results: [
          {
            ...prevDiscussion.results[0],
            title: "Deleted",
            content: "Discussion deleted by user",
          },
        ],
      }));
    } catch (err) {
      console.log(err);
    }
  };

  const handleShowReply = () => {
    setShowReply((current) => !current);
  };

  const currentPageData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * pageSize;
    const lastPageIndex = firstPageIndex + pageSize;
    return replies.results?.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, replies]);

  return (
    <div className="w-11/12 md:w-4/5 mx-auto">
      <h2>
        Forum:{" "}
        {forumData?.results.length ? (
          forumData.results
            .filter((item) => item.id === forum)
            .map((item) => (
              <Link key={item.id} to={`/forum/${id}`} className="inline-links">
                {item.title}
              </Link>
            ))
        ) : (
          <span>Forum not found</span>
        )}
      </h2>
      <div className="my-4">
        <h3 className="text-center">{title}</h3>
        <hr />
        <div className="Borders">
          <div className="flex flex-col sm:flex-row p-2">
            <div className="sm:w-[200px] flex items-center justify-between sm:block">
              <p className="text-xs flex items-baseline pb-2">
                User:
                <Link
                  to={`/profile/${profile_id}`}
                  className="inline-links flex items-baseline"
                >
                  <img
                    src={profile_image}
                    alt={owner}
                    className="w-8 h-8 object-contain"
                  />{" "}
                  {owner}
                </Link>
              </p>
              <div>
                <p className="text-xs">Posted: {added_on}</p>
                <p className="text-xs">Last updated: {updated_on}</p>
              </div>
            </div>
            <hr className="block sm:hidden py-2" />
            <div>
              <p>{content}</p>
            </div>
          </div>
          <hr />
          <div className="flex flex-row justify-between">
            {is_owner && (
              <div>
                <Link className="links" to={`/discussion/${id}/edit`}>
                  Edit
                </Link>
                <button className="links" onClick={handleDelete}>
                  Delete
                </button>
              </div>
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
        {replies.results?.length > 0 &&
          currentPageData.map((reply) => {
            return (
              <Reply
                {...reply}
                key={reply.id}
                setDiscussion={setDiscussion}
                setReplies={setReplies}
              />
            );
          })}
        {open && currentUser && (
          <div className="flex flex-row justify-end">
            <button onClick={handleShowReply} className="links">
              Add Reply
            </button>
          </div>
        )}
        {open && currentUser && showReply && (
          <ReplyCreate
            discussion={id}
            setShowReply={setShowReply}
            setDiscussion={setDiscussion}
            setReplies={setReplies}
          />
        )}
      </div>
      {replies.results?.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalCount={replies.results?.length}
          pageSize={pageSize}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}
    </div>
  );
};

export default DiscussionPage;
