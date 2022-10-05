import React from 'react';
//import styles from './SaveButton.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface Props {
  text?: string;
  icon?: string;
  isLoad?: any;
  handle?: any;
  pullRight?: boolean;
  pullLeft?: boolean;
}

const CustomButton: React.FC<Props> = (props) => {
  const ptext = props.text ? props.text : "Guardar";
  const picon = props.icon ? props.icon : "spinner";
  const isLoad = props.isLoad ? props.isLoad : false;
  const handle = props.handle ? props.handle : null;
  const pullRight = props.pullRight ? props.pullRight : false;
  const pullLeft = props.pullLeft ? props.pullLeft : false;

  let icon:any = picon;
  let text:string = " " + ptext;
  let disabled:boolean = false;

  if (isLoad) {
    icon = "spinner";
    text = " Cargando";
    disabled = true;
  }
  let pull = "pull-right";
  if (pullRight) {
    pull = "pull-right";
  }
  if (pullLeft) {
    pull = "pull-left";
  }
  return (<button className={`btn btn-danger ${pull}`} type="button" disabled={disabled} onClick={handle}>
    <FontAwesomeIcon icon={icon} />
    {text}
  </button>);
};
export default CustomButton;
