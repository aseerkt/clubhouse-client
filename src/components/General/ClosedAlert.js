import React from "react";
import { Message } from "../../semantichelper";

export default function ClosedAlert({ message, mdesc }) {
  return (
    <>
      <div className="backdrop"></div>
      <div className="closed-alert">
        <Message color="red">{mdesc}</Message>
      </div>
    </>
  );
}
