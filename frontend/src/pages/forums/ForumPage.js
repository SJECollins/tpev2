import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import Pagination from "../../components/Pagination";
import Discussion from "./Discussion";

let pageSize = 10;

const ForumPage = () => {
  const [forumData, setForumData] = useState({ results: [] });
  const { title, description } = forumData;
  const [discussions, setDiscussions] = useState({ results: [] });
  const [currentPage, setCurrentPage] = useState(1);
  const { id } = useParams();

  useEffect(() => {
    const handleMount = async () => {
      try {
        const [{ data: forum }, { data: discussions }] = await Promise.all([
          axiosReq.get(`/forum/${id}/`),
          axiosReq.get(`/discussions/?forum=${id}/`),
        ]);
        setForumData(forum);
        setDiscussions({ results: discussions });
      } catch (err) {
        console.log(err);
      }
    };
    handleMount();
  }, [id]);

  const currentPageData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * pageSize;
    const lastPageIndex = firstPageIndex + pageSize;
    if (discussions.results?.length) {
      return discussions.results.slice(firstPageIndex, lastPageIndex);
    } else {
      return null;
    }
  }, [currentPage, discussions]);

  return (
    <div className="w-11/12 md:w-4/5 mx-auto">
      <div className="flex flex-row w-full justify-center">
        <p className="VertText my-4">TPE</p>
        <h1 className="tracking-widest text-4xl">Forums</h1>
      </div>
      <Link className="links" to="/discussion/create">
        Create Discussion
      </Link>
      <div className="my-4">
        <h2>{title}</h2>
        <div>
          <p className="text-sm ps-4">{description}</p>
        </div>
      </div>
      {discussions.results?.length ? (
        currentPageData.map((discussion) => {
          return <Discussion key={discussion.id} {...discussion} />;
        })
      ) : (
        <p>No discussions yet...</p>
      )}
      {discussions.results?.length && (
        <Pagination
          currentPage={currentPage}
          totalCount={discussions.results?.length}
          pageSize={pageSize}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}
    </div>
  );
};

export default ForumPage;
