import * as React from 'react';
import { Link } from 'react-router-dom';

export default class Main extends React.Component {

  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <div className="btn-controls">
        <Link to="/files">
          teste
        </Link>
      </div>
    );
  }
}