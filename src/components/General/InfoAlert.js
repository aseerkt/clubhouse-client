import React from "react";
import { Message } from "../../semantichelper";

export default function InfoAlert({ mdesc }) {
  return (
    <div className="alert">
      <Message color="teal">{mdesc}
      </Message>
    </div>
  );
}
