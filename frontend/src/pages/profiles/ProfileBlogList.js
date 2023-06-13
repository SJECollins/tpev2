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
    handleMount();
  }, [id]);

  const currentPageData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * pageSize;
    const lastPageIndex = firstPageIndex + pageSize;
    return posts.results?.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, posts]);

  return (
    <div>
      <div>
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
          <>
            <p>You haven't written any posts yet.</p>
            <Link to="/post/create" className="links">
              Create Post
            </Link>
          </>
        ) : (
          <p>No blog posts found.</p>
        )}
      </div>
      {posts.results?.length && (
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
