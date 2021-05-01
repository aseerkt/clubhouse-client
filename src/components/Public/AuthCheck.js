import React, { useEffect, useContext } from "react";
import axios from "axios";

import { GlobalContext } from "../../context/AuthContext/GlobalState";

export default function AuthCheck() {
  const { loginuser } = useContext(GlobalContext);
  useEffect(() => {
    async function authCheck() {
      const token = await localStorage.getItem("hackathon");

      if (token) {
        axios
          .get("http://localhost:3005/api/user/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            const details = {
              user: res.data.user_,
              token: res.data.token,
            };

            loginuser(details);
          })
          .catch((err) => {
            console.log(err.response);
          });
      } else {
      }
    }
    authCheck();
  }, []);
  return <div></div>;
}
