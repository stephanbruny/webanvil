import React from "react";
import ReactDOM from "react-dom";

import CodeEditor from "@uiw/react-textarea-code-editor";
import "@uiw/react-textarea-code-editor/dist.css";

class EditorComponent extends React.Component {
    constructor(props) {
      super(props);
      this.state = { code: props.code };
    }

    setCode (code) {
        this.setState({ code })
    }

    getCode () {
        return this.state.code;
    }

    render () {
        return (
            <CodeEditor
            value={this.state.code}
            language="handlebars"
            minHeight={256}
            placeholder="<template>{{content}}</template>"
            onChange={(evn) => this.setState({ code: evn.target.value })}
            padding={15}
            style={{
                fontSize: 12,
                backgroundColor: "#f5f5f5",
                fontFamily:
                "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
            }}
            />
        )
    }
}

export default EditorComponent;
