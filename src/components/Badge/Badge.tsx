import React from 'react';
import styles from './Badge.module.scss';

interface IBadge {
    src?: string;
    variant: string;
}

const defaultProps: IBadge = {
    src: '',
    variant: 'primary'
}

const Badge: React.FC<IBadge> = (props) => {
    return (<span className={`${styles.Badge} ${styles[props.variant]}`}>{props.children}</span>);
};

Badge.defaultProps = defaultProps;

export default Badge;
