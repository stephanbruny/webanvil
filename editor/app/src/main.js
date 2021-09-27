import React from "react";

import EditorComponent from "./editor";
import AsyncList from "./list";
import EditorNavComponent from './editor-nav';
import Backend from './backend';

class WebanvilMain extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTemplateName: null,
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

    render () {
        return <div className="container-fluid">
            <div className="row">
                <div className="col-2">
                    <AsyncList 
                        loadFunction={this.getTemplateList.bind(this)} 
                        itemDisplayFunction={this.getTemplateListItem.bind(this)}
                        listClass="list-group"
                        listItemClass='list-group-item list-group-item-action'
                    ></AsyncList>
                </div>
                <div className="col-10">
                    <EditorNavComponent 
                        title={this.state.currentTemplateName || 'Template'}
                        onSave={this.onSave.bind(this)}
                    >
                    </EditorNavComponent>
                    <form>
                        <EditorComponent ref={this.editorReference} code={this.state.currentTemplate}></EditorComponent>
                    </form>
                </div>
            </div>
        </div>
    }
}

export default WebanvilMain;