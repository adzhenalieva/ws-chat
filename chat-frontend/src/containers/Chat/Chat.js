import React, {Component} from 'react';
import {Col, Row} from "reactstrap";

import {withRouter} from "react-router";
import {connect} from "react-redux";

import './Chat.css';
import {
    chatAction,
    deleteMessage
} from "../../store/actions/messagesActions";

class Chat extends Component {

    state = {
        messageText: '',
        websocket: null,
    };


    makeConnection = async (token) => {
        await this.setState({websocket: new WebSocket('ws://localhost:8000/chat?token=' + token)});

        this.state.websocket.onmessage = event => {
            const decodedMessage = JSON.parse(event.data);
            this.props.chatAction(decodedMessage.type, decodedMessage.messages);
        };

        this.state.websocket.onclose = () => {
            setTimeout(() => this.connect, 2000)
        }
    };

    componentDidMount() {
        if (this.props.user) {
            const token = this.props.user.token;
            this.makeConnection(token).then(
                () => {
                    ///
                }
            )
        }
    }

    componentWillUnmount() {
        const message = JSON.stringify({
            type: 'DELETE_USER',
            user: this.props.user.username
        });
        this.state.websocket.send(message);
        this.state.websocket.close();
    }


    changeInputHandler = event => {
        this.setState({
            [event.target.name]: event.target.value
        })
    };

    sendMessage = () => {
        const message = JSON.stringify({
            type: 'CREATE_MESSAGE',
            text: this.state.messageText
        });

        this.state.websocket.send(message);
    };

    delete = (id) => {
        this.props.deleteMessage(id).then(() => {
            const message = JSON.stringify({
                type: 'DELETE_MESSAGE'
            });
            this.state.websocket.send(message);
        });

    };

    render() {
        let deleteButton = () => {
            //
        };
        if (this.props.user && this.props.user.role === 'moderator') {
            deleteButton = (id) => {
                return <button className="DeleteButton" onClick={() => this.delete(id)}>Delete message</button>
            }
        }
        return (
            <Row>
                <Col sm={3}>
                    <h4>Current users</h4>
                    {this.props.usernames.map((username, i) => (
                        <p key={i}>
                            {username}
                        </p>
                    ))}
                </Col>
                <Col sm={9}>
                    <h4>Messages</h4>
                    <div className="SendMessage">
                        <input type="text"
                               name="messageText"
                               value={this.state.messageText}
                               onChange={this.changeInputHandler}/>
                        <input type="button" onClick={this.sendMessage} value={"Send message"}/>
                    </div>
                    {this.props.messages.map((message, i) => (
                        <div className="Messages" key={i}>
                            <b>{message.user}: </b>
                            <i>{message.text}</i>
                            {deleteButton(message._id)}
                        </div>
                    ))}

                </Col>

            </Row>
        );
    }
}

const mapStateToProps = state => ({
    user: state.users.user,
    messages: state.messages.messages,
    usernames: state.messages.usernames,

    test: state.messages.test
});

const mapDispatchToProps = dispatch => {
    return {
        deleteMessage: id => dispatch(deleteMessage(id)),
        chatAction: (type, message) => dispatch(chatAction(type, message)),
    }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Chat));