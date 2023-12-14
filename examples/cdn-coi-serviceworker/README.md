# CDN with `coi-serviceworker` patch.

This example showcases how to use the Wasmer SDK when using a CDN.

In this case, by using the [`coi-serviceworker.js`](./coi-serviceworker.js) file you can automatically patch the required
COOP/COEP headers using a service worker, so the SDK runs properly without requiring the server to send
the COOP/COEP headers.

This example should work in Github Pages and almost any other provider without modification.

You can test this running locally also very easily:

```
$ python3 -m http.server
```

And then visit http://localhost:8000/
