import { setUserProfile } from "@/redux/authSlice";
import axios from "axios";
import { useEffect, useId } from "react";
import { useDispatch } from "react-redux";

const useGetUserProfile = (userId) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/v1/user/${userId}/profile`,
          {
            withCredentials: true,
          }
        );
        console.log(res.data.users);
        if (res.data.success) {
          dispatch(setUserProfile(res.data.user));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserProfile();
  }, [useId]);
};

export default useGetUserProfile;
