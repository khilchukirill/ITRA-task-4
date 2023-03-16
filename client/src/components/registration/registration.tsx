import "./registration.scss";
import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { RegFormModel } from "../models";

export function Registration() {
  const signUpTitle: string = "Sign Up!";
  const submitBtn: string = "Submit";
  const checkBtn: string = "Check me out";
  const signInBtn: string = "Have an account? Sign In!";
  const signUpFormFields: Array<RegFormModel> = [
    new RegFormModel("formBasicName", "Name", "text", "Enter your name"),
    new RegFormModel("formBasicEmail", "Email address", "email", "Enter email"),
    new RegFormModel("formBasicPassword", "Password", "password", "Password"),
    new RegFormModel(
      "formConfirmPassword",
      "Confirm password",
      "password",
      "Confirm your password"
    ),
  ];

  const [formData, setFormData] = useState<Record<string, string>>({});
  const [error, setError] = useState<string>("");

  const handleFormFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    if (name === "formBasicEmail") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setError("Please enter a valid email");
      } else {
        setError("");
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const formDataParams = new URLSearchParams(formData as any);
      const response = await fetch("http://localhost:4200/users", {
        method: "POST",
        body: formDataParams,
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
      } else {
        console.error(response.statusText);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="signUp">
      <h2 className="signUp__title">{signUpTitle}</h2>
      <Form onSubmit={handleSubmit}>
        {signUpFormFields.map((signUpFormField) => (
          <Form.Group
            className="mb-3"
            controlId={signUpFormField.controlId}
            key={signUpFormField.controlId}
          >
            <Form.Label>{signUpFormField.formLabel}</Form.Label>
            <Form.Control
              type={signUpFormField.formType}
              placeholder={signUpFormField.formPlaceholder}
              name={signUpFormField.controlId}
              value={formData[signUpFormField.controlId] || ""}
              onChange={handleFormFieldChange}
            />
          </Form.Group>
        ))}
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label={checkBtn} />
        </Form.Group>
        <Button variant="primary" type="submit" disabled={Boolean(error)}>
          {submitBtn}
        </Button>
        {error && <p className="error-message">{error}</p>}
      </Form>
      <a href="/signIn" className="signIn__link">
        {signInBtn}
      </a>
    </div>
  );
}
