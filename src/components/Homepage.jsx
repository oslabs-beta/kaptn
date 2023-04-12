import React, { useState, useEffect } from 'react';
import CommandLine from './CommandLine.jsx';
import Terminal from './Terminal.jsx';

const Homepage = () => {
  const [command, setCommand] = useState('');
  const [response, setResponse] = useState('');

  const postCommand = async (command) => {
    try {
      const response = await fetch('/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command }),
      });
      const cliResponse = await response.json();
      console.log('the server responded: ', cliResponse);
      return cliResponse;
    } catch (e) {
      console.log(e);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('enter button clicked');
    console.log(command);
    // Fetch request
    const getCliResponse = async () => {
      const cliResponse = await postCommand(command);
      setResponse(cliResponse);
    };
    getCliResponse();
  };

  return (
    <div>
      <h1>Homepage</h1>
      <CommandLine
        handleSubmit={handleSubmit}
        postCommand={postCommand}
        setCommand={setCommand}
        command={command}
      />
      <Terminal response={response} />
    </div>
  );
};

export default Homepage;
