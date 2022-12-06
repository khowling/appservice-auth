
const fetch = require('../server_fetch');
var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', async function(req, res, next) {

  const appservice_access_token = req.get('X-MS-TOKEN-AAD-ACCESS-TOKEN'), host = req.get('host')

  if (appservice_access_token) {
    const apiurl = process.env.BACKENDAPI || 'https://api.github.com/repos/khowling/az-device-shop/releases'
    const Authorization = `Bearer ${appservice_access_token}`

    console.log (`hitting api: ${apiurl} with header: Authorization: ${Authorization}`)

    try {

      const backendApi = await fetch(apiurl, {headers:{"User-Agent": "request", Authorization }})
      const authme = false ?  await fetch(`https://${host}/.auth/me`, {headers:{"User-Agent": "request", Authorization}}) : {}

      // http://localhost:4141/MSI/token?resource=https://vault.azure.net&api-version=2019-08-01
      // X-IDENTITY-HEADER: 853b9a84-5bfa-4b22-a3f3-0b9a43d9ad8a
      // https://learn.microsoft.com/en-us/azure/app-service/overview-managed-identity?tabs=portal%2Chttp#connect-to-azure-services-in-app-code
      /*
      const msi_endpoint = process.env.IDENTITY_ENDPOINT, identity_header = process.env.IDENTITY_HEADER
      if (false && msi_endpoint) {
        console.log ("msi_endpoint", msi_endpoint)
        console.log ("identity_header", identity_header)
        const msi = await fetch(`${msi_endpoint}?resource=api://f3c2377f-ddd7-4a74-8428-0662e3f8b986/user_impersonation`) 
        console.log (msi) 
      }
      */


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
