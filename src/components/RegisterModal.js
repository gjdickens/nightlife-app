import React from 'react';
import { Modal, FormGroup, Button, FormControl } from 'react-bootstrap';

export default ({showModal, closeModal, modalUsernameChange, modalPasswordChange, register}) => {
    return <RegisterModal
      showModal={showModal}
      handleClose={closeModal}
      handleModalUsernameChange={modalUsernameChange}
      handleModalPasswordChange={modalPasswordChange}
      handleRegister={register} />;
}

class RegisterModal extends React.Component {
  render() {
    return (
      <Modal className="modal" show={this.props.showModal} onHide={this.props.handleClose}>
        <Modal.Header className="modal-header" closeButton>
          <Modal.Title>Register</Modal.Title>
        </Modal.Header>
            <Modal.Body className="modal-body">
              <FormGroup>
                <FormControl type='text' onChange={this.props.handleModalUsernameChange} placeholder="Username" />
                <FormControl type="password" onChange={this.props.handleModalPasswordChange} placeholder="Password" />
              </FormGroup>
              <Button onClick={this.props.handleRegister} className="btn">Register</Button>
            </Modal.Body>
        <Modal.Footer className="modal-footer">
          <Button onClick={this.props.handleClose}>Cancel</Button>
        </Modal.Footer>
      </Modal>

    );
  }
}
