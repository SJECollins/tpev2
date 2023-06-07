import React, { useState } from "react";
import { axiosRes } from "../../api/axiosDefaults";

const CommentCreate = (props) => {
  const { post, setPost, setComments } = props;
  const [content, setContent] = useState("");

  const handleChange = (event) => {
    setContent(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axiosRes.post("/comments/", { content, post });
      setComments((prevComments) => ({
        ...prevComments,
        results: [data, ...prevComments.results],
      }));
      setPost((prevPost) => ({
        results: [
          {
            ...prevPost.results[0],
            comments_count: prevPost.results[0].comments_count + 1,
          },
        ],
      }));
      setContent("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="lg:w-1/2 mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col">
        <label>Comment: </label>
        <textarea
          className="p-2 my-4 rounded-md shadow-md"
          placeholder="Add a comment"
          type="textarea"
          name="content"
          value={content}
          onChange={handleChange}
          rows={4}
        />
        <button type="submit" className="links">
          Add Comment
        </button>
      </form>
    </div>
  );
};

export default CommentCreate;
