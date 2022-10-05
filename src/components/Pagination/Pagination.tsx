import React from 'react';
import Utils from '../../commons/Utils';
//import styles from './Pagination.module.scss';

interface IPagination {
  count: number;
  current: number;
  handlePage?: any;
}

const defaultPropsPagination: IPagination = {
  count: 0,
  current: 1,
  handlePage: null,
}

interface IItemPage {
  text: string;
  disabled?: boolean;
  active?: boolean;
  onClick?: any;
}

const defaultPropsItemPage: IItemPage = {
  text: "",
  disabled: false,
  active: false,
  onClick: null,
}

const ItemPage: React.FC<IItemPage> = (props) => {
  return (<li onClick={props.onClick} className={`paginate_button ${props.disabled ? 'disabled' : ''} ${props.active ? 'active' : ''}`}>
    <span>{props.text}</span>
  </li>);
}

const Pagination: React.FC<IPagination> = (props) => {
  const previusPage = props.current - 1;
  const nextPage = props.current + 1;
  const isPreviusPage = props.current === 1;
  const isNextPage = props.current === props.count;
  const pages = Utils.usePagination(props.current, props.count);
  return (<div className="dataTables_paginate">
    <ul className="pagination">
      {pages.map(page => {
        if (page === "previous") {
          return (<ItemPage text={"Anterior"} disabled={isPreviusPage} onClick={() => props.handlePage(previusPage)} />)
        }
        if (page === "next") {
          return (<ItemPage text={"Siguiente"} disabled={isNextPage} onClick={() => props.handlePage(nextPage)} />)
        }
        if (page === "...") {
          return (<ItemPage key={`page-${Math.random()}`} text={page} disabled />)
        }
        return (<ItemPage key={`page-${page}`} text={String(page)} active={page === props.current} onClick={() => props.handlePage(page)} />)
      })}
    </ul>
  </div>);
};

Pagination.defaultProps = defaultPropsPagination;
ItemPage.defaultProps = defaultPropsItemPage;
export default Pagination;
