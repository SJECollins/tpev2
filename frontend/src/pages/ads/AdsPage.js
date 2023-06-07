import React, { useEffect, useState, useMemo } from "react";
import { axiosReq } from "../../api/axiosDefaults";
import AdMini from "./AdMini";
import Pagination from "../../components/Pagination";
import { Link, useLocation } from "react-router-dom";
import { useCurrentUser } from "../../contexts/CurrentUserContext";

let pageSize = 10;

const AdsPage = () => {
  const [ads, setAds] = useState({ results: [] });
  const [currentPage, setCurrentPage] = useState(1);
  const currentUser = useCurrentUser();
  const [query, setQuery] = useState("");
  const { pathname } = useLocation();

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const { data } = await axiosReq.get(`/ads/?search=${query}`);
        setAds({ results: data });
      } catch (err) {
        console.log(err);
      }
    };
    fetchAds();
  }, [pathname, query]);

  const currentPageData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * pageSize;
    const lastPageIndex = firstPageIndex + pageSize;
    if (ads.results?.length) {
      return ads.results.slice(firstPageIndex, lastPageIndex);
    } else {
      return null;
    }
  }, [currentPage, ads]);

  return (
    <div className="m-4 flex flex-col items-center">
      <div className="flex flex-row w-full justify-center">
        <p className="VertText my-4">TPE</p>
        <h1 className="tracking-widest text-4xl">Exchange</h1>
      </div>
      <div className="my-4 w-full flex items-center justify-between">
        {currentUser && (
          <Link to="/ads/create" className="links">
            Create Add
          </Link>
        )}
        <input
          className="p-2 mx-2 md:w-1/4 lg:w-1/5 border-2 rounded-md"
          type="text"
          placeholder="Search ads"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      <div className="flex flex-row flex-wrap justify-evenly w-full">
        {ads.results?.length ? (
          currentPageData.map((ad) => {
            return <AdMini {...ad} key={ad.id} setAdData={setAds} />;
          })
        ) : (
          <p>No ads found...</p>
        )}
      </div>

      {ads.results?.length && (
        <Pagination
          currentPage={currentPage}
          totalCount={ads.results?.length}
          pageSize={pageSize}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}
    </div>
  );
};

export default AdsPage;
