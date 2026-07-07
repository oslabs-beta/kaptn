import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Setup from "../../src/Pages/Setup";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";

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

describe("Setup page", () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <Setup />
      </BrowserRouter>
    );
  });

  it("renders the EASY SETUP title", () => {
    expect(screen.getByText("EASY SETUP")).toBeInTheDocument();
  });

  it("renders the three setup steps", () => {
    expect(screen.getByText("1. IMPORT IMAGE")).toBeInTheDocument();
    expect(screen.getByText("2. CHOOSE WORKING DIRECTORY")).toBeInTheDocument();
    expect(screen.getByText("3. CHOOSE/CREATE YAML FILE")).toBeInTheDocument();
  });

  it("renders the INPUT COMMANDS section", () => {
    expect(screen.getByText("INPUT COMMANDS")).toBeInTheDocument();
  });

  it("renders the LEARNING CENTER section", () => {
    expect(screen.getByText(/LEARNING CENTER/)).toBeInTheDocument();
  });

  it("renders the CHOOSE DIRECTORY button", () => {
    expect(screen.getByText("CHOOSE DIRECTORY")).toBeInTheDocument();
  });

  it("renders the Configure YAML FILE button", () => {
    expect(screen.getByText("Configure .YAML FILE")).toBeInTheDocument();
  });

  it("renders the Enter .IMG text field", () => {
    expect(screen.getByLabelText("Enter .IMG")).toBeInTheDocument();
  });

  it("renders the Commands autocomplete", () => {
    expect(screen.getByLabelText("Commands")).toBeInTheDocument();
  });

  it("renders the Types autocomplete", () => {
    expect(screen.getByLabelText("Types")).toBeInTheDocument();
  });

  it("renders the Name text field", () => {
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
  });

  it("renders the Flags select", () => {
    expect(screen.getByLabelText("Flags")).toBeInTheDocument();
  });

  it("shows NONE SELECTED as default directory", () => {
    const noneElements = screen.getAllByText("NONE SELECTED");
    expect(noneElements.length).toBeGreaterThan(0);
  });

  it("shows NONE ENTERED as default image path", () => {
    expect(screen.getByText("NONE ENTERED")).toBeInTheDocument();
  });

  it("renders learning resource links", () => {
    const links = screen.getAllByRole("link");
    expect(links.length).toBeGreaterThanOrEqual(5);
  });
});
