import React from "react";
const { ipcRenderer } = require("electron");
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Krane from "../../src/Pages/Krane";
import "@testing-library/jest-dom";
import { ProSidebarProvider } from "react-pro-sidebar";
import { BrowserRouter } from "react-router-dom";

// Mock electron so we can use ipcRenderer
jest.mock("electron", () => {
  const mElectron = { ipcRenderer: { on: jest.fn(), once: jest.fn(), send: jest.fn(), removeAllListeners: jest.fn(), removeListener: jest.fn(), invoke: jest.fn(() => Promise.resolve("")) } };
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

  it("Renders six Buttons", () => {
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBe(6);
  });

  it(`Renders choose from above text`, () => {
    const choose = screen.getByText("Choose From Above to Begin");
    expect(choose).toBeTruthy();
  });
  
  // The "still not appearing" helper only shows after a tab is chosen and the
  // cluster is unreachable — so it should NOT be on the default landing screen.
  it(`Does not render clusters not appearing text on the landing screen`, () => {
    const choose = screen.queryByText("CLUSTERS STILL NOT APPEARING AFTER CHOOSING?");
    expect(choose).toBeNull();
  });

  it("Does not render custom config button on the landing screen", () => {
    const customKubeConfigButton = screen.queryByRole("button", { name: "CLICK HERE TO LOAD A CUSTOM .KUBE/CONFIG FILE" });
    expect(customKubeConfigButton).toBeNull();
  });

});
