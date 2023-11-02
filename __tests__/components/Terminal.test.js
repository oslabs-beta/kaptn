import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Terminal from '../../src/components/Terminal';
import '@testing-library/jest-dom';

describe('Terminal test', () => {
    beforeEach(() => {

      const props = {
        response: [{id: 1, command: 'command1', response: 'response1'}, {id: 2, command: 'command2', response: 'response2'}]
      }
  
      render(
        <Terminal {...props} />
      );
    });
  
    it(`Renders both commands`, () => {
      const command1 = screen.getByText('$ command1');
      const command2 = screen.getByText('$ command2');
      expect(command1).toBeTruthy();
      expect(command2).toBeTruthy();
    })

    it(`Renders both responses`, () => {
        const response1 = screen.getByText('response1');
        const response2 = screen.getByText('response2');
        expect(response1).toBeTruthy();
        expect(response2).toBeTruthy();
      })
})