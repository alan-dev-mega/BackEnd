import express from 'express';
import api from './api/router.js';

var router = express.Router();

//Configure API Versions.
router.use('/api', api);
router.use('/api/v0(.0)?', api);

export default router;

