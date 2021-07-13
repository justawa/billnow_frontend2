import React from "react";
import { Modal, ModalHeader, ModalBody } from "reactstrap";

export default function Success({
  isOpen,
  headMessage,
  bodyMessage,
  toggleMessage,
}) {
  return (
    <Modal isOpen={isOpen} toggle={() => toggleMessage()}>
      <ModalHeader toggle={() => toggleMessage()}>{headMessage}</ModalHeader>
      <ModalBody>
        {bodyMessage.map((message, idx) => (
          <p key={idx}>{message}</p>
        ))}
      </ModalBody>
    </Modal>
  );
}
