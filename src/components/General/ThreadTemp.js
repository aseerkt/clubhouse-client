import React, { useEffect, useRef, useState } from "react";
import { Header, Comment, Icon } from "../../semantichelper";
import ThreadAdminPanelLeft from "../Thread/ThreadAdminPanelLeft";
import Highlights from "../Thread/Highlights";
import ThreadDescription from "../Thread/ThreadDescription";
import SaveStatus from "../Thread/SaveStatus";
import CommentNormal from "../Thread/CommentNormal";
import CommentReply from "../Thread/CommentRepy";
import AddComment from "../Thread/AddComment";
import ThreadAdminPanelRight from "../Thread/ThreadAdminPanelRight";
import Settings from "../Thread/Settings";
import MobileViewFeatureModal from "../Thread/MobileViewFeatureModal";
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
  startedtyping,
  stopedtyping,
  makeadmin,
  savethread,
  savethreadandclose,
  deletethreadandclose,
  updatethreadsettings,
  showsettings,
  setShowSettings,
}) {
  const commentbox = useRef(null);
  const [commentbody, setCommentBody] = useState("");
  const [handraise, setHandRaised] = useState(false);
  const [achat, setAchat] = useState(true);
  const [commentstate, setCommentState] = useState("normal");
  const [highlightsmodal, setHighlightsModal] = useState(false);
  const [formdata, setFormData] = useState({
    topic: thread.topic,
    category: thread.category,
    description: thread.description,
    chat_priv: thread.chat_priv,
    text_priv: thread.text_priv,
  });
  const [showparticipant, setShowParticipant] = useState(false);
  const [showraisedhand, setRaisedHand] = useState(false);
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
      time: item.timing,
      comment: item.body,
    });
    setCommentState("reply");
    commentbox.current.scrollIntoView();
  };
  function getDateTime(val) {
    const v = new Date(val);
    return v.toLocaleString();
  }

  return (
    <div className="thread-temp">
      <div className="feed">
        {showraisedhand && (
          <MobileViewFeatureModal
            view={showraisedhand}
            modalaction={setRaisedHand}
            header="Raised hands."
            comp={
              <ThreadAdminPanelLeft
                thread={thread}
                admin={admin}
                allowToText={allowToText}
                achat={achat}
                handraise={handraise}
                raiseHand={raiseHand}
                setHandRaised={setHandRaised}
              />
            }
          />
        )}
        <ThreadAdminPanelLeft
          thread={thread}
          admin={admin}
          allowToText={allowToText}
          achat={achat}
          handraise={handraise}
          raiseHand={raiseHand}
          setHandRaised={setHandRaised}
        />
      </div>

      <div className="main">
        <Highlights
          highlightsmodal={highlightsmodal}
          setHighlightsModal={setHighlightsModal}
          thread={thread}
          getDateTime={getDateTime}
        />
        <Settings
          formdata={formdata}
          setFormData={setFormData}
          showmodal={showsettings}
          setShowModall={setShowSettings}
          type="settings"
          createRoom={updatethreadsettings}
        />
        <ThreadDescription
          thread={thread}
          admin={admin}
          savethreadandclose={savethreadandclose}
          deletethreadandclose={deletethreadandclose}
          setShowSettings={setShowSettings}
          setShowParticipant={setShowParticipant}
          setRaisedHand={setRaisedHand}
        />

        <Header as="h4">{thread.chats?.length} comments </Header>
        <SaveStatus admin={admin} thread={thread} savethread={savethread} />
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
                <CommentNormal
                  item={item}
                  admin={admin}
                  addReply={addReply}
                  addToHighlight={addToHighlight}
                  thread={thread}
                  index={index}
                  getDateTime={getDateTime}
                />
              )}
              {item.type === "reply" && (
                <CommentReply
                  item={item}
                  addReply={addReply}
                  thread={thread}
                  index={index}
                  getDateTime={getDateTime}
                />
              )}
            </>
          ))}
          {!thread.closed && (
            <>
              {" "}
              {!achat && !admin ? (
                <>
                  {handraise ? (
                    <Header as="h4">
                      You have raised your , please wait until admin accepts
                      your request.
                      <Icon name="hand paper" />
                    </Header>
                  ) : (
                    <Header as="h5">
                      This thread is restricted to only few people to chat , i
                      if you want to chat then{" "}
                      <span
                        className="click-here"
                        onClick={() => {
                          raiseHand();
                          setHandRaised(true);
                        }}
                      >
                        {" "}
                        Click here to here to raise your hand
                        <Icon name="hand paper" />
                      </span>
                    </Header>
                  )}
                </>
              ) : null}
            </>
          )}

          <AddComment
            thread={thread}
            admin={admin}
            achat={achat}
            commentbox={commentbox}
            replycomment={replycomment}
            setReplyComment={setReplyComment}
            setCommentState={setCommentState}
            commentbody={commentbody}
            typingtimeout={typingtimeout}
            setCommentBody={setCommentBody}
            startedtyping={startedtyping}
            setTypingTimeout={setTypingTimeout}
            stopedtyping={stopedtyping}
            commentstate={commentstate}
            sendChat={sendChat}
            getDateTime={getDateTime}
          />
        </Comment.Group>
      </div>
      <div className="feed">
        {showparticipant && (
          <MobileViewFeatureModal
            view={showparticipant}
            modalaction={setShowParticipant}
            header="Audience"
            comp={
              <ThreadAdminPanelRight
                thread={thread}
                admin={admin}
                setAddMemberModal={setAddMemberModal}
                makeadmin={makeadmin}
              />
            }
          />
        )}
        <ThreadAdminPanelRight
          thread={thread}
          admin={admin}
          setAddMemberModal={setAddMemberModal}
          makeadmin={makeadmin}
        />
      </div>
    </div>
  );
}
