import React, {Component} from 'react';
import {connect} from "react-redux";
import {withRouter} from "react-router";
import {NotificationContainer} from "react-notifications";
import Container from "reactstrap/es/Container";

import Toolbar from "./components/UI/Toolbar/Toolbar";
import {logoutUser} from "./store/actions/usersActions";
import Routes from "./Routes";




class App extends Component {
  render() {
    return (
        <div>
          <NotificationContainer/>
          <header>
            <Toolbar user={this.props.user}
                     logout={this.props.logoutUser}/>
          </header>
          <Container className="mt-5">
            <Routes user={this.props.user}/>
          </Container>
        </div>
    );
  }
}
const mapStateToProps = state => ({
  user: state.users.user
});

const mapDispatchToProps = dispatch => ({
  logoutUser: () => dispatch(logoutUser())
});
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));


