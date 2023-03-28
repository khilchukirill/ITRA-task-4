import "./homePage.scss";
import Button from "react-bootstrap/Button";
import { RouteDescrModel } from "../models";

export function HomePage() {
  const homePageTitle: string = "Welcome!";
  const homePageButtons: Array<RouteDescrModel> = [
    new RouteDescrModel("/signin", "Sign In!"),
    new RouteDescrModel("/signup", "Sign Up!"),
  ];
  return (
    <div className="homePage">
      <h1 className="homePage__title">{homePageTitle}</h1>
      <div className="homePage__wrapper">
        {homePageButtons.map((btn, i) => (
          <Button href={btn.route} key={i} variant="primary" size="lg" active>
            {btn.descr}
          </Button>
        ))}
      </div>
    </div>
  );
}
