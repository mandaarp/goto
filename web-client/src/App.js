import React from 'react';
import './App.css';
import NavbarComponent from "./components/NavbarComponent";
import AlertComponent from "./components/notifications/AlertComponent";
import TableComponent from "./components/table/TableComponent";
import {COLUMNS} from './components/table/config';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            alertsData: [],
            tableData: []
        };
        this.addAlert.bind(this);
        this.removeAlert.bind(this);
        this.setTableData.bind(this);
    }

    addAlert(text, type, disappearIn=5000) {
        const newAlerts = [...this.state.alertsData];
        newAlerts.push({text, type});
        if (type === 'success' || type === 'info') {
            this.setState({alertsData: newAlerts}, () => {
                window.setTimeout(() => {
                    this.removeAlert(text);
                }, disappearIn);
            });
        } else {
            this.setState({alertsData: newAlerts});
        }
    }

    removeAlert(text) {
        const newAlerts = [...this.state.alertsData].filter(obj => obj.text !== text);
        this.setState({alertsData: newAlerts});
    }

    showAlerts() {
        return this.state.alertsData.map((alert, index) => {
            return (
                <AlertComponent id={`alert-${index}`} key={index} data={alert} removeAlert={(text) => this.removeAlert(text)} />
            );
        });
    }

    setTableData(newTableData) {
        const tableData = [...newTableData];
        this.setState({tableData: []});
        this.setState({tableData});
    }
    render() {
        return (
            <div className="container-fluid">
                <NavbarComponent setTableData={tableData => this.setTableData(tableData)}/>
                <div id={'alerts-div'}>{this.showAlerts()}</div>
                <TableComponent id={'urls-table'} columns={COLUMNS} data={this.state.tableData}/>
            </div>
        );
    }
}

export default App;
