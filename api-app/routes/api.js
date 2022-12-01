var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/myorder', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ myorder: 123 }));
});

module.exports = router;
