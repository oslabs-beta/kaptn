import React from "react";
const { ipcRenderer } = require("electron");
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Krane from "../../src/Pages/Krane";
import "@testing-library/jest-dom";
import { ProSidebarProvider } from "react-pro-sidebar";
import { BrowserRouter } from "react-router-dom";

// Mock electron so we can use ipcRenderer
jest.mock("electron", () => {
  const mElectron = { ipcRenderer: { on: jest.fn(), send: jest.fn() } };
  return mElectron;
});

const props = {
  intervalArray : [],
  setIntervalArray : jest.fn()
}
props.intervalArray.map = jest.fn()


describe("Krane test", () => {
  beforeEach(() => {
    render(
      // BrowserRouter is used here in order to render the sidebar component
      <BrowserRouter>
        <Krane intervalArray={[]} props={props} />
      </BrowserRouter>
    );
  });

  it("Renders seven Buttons", () => {
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBe(7);
  });

  it(`Renders choose directory from above text`, () => {
    const choose = screen.getByText("Choose From Above to Begin");
    expect(choose).toBeTruthy();
  });
  
  it(`Renders clusters not appearing text`, () => {
    const choose = screen.getByText("CLUSTERS STILL NOT APPEARING AFTER CHOOSING?");
    expect(choose).toBeTruthy();
  });

  it("Renders custom config button", () => {
    const customKubeConfigButton = screen.getByRole("button", { name: "CLICK HERE TO LOAD A CUSTOM .KUBE/CONFIG FILE" });
    expect(customKubeConfigButton).toBeTruthy();
  });

});
