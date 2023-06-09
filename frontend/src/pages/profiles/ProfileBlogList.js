import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import Pagination from "../../components/Pagination";
import { useCurrentUser } from "../../contexts/CurrentUserContext";

let pageSize = 5;

const ProfileBlogList = (props) => {
  const { id, owner } = props;
  const [posts, setPosts] = useState({ results: [] });
  const [currentPage, setCurrentPage] = useState(1);
  const currentUser = useCurrentUser();
  const is_owner = currentUser?.pk === id;

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get(`/blog/?owner=${id}`);
        setPosts({ results: data });
      } catch (err) {
        console.log(err);
      }
    };
    if (id) {
      handleMount();
    }
  }, [id]);

  const currentPageData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * pageSize;
    const lastPageIndex = firstPageIndex + pageSize;
    return posts.results?.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, posts]);

  return (
    <div className="w-full">
      <div className="flex flex-col">
        <h4>{is_owner ? <>Your</> : <>{owner}</>} blog posts: </h4>
        {posts.results?.length > 0 ? (
          currentPageData.map((post) => (
            <li key={post.id} className="list-disc ms-4 py-2">
              <Link to={`/post/${post.id}`} className="inline-links">
                {post.title}
              </Link>
            </li>
          ))
        ) : is_owner ? (
          <div className="flex justify-evenly items-center">
            <p>You haven't written any posts yet.</p>
            <Link to="/post/create" className="links">
              Create Post
            </Link>
          </div>
        ) : (
          <p>No blog posts found.</p>
        )}
      </div>
      {posts.results?.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalCount={posts.results?.length}
          pageSize={pageSize}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}
    </div>
  );
};

export default ProfileBlogList;
