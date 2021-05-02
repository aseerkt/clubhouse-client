import React from "react";
import { Item, Label, Icon, Menu } from "../../semantichelper";
import copy from "copy-to-clipboard";  
export default function ThreadDescription({
  thread,
  admin,
  savethreadandclose,
  deletethreadandclose,
  setShowSettings,
  setShowParticipant,
  setRaisedHand,
}) {
  return (
    <Item.Group>
      <Item>
        <Item.Content>
          <Item.Header as="a">{thread.topic} <Icon
          onClick={()=>{copy(`https://threadoverflow.herokuapp.com/thread/${thread._id}`)}}
                      name="copy outline" /></Item.Header>
          {thread.islive && (
            <Item.Meta>
              <Label as="a" color="green" ribbon>
                Live now
              </Label>
            </Item.Meta>
          )}

          <Item.Description>{thread.description}</Item.Description>
          <div className="thread-otp">
            <Item.Extra> Category - {thread.category}</Item.Extra>
            {admin && !thread.closed && (
              <>
                <Item.Extra
                  onClick={() => savethreadandclose()}
                  className="link"
                >
                  Save thread and close
                </Item.Extra>
                <Item.Extra
                  onClick={() => deletethreadandclose()}
                  className="link"
                >
                  Delete thread and close
                </Item.Extra>
                <Item.Extra onClick={() => setShowSettings(true)}>
                  <Icon name="setting" color="black" />
                  
                </Item.Extra>
              </>
                      )}
                      <div className="mob-menu">
                    <Menu compact>
                      <Menu.Item
                        as="a"
                        onClick={() => {
                          setShowParticipant(true);
                        }}
                      >
                        <Icon name="users" />
                        <Label color="red" floating>
                          {thread.people_in_thread?.length}
                        </Label>
                      </Menu.Item>
                      {admin && (
                        <Menu.Item
                          as="a"
                          onClick={() => {
                            setRaisedHand(true);
                          }}
                        >
                          <Icon name="hand paper" />
                          <Label color="teal" floating>
                            {thread.raised_hand?.length}
                          </Label>
                        </Menu.Item>
                      )}
                    </Menu>
                  </div>
          </div>
          <p>
            {" "}
            Thread managed by - <strong>{thread.createdbyemail}</strong>
          </p>
        </Item.Content>
      </Item>
    </Item.Group>
  );
}
