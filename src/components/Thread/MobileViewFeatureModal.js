import React from "react";
import { Modal, Button } from "../../semantichelper";

export default function MobileViewFeatureModal({
  view,
  modalaction,
  header,
  comp,
}) {
  return (
    <div>
      <Modal
        centered={false}
        open={view}
        onClose={() => modalaction(false)}
        onOpen={() => modalaction(true)}
      >
        <Modal.Content>{comp}</Modal.Content>
        <Modal.Actions>
          <Button onClick={() => modalaction(false)}>Close</Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
}
