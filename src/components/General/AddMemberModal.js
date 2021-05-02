import React, { useEffect, useState } from "react";
import { Button, Modal,Dropdown,Form } from "../../semantichelper";
import axios from "axios";

export default function AddMemberModal({
  setAddMemberModal,
  addMembersToPrivateThread,
  addmembermodal,
  currentmembers,
}) {
  const [members, setMembers] = useState([]);
  const [memberlist, setMemberList] = useState([]);
  useEffect(() => {
    async function fetchUsers() {
      const token = await localStorage.getItem("hackathon");
      if (token) {
        await axios
          .get("https://threadoverflow.herokuapp.com/api/users/getUser", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            const data = res.data.users;

            if (currentmembers) var mem = [];
            for (var i = 0; i < data.length; i++) {
              console.log(data[i].emailId);
              if (!currentmembers.includes(data[i].emailId)) {
                mem.push({
                  key: i,
                  text: data[i].emailId,
                  value: data[i].emailId,
                });
              }
            }
            setMembers(mem);
          })
          .catch((err) => {
            console.log(err.response);
          });
      }
    }
    fetchUsers();
  }, []);
  return (
    <div>
      <Modal
        centered={false}
        open={addmembermodal}
        onClose={() => setAddMemberModal(false)}
        onOpen={() => setAddMemberModal(true)}
      >
        <Modal.Header>Add members to private debate!</Modal.Header>
        <Modal.Content>
          <Modal.Description>
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
                  setMemberList(value);
                }}
              />
            </Form.Group>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          
          <Button
            onClick={() => {
              setAddMemberModal(false);
            }}
          >
                      Close
          </Button>
          <Button
            onClick={() => {
              addMembersToPrivateThread({ members: memberlist });
            }}
          >
            Add members
          </Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
}
