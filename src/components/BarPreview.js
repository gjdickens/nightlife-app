// src/components/AthletePreview.js
import React from 'react';
import { Link } from 'react-router';
import { ListGroup, ListGroupItem, Badge } from 'react-bootstrap';
if(process.env.WEBPACK) require('./BarPreview.scss');

export default class BarPreview extends React.Component {
  render() {
    return (
        <ListGroupItem>
          <a href={this.props.barData.link_url}>
            <h4>{this.props.barData.name}</h4>
          </a>
          <img className="thumbnail-img" src={this.props.barData.image_url} />
          <p className="thumbnail-address">{this.props.barData.location.address1}</p>
          {this.props.loggedIn.isLoggedIn ?
          <a href="#" className="badge-link"><Badge id={this.props.barData.id} onClick={this.props.badgeClick}>{this.props.barData.attendees.length + ' going tonight'}</Badge></a>
          :
          <div></div>
          }
        </ListGroupItem>
    );
  }
}
