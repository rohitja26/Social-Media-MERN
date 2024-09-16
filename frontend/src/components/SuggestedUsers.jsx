import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";

const SuggestedUsers = () => {
  const { suggestedUsers } = useSelector((store) => store.auth);
  return (
    <div className="my-10">
      <div className="flex items-center justify-between text-sm ">
        <h1 className="font-semibold text-gray-600">Suggested for you</h1>
        <span className="font-medium cursor-pointer">See All</span>
      </div>
      {suggestedUsers?.map((user) => {
        return (
          <div
            key={user._id}
            className="flex items-center justify-between my-5"
          >
            <div className="flex items-center gap-2">
              <Link to={`/profile/${user?._id}`}>
                <Avatar>
                  <AvatarImage src={user?.profilePicture} alt="post_image" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </Link>
              <div>
                <h1 className="font-semibold text-sm cursor-pointer">
                  <Link to={`/profile/${user?._id}`}></Link>
                  {user.username}
                </h1>
                {user?.bio.length > 12 ? (
                  <span className="text-gray-600 text-sm">
                    {user?.bio.substring(0, 12) + "..."}
                  </span>
                ) : (
                  <span className="text-gray-600 text-sm">{user?.bio}</span>
                )}
              </div>
            </div>
            <span className="text-[#3BADF8] text-xs font-bold cursor-pointer">
              Follow
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default SuggestedUsers;
