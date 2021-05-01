import React, { useEffect, useRef, useState } from "react";
import {
  Form,
  Item,
  TextArea,
  Button,
  Modal,
  Image,
  List,
  Header,
  Label,
  Comment,
  Icon,
} from "semantic-ui-react";
import Picker from "emoji-picker-react";
export default function ThreadTemp({
  thread,
  admin,
  checkAvailability,
  setAddMemberModal,
  raiseHand,
  allowedtochat,
  allowToText,
  sendChat,
  addToHighlight,
  addemoji,
  startedtyping,
  stopedtyping,
  makeadmin,
  savethread,
  savethreadandclose,
  deletethreadandclose,
}) {
  const emojis = [
    {
      emoji: "😀",

      unified: "1f600",
    },
    {
      emoji: "😂",
      unified: "1f602",
    },
    {
      emoji: "😱",

      unified: "1f631",
    },
    {
      emoji: "👍",

      unified: "1f44d",
    },
    {
      emoji: "👎",

      unified: "1f44e",
    },
  ];
  const [chosenEmoji, setChosenEmoji] = useState(null);

  const commentbox = useRef(null);
  const [commentbody, setCommentBody] = useState("");
  const [handraise, setHandRaised] = useState(false);
  const [achat, setAchat] = useState(true);
  const [commentstate, setCommentState] = useState("normal");
  const [highlightsmodal, setHighlightsModal] = useState(false);
  const [showemoji, setShowEmoji] = useState(false);
  useEffect(() => {
    console.log(allowedtochat);
    if (!allowedtochat) {
      if (checkAvailability(thread.allowed_to_chat)) {
        setAchat(true);
      } else {
        setAchat(false);
        if (checkAvailability(thread.raised_hand)) {
          setHandRaised(true);
        } else {
          setHandRaised(false);
        }
      }
    } else {
      setAchat(true);
    }
  }, [thread]);
  const [typingtimeout, setTypingTimeout] = useState();
  const [replycomment, setReplyComment] = useState(null);
  const addReply = (item) => {
    setReplyComment({
      image: item.image,
      uname: item.username,
      time: "Today at 5:42PM",
      comment: item.body,
    });
    setCommentState("reply");
    commentbox.current.scrollIntoView();
  };
  const onEmojiClick = (event, emojiObject) => {
    console.log(emojiObject);
    setChosenEmoji(emojiObject);
  };

  return (
    <div className="thread-temp">
      <div className="feed">
        {!thread.closed && (
          <>
            {admin ? (
              <List selection verticalAlign="middle">
                <Header as="h3" style={{ paddingLeft: "1rem" }}>
                  Wait list
                </Header>

                {thread.raised_hand?.map((item) => (
                  <List.Item>
                    <div className="list-tem">
                      <div>
                        <Image
                          avatar
                          src="https://react.semantic-ui.com/images/avatar/small/helen.jpg"
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
                        <Icon
                          name="close"
                          style={{ padding: "0.2rem", cursor: "pointer" }}
                        />
                      </div>
                    </div>
                  </List.Item>
                ))}
              </List>
            ) : (
              <>
                {!achat ? (
                  <>
                    {handraise ? (
                      <Header as="h4">
                        Requestes to chat , please wait.
                        <Icon name="hand paper" />
                      </Header>
                    ) : (
                      <Header
                        onClick={() => {
                          raiseHand();
                          setHandRaised(true);
                        }}
                        as="h4"
                      >
                        Click here to here to raise your hand
                        <Icon name="hand paper" />
                      </Header>
                    )}
                  </>
                ) : null}
              </>
            )}
          </>
        )}
      </div>
      <div className="main">
        <Modal
          centered={false}
          open={highlightsmodal}
          onClose={() => setHighlightsModal(false)}
          onOpen={() => setHighlightsModal(true)}
        >
          <Modal.Header>Highlights</Modal.Header>
          <Modal.Content>
            <Modal.Description>
              {thread.highlights?.map((item, index) => (
                <Comment.Group>
                  <Comment>
                    <Comment.Avatar as="a" src={item.image} />
                    <Comment.Content>
                      <Comment.Author as="a">{item.username}</Comment.Author>
                      <Comment.Metadata>
                        <span>Today at 5:42PM</span>
                      </Comment.Metadata>
                      <Comment.Text>{item.body}</Comment.Text>
                    </Comment.Content>
                  </Comment>
                </Comment.Group>
              ))}
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={() => setHighlightsModal(false)}>OK</Button>
          </Modal.Actions>
        </Modal>
        <Item.Group>
          <Item>
            <Item.Content>
              <Item.Header as="a">{thread.topic}</Item.Header>
              {thread.islive && (
                <Item.Meta>
                  {" "}
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
                    {" "}
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
                   </>
                )}
              </div>
            </Item.Content>
          </Item>
        </Item.Group>

        <Header as="h4">{thread.chats?.length} comments </Header>
        {admin ? (
          <>
            {!thread.issave ? (
              <Label as="a" color="red" tag onClick={() => savethread()}>
                Save this chat
              </Label>
            ) : (
              <>
                {thread.closed ? (
                  <Label as="a" color="red" tag>
                    Closed Thread.
                  </Label>
                ) : (
                  <Label as="a" color="teal" tag>
                    Chat is getting saved.
                  </Label>
                )}
              </>
            )}
          </>
        ) : (
          <>
            {!thread.closed ? (
              <>
                {thread.issave && (
                  <Label as="a" color="teal" tag>
                    Chat is getting saved.
                  </Label>
                )}
              </>
            ) : (
              <Label as="a" color="red" tag>
                Closed Thread.
              </Label>
            )}
          </>
        )}
        <Comment.Group threaded>
          <Header as="h3" dividing>
            Comments
            <span
              onClick={() => setHighlightsModal(true)}
              className="highlights-label"
            >
              Highlights
            </span>
          </Header>
          {thread.chats?.map((item, index) => (
            <>
              {item.type === "normal" && (
                <Comment.Group>
                  <Comment>
                    <Comment.Avatar as="a" src={item.image} />
                    <Comment.Content>
                      <Comment.Author as="a">{item.username}</Comment.Author>
                      <Comment.Metadata>
                        <span>Today at 5:42PM</span>
                      </Comment.Metadata>
                      <Comment.Text>{item.body}</Comment.Text>
                      {!thread.closed && (
                        <Comment.Actions>
                          <a onClick={() => addReply(item)}>Reply</a>
                          {admin && (
                            <>
                              {thread.highlightindex.includes(index) ? (
                                <Comment.Metadata style={{ cursor: "pointer" }}>
                                  Highlighted
                                </Comment.Metadata>
                              ) : (
                                <Comment.Metadata
                                  onClick={() =>
                                    addToHighlight({
                                      comment: item,
                                      index: index,
                                    })
                                  }
                                  style={{ cursor: "pointer" }}
                                >
                                  Add to highlights
                                </Comment.Metadata>
                              )}
                            </>
                          )}

                          {/* <a onClick={() => setShowEmoji(true)}>React</a> */}
                        </Comment.Actions>
                      )}
                    </Comment.Content>

                    {/* {showemoji && (
                    <div className="emojies">
                      {emojis.map((item_, index_) => (
                        <p onClick={() => addemoji({chat:item_, emoji:item,index:index})}>
                          {item_.emoji}
                        </p>
                      ))}
                    </div>
                  )} */}
                  </Comment>
                </Comment.Group>
              )}
              {item.type === "reply" && (
                <Comment>
                  <Comment.Avatar as="a" src={item.ofuserimage} />
                  <Comment.Content>
                    <Comment.Author as="a">{item.ofuser}</Comment.Author>
                    <Comment.Metadata>
                      <span>Yesterday at 12:30AM</span>
                    </Comment.Metadata>
                    <Comment.Text>
                      <p>{item.ofusercomment}</p>
                    </Comment.Text>
                  </Comment.Content>

                  <Comment.Group>
                    <Comment>
                      <Comment.Avatar as="a" src={item.image} />
                      <Comment.Content>
                        <Comment.Author as="a">{item.username}</Comment.Author>
                        <Comment.Metadata>
                          <span>{item.username}</span>
                        </Comment.Metadata>
                        <Comment.Text>{item.body}</Comment.Text>
                        {!thread.closed && (
                          <Comment.Actions>
                            <a onClick={() => addReply(item)}>Reply</a>
                          </Comment.Actions>
                        )}
                      </Comment.Content>
                    </Comment>
                  </Comment.Group>
                </Comment>
              )}
            </>
          ))}
          {!thread.closed && (
            <>
              {(achat || admin) && (
                <div ref={commentbox} style={{ marginTop: "2rem" }}>
                  {replycomment && (
                    <Comment>
                      <Header color="red" as="h4">
                        Replying to {replycomment.uname}{" "}
                        <Icon
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setReplyComment(null);
                            setCommentState("normal");
                          }}
                          name="close"
                        />
                      </Header>

                      <Comment.Avatar as="a" src={replycomment.image} />
                      <Comment.Content>
                        <Comment.Author as="a">
                          {replycomment.uname}
                        </Comment.Author>
                        <Comment.Metadata>
                          <span>{replycomment.time}</span>
                        </Comment.Metadata>
                        <Comment.Text>{replycomment.comment}</Comment.Text>
                      </Comment.Content>
                    </Comment>
                  )}

                  <Form reply>
                    <Form.TextArea
                      value={commentbody}
                      onChange={(e) => {
                        clearTimeout(typingtimeout);
                        setCommentBody(e.target.value);
                        startedtyping();
                        setTypingTimeout(
                          setTimeout(() => {
                            stopedtyping();
                          }, 5000)
                        );
                      }}
                    />
                    <Button
                      content="Add Reply"
                      labelPosition="left"
                      icon="edit"
                      primary
                      onClick={() => {
                        if (commentstate === "normal") {
                          sendChat({ type: "normal", body: commentbody });
                        } else if (commentstate === "reply") {
                          sendChat({
                            type: "reply",
                            ofuser: replycomment.uname,
                            ofuserimage: replycomment.image,
                            ofusercomment: replycomment.comment,
                            body: commentbody,
                          });
                        }
                        stopedtyping();
                        setCommentState("normal");
                        setCommentBody("");
                        setReplyComment(null);
                      }}
                    />
                  </Form>
                </div>
              )}
            </>
          )}
        </Comment.Group>
      </div>
      <div className="feed">
        {!thread.closed && (
          <List selection verticalAlign="middle">
            <Header as="h3" style={{ paddingLeft: "1rem" }}>
              Thread Audience
            </Header>
            {admin && thread.chat_priv && (
              <Header
                as="h5"
                style={{ cursor: "pointer", paddingLeft: "1rem" }}
              >
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
                  src="https://react.semantic-ui.com/images/avatar/small/helen.jpg"
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
    </div>
  );
}
