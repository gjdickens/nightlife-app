import React from 'react';
import { FormGroup, Button, FormControl } from 'react-bootstrap';


export default ({attendees}) => {
    return (
      <ul>{attendees.map(function(attendee, i){
        return <li key={i}>{attendee.username}</li>;
      })}
      </ul>
    )
  }
