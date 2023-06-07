import React, { useEffect, useState } from "react";
import Ad from "./Ad";
import { useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import AdsRelated from "./AdsRelated";

const AdPage = () => {
  const [adData, setAdData] = useState({ results: [] });
  const [extraImgs, setExtraImgs] = useState({ results: [] });
  const { id } = useParams();

  useEffect(() => {
    const handleMount = async () => {
      try {
        const [{ data: ad }, { data: imgs }] = await Promise.all([
          axiosReq.get(`/ad/${id}/`),
          axiosReq.get(`/ad-images/?ad=${id}`),
        ]);
        setAdData(ad);
        setExtraImgs(imgs);
      } catch (err) {
        console.log(err);
      }
    };
    handleMount();
  }, [id]);

  return (
    <div>
      <Ad {...adData} extraImgs={extraImgs} setAdData={setAdData} />
      <AdsRelated filterKey="category" filterVal={adData.category} />
    </div>
  );
};

export default AdPage;
