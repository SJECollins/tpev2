import React, { useRef, useState } from "react";
import { useRedirect } from "../../hooks/useRedirect";
import { useNavigate, useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import ErrAlert from "../../components/ErrAlert";
import styles from "../../styles/Forms.module.css";

const DiscussionCreate = () => {
  useRedirect("loggedOut");
  const [errors, setErrors] = useState({});
  const [discussionData, setDiscussionData] = useState({
    forum: "",
    title: "",
    content: "",
    image: "",
  });
  const { title, content, image } = discussionData;
  const imageInput = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();

  const handleChange = (event) => {
    setDiscussionData({
      ...discussionData,
      [event.target.name]: event.target.value,
    });
  };

  const handleChangeImage = (event) => {
    if (event.target.files.length) {
      URL.revokeObjectURL(image);
      setDiscussionData({
        ...discussionData,
        image: URL.createObjectURL(event.target.files[0]),
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    formData.append("forum", id);
    formData.append("title", title);
    formData.append("content", content);
    formData.append("open", true);
    if (imageInput?.current?.files[0]) {
      formData.append("image", imageInput.current.files[0]);
    }

    try {
      const { data } = await axiosReq.post("/discussions/", formData);
      navigate(`/discussion/${data.id}`);
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
        className={`w-11/12 mx-auto flex flex-col items-center PlantCard ${styles.FormBG}`}
      >
        <h1>Create New Discussion</h1>
        <div className="flex flex-col w-4/5 lg:w-2/5 mx-auto">
          <label>Discussion Title</label>
          <input
            className="p-2 my-4"
            placeholder="Enter a title for your discussion"
            type="text"
            name="title"
            value={title}
            onChange={handleChange}
          />
          <label>Discussion Content</label>
          {errors.title?.map((message, index) => (
            <ErrAlert key={index} message={message} />
          ))}
          <textarea
            className="p-2 my-4"
            placeholder="Enter the content of your discussion here"
            type="textarea"
            name="content"
            value={content}
            onChange={handleChange}
            rows={8}
          />
          {errors.content?.map((message, index) => (
            <ErrAlert key={index} message={message} />
          ))}
          <label>Discussion Image</label>
          <input
            className="p-2 my-4"
            type="file"
            accept="image/*"
            onChange={handleChangeImage}
            ref={imageInput}
          />
          {errors.image?.map((message, index) => (
            <ErrAlert key={index} message={message} />
          ))}
        </div>
        <button type="submit" className="links">
          Create Discussion
        </button>
        {errors.non_field_errors?.map((message, index) => (
          <ErrAlert key={index} message={message} />
        ))}
      </form>
    </div>
  );
};

export default DiscussionCreate;
