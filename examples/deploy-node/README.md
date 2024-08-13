# Deploying a website using Node

This example showcases how to use the Wasmer SDK to deploy a website to Wasmer Edge using Node.

Simply install dependencies:

```
npm i
```

Set the following environment variables:

* `WASMER_TOKEN`: the token to identify your user. Retrieve yours here: https://wasmer.io/settings/access-tokens
* `APP_OWNER`: the owner of your app (you can use your username)


And then, deploy the desired example using Node.js:

* A Static website:

  ```bash
  $ node deploy-static.mjs
  ```

* A Javascript worker:

  ```bash
  $ node deploy-js.mjs
  ```

* A PHP Application:

  ```bash
  $ node deploy-php.mjs
  ```
