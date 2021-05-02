import React, { useEffect, useState } from "react";
import axios from "axios";
import {  Dropdown } from "../../semantichelper";
import MenuBar from "../General/MenuBar";
import Loader from "../General/Loader";
import ItemCard from "../General/ItemCard";
import moment from "moment";
import Calendar from "react-awesome-calendar";
export default function Home() {
  const [loader, setLoader] = useState(false);
  const [chatrooms, setChatRooms] = useState({
    current: [],
    live: [],
    upcoming: [],
    saved: [],
  });
  const [filterchatrooms, setFilterChatRooms] = useState([]);

  const [events, setEvents] = useState([]);
  useEffect(() => {
    async function getChatRooms() {
      setLoader(true);
      const token = await localStorage.getItem("hackathon");
      if (token) {
        await axios
          .get("https://threadoverflow.herokuapp.com/api/chat/getchatrooms", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            setLoader(false);
            setChatRooms({
              current: res.data.chatrooms,
              live: res.data.livechatrooms,
              upcoming: res.data.upcomingchatrooms,
              saved: res.data.savedchatrooms,
            });
            setFilterChatRooms(res.data.chatrooms);
            const event = res.data.upcomingchatrooms.map((item, index) => {
              return {
                id: index,
                color: "#fd3153",
                from: moment.utc(item.timing).format(),
                to: moment.utc(item.timing).format(),
                title:
                  item.topic +
                  " at " +
                  new Date(item.timing).toLocaleTimeString(),
              };
            });
            setEvents(event);
          })
          .catch((err) => {
            setLoader(false);
          });
      }
    }
    getChatRooms();
  }, []);
  const [current_page, setCurrentPage] = useState("threads");
  function getDateTime(val) {
    const v = new Date(val);
    return v.toLocaleString();
  }
  const options_cat = [
    { key: "1", text: "All", value: "all" },
    { key: "2", text: "General", value: "general" },
    { key: "3", text: "Technical", value: "technical" },
    { key: "4", text: "News", value: "news" },
    { key: "5", text: "Food", value: "food" },
    { key: "6", text: "Covid", value: "covid" },
    { key: "7", text: "Sports", value: "sports" },
  ];
  function filterthreads(val) {
    setCurrentPage("threads");
    if (val !== "all") {
      const fdata = chatrooms.current.filter(
        (item) => item.category.toString().toLowerCase() === val
      );
      setFilterChatRooms(fdata);
    } else {
      setFilterChatRooms(chatrooms.current)
    }
  }

  return (
    <>
      {loader && <Loader />}
      <div className="search-page">
        <span>
          Show me threads by category {" "}
          <Dropdown
            inline
            options={options_cat}
            defaultValue={options_cat[0].value}
            onChange={(e, { value }) => {
              filterthreads(value);
            }}
          />
        </span>

        <MenuBar
          current_page={current_page}
          setCurrentPage={setCurrentPage}
          type="home"
        />
        {current_page === "threads" && (
          <div>
            {filterchatrooms.length > 0 ?
              <div>
                {filterchatrooms.map((item, index) => (
                  <ItemCard
                    key={index}
                    item={item}
                    getDateTime={getDateTime}
                    type="home"
                  />
                ))}
              </div> : <p className="center-message">No threads available.</p>}
            </div>
        )}

        {current_page === "livethreads" && (
          <div>
            {chatrooms.live.length > 0 ? (
              <>
                {chatrooms.live.map((item, index) => (
                  <ItemCard
                    key={index}
                    item={item}
                    getDateTime={getDateTime}
                    type="home"
                  />
                ))}
              </>
            ) : (
              <p className="center-message">No live threads available.</p>
            )}
          </div>
        )}
        {current_page === "upcomingthreads" && (
          <div>
            {chatrooms.upcoming.length > 0 ? (
              <>
                <Calendar events={events} />
                {chatrooms.upcoming.map((item, index) => (
                  <ItemCard
                    key={index}
                    item={item}
                    getDateTime={getDateTime}
                    type="home"
                  />
                ))}
              </>
            ) : (
              <p className="center-message">No Upcoming threads available.</p>
            )}
          </div>
        )}
        {current_page === "savedthreads" && (
          <div>
            {chatrooms.saved.length > 0 ? (
              <>
                {chatrooms.saved.map((item, index) => (
                  <ItemCard
                    key={index}
                    item={item}
                    getDateTime={getDateTime}
                    type="home"
                  />
                ))}
              </>
            ) : (
              <p className="center-message">No saved threads available.</p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
