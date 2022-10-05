import React from 'react';
//import styles from './ActionButton.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface Props {
  icon?: any;
  onClick?: any;
  title?: string;
  disabled?: boolean;
}

const CustomButton: React.FC<Props> = (props) => {
  const icon = props.icon ? props.icon : "spinner";
  const onClick = props.onClick ? props.onClick : null;
  const title = props.title ? props.title : "";
  const disabled = props.disabled ? props.disabled : false;

  return (<button type="button" className="btn btn-default btn-xs" title={title} onClick={onClick} disabled={disabled}>
    {icon ? <FontAwesomeIcon icon={icon} /> : null}
  </button>);
};
export default CustomButton;
