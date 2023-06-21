import React, { useState } from "react";
import { axiosRes } from "../../api/axiosDefaults";

const CommentEdit = (props) => {
  const { id, content, setShowEdit, setComments } = props;
  const [comContent, setComContent] = useState(content);

  const handleChange = (event) => {
    setComContent(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axiosRes.put(`/comment/${id}/`, { content: comContent.trim() });
      setComments((prevComments) => ({
        ...prevComments,
        results: prevComments.results.map((comment) => {
          return comment.id === id
            ? { ...comment, content: comContent.trim(), updated_at: "now" }
            : comment;
        }),
      }));
      setShowEdit(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-full mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col">
        <label>Comment: </label>
        <textarea
          className="p-2 my-4 rounded-md shadow-md"
          type="textarea"
          name="content"
          value={comContent}
          onChange={handleChange}
          rows={4}
        />
        <button type="submit" className="links">
          Update Comment
        </button>
      </form>
    </div>
  );
};

export default CommentEdit;
