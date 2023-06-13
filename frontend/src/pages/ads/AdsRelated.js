import React, { useEffect, useState } from "react";
import { axiosReq } from "../../api/axiosDefaults";
import AdMini from "./AdMini";
import { useCurrentUser } from "../../contexts/CurrentUserContext";

const AdsRelated = ({ filterKey, filterVal, profile }) => {
  const { id, owner } = profile;
  const [adList, setAdList] = useState({ results: [] });
  const currentUser = useCurrentUser();
  const is_owner = currentUser?.pk === id;

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
            <h2 className="text-base">
              {is_owner ? <>Your</> : <>{owner}'s</>} ads:
            </h2>
          )
        ) : (
          <h2 className="text-base">No ads found.</h2>
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
