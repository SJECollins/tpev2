import React, { useState } from "react";
import axios from "axios";
import styles from "../../styles/Forms.module.css";
import { useSetCurrentUser } from "../../contexts/CurrentUserContext";
import { useRedirect } from "../../hooks/useRedirect";
import { useNavigate } from "react-router-dom";
import ErrAlert from "../../components/ErrAlert";

const SignUp = () => {
  const [errors, setErrors] = useState({});
  const setCurrentUser = useSetCurrentUser();
  useRedirect("loggedIn");
  const navigate = useNavigate();

  const [signUpData, setSignUpData] = useState({
    username: "",
    password1: "",
    password2: "",
  });
  const { username, password1, password2 } = signUpData;

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data } = await axios.post(
        "/dj-rest-auth/registration/",
        signUpData
      );
      setCurrentUser(data.user);
      navigate(-1);
    } catch (err) {
      console.log(err);
      setErrors(err.response?.data);
      console.log(errors);
    }
  };

  const handleChange = (event) => {
    setSignUpData({
      ...signUpData,
      [event.target.name]: event.target.value,
    });
    console.log(signUpData);
  };

  return (
    <div className="flex flex-col items-center my-16">
      <form
        onSubmit={handleSubmit}
        className={`w-11/12 sm:w-96 rounded-lg shadow-md flex flex-col items-center ${styles.FormBG}`}
      >
        <h1>Sign Up</h1>
        <div className="flex flex-col my-4 w-full">
          <label className="mb-2 text-center">Username</label>
          <input
            className="w-11/12 p-1 rounded mx-auto"
            placeholder="Enter username"
            type="text"
            name="username"
            value={username}
            onChange={handleChange}
          />
        </div>
        {errors.username?.map((message, index) => (
          <ErrAlert key={index} message={message} />
        ))}
        <div className="flex flex-col my-4 w-full">
          <label className="mb-2 text-center">Password</label>
          <input
            className="w-11/12 p-1 rounded mx-auto"
            placeholder="Enter password"
            type="password"
            name="password1"
            value={password1}
            onChange={handleChange}
          />
        </div>
        {errors.password1?.map((message, index) => (
          <ErrAlert key={index} message={message} />
        ))}
        <div className="flex flex-col my-4 w-full">
          <label className="mb-2 text-center">Repeat password</label>
          <input
            className="w-11/12 p-1 rounded mx-auto"
            placeholder="Enter password again"
            type="password"
            name="password2"
            value={password2}
            onChange={handleChange}
          />
        </div>
        {errors.password2?.map((message, index) => (
          <ErrAlert key={index} message={message} />
        ))}
        <button type="submit" className="links">
          Submit
        </button>
        {errors.non_field_errors?.map((message, index) => (
          <ErrAlert key={index} message={message} />
        ))}
      </form>
    </div>
  );
};

export default SignUp;
