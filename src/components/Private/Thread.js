import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { useHistory, useParams } from "react-router-dom";
import { useAuthState } from "../../context/AuthContext/GlobalState";
import ThreadTemp from "../General/ThreadTemp";
import axios from "axios";
import AddMemberModal from "../General/AddMemberModal";
export default function Thread() {
  const { user } = useAuthState();
  const history = useHistory();
  const params = useParams();
  const [socket, setSocket] = useState(null);
  const [thread, setThread] = useState({});
  const [addmembermodal, setAddMemberModal] = useState(false);
  function eventHandler() {
    socket.emit("dist", { tid: params.tid }, () => {});
  }
  useEffect(() => {
    async function cd() {
      const token = localStorage.getItem("hackathon");

      if (token) {
        await axios
          .get(`http://localhost:3005/api/chat/getthread/${params.tid}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            if (res.data.thread.closed) {
              setThread(res.data.thread)
            } else if(res.data.thread.islive){
              var newSocket = io("http://localhost:3005", {
                query: {
                  token: localStorage.getItem("hackathon"),
                },
              });
              setSocket(newSocket);
            }
          })
          .catch((res) => {
          history.replace("/")
        })
        //consolele.log(token);
        if (socket) {
          socket.on("connect", () => {});
          socket.on("threadupdate", (data) => {
            console.log(data);
            setThread(data.thread);
          });
          socket.on("closeredirect", () => {
            history.replace("/");
          });
          socket.emit("checkid", { tid: params.tid }, (data) => {
            if (!data.auth) {
              history.replace("/");
            } else {
              setThread(data.thread);
            }
          });
        }
      }
    }

    cd();

    return function cleanup() {
      if (socket) socket.on("disconnect", () => {});
    };
  }, []);
  useEffect(() => {
    if (socket) {
      socket.on("connect", () => { });
      socket.on("closethread", () => {
        console.log("cdmlk")
        history.replace("/")
      })
      socket.on("threadupdate", (data) => {
        console.log(data);
        setThread(data.thread);
      });
      socket.on("closeredirect", () => {
        history.replace("/");
      });
      socket.emit("checkid", { tid: params.tid }, (data) => {
        if (!data.auth) {
          history.replace("/");
        } else {
          setThread(data.thread);
        }
      });
    }
  

  },[socket])
  function cdC() {
    socket.emit("sendm", { tid: params.tid }, () => {});
  }
  async function raiseHand() {
    socket.emit("raiseHand", { userid: user._id, tid: params.tid }, (data) => {
      //consolele.log(data);
      //consolele.log(user._id);
      setThread(data.thread);
    });
  }

  function checkAvailability(arr) {
    let val = arr?.find((obj) => obj.id === user._id);
    return val;
  }

  function allowToText(item) {
    socket.emit("allowtotext", { item: item, tid: params.tid }, (data) => {
      setThread(data.thread);
    });
  }
  function sendChat(obj) {
    socket.emit("sendmessage", { ...obj, tid: params.tid });
  }
  function addemoji(obj) {
    socket.emit("addemoji", { ...obj, tid: params.tid });
  }
  function addToHighlight(obj) {
    socket.emit("addtohighlights", { ...obj, tid: params.tid });
  }
  function addMembersToPrivateThread(obj) {
    socket.emit("addmemberstoprivatechat", { ...obj, tid: params.tid }, () => {
      setAddMemberModal(false);
    });
  }
  function startedtyping() {
    socket.emit("startedtyping", { tid: params.tid });
  }
  function stopedtyping() {
    socket.emit("stoppedtyping", { tid: params.tid });
  }
  function makeadmin(obj) {
    socket.emit("makeadmin", { ...obj, tid: params.tid });
  }
  function savethread(obj) {
    socket.emit("savethread", { tid: params.tid });
  }
  function savethreadandclose() {
    socket.emit("savethreadandclose", { tid: params.tid });
  }
  function deletethreadandclose() {
    socket.emit("deletethreadandclose", { tid: params.tid });

  }
  if (user._id === thread.createdbyid) {
    return (
      <div>
        <ThreadTemp
          thread={thread}
          checkAvailability={checkAvailability}
          raiseHand={raiseHand}
          admin={true}
          allowToText={allowToText}
          sendChat={sendChat}
          addemoji={addemoji}
          addToHighlight={addToHighlight}
          setAddMemberModal={setAddMemberModal}
          startedtyping={startedtyping}
          stopedtyping={stopedtyping}
          makeadmin={makeadmin}
          savethread={savethread}
          savethreadandclose={savethreadandclose}
          deletethreadandclose={deletethreadandclose}
        />

    
        {addmembermodal && (
          <AddMemberModal
            addMembersToPrivateThread={addMembersToPrivateThread}
            addmembermodal={addmembermodal}
            setAddMemberModal={setAddMemberModal}
            currentmembers={thread.priv_members}
          />
        )}
      </div>
    );
  }
  if (user._id !== thread.createdbyid) {
    return (
      <>
        {thread.topic && (
          <ThreadTemp
            thread={thread}
            checkAvailability={checkAvailability}
            raiseHand={raiseHand}
            admin={false}
            allowedtochat={thread.text_priv}
            sendChat={sendChat}
            startedtyping={startedtyping}
            stopedtyping={stopedtyping}
            addemoji={addemoji}
          />
        )}
      </>
    );
  }
}
