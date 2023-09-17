import React from "react";
const { ipcRenderer } = require("electron");
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Dashboard from "../../src/pages/Dashboard";
import "@testing-library/jest-dom";
import { ProSidebarProvider } from "react-pro-sidebar";
import { BrowserRouter } from "react-router-dom";

jest.mock(
  "electron",
  () => {
    const mElectron = { ipcRenderer: { on: jest.fn(), send: jest.fn() } };
    return mElectron;
  }
);

describe("Dashboard test", () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <ProSidebarProvider>
          <Dashboard />
        </ProSidebarProvider>
      </BrowserRouter>
    );
  });

  it(`Renders choose directory`, () => {
    const directory = screen.getByText("WORKING DIRECTORY:");
    expect(directory).toBeTruthy();
  });
});
