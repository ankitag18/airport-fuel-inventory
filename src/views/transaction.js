import React, { Component, Fragment } from 'react';
import '../App.css';
import Navigation from './navigation';

export default class Transaction extends Component {

    constructor(props) {
        super(props);
        this.state = {
            transactions: [],
            airports: [],
            aircrafts: [],
            formFields: {
                trans_type: '',
                airport: '',
                aircraft: '',
                quantity: '',
                transaction: ''
            },
            errors: { error: false, messages: {} }
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateInput = this.validateInput.bind(this);
    }

    componentDidMount() {
        fetch('http://localhost:3000/transaction/list')
            .then(res => res.json())
            .then((response) => {
                this.setState({ transactions: response.transactions, airports: response.airports, aircrafts: response.aircrafts });
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

            if (key == 'trans_type') {
                if (formFields[key] == '') {
                    error = true;
                    inputErrors[key] = 'Please select transaction type';
                } else {
                    inputErrors[key] = '';
                }
            }

            if (key == 'airport') {
                if (formFields[key] == '') {
                    error = true;
                    inputErrors[key] = 'Please select airport';
                } else {
                    inputErrors[key] = '';
                }
            }

            if (key == 'aircraft') {
                if (formFields[key] == '' && formFields['trans_type'] == 'OUT') {
                    error = true;
                    inputErrors[key] = 'Please select airline when reversing the transaction';
                } else {
                    inputErrors[key] = '';
                }
            }

            if (key == 'quantity') {
                if (!/\d+/.test(formFields[key])) {
                    error = true;
                    inputErrors[key] = 'Please enter valid quantity';
                } else {
                    inputErrors[key] = '';
                }
            }

            if (key == 'transaction') {
                if (formFields[key] == '' && formFields['trans_type'] == 'OUT') {
                    error = true;
                    inputErrors[key] = 'Please select transaction to be reversed';
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

            fetch('http://localhost:3000/transaction/add', requestOptions)
                .then(res => res.json())
                .then((response) => {
                    window.location = '/transaction/list';
                }).catch((err) => {
                    console.log(err.message);
                });
        });
    }

    render() {
        return (
            <Fragment>
                <Navigation currentPageContext='transaction' />
                <div className="main-section">
                    <button type="button" className="btn btn-primary float-right" data-toggle="modal" data-target="#addTransaction">
                        Add Transaction
                    </button>
                    <h3 className="text-center">Transaction List</h3>
                    <table className="table table-bordered table-list">
                        <thead>
                            <tr>
                                <th>Transaction ID</th>
                                <th>Airport</th>
                                <th>Airline</th>
                                <th>Quantity</th>
                                <th>Transaction Type</th>
                                <th>Transaction Date</th>
                                <th>Parent Transaction</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.transactions.map(item => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.airport_name}</td>
                                    <td>{item.airline_name}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.trans_type}</td>
                                    <td>{item.transaction_date}</td>
                                    <td>{item.parent_transaction}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div id="addTransaction" className="modal fade" role="dialog">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <form onSubmit={this.handleSubmit}>
                                <div className="modal-header">
                                    <h4 className="modal-title">Add Transaction</h4>
                                    <button type="button" className="close" data-dismiss="modal">&times;</button>
                                </div>
                                <div className="modal-body">
                                    <select name="trans_type" onChange={(e) => this.inputHandler.call(this, e)} value={this.state.formFields.airline}>
                                        <option value="">Select Transaction Type</option>
                                        <option value="IN">IN</option>
                                        <option value="OUT">OUT</option>
                                    </select>
                                    {this.state.errors.error && this.state.errors.messages['trans_type'] && <p className='error'>{this.state.errors.messages['trans_type']}</p>}

                                    <select name="airport" onChange={(e) => this.inputHandler.call(this, e)} value={this.state.formFields.airport}>
                                        <option value="">Select Airport</option>
                                        {this.state.airports.map(item => (
                                            <option value="item.id">{item.name}</option>
                                        ))}
                                    </select>
                                    {this.state.errors.error && this.state.errors.messages['airport'] && <p className='error'>{this.state.errors.messages['airport']}</p>}

                                    <select name="aircraft" onChange={(e) => this.inputHandler.call(this, e)} value={this.state.formFields.aircraft}>
                                        <option value="">Select Airline</option>
                                        {this.state.aircrafts.map(item => (
                                            <option value="item.id">{item.airline}</option>
                                        ))}
                                    </select>
                                    {this.state.errors.error && this.state.errors.messages['aircraft'] && <p className='error'>{this.state.errors.messages['aircraft']}</p>}

                                    <input type="text" name="quantity" onChange={(e) => this.inputHandler.call(this, e)} value={this.state.formFields.quantity} placeholder="Quantity" />
                                    {this.state.errors.error && this.state.errors.messages['quantity'] && <p className='error'>{this.state.errors.messages['quantity']}</p>}

                                    {this.state.formFields.trans_type == 'OUT' &&
                                        <select name="transaction" onChange={(e) => this.inputHandler.call(this, e)} value={this.state.formFields.transaction}>
                                            <option value="">Select Parent Transaction</option>
                                            {this.state.transactions.map(item => (
                                                <option value="item.id">{item.id}</option>
                                            ))}
                                        </select>}
                                    {this.state.errors.error && this.state.errors.messages['transaction'] && <p className='error'>{this.state.errors.messages['transaction']}</p>}

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