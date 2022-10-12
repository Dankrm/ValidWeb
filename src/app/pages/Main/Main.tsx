import React from 'react';
import { Link } from 'react-router-dom';
import { vscodeAPI } from '../../lib/VSCodeApi';

export default function main(){

  vscodeAPI.postMessage('validateApi');
  
  React.useEffect(() =>{
    console.log('reagiu');
  }, []);

  return (
    <div className="btn-controls">
      <Link to="/files">
        teste
      </Link>
    </div>
  );
}