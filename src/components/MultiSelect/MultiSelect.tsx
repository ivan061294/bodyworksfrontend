import React from 'react';

interface IMultiSelect {
    name: string;
    options: Array<any>;
    value: string;
    label: string;
    size: number;
    onChange: any;
    disabled: boolean;
}

const MultiSelect: React.FC<IMultiSelect> = (props) => {
    const { name,
        options,
        size,
        value,
        label,
        disabled,
        onChange } = props;
    return (<div className="form-group">
        <label htmlFor={"employees"}>{label}</label>
        <div className="input-group" style={{ width: '100%' }}>
            <select className={"form-control"} name={name} value={value} size={size} onChange={onChange} disabled={disabled} multiple>
                {options.map(e => {
                    return (<option value={e.value}>{e.text}</option>)
                })}

            </select></div></div>);
};

export default MultiSelect;