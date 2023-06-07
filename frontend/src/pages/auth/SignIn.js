import React, { useState } from "react";
import axios from "axios";
import styles from "../../styles/Forms.module.css";
import { useSetCurrentUser } from "../../contexts/CurrentUserContext";
import { useRedirect } from "../../hooks/useRedirect";
import { Link, useNavigate } from "react-router-dom";
import { setTokenTimestamp } from "../../utils/utils";
import ErrAlert from "../../components/ErrAlert";

const SignIn = () => {
  const [errors, setErrors] = useState({});
  const setCurrentUser = useSetCurrentUser();
  useRedirect("loggedIn");
  const navigate = useNavigate();

  const [signInData, setSignInData] = useState({
    username: "",
    password: "",
  });
  const { username, password } = signInData;

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data } = await axios.post("/dj-rest-auth/login/", signInData);
      setCurrentUser(data.user);
      setTokenTimestamp(data);
      navigate("/");
    } catch (err) {
      console.log(err);
      setErrors(err.response?.data);
      console.log(errors);
    }
  };

  const handleChange = (event) => {
    setSignInData({
      ...signInData,
      [event.target.name]: event.target.value,
    });
    console.log(signInData);
  };

  return (
    <div className="flex flex-col items-center my-16">
      <form
        onSubmit={handleSubmit}
        className={`w-11/12 sm:w-96 rounded-lg shadow-md flex flex-col items-center ${styles.FormBG}`}
      >
        <h1>Sign In</h1>
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
            name="password"
            value={password}
            onChange={handleChange}
          />
        </div>
        {errors.password?.map((message, index) => (
          <ErrAlert key={index} message={message} />
        ))}
        <Link to="/resetpw" className="text-xs mb-4">
          Forgot password?
        </Link>
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

export default SignIn;
