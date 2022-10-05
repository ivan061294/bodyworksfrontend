import React, { ReactElement } from 'react';
//import styles from './Panel.module.scss';
import { Box, Row, Col } from "adminlte-2-react";

interface IPanel {
  children?: Array<ReactElement>;
}

const Panel: React.FC<IPanel> = (props) => {
  const { children } = props;
  return (<Row>
    <Col xs={4} md={3} lg={2}>
      <Box title={"Navegacion"} solid noPadding>
        <ul className="nav nav-stacked">
          {children ? children.filter( e => e != null ).map(e => {
            const { id, title, active } = e.props;
            return (<li className={`nav-item ${active ? 'active' : ''}`}>
              <a className="nav-link" data-toggle="tab" href={`#${id}`}>{title}</a>
            </li>)
          }): null}
        </ul>
      </Box>
    </Col>
    <Col xs={8} md={9} lg={10}>
      <div className="tab-content">
        {children ? children.filter( e => e != null ).map(e => {
          const { id, active } = e.props;
          return (<div className={`tab-pane ${active ? 'active in' : ''}`} id={id}>{children}</div>)
        }) : null}
      </div>
    </Col>
  </Row>);
};

export default Panel;
