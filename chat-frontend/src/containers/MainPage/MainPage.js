import React, {Component} from 'react';
import {withRouter} from "react-router";
import {connect} from "react-redux";

class MainPage extends Component {

    goToChat = () => {
        this.props.history.push('/chat?token=' + this.props.user.token);
    };
    
    render() {
        let chat = (
            <div>
                <button onClick={this.goToChat}>Go to chat</button>
            </div>
        );
        if (!this.props.user) {
            chat = (
                <div>
                    Log in to see messages and send messages to chat
                </div>
            )
        }
        return (
            <div>
                {chat}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    user: state.users.user
});

export default withRouter(connect(mapStateToProps)(MainPage));