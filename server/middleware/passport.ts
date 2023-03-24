import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { UserService } from "../services/user.service";
import { UserRepository } from "../repositories/userRepository";
import { User } from "../models/user.model";
import { Pool } from "pg";
const keys = require("../config/keys");

const pool = new Pool({
  connectionString:
    "postgres://khilchukirill:DTPe9FVqB5v0BYsyzbKo9RMA7k8jp3GP@dpg-cg8vcl9mbg58573rkq8g-a.frankfurt-postgres.render.com/commondb?ssl=true",
});

const userRepository = new UserRepository(pool);
const userService = new UserService(userRepository);

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: keys.jwt,
};

module.exports = (passport: any) => {
  passport.use(
    new JwtStrategy(jwtOptions, async (payload: any, done: any) => {
      try {
        const user: User | null = await userService.getUserById(payload.id);

        if (!user) {
          return done(null, false);
        }

        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    })
  );
};
