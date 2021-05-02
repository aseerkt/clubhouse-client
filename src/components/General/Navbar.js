import React, { useEffect, useState } from "react";
import { useAuthState } from "../../context/AuthContext/GlobalState";
import { useHistory } from "react-router-dom";
import axios from "axios";
import Settings from "../Thread/Settings";
export default function Navbar() {
  const history = useHistory();
  const [members, setMembers] = useState([]);
  useEffect(() => {
    async function fetchUsers() {
      const token = await localStorage.getItem("hackathon");
      if (token) {
        axios
          .get("http://192.168.0.105:3005/api/users/getUser", {
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
      const token = await localStorage.getItem("hackathon");
      const priv_mem = [...formdata.priv_members, user.emailId];
      if (token) {
        await axios
          .post(
            "http://192.168.0.105:3005/api/chat/createchatroom",
            { ...formdata, priv_members: priv_mem },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((res) => {
            history.push("/");

            console.log(res);
          });
      }
    }
  }
  return (
    <>
      <div className="navbar">
        <a href="/profile">
          <p className="item">Hi, {user.username}</p>
        </a>
        <a href="/home">
          <p className="item">Timeline</p>
        </a>
        <p className="item" onClick={() => setShowModall(true)}>
          Create a room
        </p>
      </div>

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
