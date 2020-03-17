import React from "react";
import CellComponent from "./CellComponent";

class RowComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...props.data
        }
    }
    onChange(event, dataKey) {
        const newState = {...this.state};
        newState[dataKey] = event.target.value;
        this.setState(newState);
    }
    onBlur() {
        this.props.rowChanged(this.props.index, this.state);
    }
    render() {
        return (
            <tr>
                {
                    this.props.columns.map((column) => {
                        return (
                            <CellComponent id={`${this.props.id}-cell-${column.key}`} key={column.key} dataKey={column.key}
                                           value={this.state[column.key]} readonly={column.readOnly}
                                           onChange={(e, key) => this.onChange(e, key)} onBlur={() => this.onBlur()}/>
                            );
                    })
                }
            </tr>
        );
    }
}

export default RowComponent;
