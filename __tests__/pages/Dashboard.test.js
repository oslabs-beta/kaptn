import React from "react";
const { ipcRenderer } = require("electron");
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Dashboard from "../../src/pages/Dashboard";
import "@testing-library/jest-dom";
import { ProSidebarProvider } from "react-pro-sidebar";
import { BrowserRouter } from "react-router-dom";

// Mock electron so we can use ipcRenderer
jest.mock("electron", () => {
  const mElectron = { ipcRenderer: { on: jest.fn(), send: jest.fn() } };
  return mElectron;
});

describe("Dashboard test", () => {
  beforeEach(() => {
    render(
      // BrowserRouter is used here in order to render the sidebar component
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
  });

  // it(`Renders choose directory`, () => {
  //   const directory = screen.getByText("WORKING DIRECTORY:");
  //   expect(directory).toBeTruthy();
  // });
  

  it(`Renders Kubectl toggle`, () => {
    const kubectl = screen.getByText("kubectl");
    expect(kubectl).toBeTruthy();
  });

  it(`Renders Commands dropdown`, () => {
    const commands = screen.getByLabelText("Commands");
    expect(commands).toBeTruthy();
  });

  it(`Renders Types dropdown`, () => {
    const types = screen.getByLabelText("Types");
    expect(types).toBeTruthy();
  });

  it(`Renders Name dropdown`, () => {
    const name = screen.getByLabelText("Name");
    expect(name).toBeTruthy();
  });

  it(`Renders Flags dropdown`, () => {
    const flags = screen.getByLabelText("Flags");
    expect(flags).toBeTruthy();
  });
});
