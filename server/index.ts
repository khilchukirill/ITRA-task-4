import { UserController } from "./controllers/UserController";
import { UserService } from "./services/user.service";
import { UserRepository } from "./repositories/userRepository";
import { Pool } from "pg";

const cors = require("cors");
const express = require("express");
const passport = require("passport");
require("./middleware/passport")(passport);

const app = express();
const pool = new Pool({
  connectionString:
    "postgres://khilchukirill:DTPe9FVqB5v0BYsyzbKo9RMA7k8jp3GP@dpg-cg8vcl9mbg58573rkq8g-a.frankfurt-postgres.render.com/commondb?ssl=true",
});
const port = 4000;
app.use(express.json());
app.use(cors());
app.use(passport.initialize());

const userRepository = new UserRepository(pool);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

app.post("/login", userController.login.bind(userController));
app.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  userController.getAllUsers.bind(userController)
);
app.get(
  "/users/:id",
  passport.authenticate("jwt", { session: false }),
  userController.getUserById.bind(userController)
);
app.post("/users", userController.createUser.bind(userController));
app.put(
  "/users/:id",
  passport.authenticate("jwt", { session: false }),
  userController.updateUser.bind(userController)
);
app.delete(
  "/users/:id",
  passport.authenticate("jwt", { session: false }),
  userController.deleteUser.bind(userController)
);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
