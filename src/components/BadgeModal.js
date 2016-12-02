import React from 'react';
import { Modal, FormGroup, Button, FormControl } from 'react-bootstrap';
import AttendeeList from './AttendeeList';

export default ({showBadgeModal, closeModal, selectedBar, addAttendee, removeAttendee}) => {
    return <BadgeModal
      showBadgeModal={showBadgeModal}
      handleClose={closeModal}
      selectedBar={selectedBar}
      addAttendee={addAttendee}
      removeAttendee={removeAttendee} />;
}

class BadgeModal extends React.Component {
  render() {
    return (
      <Modal className="modal" show={this.props.showBadgeModal} onHide={this.props.handleClose}>
        <Modal.Header className="modal-header" closeButton>
          <Modal.Title>{this.props.selectedBar.data.name}</Modal.Title>
        </Modal.Header>
            <Modal.Body className="modal-body">
              <h4>People Going Tonight:</h4>
              <AttendeeList
                attendees={this.props.selectedBar.data.attendees} />
              {this.props.selectedBar.userAttending ?
              <Button onClick={this.props.removeAttendee} className="btn">I'm not going</Button>
              :
              <Button onClick={this.props.addAttendee} className="btn">I'm going</Button>
              }
            </Modal.Body>
      </Modal>

    );
  }
}
