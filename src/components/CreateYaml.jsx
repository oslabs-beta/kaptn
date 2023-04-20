import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';

// function Cluster() {
// return (
// <div>
// <iframe src='https://k8syaml.com' width='100%' height='900'></iframe>
// </div>
// );
// }
// export default Cluster;

export default function CreateYaml() {
  const [shown, setShown] = React.useState(false);

  return (
    <div className='App'>
      {shown ? <Modal src='https://k8syaml.com' /> : null}
      <button onClick={() => setShown(!shown)}>Test</button>
    </div>
  );
}

const Modal = (props) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
      }}
    >
      <iframe title={props.src} height='315px' src={props.src} width='560px' />
    </div>
  );
};
