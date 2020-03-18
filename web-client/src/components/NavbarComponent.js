import React from "react";
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import * as config from "../app.config";

class NavbarComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeItem: null,
            name: '',
            url: ''
        };
        this.createURL.bind(this);
    }
    createURL() {
        fetch(config.URL_API_BASE_URL, {
            method: 'POST',
            headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
            },
            body: JSON.stringify({name: this.state.name, url: this.state.url})
        })
            .then(response => response.json())
            .then(data => {
                if(data.status === 'error') {
                    this.props.addAlert(data.data, 'danger');
                } else {
                    this.props.addAlert(`Created entry for ${data.data.name} => ${data.data.url}.`, 'success');
                }
            });
    }
    render() {
        return (
            <Navbar bg="light" expand="lg">
                <Navbar.Brand id={`navbar-brand-goto`} href="/#">GOTO</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav"/>
                <Form inline>
                    <FormControl id={'name-text'} type="text" placeholder="Name" className="mr-sm-2"
                                 onChange={e => this.setState({name: e.target.value})} />
                    <FormControl id={'url-text'} type="text" placeholder="URL" className="mr-sm-2"
                                 onChange={e => this.setState({url: e.target.value})}/>
                    <Button id={'create-url-button'} variant="outline-success" className={'mr-sm-2'}
                            onClick={() => this.createURL()}>Create</Button>
                    <Button id={'refresh-url-table-button'} variant={'outline-primary'} className={'mr-sm-2'}
                            onClick={() => this.props.onRefresh()}>Refresh</Button>
                </Form>
            </Navbar>
        );
    }
}

export default NavbarComponent;
