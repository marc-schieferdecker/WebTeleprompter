var express = require('express');
var router = express.Router();
let i18n = require('i18n');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('documents', { title: i18n.__('Documents') });
});

module.exports = router;
