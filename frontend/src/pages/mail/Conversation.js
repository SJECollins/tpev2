import React, { useEffect, useState } from "react";
import { axiosReq } from "../../api/axiosDefaults";
import Message from "./Message";
import { useLocation } from "react-router-dom";

const Conversation = () => {
  const { state } = useLocation();
  const { subject, sender } = state || {};
  const [convo, setConvo] = useState({ results: [] });

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get("/messages/");
        const convoData = data.filter(
          (message) =>
            message.subject === subject &&
            (message.sender === sender || message.recipient === sender)
        );
        setConvo({ results: convoData });
      } catch (err) {
        console.log(err);
      }
    };
    handleMount();
  }, [subject, sender]);

  return (
    <div className="w-11/12 lg:w-3/5 mx-auto">
      <h2>RE: {subject}</h2>
      {convo.results?.length ? (
        <>
          {convo.results.map((message, i) => {
            if (i + 1 === convo.results.length) {
              return <Message key={message.id} {...message} />;
            } else {
              return <Message key={message.id} {...message} />;
            }
          })}
        </>
      ) : (
        <p>No messages found.</p>
      )}
    </div>
  );
};

export default Conversation;
