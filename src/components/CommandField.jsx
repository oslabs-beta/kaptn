import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { styled, lighten, darken } from '@mui/system';

const BeginnerHeader = styled('div')(({ theme }) => ({
  position: 'sticky',
  top: '-8px',
  padding: '4px 10px',
  margin: '0px',
  color: '#ffffff',
  backgroundColor: '#352a68',
  webkitScrollbarColor: 'red yellow',
}));

const GroupItems = styled('ul')({
  padding: 0,
  color: '#ffffff',
  backgroundColor: '#5c4d9a',
  webkitScrollbarColor: 'red yellow',
});

function CommandField() {
  const options = commands.map((option) => {
    const firstLetter = commands[0].category;
    return {
      firstLetter: /[{commands[0].category}]/.test(firstLetter)
        ? '0-9'
        : firstLetter,
      ...option,
    };
  });

  return (
    <div
      style={{
        padding: '0',
        color: '#ffffff',
        webkitScrollbarColor: 'red yellow',
      }}
    >
      <Autocomplete
        id='grouped-demo'
        options={options.sort(
          (a, b) => -b.firstLetter.localeCompare(a.firstLetter)
        )}
        groupBy={(option) => option.category}
        getOptionLabel={(option) => option.title}
        style={{
          webkitScrollbarColor: 'red yellow',
          backgroundColor: 'transparent',
        }}
        onInputChange={(e, newInputValue) => {
          console.log('newInputValue is', newInputValue);
          setVerb(newInputValue);
          // const newCommand = verb + ' ' + type + ' ' + name;
          // setCommand(newCommand);
          // setCommand(newInputValue);
        }}
        renderInput={(params) => <TextField {...params} label='Commands' />}
        renderGroup={(params) => (
          <li
            style={{
              webkitScrollbarColor: 'red yellow',
              color: '#ffffff',
              fontSize: '13px',
            }}
            key={params.key}
          >
            <BeginnerHeader
              style={{
                webkitScrollbarColor: 'red yellow',
                color: '#ffffff',
                fontSize: '14px',
              }}
            >
              {params.group}
            </BeginnerHeader>
            <GroupItems
              style={{
                webkitScrollbarColor: 'red yellow',
                color: '#ffffff',
                fontSize: '14px',
              }}
            >
              {params.children}
            </GroupItems>
          </li>
        )}
      />
    </div>
  );
}

const commands = [
  { title: 'create', category: 'Beginners Commands' },
  { title: 'expose', category: 'Beginners Commands' },
  { title: 'run', category: 'Beginners Commands' },
  { title: 'set', category: 'Beginners Commands' },
  { title: 'explain', category: 'Intermediate Commands' },
  { title: 'get', category: 'Intermediate Commands' },
  { title: 'edit', category: 'Intermediate Commands' },
  { title: 'delete', category: 'Intermediate Commands' },
  { title: 'rollout', category: 'Deploy Commands' },
  { title: 'scale', category: 'Deploy Commands' },
  { title: 'autoscale', category: 'Deploy Commands' },
  { title: 'certificate', category: 'Cluster Management Commands' },
  { title: 'cluster-info', category: 'Cluster Management Commands' },
  { title: 'top', category: 'Cluster Management Commands' },
  { title: 'cordon', category: 'Cluster Management Commands' },
  { title: 'uncordon', category: 'Cluster Management Commands' },
  { title: 'drain', category: 'Cluster Management Commands' },
  { title: 'taint', category: 'Cluster Management Commands' },
  { title: 'describe', category: 'Troubleshoot/Debug Commands' },
  { title: 'logs', category: 'Troubleshoot/Debug Commands' },
  { title: 'attach', category: 'Troubleshoot/Debug Commands' },
  { title: 'exec', category: 'Troubleshoot/Debug Commands' },
  { title: 'port-forward', category: 'Troubleshoot/Debug Commands' },
  { title: 'proxy', category: 'Troubleshoot/Debug Commands' },
  { title: 'cp', category: 'Troubleshoot/Debug Commands' },
  { title: 'auth', category: 'Troubleshoot/Debug Commands' },
  { title: 'debug', category: 'Troubleshoot/Debug Commands' },
  { title: 'diff', category: 'Advanced Commands' },
  { title: 'apply', category: 'Advanced Commands' },
  { title: 'patch', category: 'Advanced Commands' },
  { title: 'replace', category: 'Advanced Commands' },
  { title: 'wait', category: 'Advanced Commands' },
  { title: 'kustomize', category: 'Advanced Commands' },
  { title: 'label', category: 'Settings Commands' },
  { title: 'annotate', category: 'Settings Commands' },
  { title: 'completion', category: 'Settings Commands' },
  { title: 'alpha', category: 'Other Commands' },
  { title: 'api-resources', category: 'Other Commands' },
  { title: 'api-versions', category: 'Other Commands' },
  { title: 'config', category: 'Other Commands' },
  { title: 'plugin', category: 'Other Commands' },
  { title: 'version', category: 'Other Commands' },
];

export default CommandField;
