import useGetUserProfile from "@/hooks/useGetUserProfile";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { AtSign, Heart, MessageCircle } from "lucide-react";
import { useState } from "react";

const Profile = () => {
  const { userProfile, user } = useSelector((store) => store.auth);
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);
  const isLoggedInUserProfile = user?._id === userProfile?._id;
  const isFollowing = true;
  const [activeTab, setActiveTab] = useState("posts");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const displayPost =
    activeTab === "posts" ? userProfile?.posts : userProfile?.bookmarks;

  return (
    <div className="flex max-w-4xl  justify-center mx-auto pl-10">
      <div className="flex flex-col gap-28 p-8">
        <div className="grid grid-cols-2">
          <section className="flex items-center justify-center">
            <Avatar className="h-32 w-32">
              <AvatarImage src={userProfile?.profilePicture} alt="profile" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>
          <section>
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <span>{userProfile?.username}</span>
                {isLoggedInUserProfile ? (
                  <>
                    <Link to="/account/edit">
                      <Button
                        variant="secondary"
                        className="hover:bg-gray-200 h-8"
                      >
                        Edit Profile
                      </Button>
                    </Link>

                    <Button
                      variant="secondary"
                      className="hover:bg-gray-200 h-8"
                    >
                      View Archive
                    </Button>
                    <Button
                      variant="secondary"
                      className="hover:bg-gray-200 h-8"
                    >
                      Add Tools
                    </Button>
                  </>
                ) : isFollowing ? (
                  <>
                    <Button variant="secondary" className=" h-8] ">
                      Unfollow
                    </Button>
                    <Button variant="secondary" className="h-8">
                      Message
                    </Button>
                  </>
                ) : (
                  <Button className="hover:bg-gray-200 h-8 bg-[#0095F6] hover:bg-[#3192d2]"></Button>
                )}
              </div>

              <div className="flex items-center justify-between">
                <p>
                  <span className="font-semibold mr-2">
                    {userProfile?.posts.length}
                  </span>
                  posts
                </p>
                <p>
                  <span className="font-semibold mr-2">
                    {userProfile?.followers.length}
                  </span>
                  Followers
                </p>
                <p>
                  <span className="font-semibold mr-2">
                    {userProfile?.following.length}
                  </span>
                  Following
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold">{userProfile?.bio}</span>
                <Badge className="w-fit" variant="secondary">
                  <AtSign size={"18"} />
                  <span className="pl-1 text-sm">{userProfile?.username}</span>
                </Badge>
                <span>😀 Love to code because its easy to write </span>
                <span>🧑‍ Love to code because its easy to write </span>
                <span>🧑‍ Love to code because its easy to write </span>
              </div>
            </div>
          </section>
        </div>
        <div className="border-t border-t-gray-200">
          <div className="flex items-center justify-center gap-10 text-sm">
            <span
              className={`py-3 cursor-pointer ${
                activeTab === "posts" ? "font-bold" : ""
              } `}
              onClick={() => handleTabChange("posts")}
            >
              {" "}
              POSTS
            </span>
            <span
              className={`py-3 cursor-pointer ${
                activeTab === "saved" ? "font-bold" : ""
              } `}
              onClick={() => handleTabChange("saved")}
            >
              SAVED
            </span>
            <span
              className={`py-3 cursor-pointer ${
                activeTab === "reels" ? "font-bold" : ""
              } `}
              onClick={() => handleTabChange("reels")}
            >
              REELS
            </span>
            <span
              className={`py-3 cursor-pointer ${
                activeTab === "tags" ? "font-bold" : ""
              } `}
              onClick={() => handleTabChange("tags")}
            >
              TAGS
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {displayPost?.map((post) => {
              return (
                <div key={post?._id} className=" relative group cursor-pointer">
                  <img
                    src={post?.image}
                    alt="postimage"
                    className="rounded-sm my-2 w-full aspect-square object-cover"
                  />
                  <div className=" absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center  text-white space-x-4  ">
                      <button className="flex items-center gap-2   hover:text-gray-300 ">
                        <Heart />
                        <span>{post?.likes.length}</span>
                      </button>
                      <button className="flex items-center gap-2   hover:text-gray-300 ">
                        <MessageCircle />
                        <span>{post?.comments.length}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
