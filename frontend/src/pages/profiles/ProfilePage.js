import React, { useEffect, useState } from "react";
import Profile from "./Profile";
import { useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import ProfileSubs from "./ProfileSubs";
import AdsRelated from "../ads/AdsRelated";

const ProfilePage = () => {
  const [profileData, setProfileData] = useState({ results: [] });
  const { id } = useParams();

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get(`/profile/${id}/`);
        setProfileData({ results: [data] });
      } catch (err) {
        console.log(err);
      }
    };
    handleMount();
  }, [id]);

  return (
    <div className="flex flex-col">
      <div className="flex flex-row flex-wrap">
        <div className="w-11/12 md:w-2/3 md:px-4 mx-auto">
          <Profile {...profileData.results[0]} />
        </div>
        <div className="w-11/12 md:w-1/3 mx-auto">
          <ProfileSubs />
        </div>
      </div>
      <div className="flex flex-wrap justify-evenly">
        {profileData.results?.length && (
          <AdsRelated filterKey="owner" filterVal={profileData.results[0].id} />
        )}
      </div>
      <div>
        This will be the user's discussions? Blog posts? All of them? Links to
        history? Maybe display latest - up to 5 - then can click "more" to see
        history
      </div>
    </div>
  );
};

export default ProfilePage;
