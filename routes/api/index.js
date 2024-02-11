const router = require('express').Router();
const noteRoute = require('./notes');

router.use('/notes', noteRoute);

module.exports = router;
