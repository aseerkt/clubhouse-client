import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  Feed,
  Form,
  Dropdown,
  Menu,
  Item,
  Label,
} from "semantic-ui-react";
import moment from "moment";
import Calendar from "react-awesome-calendar";
export default function Home() {
  const [currentchatrooms, setCurrentChatrooms] = useState([]);
  const [livechatrooms, setLiveChatRooms] = useState([]);
  const [upcomingchatrooms, setUpcomingChatRooms] = useState([]);
  const [savedchatrooms, setSavedChatRooms] = useState([]);
  const [events, setEvents] = useState([]);
  //   const events = [{
  //     id: 1,
  //     color: '#fd3153',
  //     from: new Date(),
  //     to: new Date(),
  //     title: 'This is an event'
  // }, {
  //     id: 2,
  //     color: '#1ccb9e',
  //     from: '2019-05-01T13:00:00+00:00',
  //     to: '2019-05-05T14:00:00+00:00',
  //     title: 'This is another event'
  // }, {
  //     id: 3,
  //     color: '#3694DF',
  //     from: '2019-05-05T13:00:00+00:00',
  //     to: '2019-05-05T20:00:00+00:00',
  //     title: 'This is also another event'
  // }];
  useEffect(() => {
    async function getChatRooms() {
      const token = await localStorage.getItem("hackathon");
      if (token) {
        await axios
          .get("http://localhost:3005/api/chat/getchatrooms", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            setCurrentChatrooms(res.data.chatrooms);
            setLiveChatRooms(res.data.livechatrooms);
            setUpcomingChatRooms(res.data.upcomingchatrooms);
            setSavedChatRooms(res.data.savedchatrooms);

            const event = res.data.upcomingchatrooms.map((item, index) => {
              console.log(moment.utc(item.timing).format());
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

      <Menu pointing secondary>
        <Menu.Item
          name="Threads"
          active={current_page === "threads"}
          onClick={() => {
            setCurrentPage("threads");
          }}
        />
        <Menu.Item
          name="Upcoming Threads"
          active={current_page === "upcomingthreads"}
          onClick={() => {
            setCurrentPage("upcomingthreads");
          }}
        />
        <Menu.Item
          name="Live Threads"
          active={current_page === "livethreads"}
          onClick={() => {
            setCurrentPage("livethreads");
          }}
        />
        <Menu.Item
          name="Saved Threads"
          active={current_page === "savedthreads"}
          onClick={() => {
            setCurrentPage("savedthreads");
          }}
        />
      </Menu>
      {current_page === "threads" && (
        <div>
          {currentchatrooms.map((item, index) => (
            <a href={!item.schedule_later ? `/thread/${item._id}` : null}>
              <div className="space">
                {item.schedule_later && <div className="item-backdrop"></div>}
                <Item.Group>
                  {item.closed && (
                    <Label as="a" color="red" ribbon>
                      Saved
                    </Label>
                  )}
                  {item.islive && (
                    <Label as="a" color="green" ribbon>
                      Live
                    </Label>
                  )}
                  {item.schedule_later && (
                    <Label as="a" color="blue" ribbon>
                      Live at {getDateTime(item.timing)}
                    </Label>
                  )}
                  <Item>
                    <Item.Content>
                      <Item.Header as="a">{item.topic}</Item.Header>
                      <Item.Extra></Item.Extra>
                      <Item.Description>{item.description}</Item.Description>
                    </Item.Content>
                  </Item>
                </Item.Group>
              </div>
            </a>
          ))}
        </div>
      )}

      {current_page === "livethreads" && (
        <div>
          {livechatrooms.length > 0 ? (
            <>
              {livechatrooms.map((item, index) => (
                <a href={`/thread/${item._id}`}>
                  <div className="space">
                    <Item.Group>
                      <Label as="a" color="green" ribbon>
                        Live
                      </Label>
                      <Item>
                        <Item.Content>
                          <Item.Header as="a">{item.topic}</Item.Header>
                          <Item.Extra>Live thread</Item.Extra>
                          <Item.Description>
                            {item.description}
                          </Item.Description>
                        </Item.Content>
                      </Item>
                    </Item.Group>
                  </div>
                </a>
              ))}
            </>
          ) : (
            <p>No live chats available.</p>
          )}
        </div>
      )}
      {current_page === "upcomingthreads" && (
        <div>
          {upcomingchatrooms.length > 0 ? (
            <>
              <Calendar
                events={events}
                onChange={() => {}}
                onClickEvent={() => {
                  console.log("vfkl");
                }}
              />
              {upcomingchatrooms.map((item, index) => (
                <div className="space">
                  <Item.Group>
                    <Label as="a" color="blue" ribbon>
                      Live at {getDateTime(item.timing)}
                    </Label>
                    <Item>
                      <Item.Content>
                        <Item.Header as="a">{item.topic}</Item.Header>

                        <Item.Description>{item.description}</Item.Description>
                      </Item.Content>
                    </Item>
                  </Item.Group>
                </div>
              ))}
            </>
          ) : (
            <p>No upcoming chats available.</p>
          )}
        </div>
      )}
      {current_page === "savedthreads" && (
        <div>
          {savedchatrooms.length > 0 ? (
            <>
              {savedchatrooms.map((item, index) => (
                <a href={`/thread/${item._id}`}>
                  <div className="space">
                    <Item.Group>
                      <Label as="a" color="red" ribbon>
                        Saved
                      </Label>
                      <Item>
                        <Item.Content>
                          <Item.Header as="a">{item.topic}</Item.Header>

                          <Item.Description>
                            {item.description}
                          </Item.Description>
                        </Item.Content>
                      </Item>
                    </Item.Group>
                  </div>
                </a>
              ))}
            </>
          ) : (
            <p>No upcoming chats available.</p>
          )}
        </div>
      )}
    </div>
  );
}
