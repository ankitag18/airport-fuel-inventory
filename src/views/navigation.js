import React, { Component, useState } from 'react';

function Navigation(props) {

    const { currentPageContext } = props;

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                    <ul className="navbar-nav mr-auto">
                        <li className={`nav-item ${currentPageContext == 'airport' ? 'active' : ''}`}>
                            <a className="nav-link" href="/airport/list">Airport List</a>
                        </li>
                        <li className={`nav-item ${currentPageContext == 'aircraft' ? 'active' : ''}`}>
                            <a className="nav-link" href="/aircraft/list">Aircraft List</a>
                        </li>
                        <li className={`nav-item ${currentPageContext == 'transaction' ? 'active' : ''}`}>
                            <a className="nav-link" href="/transaction/list">Transaction List</a>
                        </li>
                        <li className={`nav-item ${currentPageContext == 'report' ? 'active' : ''}`}>
                            <a className="nav-link" href="/report">Reports</a>
                        </li>
                    </ul>
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a className="nav-link" href="/logout">Logout</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Navigation