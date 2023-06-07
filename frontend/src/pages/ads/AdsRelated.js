import React, { useEffect, useState } from "react";
import { axiosReq } from "../../api/axiosDefaults";
import AdMini from "./AdMini";
import { useParams } from "react-router-dom";

const AdsRelated = ({ filterKey, filterVal }) => {
  const [adList, setAdList] = useState({ results: [] });
  const { id } = useParams();

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get(`/ads/?${filterKey}=${filterVal}`);
        const relatedAds = data.filter((ad) => ad.id !== parseInt(id));
        setAdList({ results: relatedAds });
      } catch (err) {
        console.log(err);
      }
    };
    handleMount();
  }, [filterKey, filterVal, id]);

  return (
    <div className="mx-4 my-6">
      <>
        {adList.results?.length ? (
          filterKey === "category" ? (
            <h2 className="text-base">Ads in the same category:</h2>
          ) : (
            <h2 className="text-base">Your ads:</h2>
          )
        ) : (
          <h2 className="text-base">No related ads found.</h2>
        )}
        <div className="flex flex-row flex-wrap justify-evenly">
          {adList.results?.length > 0 &&
            adList.results.map((ad) => (
              <AdMini key={ad.id} {...ad} ownAd={filterKey} />
            ))}
        </div>
      </>
    </div>
  );
};

export default AdsRelated;
