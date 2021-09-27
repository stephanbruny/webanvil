import React from "react";
import ReactDOM from "react-dom";

import CodeEditor from "@uiw/react-textarea-code-editor";
import "@uiw/react-textarea-code-editor/dist.css";

class EditorNavComponent extends React.Component {
    constructor(props) {
      super(props);
      this.state = { title: props.title };
      this.onSave = props.onSave;
      this.onNew = props.onNew;
    }

    onSaveClick () {
        if (this.onSave) return this.onSave();
    }

    onNewClick () {
        if (this.onNew) return this.onNew();
    }

    render () {
        return (
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">{this.props.title}</a>
                <form className="d-flex">
                    <div className="btn-group" role="group" aria-label="Basic example">
                        <button onClick={() => this.onNewClick()} type="button" className="btn btn-outline-primary">New</button>
                        <button type="button" className="btn btn-outline-primary">Middle</button>
                        <button onClick={() => this.onSaveClick()} type="button" className="btn btn-outline-primary">Save</button>
                    </div>
                </form>
            </div>
            </nav>
        )
    }
}

export default EditorNavComponent;


/*
<nav className="navbar navbar-expand-lg navbar-light bg-light">
  <div className="container-fluid">
    <a className="navbar-brand" href="#">Navbar</a>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        <li className="nav-item">
          <a className="nav-link active" aria-current="page" href="#">Home</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">Link</a>
        </li>
        <li className="nav-item dropdown">
          <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Dropdown
          </a>
          <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
            <li><a className="dropdown-item" href="#">Action</a></li>
            <li><a className="dropdown-item" href="#">Another action</a></li>
            <li><hr className="dropdown-divider"></li>
            <li><a className="dropdown-item" href="#">Something else here</a></li>
          </ul>
        </li>
        <li className="nav-item">
          <a className="nav-link disabled">Disabled</a>
        </li>
      </ul>
      <form className="d-flex">
        <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search">
        <button className="btn btn-outline-success" type="submit">Search</button>
      </form>
    </div>
  </div>
</nav>
*/