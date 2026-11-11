import passport from "passport";
import type { User } from "../../interfaces";
import { Strategy as LocalStrategy } from "passport-local";
import { getUserByEmailIdAndPassword, getUserById} from "../../controllers/userController";
import { PassportStrategy } from '../../interfaces/index';

const localStrategy = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  (email, password, done) => {
    try {
      const user = getUserByEmailIdAndPassword(email, password);

      return user
        ? done(null, user)
        : done(null, false, {
            message: "Incorrect password",
          });
    } catch (err) {
      if (
        err instanceof Error && err.message === `Couldn't find user with email: ${email}`
      ) {
        return done(null, false, {
          message: err.message,
        });
      }

      return done(err);
    }
  }
);


/*
FIX ME (types) 😭
*/
passport.serializeUser(function (user: Express.User, done: (err?: Error | null, profile?: any) => void) {
  const appUser = user as User
  done(null, appUser.id);
});

/*
FIX ME (types) 😭
*/
passport.deserializeUser(function (id: any, done: (err?: Error | null, profile?: any) => void) {
  let user = getUserById(id);
  if (user) {
    done(null, user);
  } else {
    done(new Error("User not found"), null);
  }
});

const passportLocalStrategy: PassportStrategy = {
  name: 'local',
  strategy: localStrategy,
};

export default passportLocalStrategy;
