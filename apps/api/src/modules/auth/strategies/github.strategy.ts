import passport, { DoneCallback } from 'passport';

import { Profile, Strategy } from 'passport-github2';

import { env } from '@/config/env.js';
import { AuthService } from '../auth.service.js';

export interface GithubProfile {
  githubId: string;
  email: string | null;
  username: string;
  name: string;
  avatarUrl: string;
}

passport.use(
  new Strategy(
    {
      clientID: env.GITHUB_CLIENT_ID,

      clientSecret: env.GITHUB_CLIENT_SECRET,

      callbackURL: env.GITHUB_CALLBACK_URL,
      scope: ['user:email'],
    },

    async (
      _accessToken: string,
      _refreshToken: string,
      profile: Profile,
      done: DoneCallback,
    ) => {
      const githubProfile: GithubProfile = {
        githubId: profile.id,

        username: profile.username ?? '',

        name: profile.displayName ?? profile.username ?? '',

        avatarUrl: profile.photos?.[0]?.value ?? '',

        email: profile.emails?.[0]?.value ?? null,
      };
      try {
        const user = await AuthService.findOrCreateGithubUser(githubProfile);

        done(null, user);
      } catch (err) {
        done(err);
      }
    },
  ),
);
