import React from "react";
import { Message } from "../../semantichelper";

export default function ErrorAlert({ mdesc }) {
  return (
    <div className="alert">
      <Message color="red">{mdesc}</Message>
    </div>
  );
}
