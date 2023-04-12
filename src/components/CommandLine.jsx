import React, { useState, useEffect } from 'react';

const CommandLine = () => {
  const [command, setCommand] = useState('');

  const postCommand = async function (command) {
    try {
      const response = await fetch('/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command }),
      });
      const cliResponse = await response.json();
      console.log('the server responded: ', cliResponse);
    } catch (e) {
      console / log(e);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('enter button clicked');
    console.log(command);
    // Fetch request
    postCommand(command);
  };

  return (
    <div id='CommandLine'>
      <form
        onSubmit={handleSubmit}
        onChange={(e) => setCommand(e.target.value)}
        value={command}
      >
        <input type='text'></input>
        <button type='submit'>Enter</button>
      </form>
    </div>
  );
};

export default CommandLine;
