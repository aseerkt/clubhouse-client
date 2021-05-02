import React, { useState } from "react";
import { Button, Form, Input, Image, Header } from "../../semantichelper";
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
        .post("https://threadoverflow.herokuapp.com/api/user/sendotp", {
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
        .post("https://threadoverflow.herokuapp.com/api/user/verify", {
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
        <div className="auth-image">
          <Image
            src="https://images.unsplash.com/photo-1577563908411-5077b6dc7624?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
            size="small"
            circular
          />
        </div>
        <Header as="h3">Welcom to clubhouse !!</Header>
        <Form>
          <Form.Field
            id="form-input-control-error-email"
            control={Input}
            value={emailid}
            label="Enter your mail id"
            placeholder="jhon@gmail.com"
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
            primary
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
