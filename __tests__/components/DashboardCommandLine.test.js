import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import DashboardCommandLine from "../../src/components/DashboardCommandLine";
import "@testing-library/jest-dom";

const mockProps = {
  handleSubmit: jest.fn((e) => e.preventDefault()),
  setUserInput: jest.fn(),
  setVerb: jest.fn(),
  setType: jest.fn(),
  setName: jest.fn(),
  setFlags: jest.fn(),
  userInput: "",
  command: "kubectl get pods",
  setCommand: jest.fn(),
  shortDir: ".../myproject/",
  handleUploadDirectory: jest.fn(),
};

describe("DashboardCommandLine", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    render(<DashboardCommandLine {...mockProps} />);
  });

  it("renders the command input field", () => {
    const input = screen.getByDisplayValue("kubectl get pods");
    expect(input).toBeInTheDocument();
  });

  it("renders Run and Clear buttons", () => {
    expect(screen.getByText("Run")).toBeInTheDocument();
    expect(screen.getByText("Clear")).toBeInTheDocument();
  });

  it("renders the working directory label", () => {
    expect(screen.getByText("Working Directory")).toBeInTheDocument();
  });

  it("displays the short directory path", () => {
    expect(screen.getByText(".../myproject/")).toBeInTheDocument();
  });

  it("renders the Input Command label", () => {
    expect(screen.getByText("Input Command")).toBeInTheDocument();
  });

  it("calls handleSubmit when form is submitted", () => {
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

  it("renders the $ prompt symbol", () => {
    expect(screen.getByText("$")).toBeInTheDocument();
  });
});
