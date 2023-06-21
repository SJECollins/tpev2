import React, { useEffect, useMemo, useState } from "react";
import { useSetCurrentUser } from "../../contexts/CurrentUserContext";
import { useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import Post from "./Post";
import CommentCreate from "./CommentCreate";
import Comment from "./Comment";
import Pagination from "../../components/Pagination";

let pageSize = 10;

const PostPage = () => {
  const [post, setPost] = useState({ results: [] });
  const [comments, setComments] = useState({ results: [] });
  const [currentPage, setCurrentPage] = useState(1);
  const currentUser = useSetCurrentUser();
  const { id } = useParams();

  useEffect(() => {
    const handleMount = async () => {
      try {
        const [{ data: post }, { data: comments }] = await Promise.all([
          axiosReq.get(`/post/${id}/`),
          axiosReq.get(`/comments/?post=${id}`),
        ]);
        setPost({ results: [post] });
        setComments({ results: comments });
      } catch (err) {
        console.log(err);
      }
    };
    handleMount();
  }, [id]);

  const currentPageData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * pageSize;
    const lastPageIndex = firstPageIndex + pageSize;
    return comments.results?.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, comments]);

  return (
    <div className="flex flex-col items-center">
      <Post {...post.results[0]} setPosts={setPost} />
      {currentUser && (
        <CommentCreate post={id} setPost={setPost} setComments={setComments} />
      )}
      <div className="pb-8">
        {comments.results?.length ? (
          currentPageData.map((comment) => {
            return (
              <Comment
                {...comment}
                key={comment.id}
                setPost={setPost}
                setComments={setComments}
              />
            );
          })
        ) : (
          <p>No comments yet...</p>
        )}
      </div>

      {comments.results?.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalCount={comments.results?.length}
          pageSize={pageSize}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}
    </div>
  );
};

export default PostPage;
