import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { useHistory, useParams } from "react-router-dom";
import { useAuthState } from "../../context/AuthContext/GlobalState";
import ThreadTemp from "../General/ThreadTemp";
import axios from "axios";
import InfoAlert from "../General/InfoAlert";
import Loader from "../General/Loader";
import ErrorAlert from "../General/ErrorAlert";
import AddMemberModal from "../General/AddMemberModal";
import ClosedAlert from "../General/ClosedAlert";
export default function Thread() {
  const { user } = useAuthState();
  const history = useHistory();
  const params = useParams();
  const [socket, setSocket] = useState(null);
  const [thread, setThread] = useState({});
  const [addmembermodal, setAddMemberModal] = useState(false);
  const [timeout, changeTimeout] = useState(null);
  const [infoalert, setInfoalert] = useState(null);
  const [erroralert, setErroralert] = useState(null);
  const [closedalert, setClosedAlert] = useState(null);
  const [showsettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    async function startconnection() {
      const token = localStorage.getItem("hackathon");

      if (token) {
        setLoading(true);
        await axios
          .get(
            `https://threadoverflow.herokuapp.com/api/chat/getthread/${params.tid}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((res) => {
            if (res.data.thread.closed) {
              setLoading(false);
              setThread(res.data.thread);
            } else if (res.data.thread.islive) {
              setLoading(true);
              var newSocket = io("https://threadoverflow.herokuapp.com", {
                query: {
                  token: localStorage.getItem("hackathon"),
                },
              });
              newSocket.emit("checkid", { tid: params.tid }, (data) => {
                if (!data.auth) {
                  setLoading(false);
                  history.replace("/");
                } else {
                  setLoading(false);
                  setSocket(newSocket);
                  setThread(data.thread);
                  setLoading(false);
                }
              });
            }
          })
          .catch((err) => {
            setLoading(false);
            history.replace("/");
          });
      }
    }

    startconnection();

    return function cleanup() {
      if (socket) socket.on("disconnect", () => {});
    };
  }, []);
  useEffect(() => {
    async function con() {
      if (socket) {
        socket.on("connect", () => {});
        socket.on("closethread", (data) => {
          setClosedAlert(data.message);
          setTimeout(() => {
            history.replace("/");
            setClosedAlert(null);
          }, 5000);
        });
        socket.on("threadupdate", (data) => {
          setThread(data.thread);
        });
        socket.on("closeredirect", () => {
          history.replace("/");
        });
        socket.on("message", (data) => {
          clearTimeout(timeout);
          changeTimeout(
            setTimeout(() => {
              setInfoalert(null);
            }, 4000)
          );
          setInfoalert(data);
        });
      }
    }
    con();
    return function cleanup() {
      if (socket) socket.on("disconnect", () => {});
    };
  }, [socket]);

  async function raiseHand() {
    setLoading(true);
    socket.emit("raiseHand", { userid: user._id, tid: params.tid }, (data) => {
      setThread(data.thread);
      if (data.success) {
        setLoading(false);
      } else {
        setTimeout(() => {
          setErroralert(null);
        }, 4000);
        setErroralert("Error , please try again.");
        setLoading(false);
      }
    });
  }

  function checkAvailability(arr) {
    let val = arr?.find((obj) => obj.id === user._id);
    return val;
  }

  function allowToText(item) {
    setLoading(true);
    socket.emit("allowtotext", { item: item, tid: params.tid }, (data) => {
      setThread(data.thread);
      if (data.success) {
        setLoading(false);
      } else {
        setTimeout(() => {
          setErroralert(null);
        }, 4000);
        setErroralert("Error , please try again.");
        setLoading(false);
      }
    });
  }
  function sendChat(obj) {
    setLoading(true);
    socket.emit("sendmessage", { ...obj, tid: params.tid }, (data) => {
      if (data.success) {
        setLoading(false);
      } else {
        setTimeout(() => {
          setErroralert(null);
        }, 4000);
        setErroralert("Error , please try again.");
        setLoading(false);
      }
    });
  }
  function addToHighlight(obj) {
    setLoading(true);
    socket.emit("addtohighlights", { ...obj, tid: params.tid }, (data) => {
      if (data.success) {
        setLoading(false);
      } else {
        setTimeout(() => {
          setErroralert(null);
        }, 4000);
        setErroralert("Error , please try again.");
        setLoading(false);
      }
    });
  }
  function addMembersToPrivateThread(obj) {
    setLoading(true);
    socket.emit(
      "addmemberstoprivatechat",
      { ...obj, tid: params.tid },
      (data) => {
        setAddMemberModal(false);
        if (data.success) {
          setLoading(false);
        } else {
          setTimeout(() => {
            setErroralert(null);
          }, 4000);
          setErroralert("Error , please try again.");
          setLoading(false);
        }
      }
    );
  }
  function startedtyping() {
    socket.emit("startedtyping", { tid: params.tid }, (data) => {
      if (data.success) {
      } else {
        setTimeout(() => {
          setErroralert(null);
        }, 4000);
        setErroralert("Error , please try again.");
      }
    });
  }
  function stopedtyping() {
    socket.emit("stoppedtyping", { tid: params.tid }, (data) => {
      if (data.success) {
      } else {
        setTimeout(() => {
          setErroralert(null);
        }, 4000);
        setErroralert("Error , please try again.");
      }
    });
  }
  function makeadmin(obj) {
    setLoading(true);
    socket.emit("makeadmin", { ...obj, tid: params.tid }, (data) => {
      if (data.success) {
        setLoading(false);
      } else {
        setTimeout(() => {
          setErroralert(null);
        }, 4000);
        setErroralert("Error , please try again.");
        setLoading(false);
      }
    });
  }
  function savethread(obj) {
    setLoading(true);
    socket.emit("savethread", { tid: params.tid }, (data) => {
      if (data.success) {
        setLoading(false);
      } else {
        setTimeout(() => {
          setErroralert(null);
        }, 4000);
        setErroralert("Error , please try again.");
        setLoading(false);
      }
    });
  }
  function savethreadandclose() {
    setLoading(true);
    socket.emit("savethreadandclose", { tid: params.tid }, (data) => {
      if (data.success) {
        setLoading(false);
      } else {
        setTimeout(() => {
          setErroralert(null);
        }, 4000);
        setErroralert("Error , please try again.");
        setLoading(false);
      }
    });
  }
  function deletethreadandclose() {
    setLoading(true);
    socket.emit("deletethreadandclose", { tid: params.tid }, (data) => {
      if (data.success) {
        setLoading(false);
      } else {
        setTimeout(() => {
          setErroralert(null);
        }, 4000);
        setErroralert("Error , please try again.");
        setLoading(false);
      }
    });
  }
  function updatethreadsettings(obj) {
    setLoading(true);
    socket.emit("updatethreadsettings", { ...obj, tid: params.tid }, (data) => {
      if (data.success) {
        setShowSettings(false);
        setLoading(false);
      } else {
        setTimeout(() => {
          setErroralert(null);
        }, 4000);
        setErroralert("Error , please try again.");
        setLoading(false);
      }
    });
  }
  if (thread.createdbyid && user._id === thread.createdbyid) {
    return (
      <div style={{ paddingBottom: "1rem" }}>
        <ThreadTemp
          thread={thread}
          checkAvailability={checkAvailability}
          raiseHand={raiseHand}
          admin={true}
          allowToText={allowToText}
          sendChat={sendChat}
          addToHighlight={addToHighlight}
          setAddMemberModal={setAddMemberModal}
          startedtyping={startedtyping}
          stopedtyping={stopedtyping}
          makeadmin={makeadmin}
          savethread={savethread}
          savethreadandclose={savethreadandclose}
          deletethreadandclose={deletethreadandclose}
          updatethreadsettings={updatethreadsettings}
          showsettings={showsettings}
          setShowSettings={setShowSettings}
        />
        {loading && <Loader />}
        {infoalert && <InfoAlert mdesc={infoalert} />}
        {erroralert && <ErrorAlert mdesc={infoalert} />}

        {closedalert && <ClosedAlert mdesc={closedalert} />}

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
  if (thread.createdbyid && user._id !== thread.createdbyid) {
    return (
      <div style={{ paddingBottom: "1rem" }}>
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
          />
        )}
        {loading && <Loader />}
        {erroralert && <ErrorAlert mdesc={infoalert} />}

        {closedalert && <ClosedAlert mdesc={closedalert} />}
        {infoalert && <InfoAlert mdesc={infoalert} />}
      </div>
    );
  }
  return <>{loading && <Loader />}</>;
}
