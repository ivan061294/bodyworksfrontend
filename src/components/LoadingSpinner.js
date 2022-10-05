import React, { Component } from 'react';
import './Custom.css'
class LoadingSpinner extends Component {
    render() {
        return(<div className="spinner-grow" role="status">
            <span className="sr-only">Loading...</span>
        </div>)
    }
}
export default LoadingSpinner;