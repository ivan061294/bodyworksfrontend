import React, { Component } from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import Home from './pages/Home';

import './App.css';

export default class App extends Component {
    render() {
        return (
            <Router>
                <Home />
            </Router>
        )
    }
}