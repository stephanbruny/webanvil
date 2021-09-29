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

  getListItemClass (el) {
    const classes = [this.listItemClass];
    if (el == this.props.current) classes.push('active');
    return classes.join(' ');
  }

  render() {
    return (
      <ul className={this.listClass}>
        {this.state.data.map((el) => (
          <li key={el} className={this.getListItemClass(el)}>{this.itemDisplayFunction ? this.itemDisplayFunction(el) : el}</li>
        ))}
      </ul>
    );
  }
}

export default AsyncList;
