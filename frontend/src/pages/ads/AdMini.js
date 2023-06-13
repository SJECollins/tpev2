import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { axiosReq, axiosRes } from "../../api/axiosDefaults";
import { Switch } from "@headlessui/react";

const AdMini = (props) => {
  const { id, is_owner, title, status, image, ownAd } = props;
  const [available, setAvailable] = useState(status);

  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/ad/${id}/`);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setAvailable(status);
  }, [status, setAvailable]);

  const handleSwitch = async () => {
    try {
      await axiosReq.patch(`/ad/${id}/`, {
        status: available === "Available" ? "Taken" : "Available",
      });
      setAvailable((prevAvailability) =>
        prevAvailability === "Available" ? "Taken" : "Available"
      );
    } catch (err) {
      console.log(err);
      if (err.response?.status !== 401) {
        console.log(err.response?.data);
      }
    }
  };

  return (
    <div className="w-72 h-30 shadow-md rounded-md flex flex-col m-4">
      <Link
        to={`/ad/${id}/`}
        className="w-full h-full flex flex-row justify-between p-4"
      >
        <div className="w-20 h-20 rounded mx-auto">
          <img
            src={image}
            alt={title}
            className="w-20 h-20 object-contain rounded"
          />
        </div>
        <div className="flex flex-col justify-between">
          <h4 className="text-base">{title}</h4>
          <span
            className={`${
              available === "Available"
                ? "BgGreen px-2 w-fit self-end"
                : "BgRed px-2 w-fit self-end"
            } rounded`}
          >
            {available}
          </span>
        </div>
      </Link>
      <div>
        {is_owner && ownAd !== "category" && (
          <div className="flex flex-row justify-evenly">
            <button className="links" onClick={handleDelete}>
              Delete
            </button>
            <p className="flex items-center text-xs">
              Change availability:
              <Switch
                onChange={handleSwitch}
                className={`${
                  available === "Available" ? "BgGreen" : "BgRed"
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
        )}
      </div>
    </div>
  );
};

export default AdMini;
