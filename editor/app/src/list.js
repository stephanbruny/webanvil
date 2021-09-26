import React from "react";

class AsyncList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [] };
    this.loadFunction = props.loadFunction;
    this.itemDisplayFunction = props.itemDisplayFunction;
  }

  componentDidMount() {
    this.loadFunction().then((json) => this.setState({ data: json }));
  }

  render() {
    return (
      <ul>
        {this.state.data.map((el) => (
          <li key={el}>{this.itemDisplayFunction ? this.itemDisplayFunction(el) : el}</li>
        ))}
      </ul>
    );
  }
}

export default AsyncList;
