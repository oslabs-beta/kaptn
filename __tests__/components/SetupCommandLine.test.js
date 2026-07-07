import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SetupCommandLine from "../../src/components/SetupCommandLine";
import "@testing-library/jest-dom";

const mockProps = {
  handleSubmit: jest.fn((e) => e.preventDefault()),
  setUserInput: jest.fn(),
  setVerb: jest.fn(),
  setType: jest.fn(),
  setName: jest.fn(),
  setFlags: jest.fn(),
  userInput: "",
  command: "kubectl apply -f deployment.yaml",
  setCommand: jest.fn(),
  shortDir: ".../k8s/",
  handleUploadDirectory: jest.fn(),
};

describe("SetupCommandLine", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    render(<SetupCommandLine {...mockProps} />);
  });

  it("renders the command in the input field", () => {
    const input = screen.getByDisplayValue("kubectl apply -f deployment.yaml");
    expect(input).toBeInTheDocument();
  });

  it("renders Run and Clear buttons", () => {
    expect(screen.getByText("Run")).toBeInTheDocument();
    expect(screen.getByText("Clear")).toBeInTheDocument();
  });

  it("calls handleSubmit on form submission", () => {
    const runButton = screen.getByText("Run");
    fireEvent.click(runButton);
    expect(mockProps.handleSubmit).toHaveBeenCalled();
  });

  it("clears all inputs when Clear is clicked", () => {
    const clearButton = screen.getByText("Clear");
    fireEvent.click(clearButton);
    expect(mockProps.setUserInput).toHaveBeenCalledWith("");
    expect(mockProps.setVerb).toHaveBeenCalledWith("");
    expect(mockProps.setType).toHaveBeenCalledWith("");
    expect(mockProps.setName).toHaveBeenCalledWith("");
    expect(mockProps.setFlags).toHaveBeenCalledWith([]);
  });
});
