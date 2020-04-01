import React, { Component, Fragment } from 'react';
import '../App.css';
import Navigation from './navigation';

export default class Aircraft extends Component {

    constructor(props) {
        super(props);
        this.state = {
            aircrafts: [],
            formFields: {
                airline: '',
                flight_no: '',
                source: '',
                destination: ''
            },
            errors: { error: false, messages: {} }
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateInput = this.validateInput.bind(this);
    }

    componentDidMount() {
        fetch('http://localhost:3000/aircraft/list')
            .then(res => res.json())
            .then((response) => {
                this.setState({ aircrafts: response });
            }).catch((err) => {
                console.log(err.message);
            });
    }

    validateInput(formFields, fieldName = '', callback) {
        const inputErrors = {};
        let error = false;

        for (let key in formFields) {
            if (fieldName && key != fieldName) {
                continue;
            }

            if (key == 'airline') {
                if (formFields[key] == '') {
                    error = true;
                    inputErrors[key] = 'Please enter airline';
                } else {
                    inputErrors[key] = '';
                }
            }
        }

        this.setState({
            formFields,
            errors: { error, messages: inputErrors }
        }, callback);
    }

    inputHandler(event) {
        let formFields = this.state.formFields;
        formFields[event.target.name] = event.target.value;

        this.validateInput(formFields, event.target.name);
    }

    handleSubmit(event) {
        event.preventDefault();
        this.validateInput(this.state.formFields, '', () => {
            if (this.state.errors.error) {
                return false;
            }

            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...this.state.formFields })
            };

            fetch('http://localhost:3000/aircraft/add', requestOptions)
                .then(res => res.json())
                .then((response) => {
                    window.location = '/aircraft/list';
                }).catch((err) => {
                    console.log(err.message);
                });
        });
    }

    render() {
        return (
            <Fragment>
                <Navigation currentPageContext='aircraft' />
                <div className="main-section">
                    <button type="button" className="btn btn-primary float-right" data-toggle="modal" data-target="#addAircraft">
                        Add Aircraft
                    </button>
                    <h3 className="text-center">Aircraft List</h3>
                    <table className="table table-bordered table-list">
                        <thead>
                            <tr>
                                <th>Airline</th>
                                <th>Flight No.</th>
                                <th>Source</th>
                                <th>Destination</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.aircrafts.map(item => (
                                <tr key={item.id}>
                                    <td>{item.airline}</td>
                                    <td>{item.flight_no}</td>
                                    <td>{item.source}</td>
                                    <td>{item.destination}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div id="addAircraft" className="modal fade" role="dialog">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <form onSubmit={this.handleSubmit}>
                                <div className="modal-header">
                                    <h4 className="modal-title">Add Aircraft</h4>
                                    <button type="button" className="close" data-dismiss="modal">&times;</button>
                                </div>
                                <div className="modal-body">
                                    <input type="text" name="airline" onChange={(e) => this.inputHandler.call(this, e)} value={this.state.formFields.airline} placeholder="Airline Name" />
                                    {this.state.errors.error && this.state.errors.messages['airline'] && <p className='error'>{this.state.errors.messages['airline']}</p>}

                                    <input type="text" name="flight_no" onChange={(e) => this.inputHandler.call(this, e)} value={this.state.formFields.flight_no} placeholder="Flight Number" />
                                    <input type="text" name="source" onChange={(e) => this.inputHandler.call(this, e)} value={this.state.formFields.source} placeholder="Source" />
                                    <input type="text" name="destination" onChange={(e) => this.inputHandler.call(this, e)} value={this.state.formFields.destination} placeholder="Destination" />
                                </div>
                                <div className="modal-footer">
                                    <button className="btn btn-danger" data-dismiss="modal">Cancel</button>
                                    <button type="submit" className="btn btn-primary">Submit</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

            </Fragment>
        );
    }

}