import React, { useState, useEffect } from 'react';

const Terminal = (props) => {
  const commandLog = [];
  props.response.forEach((el) => {
    commandLog.push(
      <div class='command-log'>
        <p>$ {el.command}</p>
        <p>{el.response}</p>
      </div>
    );
  });
  return <div id='terminal'>{commandLog}</div>;
};

export default Terminal;
