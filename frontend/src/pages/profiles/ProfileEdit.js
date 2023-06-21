import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ErrAlert from "../../components/ErrAlert";
import { axiosReq } from "../../api/axiosDefaults";
import styles from "../../styles/Forms.module.css";

const ProfileEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [errors, setErrors] = useState({});
  const avInput = useRef(null);
  const [profileData, setProfileData] = useState({
    first_name: "",
    last_name: "",
    location: "",
    interested_in: "",
    bio: "",
    avatar: "",
  });
  const { first_name, last_name, location, interested_in, bio, avatar } =
    profileData;

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get(`/profile/${id}/`);
        const {
          is_owner,
          first_name,
          last_name,
          location,
          interested_in,
          bio,
          avatar,
        } = data;
        is_owner
          ? setProfileData({
              first_name,
              last_name,
              location,
              interested_in,
              bio,
              avatar,
            })
          : navigate("/");
      } catch (err) {
        console.log(err);
      }
    };
    handleMount();
  }, [id, navigate]);

  const handleChange = (event) => {
    setProfileData({
      ...profileData,
      [event.target.name]: event.target.value,
    });
  };

  const handleChangeAv = (event) => {
    if (event.target.files.length) {
      URL.revokeObjectURL(avatar);
      setProfileData({
        ...profileData,
        avatar: URL.createObjectURL(event.target.files[0]),
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    formData.append("first_name", first_name);
    formData.append("last_name", last_name);
    formData.append("location", location);
    formData.append("interested_in", interested_in);
    formData.append("location", location);
    formData.append("bio", bio);
    if (avInput?.current?.files[0]) {
      formData.append("avatar", avInput.current.files[0]);
    }

    try {
      await axiosReq.put(`/profile/${id}/`, formData);
      navigate(`/profile/${id}/`);
    } catch (err) {
      console.log(err);
      if (err.response?.status !== 401) {
        setErrors(err.response?.data);
      }
    }
  };

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className={`w-11/12 mx-auto my-8 rounded-lg flex flex-col items-center PlantCard ${styles.FormBG}`}
      >
        <h1>Update Your Profile</h1>
        <div className="flex flex-col w-4/5 lg:w-2/5 mx-auto">
          <label>First Name: </label>
          <input
            className="p-2 my-4"
            placeholder="First name"
            type="text"
            name="first_name"
            value={first_name || ""}
            onChange={handleChange}
          />
          {errors.first_name?.map((message, index) => (
            <ErrAlert key={index} message={message} />
          ))}
          <label>Last Name: </label>
          <input
            className="p-2 my-4"
            placeholder="Last name"
            type="text"
            name="last_name"
            value={last_name || ""}
            onChange={handleChange}
          />
          {errors.last_name?.map((message, index) => (
            <ErrAlert key={index} message={message} />
          ))}
          <label>Location: </label>
          <input
            className="p-2 my-4"
            placeholder="Where you are (vaguely)"
            type="text"
            name="location"
            value={location || ""}
            onChange={handleChange}
          />
          {errors.location?.map((message, index) => (
            <ErrAlert key={index} message={message} />
          ))}
          <label>Interested In: </label>
          <input
            className="p-2 my-4"
            placeholder="Plants you're interested in"
            type="text"
            name="interested_in"
            value={interested_in || ""}
            onChange={handleChange}
          />
          {errors.interested_in?.map((message, index) => (
            <ErrAlert key={index} message={message} />
          ))}
          <label>Bio: </label>
          <textarea
            className="p-2 my-4"
            placeholder="Tell people about yourself"
            type="textarea"
            name="bio"
            value={bio || ""}
            onChange={handleChange}
            rows={4}
          />
          {errors.bio?.map((message, index) => (
            <ErrAlert key={index} message={message} />
          ))}
        </div>
        <div>
          <label>Change Avatar</label>
          <figure className="mx-auto w-20 h-20">
            <img
              src={avatar}
              alt="Profile avatar"
              className="w-full h-full object-contain"
            />
          </figure>
          <input
            className="p-2 my-4"
            type="file"
            accept="image/*"
            onChange={handleChangeAv}
            ref={avInput}
          />
          {errors.avatar?.map((message, index) => (
            <ErrAlert key={index} message={message} />
          ))}
        </div>
        <button type="submit" className="links">
          Update Profile
        </button>
        {errors.non_field_errors?.map((message, index) => (
          <ErrAlert key={index} message={message} />
        ))}
      </form>
    </div>
  );
};

export default ProfileEdit;
