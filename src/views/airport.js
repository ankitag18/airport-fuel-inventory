import React, { Component, Fragment } from 'react';
import '../App.css';
import Navigation from './navigation';
// import CurrentPageContext from '../page-context';

export default class Airport extends Component {
    // static contextType = CurrentPageContext;

    constructor(props) {
        super(props);
        this.state = {
            airports: [],
            formFields: {
                name: '',
                fuel_capacity: ''
            },
            errors: { error: false, messages: {} }
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateInput = this.validateInput.bind(this);
    }

    componentDidMount() {
        fetch('http://localhost:3000/airport/list')
            .then(res => res.json())
            .then((response) => {
                this.setState({ airports: response });
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

            if (key == 'name') {
                if (formFields[key] == '') {
                    inputErrors[key] = 'Please enter name';
                    error = true;
                } else {
                    inputErrors[key] = '';
                }
            }

            if (key == 'fuel_capacity') {
                if (!/\d+/.test(formFields[key])) {
                    inputErrors[key] = 'Please enter valid fuel capacity';
                    error = true;
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

            fetch('http://localhost:3000/airport/add', requestOptions)
                .then(res => res.json())
                .then((response) => {
                    window.location = '/airport/list';
                }).catch((err) => {
                    console.log(err.message);
                });
        });
    }

    render() {
        return (
            <Fragment>
                <Navigation currentPageContext='airport' />
                <div className="main-section">
                    <button type="button" className="btn btn-primary float-right" data-toggle="modal" data-target="#addAirport">
                        Add Airport
                    </button>
                    <h3 className="text-center">Airport List</h3>
                    <table className="table table-bordered table-list">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Fuel Capacity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.airports.map(item => (
                                <tr key={item.id}>
                                    <td>{item.name}</td>
                                    <td>{item.fuel_capacity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div id="addAirport" className="modal fade" role="dialog">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <form onSubmit={this.handleSubmit}>
                                <div className="modal-header">
                                    <h4 className="modal-title">Add Airport</h4>
                                    <button type="button" className="close" data-dismiss="modal">&times;</button>
                                </div>
                                <div className="modal-body">
                                    <input type="text" name="name" onChange={(e) => this.inputHandler.call(this, e)} value={this.state.formFields.name} placeholder="Name" />
                                    {this.state.errors.error && this.state.errors.messages['name'] && <p className='error'>{this.state.errors.messages['name']}</p>}

                                    <input type="text" name="fuel_capacity" onChange={(e) => this.inputHandler.call(this, e)} value={this.state.formFields.fuel_capacity} placeholder="Fuel Capacity" />
                                    {this.state.errors.error && this.state.errors.messages['fuel_capacity'] && <p className='error'>{this.state.errors.messages['fuel_capacity']}</p>}
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