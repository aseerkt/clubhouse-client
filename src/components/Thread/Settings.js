import React from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  TextArea,
  Dropdown,
  Header,
  Button,
  Icon,
} from "../../semantichelper";
import DateTimePicker from "react-datetime-picker";

export default function Settings({
  showmodal,
  formdata,
  setFormData,
  members,
  setShowModall,
  createRoom,
  type,
}) {
  const options_cat = [
    { key: "1", text: "General", value: "general" },
    { key: "2", text: "Technical", value: "technical" },
    { key: "3", text: "News", value: "news" },
    { key: "4", text: "Food", value: "food" },
    { key: "5", text: "Covid", value: "covid" },
    { key: "6", text: "Sports", value: "sports" },
  ];
  const options_privacy = [
    { key: "1", text: "Yes", value: true },
    { key: "2", text: "No", value: false },
  ];

  return (
    <Modal open={showmodal}>
      <Modal.Content>
        <Header as="h2">
          {type === "new" ? "Create a thread" : "Settings of thread"}
        </Header>
      </Modal.Content>
      <Form style={{ padding: "1rem" }}>
        <Form.Group widths="equal">
          <Form.Field
            control={Input}
            value={formdata.topic}
            label="Topic"
            placeholder="Topic..."
            onChange={(e) => {
              if (type === "new") {
                setFormData({ ...formdata, topic: e.target.value });
              }
            }}
          />
          <Form.Field
            value={formdata.category}
            control={Select}
            onChange={(e, { value }) => {
              if (type === "new") {
                setFormData({ ...formdata, category: value });
              }
            }}
            label="Category"
            placeholder="Category"
            options={options_cat}
          />
        </Form.Group>

        <Form.Field
          value={formdata.description}
          onChange={(e) => {
            if (type === "new") {
              setFormData({ ...formdata, description: e.target.value });
            }
          }}
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
            label="Is this a private thread?"
            placeholder="Yes or No"
            options={options_privacy}
          />
        </Form.Group>
        {type === "new" && (
          <>
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
          </>
        )}
        {type === "new" && (
          <>
            <Form.Group widths="equal">
              <Form.Field
                value={formdata.schedule_later}
                control={Select}
                onChange={(e, { value }) =>
                  setFormData({ ...formdata, schedule_later: value })
                }
                label="Start this thread later?"
                placeholder="Yes or No"
                options={options_privacy}
              />
            </Form.Group>
          </>
        )}
      </Form>
      {type === "new" && (
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
      )}

      <Modal.Actions>
        <Button color="red" onClick={() => setShowModall(false)}>
          <Icon name="remove" /> Cancel
        </Button>
        <Button
          color="green"
          onClick={() => {
            if (type === "new") {
              createRoom();
            } else if (type === "settings") {
              createRoom(formdata);
            }
          }}
        >
          <Icon name="checkmark" /> Submit
        </Button>
      </Modal.Actions>
    </Modal>
  );
}
