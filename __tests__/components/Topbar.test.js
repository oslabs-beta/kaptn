import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Topbar from '../../src/components/Topbar';
import '@testing-library/jest-dom';

jest.mock("electron", () => ({
  ipcRenderer: {
    on: jest.fn(),
    send: jest.fn(),
    invoke: jest.fn(() => Promise.resolve("")),
    removeListener: jest.fn(),
  },
}));

describe('Topbar test', () => {
    beforeEach(() => {
  
      render(
        <Topbar />
      );
    });
  
    it(`Renders logo`, () => {
      const topbar = screen.getByText('kaptn');
      expect(topbar).toBeTruthy();
    })
})