import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import SideNav from '../../src/components/Sidebar';
import '@testing-library/jest-dom';
import { ProSidebarProvider } from 'react-pro-sidebar';
import { ColorModeContext, useMode } from '../../src/theme';

describe('Sidebar test', () => {
  beforeEach(() => {
    const [theme, colorMode] = useMode();

    render(
      <ProSidebarProvider>
        <ColorModeContext.Provider value={colorMode}>
          <SideNav />
        </ColorModeContext.Provider>
      </ProSidebarProvider>
    );
  });

  xit('Renders six buttons', () => {
    const links = screen.getAllByRole('link');
    expect(links.length).toBe(5);
  });
});
