import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import CommandLine from "../../src/components/DashboardCommandLine";
import "@testing-library/jest-dom";

describe("CommandLine tests", () => {
  let props = {
    handleSubmit: jest.fn((e) => e.preventDefault()),
    handleClear: jest.fn((e) => e.preventDefault()),
    setUserInput: jest.fn((e) => e.preventDefault()),
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
    const clearButton = screen.getByRole("button", { name: "Clear" });
    expect(clearButton.textContent).toBe("Clear");
  });

  it("Renders Clear as text value of clear button", () => {
    const clearButton = screen.getByRole("button", { name: "Clear" });
    expect(clearButton.textContent).toBe("Clear");
  });

  it("Runs a function when run button is pressed", () => {
    const button = screen.getByRole("button", { name: "Run" });
    fireEvent.click(button);
    expect(props.handleSubmit.mock.calls).toHaveLength(1);
  });

  it("Runs a function when clear button is pressed", () => {
    const button = screen.getByRole("button", { name: "Clear" });
    fireEvent.click(button);
    expect(props.handleClear.mock.calls).toHaveLength(1);
  });
});
