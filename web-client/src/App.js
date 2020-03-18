import React from 'react';
import './App.css';
import NavbarComponent from "./components/NavbarComponent";
import AlertComponent from "./components/notifications/AlertComponent";
import TableComponent from "./components/table/TableComponent";
import {COLUMNS} from './components/table/config';
import * as config from "./app.config";

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
        this.deleteRow.bind(this);
        this.fetchURLs.bind(this);
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

    fetchURLs() {
        fetch(config.URL_API_BASE_URL)
            .then(response => response.json())
            .then(data => {
                if(data.status === 'error') {
                    this.addAlert(data.data, 'danger');
                } else {
                    this.setTableData([...data.data]);
                    this.addAlert(`Fetched ${data.data.length} entries.`, 'success');
                }
            });
    }
    setTableData(newTableData) {
        const tableData = [...newTableData];
        tableData.forEach(e => e.actions = [{
            key: 'delete',
            onClick: this.deleteRow
        }]);
        this.setState({tableData: []});
        this.setState({tableData});
    }

    deleteRow(index) {
        fetch(`${config.URL_API_BASE_URL}${this.state.tableData[index].name}`, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                if(data.status === 'error') {
                    this.addAlert(`Failed to delete the entry for ${this.state.tableData[index].name} => 
                    ${this.state.tableData[index].url}`, 'danger');
                } else {
                    this.addAlert(`Deleted the entry for ${this.state.tableData[index].name} => 
                    ${this.state.tableData[index].url}`, 'success');
                }
                this.fetchURLs();
            });
    }

    render() {
        return (
            <div className="container-fluid">
                <NavbarComponent addAlert={(text, type) => this.addAlert(text, type)} onRefresh={() => this.fetchURLs()}/>
                <div id={'alerts-div'}>{this.showAlerts()}</div>
                <TableComponent id={'urls-table'} columns={COLUMNS} data={this.state.tableData}
                                deleteRow={index => this.deleteRow(index)}
                />
            </div>
        );
    }
}

export default App;
