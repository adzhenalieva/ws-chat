import React, {Component} from 'react';
import {Col, Row} from "reactstrap";

class Chat extends Component {

    state = {
        username: '',
        usernames: [],
        messages: [],
        messageText: ''
    };

    componentDidMount() {
        const params = new URLSearchParams(this.props.location.search);
        const token = params.get('token');

        this.websocket = new WebSocket('ws://localhost:8000/chat?token=' + token);

        this.websocket.onmessage = event => {
            const decodedMessage = JSON.parse(event.data);
            if (decodedMessage.type === 'NEW_MESSAGE') {
                this.setState({
                    messages: [...this.state.messages, decodedMessage.message]
                });
            }
            if (decodedMessage.type === 'ACTIVE_USERS') {
                this.setState({usernames: decodedMessage.usernames})
            }
            if (decodedMessage.type === 'LATEST_MESSAGES') {
                this.setState({messages: decodedMessage.messages})
            }
            if (decodedMessage.type === 'DELETE_USER') {
                console.log(decodedMessage.user);
            }
            // if(decodedMessage.type === "NEW_USER"){
            //     this.state.usernames.push(decodedMessage.user)
            // }
        };

        this.websocket.onclose = () => {
            setTimeout(() => this.connect, 2000)
        }
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

        this.websocket.send(message);
    };


    render() {
        return (
            <Row>
                <Col sm={3}>
                    <h2>Current users</h2>
                    {this.state.usernames.map((username, i) => (
                        <p key={i}>
                            {username}
                        </p>
                    ))}
                </Col>
                <Col sm={9}>
                    {this.state.messages.map((message, i) => (
                        <div key={i}>
                            <b>{message.user}</b>
                            <span>{message.text}</span>
                        </div>
                    ))}
                    <div>
                        <input type="text"
                               name="messageText"
                               value={this.state.messageText}
                               onChange={this.changeInputHandler}/>
                        <input type="button" onClick={this.sendMessage} value={"Send message"}/>
                    </div>
                </Col>

            </Row>
        );
    }
}


export default Chat;