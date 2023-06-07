import React, { useEffect, useState } from "react";
import { axiosReq } from "../../api/axiosDefaults";
import Forum from "./Forum";
import { useCurrentUser } from "../../contexts/CurrentUserContext";

const ForumsPage = () => {
  const [forums, setForums] = useState({ results: [] });
  const currentUser = useCurrentUser();

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get("/forums/");
        setForums({ results: data });
      } catch (err) {
        console.log(err);
      }
    };
    handleMount();
  }, [currentUser]);

  return (
    <div className="w-11/12 md:w-4/5 mx-auto">
      <div className="flex flex-row w-full justify-center">
        <p className="VertText my-4">TPE</p>
        <h1 className="tracking-widest text-4xl">Forums</h1>
      </div>
      {forums.results?.length ? (
        forums.results.map((forum) => <Forum key={forum.id} {...forum} />)
      ) : (
        <p>No forums found.</p>
      )}
    </div>
  );
};

export default ForumsPage;
