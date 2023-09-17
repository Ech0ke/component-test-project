import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { RefForm } from "./RefForm";
// can swap you to state form, tests will still run
// import { StateForm } from "./StateForm";
import userEvent from "@testing-library/user-event";

describe("StateForm component", () => {
  it("should call onSubmit with valid form values", async () => {
    const user = userEvent.setup();
    const onSubmitMock = vi.fn();
    render(<RefForm onSubmit={onSubmitMock} />);
    const email = "aidas@webdevsimplified.com";
    const password = "PassWord123/%";

    const submitBtn = screen.getByText("Submit");
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    // enter valid email and password and submit
    await user.type(emailInput, email);
    await user.type(passwordInput, password);
    await user.click(submitBtn);
    // onSubmit function should have been called with {email, password}
    expect(onSubmitMock).toHaveBeenCalledOnce();
    expect(onSubmitMock).toHaveBeenCalledWith({ email, password });
  });

  it("should show error messages and not submit form if form is invalid", async () => {
    const user = userEvent.setup();
    const onSubmitMock = vi.fn();
    render(<RefForm onSubmit={onSubmitMock} />);

    const email = "test@gmail.com";
    const password = " ";

    const submitBtn = screen.getByText("Submit");
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    // enter invalid form details and submit
    await user.type(emailInput, email);
    await user.type(passwordInput, password);
    await user.click(submitBtn);
    // onSubmit shouldn't have been called and error messages should've shown up
    expect(onSubmitMock).not.toHaveBeenCalled();
    expect(
      screen.getByText("Must end with @webdevsimplified.com")
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Must be at least 10 characters, Must include at least 1 lowercase letter, Must include at least 1 uppercase letter, Must include at least 1 number"
      )
    ).toBeInTheDocument();
  });

  it("should update error messages when user changes input values after first submit", async () => {
    const user = userEvent.setup();
    const onSubmitMock = vi.fn();
    render(<RefForm onSubmit={onSubmitMock} />);

    let email = "test@gmail.com";
    let password = " ";

    const submitBtn = screen.getByText("Submit");
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    // enter invalid form details and submit
    await user.type(emailInput, email);
    await user.type(passwordInput, password);
    await user.click(submitBtn);
    expect(onSubmitMock).not.toHaveBeenCalled();
    expect(
      screen.getByText("Must end with @webdevsimplified.com")
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Must be at least 10 characters, Must include at least 1 lowercase letter, Must include at least 1 uppercase letter, Must include at least 1 number"
      )
    ).toBeInTheDocument();

    email = "test@webdevsimplified.com";
    password = "Test1";
    // enter valid email and a password that does not contain 10 characters, but has a number, uppercase, lowercase letter
    await user.clear(emailInput);
    await user.clear(passwordInput);
    await user.type(emailInput, email);
    await user.type(passwordInput, password);
    // email error messages should not be present
    expect(
      screen.queryByText("Must end with @webdevsimplified.com")
    ).not.toBeInTheDocument();
    // password error messages for a number, uppercase, lowercase letter should not be present
    expect(
      screen.queryByText(
        "Must include at least 1 lowercase letter, Must include at least 1 uppercase letter, Must include at least 1 number"
      )
    ).not.toBeInTheDocument();
    // error message that password must be at least 10 characters should still be present
    expect(
      screen.getByText("Must be at least 10 characters")
    ).toBeInTheDocument();
  });
});
