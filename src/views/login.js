import React, { Component } from 'react';
import '../App.css';

export default class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: false,
            errorMessage: '',
        };

        this.emailInput = React.createRef();
        this.passwordInput = React.createRef();

        this.verifyUser = this.verifyUser.bind(this);
    }

    verifyUser() {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: this.emailInput.current.value, password: this.passwordInput.current.value })
        };

        fetch('http://localhost:3000/login', requestOptions)
            .then(res => res.json())
            .then((response) => {
                if (!response.success) {
                    this.setState({
                        error: true,
                        errorMessage: response.msg
                    });

                    return false;
                }
                window.location = '/airport/list';
            }).catch((err) => {
                console.log(err.message);
            });
    }

    render() {
        return (
            <div className="wrapper">
                <h2>Sign In</h2>
                <div id="formContent">
                    <form>
                        <input type="text" name="email" ref={this.emailInput} placeholder="Email" />
                        <input type="text" name="password" ref={this.passwordInput} placeholder="Password" />
                        <input type="button" onClick={this.verifyUser} value="Log In" />
                    </form>
                    {this.state.error && <p className="error">{this.state.errorMessage}</p>}
                </div>
            </div>
        );


    }
}
