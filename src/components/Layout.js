// src/components/Layout.js
import React from 'react';
import { Link } from 'react-router';
import NavBar from './NavBar';
import RegisterModal from './RegisterModal';

export default class Layout extends React.Component {
  constructor(props) {
    super(props);

    this.usernameChange = this.usernameChange.bind(this);
    this.passwordChange = this.passwordChange.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.register = this.register.bind(this);
    this.showRegister = this.showRegister.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.modalUsernameChange = this.modalUsernameChange.bind(this);
    this.modalPasswordChange = this.modalPasswordChange.bind(this);
    this.normalLogin= this.normalLogin.bind(this);

    this.state = {
      username: "",
      password: "",
      showRegisterModal: false,
      loggedIn: {
        isLoggedIn: false,
        user: ""
      },
      modalInput: {
        username: "",
        password: ""
      }
    }
  }

  login(username, password){
    var that = this;
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    var options = {
      method: 'post',
      body: JSON.stringify({
        username: username,
        password: password
      }),
      headers: myHeaders
      };
    fetch('/login', options)
    .then(function(response) {
      if (response.status === 200) {
        console.log('login successful');
        that.setState({"loggedIn": {"user": username, "isLoggedIn": true }, "username": "", "password": "" });
      }

    });
  }

  normalLogin() {
    this.login(this.state.username, this.state.password);
  }

  register(){
    var that = this;
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    var options = {
      method: 'post',
      body: JSON.stringify({
        username: this.state.modalInput.username,
        password: this.state.modalInput.password
      }),
      headers: myHeaders
      };
    fetch('/register', options)
    .then(function(response) {
      if (response.status === 200) {
        that.login(that.state.modalInput.username, that.state.modalInput.password);
        that.closeModal();
      }
    });
    }


  closeModal() {
    this.setState({"showRegisterModal": false});
  }


  usernameChange(e) {
    this.setState({"username": e.target.value});
  }

  passwordChange(e) {
    this.setState({"password": e.target.value});
  }

  showRegister() {
    this.setState({"showRegisterModal": true});
  }

  logout() {
    var that = this;
    fetch('/logout')
      .then(function(response) {
        that.setState({"loggedIn": {"user": "", "isLoggedIn": false }, "username": "", "password": "" });
      })
  }

  modalUsernameChange(e) {
    this.setState({"modalInput": {"username": e.target.value, "password": this.state.modalInput.password}});
  }

  modalPasswordChange(e) {
    this.setState({"modalInput": {"username": this.state.modalInput.username, "password": e.target.value }});
  }

  render() {
    return (
      <div className="app-container">
        <header>
          <NavBar
            normalLogin={this.normalLogin}
            register={this.register}
            showRegister={this.showRegister}
            logout={this.logout}
            usernameChange={this.usernameChange}
            passwordChange={this.passwordChange}
            username={this.state.username}
            password={this.state.password}
            loggedIn={this.state.loggedIn} />
        </header>
        <div className="app-content">{React.cloneElement(this.props.children, { appState: this.state })}</div>
        <footer>
          <RegisterModal
            showModal={this.state.showRegisterModal}
            closeModal={this.closeModal}
            modalUsernameChange={this.modalUsernameChange}
            modalPasswordChange={this.modalPasswordChange}
            register={this.register} />
        </footer>
      </div>
    );
  }
}
