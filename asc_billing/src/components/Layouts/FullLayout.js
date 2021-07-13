import React from 'react';
import Header from '../Header';
import Footer from '../Footer';

export default function SidebarLayout(props) {
  function getComponent(key) {
    return props.children.filter((component) => {
      return component.key === key;
    });
  }

  return (
    <>
      <Header />
      <div className='container-fluid'>
        <div className='row mb-2'>
          <div className='col-4'>{getComponent('side-left')}</div>
          <div className='col-8'>{getComponent('side-right')}</div>
        </div>
        <div className='row'>
          <div className='col'>{getComponent('main')}</div>
        </div>
      </div>
      <Footer />
    </>
  );
}
