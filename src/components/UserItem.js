import React, {Component} from 'react';

class UserItem extends Component {
    render() {
        const {
            imageUrl, username, profile, email
        } = this.props;

        const logout = () => {
            localStorage.clear();
        }

        return (<li className="dropdown user user-menu">
            <a href={'/#'} className="dropdown-toggle" data-toggle="dropdown">
                <img alt={''} src={imageUrl} className={"user-image"}/>
                <span className="hidden-xs">{username}</span>
            </a>
            <ul className="dropdown-menu">
                <li className="user-header">
                    <img alt={''} src={imageUrl} className={"img-circle"}/>
                    <p>
                        {profile}
                        <small>{email}</small>
                    </p>
                </li>
                <li className="user-footer">
                    <div className="pull-right">
                        <a href="/" onClick={() => logout()} className="btn btn-default btn-flat">Salir</a>
                    </div>
                </li>
            </ul>
        </li>);
    }
}

export default UserItem;