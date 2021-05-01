import React, { useEffect, useState } from "react";
import { useAuthState } from "../../context/AuthContext/GlobalState";
import DateTimePicker from "react-datetime-picker";
import {useHistory} from "react-router-dom"
import axios from "axios";
import {
  Button,
  Modal,
  Icon,
  Form,
  Input,
  Select,
  TextArea,
  Dropdown,
} from "semantic-ui-react";
export default function Navbar() {
  const history = useHistory();
  const [members, setMembers] = useState([]);
  useEffect(() => {
    //  console.log(Date.parse('Sat May 01 2021 20:05:00 GMT+0530') < Date.parse('Sat May 01 2021 20:57:00 GMT+0530'))
    async function fetchUsers() {
      const token = await localStorage.getItem("hackathon");
      if (token) {
        axios
          .get("http://localhost:3005/api/users/getUser", {
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
  const options_cat = [
    { key: "1", text: "Sports", value: "sports" },
    { key: "2", text: "Technical", value: "technical" },
    { key: "3", text: "NextJS", value: "nextjs" },
  ];
  const options_privacy = [
    { key: "1", text: "Yes", value: true },
    { key: "2", text: "No", value: false },
  ];

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
            "http://localhost:3005/api/chat/createchatroom",
            { ...formdata, priv_members: priv_mem },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((res) => {
            history.push("/")

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

      <Modal open={showmodal}>
        <Modal.Content>
          <p>Create a room !</p>
        </Modal.Content>
        <Form style={{ padding: "2rem" }}>
          <Form.Group widths="equal">
            <Form.Field
              control={Input}
              value={formdata.topic}
              label="Topic"
              placeholder="Topic..."
              onChange={(e) =>
                setFormData({ ...formdata, topic: e.target.value })
              }
            />
            <Form.Field
              value={formdata.category}
              control={Select}
              onChange={(e, { value }) => {
                setFormData({ ...formdata, category: value });
              }}
              label="Category"
              placeholder="Category"
              options={options_cat}
            />
          </Form.Group>

          <Form.Field
            value={formdata.description}
            onChange={(e) =>
              setFormData({ ...formdata, description: e.target.value })
            }
            control={TextArea}
            label="Detailed description"
            placeholder="Tell us more about the topic...."
          />
          <Form.Group widths="equal">
            <Form.Field
              value={formdata.text_priv}
              control={Select}
              onChange={(e, { value }) =>
                setFormData({ ...formdata, text_priv: value })
              }
              label="Allow everyone to chat?"
              placeholder="Yes or No"
              options={options_privacy}
            />
            <Form.Field
              value={formdata.chat_priv}
              control={Select}
              onChange={(e, { value }) => {
                if (!value) {
                  setFormData({
                    ...formdata,
                    priv_members: [],
                    chat_priv: value,
                  });
                } else setFormData({ ...formdata, chat_priv: value });
              }}
              label="Is this a private debate?"
              placeholder="Yes or No"
              options={options_privacy}
            />
          </Form.Group>
          {formdata.chat_priv && (
            <Form.Group widths="equal">
              <Dropdown
                placeholder="Select members of chat"
                options={members}
                fluid
                multiple
                search
                selection
                label="Select members"
                onChange={(e, { value }) => {
                  setFormData({ ...formdata, priv_members: value });
                }}
              />
            </Form.Group>
          )}
          <Form.Group widths="equal">
            <Form.Field
              value={formdata.schedule_later}
              control={Select}
              onChange={(e, { value }) =>
                setFormData({ ...formdata, schedule_later: value })
              }
              label="Start debate / conversation now or later?"
              placeholder="Yes or No"
              options={options_privacy}
            />
          </Form.Group>
        </Form>
        <div className="datetimepicker">
          {formdata.schedule_later && (
            <DateTimePicker
              onChange={(value) => {
                setFormData({ ...formdata, timing: value });
              }}
              value={formdata.timing}
              style={{ width: "20rem" }}
            />
          )}
        </div>
        <Modal.Actions>
          <Button color="red" onClick={() => setShowModall(false)}>
            <Icon name="remove" /> No
          </Button>
          <Button color="green" onClick={() => createRoom()}>
            <Icon name="checkmark" /> Yes
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
}
