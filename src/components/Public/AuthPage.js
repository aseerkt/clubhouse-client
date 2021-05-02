import React, { useState } from "react";
import { Button, Form, Input, Label } from "semantic-ui-react";
import Loader from "../General/Loader";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { useAuthState } from "../../context/AuthContext/GlobalState";
export default function AuthPage() {
  const history = useHistory();
  const { loginuser } = useAuthState();

  const [emailid, setEmailId] = useState("");
  const [otp, setOtp] = useState("");
  const [loader, setLoader] = useState(false);
  const [screen, setScreen] = useState("email");
  const [newuser, setNewUSer] = useState(false);
  const [erroremail, setErrorEmail] = useState(false);
  const [errorotp, setErrorOtp] = useState(false);
  const [avatar, setAvatar] = useState([
    "https://www.w3schools.com/howto/img_avatar2.png",
    "https://www.w3schools.com/w3images/avatar2.png",
    "https://www.w3schools.com/w3images/avatar6.png",
    "https://www.w3schools.com/w3images/avatar5.png",
    "https://www.w3schools.com/howto/img_avatar.png",
  ]);
  const [selectedavatar, setSelectAvatar] = useState(null);
  async function sendOtp() {
    var re_mail = /\S+@\S+\.\S+/;
    if (!re_mail.test(emailid)) {
      setErrorEmail(true);
    } else {
      setLoader(true);
      await axios
        .post("http://192.168.0.105:3005/api/user/sendotp", {
          emailId: emailid,
        })
        .then((res) => {
          console.log(res.data);
          setScreen("otp");
          setNewUSer(res.data.newuser);
          setLoader(false);
        })
        .catch((err) => {
          setLoader(false);
        });
    }
  }
  async function verifyOtp() {
    if (newuser && selectedavatar == null) {
      alert("Please select an avatar");
    } else if (otp.length !== 6) {
      setErrorOtp(true);
    } else {
      setLoader(true);
      await axios
        .post("http://192.168.0.105:3005/api/user/verify", {
          emailId: emailid,
          otp: otp,
          newuser: newuser,
          avatar: avatar[selectedavatar],
        })
        .then(async (res) => {
          loginuser({ token: res.data.token, user: res.data.user_ }, false);
          history.push("/home");
          setLoader(false);
        })
        .catch((err) => {
          setErrorOtp(true);
          setLoader(false);
        });
    }
  }
  return (
    <>
      {loader && <Loader />}
      <div className="auth-form">
        <Form>
          <Form.Field
            id="form-input-control-error-email"
            control={Input}
            value={emailid}
            label="Email"
            placeholder="joe@schmoe.com"
            onChange={(e) => setEmailId(e.target.value)}
            error={erroremail ? "Please enter a valid mail id" : null}
          />
          {screen === "otp" && (
            <Form.Field
              id="form-input-control-error-email"
              control={Input}
              label="Otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="123456"
              error={errorotp ? "Please enter a valid otp" : null}
            />
          )}
          {newuser && (
            <div className="avatar-div">
              {avatar.map((item, index) => (
                <img
                  className={
                    selectedavatar === index ? "aimg selectedavatar" : "aimg"
                  }
                  key={index}
                  src={item}
                  alt=""
                  onClick={() => setSelectAvatar(index)}
                />
              ))}
            </div>
          )}
          <Button
            type="submit"
            onClick={() => {
              if (screen === "email") {
                sendOtp();
              } else {
                verifyOtp();
              }
            }}
          >
            Submit
          </Button>
        </Form>
      </div>
    </>
  );
}
