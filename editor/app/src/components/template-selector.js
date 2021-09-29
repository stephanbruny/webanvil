import React from "react";

class TemplateSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            templates: props.templates || [],
            partials: props.partials || [],
            templateListExpanded: false,
            partialListExpanded: false,
            currentTemplate: null,
            currentPartial: null
        };
        this.backend = props.backend;
        this.onSelectTemplate = props.onSelectTemplate;
        this.onSelectPartial = props.onSelectPartial;
    }

    async getTemplateList () {
        const items = await this.backend.listTemplates();
        return items;
    };

    async getPartialList () {
        const items = await this.backend.listPartials();
        return items;
    };

    getTemplateListItem (item) {
        return <a onClick={() => { this.onTemplateSelect(item) }}>{item}</a>
    }

    onTemplateNameChange (ev) {
        this.setState({
            currentTemplateName: ev.target.value
        })
    }

    renderListItem (text, onSelect, active) {
        const classNames = ['list-group-item', 'list-group-item-action'];
        if (active) classNames.push('active');
        const onClick = ev => {
            ev.preventDefault();
            ev.stopPropagation();
            onSelect(text);
            return false;
        }
        return <a key={text} href="#" className={classNames.join(' ')} onClick={onClick}>{text}</a>
    };

    renderList (items = [], onSelect, checkActive, show) {
        const itemElements = items.map(item => this.renderListItem(item, () => onSelect(item), checkActive && checkActive(item)));
        return <div className={`list-group collapse ${show ? 'show' : null}`}>
            {itemElements}
        </div>
    }

    componentDidMount() {
        this.getTemplateList().then((json) => {
            this.setState({ templates: json })
        });
    }

    getListToggle (id = 'templateListExpanded') {
        return (function(ev) {
            ev.preventDefault();
            this.setState({
                [id]: !this.state[id]
            });
            return false;
        }).bind(this);
    }

    render () {
        const toggleTemplateList = this.getListToggle();
        const togglePartialList = this.getListToggle('partialListExpanded');
        const templateList = this.renderList(
            this.state.templates, 
            name => { this.onSelectTemplate(name) },
            name => name === this.props.currentTemplate,
            this.state.templateListExpanded
        );
        const partialList = this.renderList(
            this.state.partials, 
            name => { this.onSelectPartial(name) }, 
            name => { name === this.props.currentPartial },
            this.state.partialListExpanded
        );
        return <>
            <div className="list-group">
                <div className="list-group-item list-group-item-action" onClick={toggleTemplateList}>
                    Templates
                    {templateList}
                </div>
            </div>
            <div className="list-group">
                <div className="list-group-item list-group-item-action" onClick={togglePartialList}>
                    Partials
                    {partialList}
                </div>
            </div>
        </>
    }
}

export default TemplateSelector;