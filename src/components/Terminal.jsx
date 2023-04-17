import React, { useState, useEffect, useRef } from 'react';

const Terminal = (props) => {
  // Create a div for each command/response in the current session
  const commandLog = [];

  // Format the response for line breaks and spacing
  // The <pre> tag here ensures proper spacing
  props.response.forEach((el) => {
    const paredResponse = el.response.split('\n').map(function (item, idx) {
      console.log('item', item);
      return (
        <pre>
          <span>
            {item}
            <br />
          </span>
        </pre>
      );
    });

    commandLog.push(
      <div class='command-log'>
        <p>$ {el.command}</p>
        <p>{paredResponse}</p>
      </div>
    );
  });

  return (
    <div
      id='terminal'
      style={{
        border: '1px solid',
        borderRadius: '3px',
        // border: '2px solid #c6bebe',
        background: '#0e0727',
        height: '400px',
        width: 'auto',
        // color: '#edeaea',
        fontFamily: 'monospace',
        padding: '5px',
        overflow: 'scroll',
      }}
    >
      {commandLog}
    </div>
  );
};

export default Terminal;
