import React from "react";
import { Comment, Form, Header, Icon, Button } from "../../semantichelper";
export default function AddComment({
  thread,
  admin,
  achat,
  commentbox,
  replycomment,
  setReplyComment,
  setCommentState,
  commentbody,
  typingtimeout,
  setCommentBody,
  startedtyping,
  setTypingTimeout,
  stopedtyping,
  commentstate,
  sendChat,
  getDateTime,
}) {
  return (
    <div>
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
                    <Comment.Author as="a">{replycomment.uname}</Comment.Author>
                    <Comment.Metadata>
                      <span>{getDateTime(replycomment.time)}</span>
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
                  onKeyDown={(e) => {
                    if (e.keyCode === 13) {
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
                    }
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
    </div>
  );
}
