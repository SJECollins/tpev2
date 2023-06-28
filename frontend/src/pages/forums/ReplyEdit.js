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
        <div className="flex justify-between">
          <label htmlFor="content">Edit Reply:</label>
          <button onClick={() => setShowEdit(false)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        </div>

        <textarea
          className="p-2 my-4 rounded-md shadow-md"
          type="textarea"
          name="content"
          value={replyContent}
          onChange={handleChange}
          rows={4}
        />
        <button type="submit" className="links lg:w-1/3 mx-auto">
          Edit Reply
        </button>
      </form>
    </div>
  );
};

export default ReplyEdit;
