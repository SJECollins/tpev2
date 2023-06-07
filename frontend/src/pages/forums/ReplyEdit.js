import React, { useState } from "react";
import { axiosRes } from "../../api/axiosDefaults";

const ReplyEdit = (props) => {
  const { id, content, setShowEdit, setReplies } = props;
  const [replyContent, setReplyContent] = useState(content);

  const handleChange = (event) => {
    setReplyContent(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axiosRes.put(`/reply/${id}/`, { content: replyContent.trim() });
      setReplies((prevReplies) => ({
        ...prevReplies,
        results: prevReplies.results.map((reply) => {
          return reply.id === id
            ? { ...reply, content: replyContent.trim(), updated_at: "now" }
            : reply;
        }),
      }));
      setShowEdit(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <label>Edit Reply:</label>
        <textarea
          className="p-2 my-4 rounded-md shadow-md"
          type="textarea"
          name="content"
          value={replyContent}
          onChange={handleChange}
          rows={4}
        />
        <button type="submit" className="links">
          Edit Reply
        </button>
      </form>
    </div>
  );
};

export default ReplyEdit;
