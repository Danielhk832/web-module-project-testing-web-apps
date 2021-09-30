import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ContactForm from "./ContactForm";

test("renders without errors", () => {
  render(<ContactForm />);
});

test("renders the contact form header", () => {
  render(<ContactForm />);
  const formHeader = screen.queryByText(/contact form/i);
  expect(formHeader).toBeInTheDocument();
});

test("renders ONE error message if user enters less then 5 characters into firstname.", async () => {
  render(<ContactForm />);
  const name = "Jib";
  const nameInput = screen.queryByLabelText(/first name*/i);

  userEvent.type(nameInput, name);

  const errorMsg = await screen.queryByTestId("error");

  expect(errorMsg).toBeInTheDocument();
});

test("renders THREE error messages if user enters no values into any fields.", async () => {
  render(<ContactForm />);
  const button = screen.getByRole("button");

  userEvent.click(button);

  const errorMsg = await screen.findAllByTestId("error");

  expect(errorMsg).toBeTruthy();
});

test("renders ONE error message if user enters a valid first name and last name but no email.", async () => {
  render(<ContactForm />);
  const firstName = screen.queryByLabelText(/first name*/i);
  const lastName = screen.queryByLabelText(/last name*/i);
  const email = screen.queryByLabelText(/email*/i);
  const button = screen.getByRole("button");

  userEvent.type(firstName, "daniel");
  userEvent.type(lastName, "kish");
  userEvent.click(button);

  const errorMsg = await screen.queryByText(
    /Error: email must be a valid email address./i
  );

  expect(errorMsg).toHaveTextContent(
    /Error: email must be a valid email address./i
  );
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
  render(<ContactForm />);
  const email = screen.queryByLabelText(/email*/i);

  userEvent.type(email, "a@d,com");

  const errorMsg = await screen.queryByText(
    /Error: email must be a valid email address./i
  );

  expect(errorMsg).toHaveTextContent(
    /Error: email must be a valid email address./i
  );
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
  render(<ContactForm />);

  const button = screen.getByRole("button");

  userEvent.click(button);

  const errorMsg = await screen.queryByText(
    /Error: lastName is a required field./i
  );

  expect(errorMsg).toHaveTextContent(/Error: lastName is a required field./i);
});

test("renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.", async () => {
  render(<ContactForm />);

  const firstName = screen.queryByPlaceholderText(/edd/i);
  const lastName = screen.queryByPlaceholderText(/burke/i);
  const email = screen.queryByLabelText(/email*/i);
  const button = screen.getByRole("button");
  const message = screen.queryByLabelText("Message");

  userEvent.type(firstName, "David");
  userEvent.type(lastName, "kish");
  userEvent.type(email, "1234@6.com");

  userEvent.click(button);

  const firstNameDisplay = await screen.queryByTestId(/firstNameDisplay/i);
  const lastNameDisplay = await screen.queryByTestId(/lastNameDisplay/i);
  const emailDisplay = await screen.queryByTestId(/emailDisplay/i);
  const messageDisplay = screen.queryByTestId(/messageDisplay/i);

  expect(messageDisplay).toBeNull();
  expect(lastNameDisplay).not.toBeNull();
  expect(emailDisplay).not.toBeNull();
  expect(firstNameDisplay).not.toBeNull();
});

test("renders all fields text when all fields are submitted.", async () => {
  render(<ContactForm />);

  const firstName = screen.queryByPlaceholderText(/edd/i);
  const lastName = screen.queryByPlaceholderText(/burke/i);
  const email = screen.queryByLabelText(/email*/i);
  const button = screen.getByRole("button");
  const message = screen.queryByLabelText("Message");

  userEvent.type(firstName, "David");
  userEvent.type(lastName, "kish");
  userEvent.type(email, "1234@6.com");
  userEvent.type(message, "words");

  userEvent.click(button);

  const firstNameDisplay = await screen.queryByTestId(/firstNameDisplay/i);
  const lastNameDisplay = await screen.queryByTestId(/lastNameDisplay/i);
  const emailDisplay = await screen.queryByTestId(/emailDisplay/i);
  const messageDisplay = await screen.queryByTestId(/messageDisplay/i);

  expect(messageDisplay).toBeInTheDocument();
  expect(lastNameDisplay).toBeInTheDocument();
  expect(emailDisplay).toBeInTheDocument();
  expect(firstNameDisplay).toBeInTheDocument();
});
