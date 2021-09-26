import React from "react";

import EditorComponent from "./editor";
import AsyncList from "./list";
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

    render () {
        return <>
            <aside>
                <AsyncList loadFunction={this.getTemplateList.bind(this)} itemDisplayFunction={this.getTemplateListItem.bind(this)}></AsyncList>
            </aside>
            <div>
                <form>
                    <EditorComponent ref={this.editorReference} code={this.state.currentTemplate}></EditorComponent>
                </form>
            </div>
        </>
    }
}

export default WebanvilMain;