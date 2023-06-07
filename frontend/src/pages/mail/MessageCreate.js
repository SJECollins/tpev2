import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ErrAlert from "../../components/ErrAlert";
import { axiosReq } from "../../api/axiosDefaults";

const MessageCreate = () => {
  const { state } = useLocation();
  const { id, title, owner, profile_id, profile_image } = state || {};
  const [errors, setErrors] = useState({});
  const [messageData, setMessageData] = useState({
    content: "",
  });
  const { content } = messageData;
  const navigate = useNavigate();

  const handleChange = (event) => {
    setMessageData({
      ...messageData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    formData.append("recipient", profile_id);
    formData.append("subject", id);
    formData.append("content", content);

    try {
      await Promise.all([
        axiosReq.post("/messages/", formData),
        axiosReq.post(`/ad-messaged/`, { ad: id }),
      ]);
      navigate(`/ad/${id}`);
    } catch (err) {
      console.log(err);
      if (err.response?.data !== 401) {
        setErrors(err.response?.data);
      }
    }
  };

  return (
    <div className="my-4 lg:w-1/3 md:w-1/2 flex flex-col align-center mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col">
        <h3 className="flex flex-row items-baseline justify-center">
          Messaging:
          <Link
            to={`/profile/${profile_id}`}
            className="flex flex-row items-baseline"
          >
            <img
              src={profile_image}
              alt={owner}
              className="w-10 h-10 object-contain"
            />{" "}
            {owner}
          </Link>
        </h3>
        <h4>Subject: {title}</h4>
        <textarea
          className="p-2 my-4"
          placeholder="Enter your message here"
          type="textarea"
          name="content"
          value={content}
          onChange={handleChange}
          rows={8}
        />
        {errors.content?.map((msg, index) => (
          <ErrAlert key={index} message={msg} />
        ))}
        <button type="submit" className="links">
          Send Message
        </button>
        {errors.non_field_errors?.map((msg, index) => (
          <ErrAlert key={index} message={msg} />
        ))}
      </form>
    </div>
  );
};

export default MessageCreate;
