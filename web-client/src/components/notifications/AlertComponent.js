import React from "react";
import Alert from "react-bootstrap/Alert";

class AlertComponent extends React.Component {

    render() {
        return (
            <Alert id={this.props.id} variant={this.props.data.type} dismissible
                   onClose={() => this.props.removeAlert(this.props.data.text)}>
                {this.props.data.text}
            </Alert>
        );
    }
}

export default AlertComponent;
