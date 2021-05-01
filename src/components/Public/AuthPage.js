import React, { useState } from "react";
import { Button, Checkbox, Form, Input } from "semantic-ui-react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { useAuthState } from "../../context/AuthContext/GlobalState";
export default function AuthPage() {
  const history = useHistory();
  const { loginuser } = useAuthState();

  const [emailid, setEmailId] = useState("");
  const [otp, setOtp] = useState("");
  const [screen, setScreen] = useState("email");
  async function sendOtp() {
    await axios
      .post("http://localhost:3005/api/user/sendotp", { emailId: emailid })
      .then((res) => {
        console.log(res.data);
        setScreen("otp");
      });
  }
  async function verifyOtp() {
    await axios
      .post("http://localhost:3005/api/user/verify", {
        emailId: emailid,
        otp: otp,
      })
      .then(async (res) => {
        loginuser({ token: res.data.token, user: res.data.user_ });
        history.push("/home");
      });
  }
  return (
    <div className="auth-form">
      <Form>
        <Form.Field
          id="form-input-control-error-email"
          control={Input}
          value={emailid}
          label="Email"
          placeholder="joe@schmoe.com"
          error={null}
          onChange={(e) => setEmailId(e.target.value)}
        />
        {screen === "otp" && (
          <Form.Field
            id="form-input-control-error-email"
            control={Input}
            label="Otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="123456"
            error={null}
          />
        )}
        <Form.Field>
          <Checkbox label="I agree to the Terms and Conditions" />
        </Form.Field>
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
  );
}
