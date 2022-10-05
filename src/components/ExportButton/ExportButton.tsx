import React from 'react';
//import styles from './ExportButton.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface Props {
  disabled?: boolean;
  handle?: any;
}
const ExportButton: React.FC<Props> = (props) => {
  const disabled = props.disabled ? props.disabled : false;
  const handle = props.handle ? props.handle : null;
  const icon:any = 'download';
  return (<button className={`btn btn-default pull-right`} type="button" disabled={disabled} onClick={handle}>
    <FontAwesomeIcon icon={icon} /> 
  </button>);
};
export default ExportButton;