import React, { useState, useEffect } from 'react';

const CommandLine = (props) => {
  return (
    <div id='CommandLine'>
      <form
        onSubmit={props.handleSubmit}
        onChange={(e) => props.setCommand(e.target.value)}
        value={props.command}
      >
        <input type='text'></input>
        <button type='submit'>Enter</button>
      </form>
    </div>
  );
};

export default CommandLine;
