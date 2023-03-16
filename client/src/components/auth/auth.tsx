import "./auth.scss";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { RegFormModel } from "../models";

export function Auth() {
  const signInTitle: string = "Sign In!";
  const submitBtn: string = "Submit";
  const checkBtn: string = "Check me out";
  const signUpLink: string = "Don`t have an account? Sing Up now!";
  const signUpFormFields: Array<RegFormModel> = [
    new RegFormModel("formBasicEmail", "Email address", "email", "Enter email"),
    new RegFormModel("formBasicPassword", "Password", "password", "Password"),
  ];
  return (
    <div className="signIn signUp">
      <h2 className="signIn__title signUp__title">{signInTitle}</h2>
      <Form>
        {signUpFormFields.map((signUpFormField, i) => (
          <Form.Group
            key={i}
            className="mb-3"
            controlId={signUpFormField.controlId}
          >
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
      <a href="/signUp" className="signUp__link">
        {signUpLink}
      </a>
    </div>
  );
}
