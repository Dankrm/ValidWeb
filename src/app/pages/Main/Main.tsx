import React from 'react';
import { Link } from 'react-router-dom';
import { vscodeAPI } from '../../lib/VSCodeApi';

export default function Main(){
  vscodeAPI.onMessage((message) => {
    console.log(message)
  });
  vscodeAPI.postMessage(
    {
      type: 'validateApi',
      value: 'teste'
    }
  );

  return (
    <div className="btn-controls">
      <Link to="/files">
        teste
      </Link>
    </div>
  );
}