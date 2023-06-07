import React, { useState } from "react";
import { axiosReq } from "../../api/axiosDefaults";
import { useNavigate, Link } from "react-router-dom";
import ErrAlert from "../../components/ErrAlert";

const MessageReply = (props) => {
  const { id, subject, sender, sender_id, sender_image } = props;
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

  console.log(messageData);
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    formData.append("recipient", sender);
    formData.append("parent", id);
    formData.append("subject", subject);
    formData.append("content", content);

    try {
      await Promise.all([
        axiosReq.post("/messages/", formData),
        axiosReq.patch(`/message/${id}/`, { replied: true }),
      ]);
      navigate("/inbox");
    } catch (err) {
      console.log(err);
      if (err.response?.data !== 401) {
        setErrors(err.response?.data);
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col py-2">
        <p className="flex flex-row items-baseline">
          Replying to:
          <Link
            to={`/profile/${sender_id}`}
            className="flex flex-row items-baseline"
          >
            <img
              src={sender_image}
              alt={sender}
              className="w-8 h-8 object-contain"
            />{" "}
            {sender}
          </Link>
        </p>
        <textarea
          className="p-2 my-4 rounded-md shadow-md"
          placeholder="Enter your reply"
          type="textarea"
          name="content"
          value={content}
          onChange={handleChange}
          rows={4}
        />
        {errors.content?.map((msg, index) => (
          <ErrAlert key={index} message={msg} />
        ))}
        <button type="submit" className="links">
          Send Reply
        </button>
      </form>
      {errors.non_field_errors?.map((msg, index) => (
        <ErrAlert key={index} message={msg} />
      ))}
    </div>
  );
};

export default MessageReply;
