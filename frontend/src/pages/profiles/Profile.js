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
    <div className="w-full PlantCard p-4">
      <div className="w-full">
        <div className="flex flex-row items-baseline justify-evenly my-4">
          <img src={avatar} alt={owner} className="w-20 h-20 object-contain" />
          <h3>{owner}</h3>
        </div>
        <hr className="mb-4" />
        <table className="w-full">
          <tbody>
            <tr>
              <th>First Name: </th>
              {first_name && first_name !== "null" ? (
                <td>
                  {first_name.charAt(0).toUpperCase() + first_name.slice(1)}
                </td>
              ) : (
                <td>Not provided</td>
              )}
            </tr>
            <tr>
              <th>Last Name: </th>
              {last_name && last_name !== "null" ? (
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
              {interested_in && interested_in !== "null" ? (
                <td>{interested_in}</td>
              ) : (
                <td>Not provided</td>
              )}
            </tr>
          </tbody>
        </table>
        <div>
          <h4>
            About{" "}
            {first_name && first_name !== "null" ? (
              <span>{first_name}</span>
            ) : (
              <span>{owner}</span>
            )}
          </h4>
          <p>
            {bio && bio !== "null" ? (
              <span>{bio}</span>
            ) : (
              <span>Nothing here yet</span>
            )}
          </p>
        </div>

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
