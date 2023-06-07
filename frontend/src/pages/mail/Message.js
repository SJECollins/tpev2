import React, { useState } from "react";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { Link } from "react-router-dom";
import MessageReply from "./MessageReply";

const Message = (props) => {
  const {
    id,
    sender,
    sender_id,
    sender_image,
    subject,
    recipient,
    recipient_id,
    recipient_image,
    sent,
    replied,
    content,
  } = props;
  const [showReply, setShowReply] = useState(false);
  const currentUser = useCurrentUser();
  const is_sender = currentUser?.username === sender;

  const toggleShowReply = () => {
    setShowReply((current) => !current);
  };

  return (
    <div>
      <hr />
      <div className="text-sm py-2 flex flex-row items-baseline">
        From:
        <Link
          to={`/profile/${sender_id}`}
          className="inline-links flex flex-row items-baseline"
        >
          <img
            src={sender_image}
            alt={sender}
            className="w-8 h-8 object-contain"
          />
          {is_sender ? <span>You</span> : <span>{sender}</span>}
        </Link>{" "}
        to
        <Link
          to={`/profile/${recipient_id}`}
          className="inline-links flex flex-row items-baseline"
        >
          <img
            src={recipient_image}
            alt={recipient}
            className="w-8 h-8 object-contain"
          />
          {is_sender ? <span>{recipient}</span> : <span>You</span>}
        </Link>
        , {sent}
      </div>
      <hr />
      <div className="p-4">
        <p>Message: {content}</p>
      </div>
      <hr />
      {!showReply && !replied && !is_sender && (
        <button className="links" type="button" onClick={toggleShowReply}>
          Reply
        </button>
      )}
      {showReply && (
        <MessageReply
          id={id}
          subject={subject}
          sender={sender}
          sender_id={sender_id}
          sender_image={sender_image}
        />
      )}
    </div>
  );
};

export default Message;
