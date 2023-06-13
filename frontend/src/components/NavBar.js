import React, { useEffect, useState } from "react";
import styles from "../styles/Navbar.module.css";
import "../App.css";
import { NavLink, useNavigate } from "react-router-dom";
import {
  useCurrentUser,
  useSetCurrentUser,
} from "../contexts/CurrentUserContext";
import axios from "axios";
import { removeTokenTimestamp } from "../utils/utils";
import { Menu } from "@headlessui/react";
import { axiosReq } from "../api/axiosDefaults";
import logo from "../assets/logo.png";
import useClickOutsideToggle from "../hooks/useClickOutsideToggle";

const NavBar = () => {
  const [msgs, setMsgs] = useState({ results: [] });
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();
  const navigate = useNavigate();
  const { expanded, setExpanded, ref } = useClickOutsideToggle();

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get("/inbox/");
        const unread = data.filter((msg) => !msg.read);
        setMsgs({ results: unread });
      } catch (err) {
        console.log(err);
      }
    };
    handleMount();
  }, []);

  const handleSignOut = async () => {
    try {
      await axios.post("/dj-rest-auth/logout/");
      setCurrentUser(null);
      removeTokenTimestamp();
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <nav
      className={`p-4 ${styles.NavBG} flex flex-col sm:flex-row justify-between align-center`}
    >
      <div className="flex content-center justify-between">
        <NavLink to="/" className="flex content-center items-center">
          <span className="VertText mb-1">TPE</span>
          <img
            src={logo}
            alt="logo"
            className="w-10 h-10 object-contain rounded-md"
          />
        </NavLink>
        <button
          type="button"
          className="sm:hidden"
          ref={ref}
          onClick={() => setExpanded(!expanded)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>
      </div>

      <div className={`${expanded ? "block" : "hidden"} sm:flex sm:flex-row`}>
        <div className="flex flex-col sm:flex-row">
          <NavLink className="links" to="/ads">
            Exchange
          </NavLink>
          <NavLink className="links" to="/blog">
            Blog
          </NavLink>
          <NavLink className="links" to="/forums">
            Forum
          </NavLink>
          {currentUser && (
            <NavLink className="links" to="/inbox">
              Mail
              {msgs.results?.length > 0 && (
                <span className="ps-2 text-amber-700">
                  {msgs.results.length}
                </span>
              )}
            </NavLink>
          )}
          {expanded ? (
            currentUser ? (
              <>
                <NavLink
                  className="links"
                  to={`/profile/${currentUser?.profile_id}`}
                >
                  <img
                    src={currentUser?.profile_image}
                    className="w-6 h-6 object-contain inline"
                    alt="Profile"
                  />
                  <span>Profile</span>
                </NavLink>
                <NavLink className="links" onClick={handleSignOut}>
                  Logout
                </NavLink>
              </>
            ) : (
              <>
                <NavLink className="links" to="/signin">
                  Sign In
                </NavLink>
                <NavLink className="links" to="/signup">
                  Sign Up
                </NavLink>
              </>
            )
          ) : (
            <div className="flex flex-col">
              <Menu>
                <Menu.Button className="links">
                  {currentUser ? <>Account</> : <> Sign In </>}
                </Menu.Button>
                {currentUser ? (
                  <Menu.Items
                    className={`flex flex-col absolute mt-14 ${styles.DropBG}`}
                  >
                    <Menu.Item>
                      <NavLink
                        className="links"
                        to={`/profile/${currentUser?.profile_id}`}
                      >
                        <img
                          src={currentUser?.profile_image}
                          className="w-6 h-6 object-contain inline"
                          alt="Profile"
                        />
                        <span>Profile</span>
                      </NavLink>
                    </Menu.Item>
                    <Menu.Item>
                      <NavLink className="links" onClick={handleSignOut}>
                        Logout
                      </NavLink>
                    </Menu.Item>
                  </Menu.Items>
                ) : (
                  <Menu.Items
                    className={`flex flex-col absolute mt-14 ${styles.DropBG}`}
                  >
                    <Menu.Item>
                      <NavLink className="links" to="/signin">
                        Sign In
                      </NavLink>
                    </Menu.Item>
                    <Menu.Item>
                      <NavLink className="links" to="/signup">
                        Sign Up
                      </NavLink>
                    </Menu.Item>
                  </Menu.Items>
                )}
              </Menu>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
