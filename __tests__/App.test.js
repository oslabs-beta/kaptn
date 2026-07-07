import React from "react";
import { render, screen } from "@testing-library/react";
import App from "../src/App";
import "@testing-library/jest-dom";

jest.mock("electron", () => {
  const mElectron = {
    ipcRenderer: {
      on: jest.fn(),
      send: jest.fn(),
      removeListener: jest.fn(),
    },
  };
  return mElectron;
});

describe("App", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders without crashing", () => {
    const appRoot = document.querySelector(".App");
    expect(appRoot).toBeInTheDocument();
  });

  it("renders the Topbar", () => {
    const topbar = document.getElementById("top-bar2");
    expect(topbar).toBeInTheDocument();
    expect(screen.getAllByText("kaptn").length).toBeGreaterThan(0);
  });

  it("renders the sidebar navigation", () => {
    const links = screen.getAllByRole("link");
    expect(links.length).toBeGreaterThan(0);
  });
});
