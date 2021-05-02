import React from "react";
import { Message } from "semantic-ui-react";

export default function InfoAlert({ mdesc }) {
  return (
    <div className="alert">
      <Message color="teal">{mdesc}
      </Message>
    </div>
  );
}
