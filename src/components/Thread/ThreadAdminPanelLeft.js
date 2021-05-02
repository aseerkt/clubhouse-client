import React from "react";
import { Image, List, Header, Icon } from "../../semantichelper";
export default function ThreadAdminPanelLeft({
  thread,
  admin,
  allowToText,
  achat,
  handraise,
  raiseHand,
  setHandRaised,
}) {
  return (
    <>
      {!thread.closed && (
        <>
          {admin ? (
            <List selection verticalAlign="middle">
              <Header as="h3" style={{ paddingLeft: "1rem" }}>
                Raised Hands
              </Header>

              {thread.raised_hand?.map((item) => (
                <List.Item>
                  <div className="list-tem">
                    <div>
                      <Image
                        avatar
                        src={item.avatar}
                      />

                      <List.Content>
                        <List.Header
                          style={{
                            paddingTop: "0.5rem",
                            paddingLeft: "0.2rem",
                          }}
                        >
                          {item.name}
                        </List.Header>
                      </List.Content>
                    </div>
                    <div className="icons">
                      <Icon
                        name="check"
                        onClick={() => allowToText(item)}
                        style={{
                          padding: "0.2rem",
                          paddingRight: "2rem",
                          cursor: "pointer",
                        }}
                      />
                      {/* <Icon
                        name="close"
                        style={{ padding: "0.2rem", cursor: "pointer" }}
                      /> */}
                    </div>
                  </div>
                </List.Item>
              ))}
            </List>
          ) : (
            <>
              
            </>
          )}
        </>
      )}
    </>
  );
}
