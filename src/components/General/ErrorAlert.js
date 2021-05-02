import React from "react";
import { Message } from "semantic-ui-react";

export default function ErrorAlert({ mdesc }) {
  return (
    <div className="alert">
      <Message color="red">{mdesc}</Message>
    </div>
  );
}
