import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import SideNav from "../../src/components/Sidebar";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";

describe("Sidebar test", () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <SideNav />
      </BrowserRouter>
    );
  });

  it("Renders five buttons", () => {
    const links = screen.getAllByRole("link");
    expect(links.length).toBe(5);
  });
});
