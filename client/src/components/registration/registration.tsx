import "./registration.scss";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { RegFormModel } from "../models";

export function Registration() {
  let signUpTitle: string = "Sign Up!";
  let submitBtn: string = "Submit";
  let checkBtn: string = "Check me out";
  let signUpFormFields: Array<RegFormModel> = [
    new RegFormModel("formBasicName", "Name", "text", "Enter your name"),
    new RegFormModel("formBasicEmail", "Email address", "email", "Enter email"),
    new RegFormModel("formBasicPassword", "Password", "password", "Password"),
    new RegFormModel(
      "formBasicPassword",
      "Confirm password",
      "password",
      "Confirm your password"
    ),
  ];

  return (
    <div className="signUp">
      <h2 className="signUp__title">{signUpTitle}</h2>
      <Form>
        {signUpFormFields.map((signUpFormField) => (
          <Form.Group className="mb-3" controlId={signUpFormField.controlId}>
            <Form.Label>{signUpFormField.formLabel}</Form.Label>
            <Form.Control
              type={signUpFormField.formType}
              placeholder={signUpFormField.formPlaceholder}
            />
          </Form.Group>
        ))}
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label={checkBtn} />
        </Form.Group>
        <Button variant="primary" type="submit">
          {submitBtn}
        </Button>
      </Form>
    </div>
  );
}
