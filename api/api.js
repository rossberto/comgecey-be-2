const express = require('express');
const apiRouter = express.Router();

const withAuth = require('./middleware');

// Routes require auth
const usersRouter = require('./users/users');
apiRouter.use('/users', withAuth, usersRouter);

const convocatoriesRouter = require('./convocatories/convocatories');
apiRouter.use('/convocatories', withAuth, convocatoriesRouter);

const placesRouter = require('./convocatories/places');
apiRouter.use('/places', withAuth, placesRouter);

const convHasPlaceRouter = require('./convocatories/conv_has_place');
apiRouter.use('/conv_has_place', withAuth, convHasPlaceRouter);

// Routes do not require auth
const authRouter = require('./auth/auth');
apiRouter.use('/auth', authRouter);

const pwdRecoveryRouter = require('./auth/pwdRecovery');
apiRouter.use('/pwdrecovery', pwdRecoveryRouter);

const newsletterRouter = require('./newsletter/newsletter');
apiRouter.use('/newsletter', newsletterRouter);

const registerRouter = require('./register/register');
apiRouter.use('/register', registerRouter);

module.exports = apiRouter;
