
const fetch = require('../server_fetch');
var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', async function(req, res, next) {

  const appservice_access_token = req.get('X-MS-TOKEN-AAD-ACCESS-TOKEN')

  if (appservice_access_token) {
    const apiurl = process.env.BACKENDAPI || 'https://api.github.com/repos/khowling/az-device-shop/releases'
    const Authorization = `Bearer ${appservice_access_token}`

    console.log (`hitting api: ${apiurl} with header: Authorization: ${Authorization}`)

    try {

      const backendApi = await fetch(apiurl, {headers:{"User-Agent": "request", Authorization }})

      const authme = await fetch('/.auth/me')

      res.render('index', { title: 'Express', httpheaders: req.headers, apiurl, apibody: JSON.stringify(backendApi), authme: JSON.stringify(authme)});

    } catch (error) {
      res.status(error.status || 500);
      res.render('error', {error, message: error.message});
    }
  } else {
    res.status(500);
    res.render('error', {error: {status: 500, stack: '/'}, message: 'Not running in AppService with Authentication enabled'});
  }
});

module.exports = router;
