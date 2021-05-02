import React from "react";
import { List, Image, Header, Icon, Label } from "../../semantichelper";
export default function ThreadAdminPanelRight({
  thread,
  admin,
  setAddMemberModal,
  makeadmin,
}) {
  return (
    <div>
      {!thread.closed && (
        <List selection verticalAlign="middle">
          <Header as="h3" style={{ paddingLeft: "1rem" }}>
            Thread Audience
          </Header>
          {admin && thread.chat_priv && (
            <Header as="h5" style={{ cursor: "pointer", paddingLeft: "1rem" }}>
              <a onClick={() => setAddMemberModal(true)}>
                {" "}
                Add Audience to private thread{" "}
              </a>
            </Header>
          )}
          {thread.people_in_thread?.map((item) => (
            <List.Item>
              <Image
                avatar
                src={item.avatar}
              />
              <List.Content>
                <List.Header>
                  <Header
                    as="h4"
                    color={
                      item.name === thread.createdbyemail.split("@")[0]
                        ? "red"
                        : "black"
                    }
                  >
                    {item.name}
                  </Header>
                  {admin && (
                    <>
                      {item.name !== thread.createdbyemail.split("@")[0] && (
                        <>
                          <Label onClick={() => makeadmin({ uid: item.id })}>
                            Make admin
                          </Label>
                        </>
                      )}
                    </>
                  )}
                  {item.typing && (
                    <Icon
                      name="keyboard outline"
                      color="red"
                      style={{ paddingLeft: "1rem" }}
                    />
                  )}
                </List.Header>
                {item.typing && <p>Typing...</p>}
              </List.Content>
            </List.Item>
          ))}
        </List>
      )}
    </div>
  );
}
