import React from "react";

class AsyncList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [] };
    this.loadFunction = props.loadFunction;
    this.itemDisplayFunction = props.itemDisplayFunction;
    this.listClass = props.listClass;
    this.listItemClass = props.listItemClass;
  }

  componentDidMount() {
    this.loadFunction().then((json) => this.setState({ data: json }));
  }

  render() {
    return (
      <ul className={this.listClass}>
        {this.state.data.map((el) => (
          <li key={el} className={this.listItemClass}>{this.itemDisplayFunction ? this.itemDisplayFunction(el) : el}</li>
        ))}
      </ul>
    );
  }
}

export default AsyncList;
