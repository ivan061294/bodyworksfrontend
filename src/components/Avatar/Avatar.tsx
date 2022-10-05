import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './Avatar.module.scss';

interface IAvatar {
    src?: string;
    size?: string;
    alt?: string;
    title?: string;
    variant?: string;
    onChange?: any;
}

const defaultProps: IAvatar = {
    src: '',
    size: '2.5rem',
    alt: '',
    title: '',
    variant: 'secondary',
    onChange: null
}

const Avatar: React.FC<IAvatar> = (props) => {
    const hiddenFileInput = React.useRef<HTMLInputElement>(null);
    const handleClick = () => {
        hiddenFileInput.current!.click();
    };
    let upload, image;
    if (props.onChange) {
        upload = <>
            <span className={styles.upload} onClick={handleClick}><FontAwesomeIcon icon={['fas', 'camera']} size="lg"/></span>
            <input name={"avatar"} type="file" accept="image/*" onChange={props.onChange} ref={hiddenFileInput} />
        </>
    }
    if (props.src) {
        image = <img src={props.src} alt={props.alt} style={{ width: props.size, height: props.size}} />
    } else {
        image = <svg viewBox="0 0 16 16" width="60%" height="60%" focusable="false" role="img" aria-label="person fill"
                     aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                     className="bi-person-fill b-icon bi"><g><path
            d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path></g></svg>
    }
    return (<span className={`${styles.avatar} ${styles[props.variant!]}`}
                  style={{ width: props.size, height: props.size}}
                  data-toggle="tooltip" title={props.title}>
        {image}
        {upload}
    </span>);
};

Avatar.defaultProps = defaultProps;

export default Avatar;
