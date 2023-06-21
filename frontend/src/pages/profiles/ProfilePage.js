import React, { useEffect, useState } from "react";
import Profile from "./Profile";
import { useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import ProfileSubs from "./ProfileSubs";
import AdsRelated from "../ads/AdsRelated";
import ProfileBlogList from "./ProfileBlogList";
import { useCurrentUser } from "../../contexts/CurrentUserContext";

const ProfilePage = () => {
  const [profileData, setProfileData] = useState({ results: [] });
  const { id } = useParams();
  const currentUser = useCurrentUser();
  const is_owner = currentUser?.pk === parseInt(id);

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
        {is_owner && (
          <div className="w-11/12 md:w-1/3 mx-auto">
            <ProfileSubs />
          </div>
        )}
      </div>
      <div className="flex flex-wrap justify-evenly">
        {profileData.results?.length && (
          <AdsRelated
            filterKey="owner"
            filterVal={profileData.results[0].id}
            profile={profileData.results[0]}
          />
        )}
      </div>
      <div className="w-11/12 mx-auto">
        <ProfileBlogList {...profileData.results[0]} />
      </div>
    </div>
  );
};

export default ProfilePage;
