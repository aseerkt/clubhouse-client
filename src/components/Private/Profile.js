import React, { useEffect, useState } from "react";
import axios from "axios";
import { Header, Icon, Item, Label } from "semantic-ui-react";
import { useAuthState } from "../../context/AuthContext/GlobalState";
export default function Profile() {
  const { user, updateuser } = useAuthState();
  const [mychatrooms, setMyChatRooms] = useState([]);

  useEffect(() => {
    async function getChatRooms() {
      const token = await localStorage.getItem("hackathon");
      if (token) {
        await axios
          .get("http://localhost:3005/api/chat/mychatrooms", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            setMyChatRooms(res.data.chatrooms);
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
        .delete(`http://localhost:3005/api/chat/deletethread/${id}`, {
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
    <div style={{ margin: "2rem" }}>
      <Item.Group divided>
        <Item style={{ pointer: "cursor" }}>
          <Item.Content style={{ padding: "2rem" }}>
            <Item.Header as="a">{user.username}</Item.Header>
            <Item.Meta>
              <span className="cinema">{user.emailId}</span>
            </Item.Meta>
          </Item.Content>
        </Item>
      </Item.Group>
      <Header as="h3" dividing>
        My threads
      </Header>
      {mychatrooms.map((item, index) => (
        <a href={!item.schedule_later ? `/thread/${item._id}` : null}>
          <div className="space">
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
              <Icon
                name="zip"
                size="large"
                onClick={() => deletethread(item._id)}
                style={{ zIndex: "5000" }}
                color="red"
              />
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
  );
}
