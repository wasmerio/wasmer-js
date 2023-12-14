# CDN

This example showcases how to use the Wasmer SDK when using a CDN.

You'll need to set up the COOP/COEP headers when serving the html file, so it works
properly in the broser:

```
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy: same-origin
```

If you are unable to modify the server to send this headers when serving the html file,
please use the [cdn-coi-serviceworker](../cdn-coi-serviceworker/) example instead.
