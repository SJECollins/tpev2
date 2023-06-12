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

const NavBar = () => {
  const [msgs, setMsgs] = useState({ results: [] });
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get("/inbox/");
        const unread = data.filter((msg) => !msg.read);
        console.log(unread);
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
      className={`flex flex-row items-center justify-between 
    px-4 ${styles.NavBG}`}
    >
      <div>
        <NavLink to="/" className="flex flex-row align-center">
          <span className="VertText mb-1">TPE</span>
          <img
            src={logo}
            alt="logo"
            className="w-10 h-10 object-contain rounded-md"
          />
        </NavLink>
      </div>
      <div className="flex flex-row">
        <div>
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
        </div>
        <div className="flex flex-col w-fit">
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
                  <NavLink
                    className="links text-center"
                    onClick={handleSignOut}
                  >
                    Logout
                  </NavLink>
                </Menu.Item>
              </Menu.Items>
            ) : (
              <Menu.Items
                className={`flex flex-col absolute mt-14 ${styles.DropBG}`}
              >
                <Menu.Item>
                  <NavLink className="links text-center" to="/signin">
                    Sign In
                  </NavLink>
                </Menu.Item>
                <Menu.Item>
                  <NavLink className="links text-center" to="/signup">
                    Sign Up
                  </NavLink>
                </Menu.Item>
              </Menu.Items>
            )}
          </Menu>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
