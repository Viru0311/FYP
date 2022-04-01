import React, { useState } from "react";
import "./Popup.css";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

function Popup(props) {
  let message;

  if (props.error) message = "Oops!";
  else message = "Successful!";

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">{message}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ color: "#3E2050" }}>
        <p>{props.message}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default Popup;
