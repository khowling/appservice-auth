

Create 2 webapps, in the same App Service Plan, api-app-<unique>, and frontned-app-<unique>

```
az group create -n appservice-auth
az appservice plan create -g appservice-auth -n appservice-auth --sku B1 --is-linux 
az webapp create -g appservice-auth -p appservice-auth -n api-app-1234 --runtime "NODE:18-lts"
az webapp create -g appservice-auth -p appservice-auth -n frontend-app-1234 --runtime "NODE:18-lts"

```

Enabled Auth for both apps!

* Webapp -> Authentication -> Enable 
* Webapp -> Authentication -> Add Provider
* Webapp -> Authentication -> Restrict access -> Require authentication

This will create a `App Registration` for BOTH the `api` and `frontend` applications


There are now __3__ choices on how to implement app service authentication:

1. `api` app will be called from the `frontend` app (service-2=sevice), __using the `users` identity for both__
   * The user will need to be granted access to BOTH apps
   * The end-user context will be avaible to both 'frontend' and 'api' apps for authorization purporses.

2. `api` app will be called from the `frontend` app (service-2-service), __using the `frontend` applications identity__
   * We will create a __Managed Identity__ for the `frontend` app, this will be used to gain a access_token for calls to the `backend`
   * The end-user will not require any permissions to the backend.

       * Webapp -> Identity -> System Assigned -> On
       * AAD -> Enterprise Applications -> (search ObjectId) -> Permissions
       * (optional) Webapp -> Identity -> System Assigned -> Azure Role Assignments
          * Assign RBAC to the MSI