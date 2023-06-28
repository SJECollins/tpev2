import React, { useState } from "react";
import { axiosRes } from "../../api/axiosDefaults";

const ReplyCreate = (props) => {
  const { discussion, setShowReply, setDiscussion, setReplies } = props;
  const [content, setContent] = useState("");

  const handleChange = (event) => {
    setContent(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axiosRes.post("/replies/", {
        content,
        discussion,
      });
      setReplies((prevReplies) => ({
        ...prevReplies,
        results: [...prevReplies.results, data],
      }));
      setDiscussion((prevDiscussion) => ({
        results: [
          {
            ...prevDiscussion.results[0],
            replies_count: prevDiscussion.results[0].replies_count + 1,
          },
        ],
      }));
      setContent("");
      setShowReply(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="my-4">
      <form onSubmit={handleSubmit} className="flex flex-col">
        <label>Reply: </label>
        <textarea
          className="p-2 my-4 my-4 rounded-md shadow-md"
          placeholder="Add a reply"
          type="textarea"
          name="content"
          value={content}
          onChange={handleChange}
          rows={4}
        />
        <button type="submit" className="links lg:w-1/3 mx-auto">
          Add Reply
        </button>
      </form>
    </div>
  );
};

export default ReplyCreate;
