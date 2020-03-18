import React from "react";
import Button from "react-bootstrap/Button";

class CellComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            edit: false,
            value: this.props.value
        };
        this.inputRef = React.createRef();
        this.onFocus.bind(this);
        this.onBlur.bind(this);
    }
    valueToString(key, value) {
        let str = value;
        if(key === 'createdAt' || key === 'updatedAt') {
            str = new Date(value);
            str = str.toLocaleString();
        } else if(key === 'hits') {
            str = `${value}`
        }
        return str;
    }

    onFocus() {
        this.setState({edit: true},() => {
            if(this.inputRef.current)
            {
                this.inputRef.current.focus();
            }
        });
    }
    onBlur() {
        this.setState({edit: false});
        this.props.onBlur();
    }
    onChange(event, key) {
        this.props.onChange(event, key);
    }
    render() {
        return (
            <td>
                {
                    (() => {
                        if(this.state.edit && !this.props.readonly) {
                            return (
                                <input id={`${this.props.id}-input-${this.props.dataKey}`} className={'form-control text-center'}
                                   ref={this.inputRef} onBlur={() => this.onBlur()} value={this.props.value || ''}
                                   onChange={e => this.onChange(e, this.props.dataKey)} readOnly={this.props.readonly}
                                />
                            );
                        } else if (this.props.dataKey === 'actions') {
                            const buttons = this.props.value;
                            if (buttons[0].key === 'delete') {
                                return (
                                    <Button id={`${this.props.id}-button-${buttons[0].key.toLowerCase()}`}
                                            variant="outline-danger" className={'mr-sm-2 form-control align-center'}
                                            onClick={() => this.props.deleteRow()}>Delete</Button>
                                );
                            }
                        } else {
                                return (
                                    <label id={`${this.props.id}-text-${this.props.dataKey}`} className={'text-center'}
                                           style={{display: 'block'}} onClick={() => this.onFocus()} >
                                        {this.valueToString(this.props.dataKey, this.props.value)}
                                    </label>
                                );
                        }
                    })()
                }
            </td>
        );
    }
}

export default CellComponent;
