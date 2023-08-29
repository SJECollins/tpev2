import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useSetCurrentUser } from "../../contexts/CurrentUserContext";
import { removeTokenTimestamp } from "../../utils/utils";
import { axiosReq } from "../../api/axiosDefaults";

const ProfileDelete = () => {
  const setCurrentUser = useSetCurrentUser();
  const navigate = useNavigate();
  const { id } = useParams();

  const handleDelete = async () => {
    try {
      const response = await axiosReq.delete(`/profile/${id}/`);
      if (response.status === 204) {
        logout();
      } else {
        console.log(response);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const logout = async () => {
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
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold">
        Are you sure you want to delete your profile?
      </h1>
      <button
        type="button"
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
        onClick={handleDelete}
      >
        Delete
      </button>
    </div>
  );
};

export default ProfileDelete;
