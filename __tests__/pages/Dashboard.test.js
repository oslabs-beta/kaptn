import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Dashboard from '../../src/pages/Dashboard';
import '@testing-library/jest-dom';
import { ProSidebarProvider } from 'react-pro-sidebar';

describe('Dashboard test', () => {
  beforeEach(() => {
    render(
      <ProSidebarProvider>
        <Dashboard />
      </ProSidebarProvider>
    );
  });

  xit(`Renders choose directory`, () => {
    const directory = screen.getByText('WORKING DIRECTORY:');
    expect(directory).toBeTruthy();
  });
});
