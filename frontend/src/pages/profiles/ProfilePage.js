import React, { useEffect, useState } from "react";
import Profile from "./Profile";
import { useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import ProfileSubs from "./ProfileSubs";

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

  console.log(profileData);

  return (
    <div className="flex flex-col">
      <div className="flex flex-row flex-wrap">
        <div>
          <Profile {...profileData.results[0]} />
        </div>
        <div>
          <ProfileSubs />
        </div>
      </div>
      <div>This will be the user's ads</div>
      <div>
        This will be the user's discussions? Blog posts? All of them? Links to
        history? Maybe display latest - up to 5 - then can click "more" to see
        history
      </div>
    </div>
  );
};

export default ProfilePage;
