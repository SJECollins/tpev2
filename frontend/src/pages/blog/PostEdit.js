import React, { useEffect, useRef, useState } from "react";
import { useRedirect } from "../../hooks/useRedirect";
import { useNavigate, useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import ErrAlert from "../../components/ErrAlert";

const PostEdit = () => {
  useRedirect("loggedOut");
  const [errors, setErrors] = useState({});
  const [postData, setPostData] = useState({
    title: "",
    content: "",
    image: "",
  });
  const { title, content, image } = postData;
  const imageInput = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get(`/post/${id}/`);
        const { is_owner, title, content, image } = data;

        is_owner ? setPostData({ title, content, image }) : navigate("/blog");
      } catch (err) {
        console.log(err);
      }
    };
    handleMount();
  }, [id, navigate]);

  const handleChange = (event) => {
    setPostData({
      ...postData,
      [event.name.target]: event.target.value,
    });
  };

  const handleChangeImage = (event) => {
    if (event.target.files.length) {
      URL.revokeObjectURL(image);
      setPostData({
        ...postData,
        image: URL.createObjectURL(event.target.files[0]),
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    formData.append("title", title);
    formData.append("content", content);
    if (imageInput?.current?.files[0]) {
      formData.append("image", imageInput.current.files[0]);
    }

    try {
      await axiosReq.put(`/post/${id}/`, formData);
      navigate(`/post/${id}`);
    } catch (err) {
      console.log(err);
      if (err.response?.status !== 401) {
        setErrors(err.response?.data);
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>Update Post</h1>
        <div className="flex flex-col">
          <label>Post Title</label>
          <input
            className="p-2 my-4"
            placeholder="Enter a title for your post"
            type="text"
            name="title"
            value={title}
            onChange={handleChange}
          />
          <label>Post Content</label>
          {errors.title?.map((message, index) => (
            <ErrAlert key={index} message={message} />
          ))}
          <input
            className="p-2 my-4"
            placeholder="Enter the content of your post here"
            type="textarea"
            name="content"
            value={content}
            onChange={handleChange}
            rows={8}
          />
          {errors.content?.map((message, index) => (
            <ErrAlert key={index} message={message} />
          ))}
          <label>Post Image</label>
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
          Update Post
        </button>
        {errors.non_field_errors?.map((message, index) => (
          <ErrAlert key={index} message={message} />
        ))}
      </form>
    </div>
  );
};

export default PostEdit;
