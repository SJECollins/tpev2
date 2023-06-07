import React, { useEffect, useMemo, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { axiosReq } from "../../api/axiosDefaults";
import PostShort from "./PostShort";
import Pagination from "../../components/Pagination";

let pageSize = 10;

const PostsPage = () => {
  const [posts, setPosts] = useState({ results: [] });
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState("");
  const { pathname } = useLocation();
  const currentUser = useCurrentUser();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await axiosReq.get(`/blog/?title=${query}`);
        setPosts({ results: data });
      } catch (err) {
        console.log(err);
      }
    };
    fetchPosts();
  }, [query, pathname, currentUser]);

  const currentPageData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * pageSize;
    const lastPageIndex = firstPageIndex + pageSize;
    return posts.results?.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, posts]);

  return (
    <div className="m-4 flex flex-col items-center">
      <div className="flex flex-row w-full justify-center">
        <p className="VertText my-4">TPE</p>
        <h1 className="tracking-widest text-4xl">Blog</h1>
      </div>
      <div className="my-4 w-full flex items-center justify-between">
        {currentUser && (
          <Link to="/post/create" className="links">
            Add Post
          </Link>
        )}
        <input
          className="p-2 mx-2 md:w-1/4 lg:w-1/5 border-2 rounded-md"
          type="text"
          placeholder="Search posts"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      <div className="flex flex-row flex-wrap w-full">
        {posts.results?.length ? (
          currentPageData.map((post) => {
            return <PostShort {...post} key={post.id} />;
          })
        ) : (
          <p>No posts found...</p>
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

export default PostsPage;
