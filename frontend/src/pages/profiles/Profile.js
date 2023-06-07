import React from "react";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { Link } from "react-router-dom";

const Profile = (props) => {
  const {
    id,
    owner,
    first_name,
    last_name,
    location,
    bio,
    interested_in,
    joined_on,
    avatar,
  } = props;
  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;

  return (
    <div>
      <div>
        <div className="flex flex-col justify-baseline">
          <div className="w-20 h-20">
            <img
              src={avatar}
              alt={owner}
              className="w-20 h-20 object-contain"
            />
          </div>
          <h3>{owner}</h3>
          avatar and username
        </div>
        <table>
          <tbody>
            <tr>
              <th>First Name: </th>
              {first_name ? (
                <td>
                  {first_name.charAt(0).toUpperCase() + first_name.slice(1)}
                </td>
              ) : (
                <td>Not provided</td>
              )}
            </tr>
            <tr>
              <th>Last Name: </th>
              {last_name ? (
                <td>
                  {last_name.charAt(0).toUpperCase() + last_name.slice(1)}
                </td>
              ) : (
                <td>Not provided</td>
              )}
            </tr>
            <tr>
              <th>Joined: </th>
              <td>{joined_on}</td>
            </tr>
            <tr>
              <th>Location: </th>
              <td>{location}</td>
            </tr>
            <tr>
              <th>Interested In: </th>
              {interested_in ? <td>{interested_in}</td> : <td>Not provided</td>}
            </tr>
            <tr>
              <th>
                About{" "}
                {first_name ? <span>{first_name}</span> : <span>{owner}</span>}
              </th>
              <td>{bio}</td>
            </tr>
          </tbody>
        </table>
        {is_owner && (
          <div>
            <Link to={`/profile/${id}/edit`} className="links">
              Update
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
