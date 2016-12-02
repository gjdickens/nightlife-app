// src/components/IndexPage.js
import React from 'react';
import BarPreview from './BarPreview';
import SearchBar from './SearchBar';
import BadgeModal from './BadgeModal';
import { ListGroup } from 'react-bootstrap';
if(process.env.WEBPACK) require('./IndexPage.scss');

const queryString = 'https://api.yelp.com/v3/businesses/search?term=bars&location=';



export default class IndexPage extends React.Component {
  constructor(props) {
    super(props);

    this.searchChange = this.searchChange.bind(this);
    this.clearClick = this.clearClick.bind(this);
    this.searchClick = this.searchClick.bind(this);
    this.badgeClick = this.badgeClick.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.addAttendee = this.addAttendee.bind(this);
    this.fetchAttendees = this.fetchAttendees.bind(this);
    this.removeAttendee = this.removeAttendee.bind(this);
    this.fetchLocalStorage = this.fetchLocalStorage.bind(this);

    this.state = {
      searchField: "",
      data: [],
      showBadgeModal: false,
      selectedBar: {data:{}, userAttending: false},
      barArr: []
    }
  }

  componentDidMount() {
    this.fetchLocalStorage();
  }

  fetchLocalStorage() {
    var barSearchData = JSON.parse(localStorage.getItem('barSearchData'));
    if (barSearchData) { this.setState({data: barSearchData}) }
    var barSearchField = JSON.parse(localStorage.getItem('barSearchField'));
    if (barSearchField) { this.setState({searchField: barSearchField}) }
    var barArr = JSON.parse(localStorage.getItem('barArr'));
    if (barArr) { this.setState({barArr: barArr}) }
  }


  searchChange(e) {
    this.setState({searchField: e.target.value});
  }

  searchClick() {
    var that = this;
    var searchQuery = this.state.searchField;
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    var options = {
      method: 'post',
      body: JSON.stringify({
        searchQuery: searchQuery
      }),
      headers: myHeaders
      };
    console.log(options);
    fetch('/search', options)
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      var data = json;
      let idArr = [];
      for (let i = 0; i < json.length; i++) {
        idArr.push(json[i].id);
      }
      that.setState({barArr: idArr});
      that.fetchAttendees(json);
      localStorage.setItem('barArr', JSON.stringify(idArr));
      localStorage.setItem('barSearchField', JSON.stringify(searchQuery));

    });
  }

  fetchAttendees(jsonData) {
    var that = this;
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    var options2 = {
      method: 'post',
      body: JSON.stringify({
        barArr: this.state.barArr
      }),
      headers: myHeaders
      };
    fetch('/bars', options2)
    .then(function(response) {
      return response.json();
    })
    .then(function(j) {
      j.map(function(arr, i) {
        if (arr.attendees.length > 0) {
          var index = that.state.barArr.indexOf(arr.bar_id);
          jsonData[index].attendees = arr.attendees;
        }
        else {
          var index = that.state.barArr.indexOf(arr.bar_id);
          jsonData[index].attendees = [];
        }
      })
      that.setState({data: jsonData});

      localStorage.setItem('barSearchData', JSON.stringify(jsonData));
    });
  }


  clearClick() {
    this.setState({searchField: "", data: [], barArr: []});
    localStorage.removeItem('barArr');
    localStorage.removeItem('barSearchData');
    localStorage.removeItem('barSearchField');
  }

  closeModal() {
    this.setState({"showBadgeModal": false });
  }

  badgeClick(e) {
    var that = this;
    var selectedBar = this.state.data.filter(function(arr) {
      return arr.id === e.target.id;
    });
    var userAttending = false;
    selectedBar[0].attendees.map(function(arr, i) {
      if (arr.username === that.props.appState.loggedIn.user) {userAttending = true}
    });
    this.setState({"showBadgeModal": true, selectedBar: {data: selectedBar[0], userAttending: userAttending} });
  }

  addAttendee() {
    var that = this;
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    var options = {
      method: 'post',
      body: JSON.stringify({
        bar_id: this.state.selectedBar.data.id,
        username: this.props.appState.loggedIn.user
      }),
      headers: myHeaders
      };
    fetch('/newBar', options)
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      that.fetchAttendees(that.state.data);
      that.setState({selectedBar: {data: that.state.selectedBar.data, userAttending: true}});
    });
  }

  removeAttendee() {
    var that = this;
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    var options = {
      method: 'delete',
      body: JSON.stringify({
        bar_id: this.state.selectedBar.data.id,
        username: this.props.appState.loggedIn.user
      }),
      headers: myHeaders
      };
    fetch('/deleteBar', options)
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      that.fetchAttendees(that.state.data);
      that.setState({selectedBar: {data: that.state.selectedBar.data, userAttending: false}});
    });
  }

  render() {
    return (
      <div className="well">
        <SearchBar
        searchChange={this.searchChange}
        searchClick={this.searchClick}
        clearClick={this.clearClick}
        searchField={this.state.searchField} />
        <ListGroup>
          {this.state.data.map(barData =>
            <BarPreview
              key={barData.id}
              barData={barData}
              loggedIn={this.props.appState.loggedIn}
              badgeClick={this.badgeClick} />, this)}
        </ListGroup>
        <footer>
          <p className="text-center">Powered by Yelp</p>
          <BadgeModal
              showBadgeModal={this.state.showBadgeModal}
              closeModal={this.closeModal}
              selectedBar={this.state.selectedBar}
              addAttendee={this.addAttendee}
              removeAttendee={this.removeAttendee}/>
        </footer>
      </div>
    );
  }
}
