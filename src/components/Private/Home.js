import React, { useEffect, useState } from "react";
import axios from "axios";
import { Form, Dropdown } from "semantic-ui-react";
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

  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function getChatRooms() {
      setLoader(true);
      const token = await localStorage.getItem("hackathon");
      if (token) {
        await axios
          .get("http://192.168.0.105:3005/api/chat/getchatrooms", {
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
  return (
    <>
      {loader && <Loader />}
      <div className="search-page">
        <Form.Group widths="equal">
          <Dropdown
            placeholder="Search for threads"
            fluid
            multiple
            search
            selection
            label="Select members"
            onChange={(e, { value }) => {}}
          />
        </Form.Group>

        <MenuBar
          current_page={current_page}
          setCurrentPage={setCurrentPage}
          type="home"
        />
        {current_page === "threads" && (
          <div>
            {chatrooms.current.map((item, index) => (
              <ItemCard
                key={index}
                item={item}
                getDateTime={getDateTime}
                type="home"
              />
            ))}
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
              <p>No live chats available.</p>
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
              <p>No upcoming chats available.</p>
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
              <p>No upcoming chats available.</p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
