import React, { useEffect, useState, useMemo } from "react";
import { axiosReq } from "../../api/axiosDefaults";
import { Link } from "react-router-dom";
import Pagination from "../../components/Pagination";

let pageSize = 10;

const Inbox = () => {
  const [messages, setMessages] = useState({ results: [] });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get(`/inbox/`);
        setMessages({ results: data });
      } catch (err) {
        console.log(err);
      }
    };
    handleMount();
  }, []);

  const handleRead = async (msgId) => {
    try {
      await axiosReq.patch(`/message/${msgId}/`, { read: true });
    } catch (err) {
      console.log(err);
    }
  };

  const formatDate = (theDate) => {
    const sent = new Date(theDate);
    const options = {
      day: "numeric",
      month: "short",
      year: "2-digit",
      hour: "numeric",
      minute: "numeric",
    };
    return sent.toLocaleString([], options);
  };

  const currentPageData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * pageSize;
    const lastPageIndex = firstPageIndex + pageSize;
    return messages.results?.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, messages]);

  return (
    <div className="flex flex-col my-4 mx-auto md:w-4/5 lg:w-3/5">
      <Link to="/outbox" className="links self-end">
        Sent Messages
      </Link>
      <h1 className="text-center">Inbox</h1>
      {messages.results?.length ? (
        currentPageData.map((message) => (
          <div>
            <Link
              to={`/conversation/${message.id}`}
              key={message.id}
              onClick={() => handleRead(message.id)}
              state={message}
            >
              <div className="m-4">
                <table>
                  <thead>
                    <tr>
                      <th>Subject:</th>
                      <td>{message.subject}</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th>From: </th>
                      <td>
                        {message.sender}, {formatDate(message.sent)}
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td>
                        {message.read ? <span>Read</span> : <span>Unread</span>}
                      </td>
                      <td>{message.replied && <span>Replied</span>}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </Link>
            <hr />
          </div>
        ))
      ) : (
        <h2>No messages in inbox.</h2>
      )}
      {messages.results?.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalCount={messages.results?.length}
          pageSize={pageSize}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}
    </div>
  );
};

export default Inbox;
