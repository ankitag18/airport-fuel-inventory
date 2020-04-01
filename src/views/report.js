import React, { Component, Fragment } from 'react';
import '../App.css';
import Navigation from './navigation';

export default class Report extends Component {

    constructor(props) {
        super(props);
        this.state = { fuelAvailabilityData: [], fuelConsumptionData: [], fuelAvailablePerTransaction: [] };
    }

    componentDidMount() {
        fetch('http://localhost:3000/reports')
            .then(res => res.json())
            .then((response) => {

                this.setState({
                    fuelAvailabilityData: response.fuelAvailabilityData,
                    fuelConsumptionData: response.fuelConsumptionData,
                    fuelAvailablePerTransaction: response.fuelAvailablePerTransaction
                });

            }).catch((err) => {
                console.log(err.message);
            });
    }

    getQuantity(transactionId, airport_id) {
        const { quantity } = this.state.fuelAvailablePerTransaction[airport_id].find(({ transaction_id }) => transaction_id == transactionId);
        return quantity;
    }

    render() {
        return (
            <Fragment>
                <Navigation currentPageContext='report' />
                <div className="main-section">
                    <div className="airport_report">
                        <h3 className="text-center">Airport Summary Report</h3>
                        <table className="table table-bordered table-list">
                            <thead>
                                <tr>
                                    <th>Airport</th>
                                    <th>Fuel Available</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.fuelAvailabilityData.map(item => (
                                    <tr key={item.id}>
                                        <td>{item.name}</td>
                                        <td>{item.fuel_available}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="fuel_report" style={{ marginTop: "30px" }}>
                        <h3 className="text-center">Fuel Consumtion Report</h3>
                        <table className="table table-bordered table-list">
                            <thead>
                                <tr>
                                    <th>Airport</th>
                                    <th>Date/Time</th>
                                    <th>Type</th>
                                    <th>Fuel</th>
                                    <th>Aircraft</th>
                                    <th>Fuel Available</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.fuelConsumptionData.map(item => (
                                    <tr key={item.id}>
                                        <td>{item.airport_name}</td>
                                        <td>{item.transaction_date}</td>
                                        <td>{item.trans_type}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.airline_no}</td>
                                        <td>{this.getQuantity(item.id, item.airport_id)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Fragment>
        );
    }

}