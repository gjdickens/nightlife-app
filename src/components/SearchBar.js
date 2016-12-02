import React from 'react';
import { FormGroup, Button, FormControl } from 'react-bootstrap';


export default ({searchChange, searchClick, clearClick, searchField}) => {
    return (
      <div>
          <h2 className="text-center">Nightlife Search</h2>
          <FormGroup>
              <FormControl type='text' onChange={searchChange} placeholder="Search" value={searchField} />
              <Button onClick={searchClick}>Search</Button>
              <Button onClick={clearClick}>Clear</Button>
          </FormGroup>
      </div>
    )
  }
