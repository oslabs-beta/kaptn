import React from "react";
const { ipcRenderer } = require("electron");
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Start from "../../src/Pages/Start";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";

// Mock electron so we can use ipcRenderer
jest.mock("electron", () => {
  const mElectron = { ipcRenderer: { on: jest.fn(), send: jest.fn() } };
  return mElectron;
});

// const props = {
//   intervalArray : [],
//   setIntervalArray : jest.fn()
// }
// props.intervalArray.map = jest.fn()

describe("Start test", () => {
  beforeEach(() => {
    render(
      // BrowserRouter is used here in order to render the sidebar component
      <BrowserRouter>
        <Start />
      </BrowserRouter>
    );
  });

  it(`Renders Kaptn logo text`, () => {
    const kaptnLogo = screen.getByText("kaptn");
    expect(kaptnLogo).toBeTruthy();
  });

  it(`Renders v2.0.1`, () => {
    const versionNumberText = screen.getByText("v2.0.1");
    expect(versionNumberText).toBeTruthy();
  });

  it(`Renders Kaptn tagline`, () => {
    const kaptnTagline = screen.getByText("take command of kubernetes");
    expect(kaptnTagline).toBeTruthy();
  });

  it(`Renders QUICKSTART text`, () => {
    const quickstartText = screen.getByText("QUICKSTART :");
    expect(quickstartText).toBeTruthy();
  });

  it("Renders four buttons", () => {
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBe(4);
  });
});
