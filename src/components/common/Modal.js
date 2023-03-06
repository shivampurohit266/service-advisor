import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import * as classNames from "classnames";
import LastUpdated from "../common/LastUpdated";

const CRMModal = props => (
  <Modal
    isOpen={props.isOpen}
    toggle={props.toggle}
    backdrop={"static"}
    className={classNames(
      props.isAppointment
        ? "customer-modal custom-form-modal"
        : "customer-modal custom-form-modal custom-modal-lg",
      { ...props.classNames }
    )}
    {...props.modalProps}
  >
    <ModalHeader toggle={props.toggle}>
      {props.headerText || "Modal Header"}
      {props.updatedAt ? <LastUpdated updatedAt={props.updatedAt} /> : null}
    </ModalHeader>
    <ModalBody>{props.children}</ModalBody>
    <ModalFooter>
      {props.showfooterMsg ? (
        <div className="required-fields">
          {props.footerMessage || "*Fields are Required."}
        </div>
      ) : null}
      {props.footerButtons &&
        props.footerButtons.map((button, index) => {
          return (
            <Button
              color={button.color}
              onClick={e => {
                e.preventDefault();
                if (button.onClick) {
                  button.onClick(e);
                }
              }}
              type={button.type}
              key={index}
            >
              {button.text || "Button"}
            </Button>
          );
        })}
    </ModalFooter>
  </Modal>
);

export default CRMModal;
