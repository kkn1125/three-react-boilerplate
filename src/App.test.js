import App from "./App";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("test jest", () => {
  test("test one", () => {
    const component = render(<App />);
    expect(component.container).toMatchSnapshot();
  });
  test("test two", () => {
    const component = render(<App />);
    // expect(component.container).toMatchSnapshot();
    component.getByText("Create React App example");
  });
});
