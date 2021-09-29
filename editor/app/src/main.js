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
            currentTemplate: null
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
                currrentTemplate: template 
            })
            this.editorReference.current.setCode(template);
        });
    }

    getTemplateListItem (item) {
        return <a onClick={() => { this.onTemplateSelect(item) }}>{item}</a>
    }

    onSave () {
        if (this.state.currentTemplateName) {
            this.backend.saveTemplate(
                this.state.currentTemplateName, 
                this.editorReference.current.getCode()
            ).catch(e => console.error(e));
        }
    }

    onNew () {
        this.setState({
            currentTemplate: '',
            currentTemplateName: ''
        });
        this.editorReference.current.setCode('');
    }

    onTemplateNameChange (ev) {
        this.setState({
            currentTemplateName: ev.target.value
        })
    }

    render () {
        return <div className="container-fluid">
            <div className="row">
                <div className="col-2">
                    <TemplateSelector 
                        backend={this.backend}
                        onSelectTemplate={this.onTemplateSelect.bind(this)}
                        currentTemplate={this.state.currentTemplateName}
                    ></TemplateSelector>
                </div>
                <div className="col-10">
                    <EditorNavComponent 
                        title={this.state.currentTemplateName}
                        onSave={this.onSave.bind(this)}
                        onNew={this.onNew.bind(this)}
                        onChange={this.onTemplateNameChange.bind(this)}
                    >
                    </EditorNavComponent>
                    <form className="container">
                        <EditorComponent ref={this.editorReference} code={this.state.currentTemplate}></EditorComponent>
                        <div className="btn-group" role="group" aria-label="Basic example">
                            <button onClick={() => this.onNew()} type="button" className="btn btn-outline-warning">New</button>
                            <button type="button" className="btn btn-outline-primary">Save Partial</button>
                            <button onClick={() => this.onSave()} type="button" className="btn btn-outline-success">Save Template</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    }
}

export default WebanvilMain;