import React, { useEffect, useState } from "react";
import { Switch } from "@headlessui/react";
import { axiosReq } from "../api/axiosDefaults";

const TogAvail = ({ id }) => {
  const [available, setAvailable] = useState("");
  console.log(id);

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get(`/ad/${id}/`);
        setAvailable(data.status);
      } catch (err) {
        console.log(err);
      }
    };
    handleMount();
  }, [id]);

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

  console.log(available);
  return (
    <Switch
      checked={available}
      onChange={handleSwitch}
      className={`${
        available === "Available" ? "bg-green-400" : "bg-red-400"
      } relative inline-flex h-6 w-11 items-center rounded-full`}
    >
      <span className="sr-only">Change Status</span>
      <span
        className={`${
          available === "Available" ? "translate-x-1" : "translate-x-6"
        } inline-block h-4 w-4 transform rounded-full bg-white transition`}
      />
    </Switch>
  );
};

export default TogAvail;
