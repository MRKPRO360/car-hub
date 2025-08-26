import passport from 'passport';
import { Strategy as FaceBookStrategy } from 'passport-facebook';
import User from '../modules/user/user.model';
import config from '../config/index';
import AppError from '../errors/AppError';

passport.use(
  new FaceBookStrategy(
    {
      clientID: config.facebook_app_id as string,
      clientSecret: config.facebook_app_secret as string,
      callbackURL: config.facebook_callback_url as string,
      profileFields: ['id', 'displayName', 'emails', 'picture.type(large)'],
    },
    async (accessToken, refreshToken, profile, done) => {
      const email = profile.emails?.[0]?.value;
      try {
        if (!email) throw new AppError(404, 'Credential is required!');
        let user =
          (await User.findOne({ facebookId: profile.id })) ||
          (await User.isUserExistsByEmail(email));

        // CHECK IF USER IS BLOCKED
        if (user?.isBlocked) throw new AppError(403, 'User is blocked!');

        // CHECK IF USER IS DELETED
        if (user?.isDeleted) throw new AppError(403, 'User is deleted!');

        if (!user) {
          user = await User.create({
            facebookId: profile.id,
            email: profile.emails?.[0]?.value || null,
            name: profile.displayName,
            profileImg: profile.photos?.[0]?.value || '',
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// serialize user (for session cookies)
passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
export default passport;
