import React from "react";

import EditorComponent from "./editor";
import AsyncList from "./list";
import EditorNavComponent from './editor-nav';
import Backend from './backend';
import TemplateSelector from "./components/template-selector";

class WebanvilMain extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTemplateName: '',
            currentTemplate: null,
            currentPartialName: '',
            currentName: '',
            currentPartial: null
        };
        this.backend = Backend();
        this.editorReference = React.createRef();
    }

    async getTemplateList () {
        const items = await this.backend.listTemplates();
        return items;
    };

    async onTemplateSelect (name) {
        return this.backend.getTemplate(name).then(template => {
            this.setState({ 
                currentTemplateName: name,
                currentTemplate: template,
                currentPartial: null,
                currentPartialName: ''
            })
            this.editorReference.current.setCode(template);
        });
    }

    async onPartialSelect (name) {
        return this.backend.getPartial(name).then(partial => {
            this.setState({ 
                currentTemplateName: '',
                currentTemplate: null,
                currentPartial: partial,
                currentPartialName: name
            })
            this.editorReference.current.setCode(partial);
        });
    }

    getTemplateListItem (item) {
        return <a onClick={() => { this.onTemplateSelect(item) }}>{item}</a>
    }

    onSave (isPartial) {
        if (isPartial) {
            return this.backend.savePartial(
                this.state.currentPartialName || this.state.currentTemplateName, 
                this.editorReference.current.getCode()
            ).catch(e => console.error(e));
        }
        if (this.state.currentTemplateName) {
            return this.backend.saveTemplate(
                this.state.currentTemplateName, 
                this.editorReference.current.getCode()
            ).catch(e => console.error(e));
        }
        
    }

    onNew () {
        this.setState({
            currentTemplate: null,
            currentTemplateName: '',
            currentPartial: null,
            currentPartialName: ''
        });
        this.editorReference.current.setCode('');
    }

    onTemplateNameChange (ev) {
        this.setState({
            currentTemplateName: ev.target.value
        })
    }

    getFormButtons () {
        console.log(this.state)
        if (this.state.currentTemplate) {
            return <>
                <button onClick={() => this.onNew()} type="button" className="btn btn-outline-warning">New</button>
                <button onClick={() => this.onSave()} type="button" className="btn btn-outline-success">Save Template</button>
            </>
        }
        if (this.state.currentPartial) {
            return <>
                <button onClick={() => this.onNew()} type="button" className="btn btn-outline-warning">New</button>
                <button type="button" onClick={() => this.onSave(true)} className="btn btn-outline-primary">Save Partial</button>
            </>
        }
        return <>
            <button onClick={() => this.onNew()} type="button" className="btn btn-outline-warning">New</button>
            <button type="button" onClick={() => this.onSave(true)} className="btn btn-outline-primary">Save Partial</button>
            <button onClick={() => this.onSave()} type="button" className="btn btn-outline-success">Save Template</button>
        </>
    }

    render () {
        return <div className="container-fluid">
            <div className="row">
                <div className="col-2">
                    <TemplateSelector 
                        backend={this.backend}
                        onSelectTemplate={this.onTemplateSelect.bind(this)}
                        onSelectPartial={this.onPartialSelect.bind(this)}
                        currentTemplate={this.state.currentTemplateName}
                    ></TemplateSelector>
                </div>
                <div className="col-10">
                    <EditorNavComponent 
                        title={this.state.currentTemplateName || this.state.currentPartialName}
                        onSave={this.onSave.bind(this)}
                        onNew={this.onNew.bind(this)}
                        onChange={this.onTemplateNameChange.bind(this)}
                    >
                    </EditorNavComponent>
                    <form className="container">
                        <EditorComponent ref={this.editorReference} code={this.state.currentTemplate}></EditorComponent>
                        <div className="btn-group" role="group" aria-label="Basic example">
                            {this.getFormButtons()}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    }
}

export default WebanvilMain;