import React, { useEffect, useState } from "react";
import { useAuthState } from "../../context/AuthContext/GlobalState";
import { useHistory, useLocation } from "react-router-dom";
import { Menu } from "../../semantichelper";
import Loader from "../General/Loader";
import axios from "axios";
import Settings from "../Thread/Settings";
export default function Navbar() {
  const history = useHistory();
  const location = useLocation();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    async function fetchUsers() {
      const token = await localStorage.getItem("hackathon");
      if (token) {
        axios
          .get("https://threadoverflow.herokuapp.com/api/users/getUser", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            const data = res.data.users;
            console.log(data);
            var mem = data.map((item, index) => {
              return { key: index, text: item.emailId, value: item.emailId };
            });
            setMembers(mem);
          })
          .catch((err) => {
            console.log(err.response);
          });
      }
    }
    fetchUsers();
  }, []);

  const { user } = useAuthState();
  const [showmodal, setShowModall] = useState(false);
  const [formdata, setFormData] = useState({
    topic: "",
    category: "",
    description: "",
    text_priv: true,
    chat_priv: false,
    priv_members: [],
    schedule_later: false,
    timing: new Date(),
  });
  async function createRoom() {
    if (formdata.topic.trim().length === 0) {
      alert("Please enter the topic");
    } else if (formdata.category.trim().length === 0) {
      alert("Please select category");
    } else if (formdata.description.trim().length === 0) {
      alert("Please enter the description");
    } else if (formdata.chat_priv && formdata.priv_members.length === 0) {
      alert("Please select atleast one member for private group");
    } else if (
      formdata.schedule_later &&
      Date.parse(new Date()) > Date.parse(formdata.timing)
    ) {
      alert("Please enter a time in advance");
    } else {
      setLoading(true);
      const token = await localStorage.getItem("hackathon");
      const priv_mem = [...formdata.priv_members, user.emailId];
      if (token) {
        await axios
          .post(
            "https://threadoverflow.herokuapp.com/api/chat/createchatroom",
            { ...formdata, priv_members: priv_mem },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((res) => {
            setLoading(false);
            history.push("/");
          })
          .catch(() => {
            setLoading(false);
            alert("Please try again later");
          });
      }
    }
  }
  return (
    <>
      {loading && <Loader />}
      <Menu style={{ marginTop: "0rem" }}>
        <Menu.Item>
          <img src="https://images.unsplash.com/photo-1577563908411-5077b6dc7624?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80" />
        </Menu.Item>

        <Menu.Item
          onClick={() => {
            history.push("/");
          }}
          name="home"
          active={location.pathname === "/home"}
        >
          Timeline
        </Menu.Item>

        <Menu.Item
          name="profile"
          onClick={() => {
            history.push("/profile");
          }}
        >
          Hi, {user.username}
        </Menu.Item>
        {!location.pathname.includes("/thread") && (
          <Menu.Item name="createroom" onClick={() => setShowModall(true)}>
            Create a room
          </Menu.Item>
        )}
      </Menu>

      <Settings
        showmodal={showmodal}
        formdata={formdata}
        setFormData={setFormData}
        members={members}
        setShowModall={setShowModall}
        createRoom={createRoom}
        type="new"
      />
    </>
  );
}
