import React, { useEffect, useState, useMemo } from "react";
import { axiosReq } from "../../api/axiosDefaults";
import { Link } from "react-router-dom";
import Pagination from "../../components/Pagination";

let pageSize = 4;

const Outbox = () => {
  const [messages, setMessages] = useState({ results: [] });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get(`/sent/`);
        setMessages({ results: data });
      } catch (err) {
        console.log(err);
      }
    };
    handleMount();
  }, []);

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
      <Link to="/inbox" className="links self-end">
        To Inbox
      </Link>
      <h1 className="text-center">Outbox</h1>
      {messages.results?.length ? (
        currentPageData.map((message) => (
          <div key={message.id} className="m-4">
            <table>
              <thead>
                <tr>
                  <th>Subject:</th>
                  <td>{message.subject}</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>To: </th>
                  <td>
                    {message.recipient}, {formatDate(message.sent)}
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <th>
                    {message.read ? <span>Read</span> : <span>Unread</span>}
                  </th>
                </tr>
              </tfoot>
            </table>
            <hr />
          </div>
        ))
      ) : (
        <h2>No messages in outbox.</h2>
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

export default Outbox;
