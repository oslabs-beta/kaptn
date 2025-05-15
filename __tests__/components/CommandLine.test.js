import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import CommandLine from "../../src/components/DashboardCommandLine";
import "@testing-library/jest-dom";

describe("CommandLine tests", () => {
  let props = {
    handleSubmit: jest.fn((e) => e.preventDefault()),
    setUserInput: jest.fn(),
    setVerb: jest.fn(),
    setType: jest.fn(),
    setName: jest.fn(),
    setFlags: jest.fn()
  };

  beforeEach(() => {
    render(<CommandLine {...props} />);
  });

  it("Renders 3 buttons", () => {
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBe(3);
  });

  it("Renders one TextField", () => {
    const textField = screen.getAllByRole("textbox");
    expect(textField.length).toBe(1);
  });

  it("Renders Run as text value of run button", () => {
    const runButton = screen.getByRole("button", { name: "Run" });
    expect(runButton.textContent).toBe("Run");
  });

  it("Renders Clear as text value of clear button", () => {
    const clearButton = screen.getByRole("button", { name: "Clear" });
    expect(clearButton.textContent).toBe("Clear");
  });

  it(`Renders working directory field`, () => {
    const directory = screen.getByText("Working Directory");
    expect(directory).toBeTruthy();
  });

  it("Runs a function when Run button is pressed", () => {
    const button = screen.getByRole("button", { name: "Run" });
    fireEvent.click(button);
    expect(props.handleSubmit.mock.calls).toHaveLength(1);
  });

  it("Clears input fields when Clear button is pressed", () => {
    const clearButton = screen.getByRole("button", { name: "Clear" });
    fireEvent.click(clearButton);
    expect(props.setUserInput.mock.calls).toHaveLength(1);
    expect(props.setVerb.mock.calls).toHaveLength(1);
    expect(props.setType.mock.calls).toHaveLength(1);
    expect(props.setName.mock.calls).toHaveLength(1);
    expect(props.setFlags.mock.calls).toHaveLength(1);
  });
});
