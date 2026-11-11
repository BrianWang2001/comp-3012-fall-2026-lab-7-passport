import { Strategy as GitHubStrategy, type Profile} from "passport-github2";

import type { Request } from "express";
import type { PassportStrategy, User } from "../../interfaces";
import { database } from "../../models/userModel";

const clientID = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;

if (!clientID || !clientSecret) {
    throw new Error("Missing GitHub OAuth credentials in .env");
}

const githubStrategy: GitHubStrategy = new GitHubStrategy(
    {
        clientID: clientID,
        clientSecret: clientSecret,
        callbackURL: "http://localhost:8000/auth/github/callback",
        passReqToCallback: true,
    },
    
    /* FIX ME:Done 😭 */
    (req: Request, accessToken: string , refreshToken: string, profile: Profile, done: (err?: Error | null, user?: User) => void) => {
        let user = database.find((existingUser) =>
            existingUser.githubId === profile.id
        );
        if (!user) {
        // First GitHub login: allocate a local numeric ID.
        const nextId =database.reduce((highestId, existingUser) => 
            Math.max(highestId, existingUser.id),0) + 1;

        user = {
            id: nextId,
            githubId: profile.id,
            name: profile.displayName || profile.username || "GitHub user",
            email: profile.emails?.[0]?.value,
            role: "user"
            };

            database.push(user);
        };
    return done(null, user);
    }
);

const passportGitHubStrategy: PassportStrategy = {
    name: 'github',
    strategy: githubStrategy,
};

export default passportGitHubStrategy;
