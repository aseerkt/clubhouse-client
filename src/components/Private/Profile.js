import React, { useEffect, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { Header } from "semantic-ui-react";
import Loader from "../General/Loader";
import MenuBar from "../General/MenuBar";
import ProfileHeader from "../General/ProfileHeader";
import ItemCard from "../General/ItemCard";
import { useAuthState } from "../../context/AuthContext/GlobalState";
export default function Profile() {
  const { user, loginuser } = useAuthState();
  const history = useHistory();
  const [loader, setLoader] = useState(false);
  const [mychatrooms, setMyChatRooms] = useState({
    all: [],
    saved: [],
    upcoming: [],
    live: [],
    private: [],
  });
  const [current_page, setCurrentPage] = useState("threads");
  useEffect(() => {
    async function getChatRooms() {
      setLoader(true);
      const token = await localStorage.getItem("hackathon");
      if (token) {
        await axios
          .get("http://192.168.0.105:3005/api/chat/mychatrooms", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            setLoader(false);
            setMyChatRooms({
              all: res.data.chatrooms,
              saved: res.data.savedchatrooms,
              upcoming: res.data.upcomingchatrooms,
              live: res.data.livechatrooms,
              private: res.data.privatechatrooms,
            });
          })
          .catch((err) => {
            setLoader(false);
          });
      }
    }
    getChatRooms();
  }, []);
  function getDateTime(val) {
    const v = new Date(val);
    return v.toLocaleString();
  }
  async function deletethread(id) {
    const token = localStorage.getItem("hackathon");
    if (token) {
      await axios
        .delete(`http://192.168.0.105:3005/api/chat/deletethread/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setMyChatRooms(res.data.chatrooms);
        });
    }
  }
  return (
    <>
      {loader && <Loader />}
      <div className="search-page">
        <ProfileHeader user={user} history={history} loginuser={loginuser} />
        <Header as="h3" dividing>
          My threads
        </Header>
        <MenuBar
          current_page={current_page}
          setCurrentPage={setCurrentPage}
          type="profile"
        />
        {current_page === "threads" && (
          <>
            {mychatrooms.all.map((item, index) => (
              <ItemCard
                key={index}
                item={item}
                getDateTime={getDateTime}
                deletethread={deletethread}
                type="profile"
              />
            ))}
          </>
        )}

        {current_page === "livethreads" && (
          <div>
            {mychatrooms.live.length > 0 ? (
              <>
                {mychatrooms.live.map((item, index) => (
                  <ItemCard
                    key={index}
                    item={item}
                    getDateTime={getDateTime}
                    deletethread={deletethread}
                    type="profile"
                  />
                ))}
              </>
            ) : (
              <p>No live chats available.</p>
            )}
          </div>
        )}
        {current_page === "privatethreads" && (
          <div>
            {mychatrooms.private.length > 0 ? (
              <>
                {mychatrooms.private.map((item, index) => (
                  <ItemCard
                    key={index}
                    item={item}
                    getDateTime={getDateTime}
                    deletethread={deletethread}
                    type="profile"
                  />
                ))}
              </>
            ) : (
              <p>No live chats available.</p>
            )}
          </div>
        )}
        {current_page === "savedthreads" && (
          <div>
            {mychatrooms.saved.length > 0 ? (
              <>
                {mychatrooms.saved.map((item, index) => (
                  <ItemCard
                    key={index}
                    item={item}
                    getDateTime={getDateTime}
                    deletethread={deletethread}
                    type="profile"
                  />
                ))}
              </>
            ) : (
              <p>No live chats available.</p>
            )}
          </div>
        )}
        {current_page === "upcomingthreads" && (
          <div>
            {mychatrooms.upcoming.length > 0 ? (
              <>
                {mychatrooms.upcoming.map((item, index) => (
                  <ItemCard
                    key={index}
                    item={item}
                    getDateTime={getDateTime}
                    deletethread={deletethread}
                    type="profile"
                  />
                ))}
              </>
            ) : (
              <p>No live chats available.</p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
