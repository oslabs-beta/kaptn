import React, { useState, useEffect } from 'react';

const Terminal = (props) => {
  
  // Create a div for each command/response in the current session
  const commandLog = [];
  props.response.forEach((el) => {
    commandLog.push(
      <div class='command-log'>
        <p>$ {el.command}</p>
        <div>{el.response}</div>
      </div>
    );
  });

  return <div id='terminal'>{commandLog}</div>;
};

export default Terminal;
