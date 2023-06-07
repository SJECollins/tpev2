import React, { useEffect, useState } from "react";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { Link, useNavigate } from "react-router-dom";
import { axiosRes, axiosReq } from "../../api/axiosDefaults";
import { Switch } from "@headlessui/react";

const Ad = (props) => {
  const {
    id,
    owner,
    profile_id,
    profile_image,
    title,
    description,
    trade_for,
    added_on,
    updated_on,
    status,
    image,
    extraImgs,
    messaged_id,
  } = props;

  const [available, setAvailable] = useState("");
  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/ad/${id}/`);
      navigate("/ads/");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setAvailable(status);
  }, [status]);

  const handleSwitch = async () => {
    setAvailable(available === "Available" ? "Taken" : "Available");

    try {
      await axiosReq.patch(`/ad/${id}/`, { status: available });
    } catch (err) {
      console.log(err);
      if (err.response?.status !== 401) {
        console.log(err.response?.data);
      }
    }
  };

  return (
    <div>
      <div className="flex flex-row flex-wrap md:w-4/5 mx-auto">
        <div className="flex flex-col w-full md:w-1/2 p-2">
          <figure className="m-4 p-4 mx-auto shadow-md rounded-md">
            <img
              src={image}
              alt={title}
              className="object-contain w-full h-full"
            />
          </figure>
          <div className="flex flex-row mx-auto">
            {extraImgs.length > 0 &&
              extraImgs.map((img) => (
                <div key={img.id} className="w-28 h-28 border-2 rounded">
                  <img
                    src={img.image}
                    alt={`extra img ${img.id}`}
                    className="object-contain w-full h-full"
                  />
                </div>
              ))}
          </div>
        </div>
        <div className=" flex flex-col justify-evenly w-full md:w-1/2 p-2">
          <div className="flex flex-row justify-between">
            <h3>{title}</h3>
            <h3
              className={`${
                available === "Available"
                  ? "bg-green-200 px-2"
                  : "bg-red-200 px-2"
              } rounded`}
            >
              {available}
            </h3>
          </div>
          <hr />
          {is_owner ? (
            <div className="p-2">
              <div className="flex flex-row justify-between items-center text-xs">
                <p>
                  You posted this {added_on}
                  <br />
                  Last edited: {updated_on}
                </p>
                <p className="flex items-center">
                  Change availability:
                  <Switch
                    checked={available || status}
                    onChange={handleSwitch}
                    className={`${
                      available === "Available" ? "bg-green-400" : "bg-red-400"
                    } relative inline-flex h-6 w-11 items-center rounded-full`}
                  >
                    <span className="sr-only">Change Status</span>
                    <span
                      className={`${
                        available === "Available"
                          ? "translate-x-1"
                          : "translate-x-6"
                      } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                    />
                  </Switch>
                </p>
              </div>
              <div className="flex flex-row justify-between">
                <Link className="links" to={`/ad/${id}/edit`}>
                  Edit
                </Link>
                <button className="links" onClick={handleDelete}>
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm">
              <span className="flex flex-row items-baseline">
                Posted by
                <Link
                  to={`/profile/${profile_id}`}
                  className="flex flex-row items-baseline"
                >
                  <img
                    src={profile_image}
                    alt={owner}
                    className="w-8 h-8 object-contain"
                  />{" "}
                  {owner}
                </Link>
                , {added_on} <br />
              </span>
              Last edited: {updated_on}
            </p>
          )}
          <hr />
          <p>{description}</p>
          <hr />
          <p>
            <strong>Will trade for: </strong>
            {trade_for}
          </p>
          <hr />
          <p className="mx-auto">
            {is_owner ? (
              <p>This is your ad.</p>
            ) : messaged_id ? (
              <>Message sent.</>
            ) : available ? (
              <>
                Interested?
                <Link
                  className="links"
                  to="/message/create"
                  state={{ id, title, owner, profile_id, profile_image }}
                >
                  Message {owner}
                </Link>
              </>
            ) : (
              <p>This plant is not available.</p>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Ad;
