import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter, Route } from "react-router-dom";

// Import the components to test
import Root, { useQuery, QueryParamsDemo } from "./Root";

// Mock the useLocation hook
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
}));

// Test the useQuery hook
describe("useQuery hook", () => {
  it("returns query parameters from the URL", () => {
    const location = {
      search: "?redirect=http://example.com",
    };
    useLocation.mockReturnValue(location);

    const query = useQuery();
    expect(query.get("redirect")).toBe("http://example.com");
  });
});

// Test the QueryParamsDemo component
describe("QueryParamsDemo component", () => {
  it("displays the 'Return Home' heading and a link", () => {
    const location = {
      search: "?redirect=http://example.com",
    };
    useLocation.mockReturnValue(location);

    const { getByText } = render(
      <MemoryRouter>
        <QueryParamsDemo />
      </MemoryRouter>
    );

    expect(getByText("Return Home")).toBeInTheDocument();
    expect(getByText("Click to go home")).toHaveAttribute(
      "href",
      "http://example.com"
    );
  });
});

// Test the Root component
describe("Root component", () => {
  it("renders Router with QueryParamsDemo component", () => {
    const { getByText } = render(<Root />);
    expect(getByText("Return Home")).toBeInTheDocument();
    expect(getByText("Click to go home")).toBeInTheDocument();
  });
});
