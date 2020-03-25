import express from 'express';
import users_fetch from './users_fetch/router.js';
import users_redeem from './users_redeem/router.js';

var router = express.Router();
router.use('/users', users_fetch);
router.use('/users', users_redeem);

export default router;