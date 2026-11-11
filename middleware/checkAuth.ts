import { Request, Response, NextFunction} from 'express';
import type { User } from "../interfaces";
/*
FIX ME : done
fix types
*/
export const ensureAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/auth/login");
}

/*
FIX ME : done fix types
*/
export const forwardAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      
      return next();
    }
    res.redirect("/dashboard");
}

export const ensureIsAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    const user = req.user as User;
    if(user.role === "admin"){
      return next();
    }  
  }
  res.redirect("/auth/login");
}