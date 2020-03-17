import React from "react";
import RowComponent from "./RowComponent";
import Table from "react-bootstrap/Table";

class TableComponent extends React.Component {

    render() {
        return (
            <div>
                <Table className={'table'} striped bordered hover responsive style={{ wordWrap: 'break-word'}}>
                    <thead className={'thead-dark'}>
                    <tr itemScope={'col'}>
                        {
                            this.props.columns.map((element) => {
                                return (
                                    <th id={`${this.props.id}-head-${element.key}`} className={'text-center'} key={element.key}>
                                        {element.text}
                                    </th>
                                );
                            })
                        }
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.props.data.map((element, index) => {
                            return (
                                <RowComponent id={`${this.props.id}-row-${index}`} key={index} index={index}
                                              data={element} columns={this.props.columns}
                                              rowChanged={(i, newValue) => this.props.onRowChange(i, newValue)}/>
                            );
                        })
                    }
                    </tbody>
                </Table>
            </div>
        );
    }
}

export default TableComponent;
