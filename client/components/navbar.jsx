import React from 'react';

export default class Navbar extends React.Component {
  render() {

    return (
      <nav className="navbar navbar-dark bg-warning">
        <div className="container navbar-collapse text">
          <a className="navbar-brand mx-auto" href="#">
            <i className="fas fa-bolt me-2 text-center" />
            FLASH
          </a>
        </div>
      </nav>
    );
  }
}
