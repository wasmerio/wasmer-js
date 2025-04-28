import { type Instance } from "@wasmer/sdk";
// @ts-ignore
// import WasmModule from "@wasmer/sdk/wasm?url";

async function createIframeAndCommunicate() {
  const { Wasmer, Runtime, init, HttpListenerNetworking } = await import(
    "@wasmer/sdk"
  );

    await init({log: "trace"});
  
    const pkg = await Wasmer.fromRegistry("php/php-eh@=8.3.404-beta.8");
    console.log("pkg");
    const network = new HttpListenerNetworking();
    network.setOnNewListener((addr?: string) => {
    // Create the iframe
    const iframe = document.createElement('iframe');
    iframe.title = 'Embedded browser. It shows the responses from the environment';
    iframe.src = 'http://localhost:9001/wasmer@index.html'; // Replace with your target URL
    iframe.style.width = '400px';
    iframe.style.height = '300px';
    iframe.style.display = 'none';
    // iframe.sandbox = 'allow-scripts allow-forms allow-same-origin allow-popups allow-downloads allow-modals';
    iframe.allow = 'geolocation; ch-ua-full-version-list; cross-origin-isolated; screen-wake-lock; publickey-credentials-get; shared-storage-select-url; ch-ua-arch; bluetooth; ch-prefers-reduced-transparency; usb; ch-save-data; publickey-credentials-create; shared-storage; ch-ua-form-factors; ch-downlink; otp-credentials; payment; ch-ua; ch-ua-model; ch-ect; autoplay; camera; accelerometer; ch-ua-platform-version; ch-viewport-height; local-fonts; ch-ua-platform; midi; ch-ua-full-version; xr-spatial-tracking; clipboard-read; gamepad; display-capture; ch-width; ch-prefers-reduced-motion; encrypted-media; gyroscope; serial; ch-rtt; ch-ua-mobile; window-management; unload; ch-dpr; ch-prefers-color-scheme; ch-ua-wow64; fullscreen; identity-credentials-get; hid; ch-ua-bitness; storage-access; sync-xhr; ch-device-memory; ch-viewport-width; picture-in-picture; magnetometer; clipboard-write; microphone';
    document.body.appendChild(iframe);

    // Wait for iframe to load
    iframe.onload = function() {
        console.log('Iframe loaded');
        const iframeWindow = iframe.contentWindow;

        // Function to send message to iframe
        function sendMessageToChild() {
            console.log('Sending message to iframe');
            // const message = {
            //     type: 'hello',
            //     data: 'Hello from parent!',
            //     timestamp: Date.now()
            // };
            let messageChannel = new MessageChannel();
            // setTimeout(() => {
            // }, 0);

            messageChannel.port1.onmessage = async function(event) {
                // await onServerReady;
                console.log('Received from iframe:', event.data);
                if (event.data.msgType === 'REQUEST') {
                    console.log("Received request with", event.data.request.body.buffer);
                    let request = new Request(event.data.request.url, {
                        // method: event.data.method,
                        // headers: event.data.headers,
                        method: event.data.request.method,
                        headers: new Headers(event.data.request.headers),
                        // body: event.data.request.body,

                        // body: event.data.request.body.buffer,
                    });
                    console.log("Sending request network", network);
                    let response = await network.handleRequest(request, "0.0.0.0:8000", "127.0.0.1:50000");
                    // response.body?.getReader().read().then(result => {
                    //     console.log("Response received X", result);
                    // });
                    let data = await response.bytes();
                    let headers = response.headers;
                    // headers.forEach((value, key) => {
                    //     console.log(key, value);
                    // });
                    headers.set("access-control-allow-origin", "*");
                    headers.set("cache-control", "no-store");
                    headers.set("cross-origin-embedder-policy", "require-corp");
                    headers.set("cross-origin-opener-policy", "same-origin");
                    headers.set("cross-origin-resource-policy", "cross-origin");
                    headers.set("content-type", "text/html");
            
                    // let body = new TextEncoder().encode("Hello, world!");
                    // let data = new Uint8Array(body);
                    messageChannel.port1.postMessage({
                        msgType: 'RESPONSE',
                        requestId: event.data.requestId,
                        response: {
                            status: response.status,
                            statusText: response.statusText,
                            headers: Object.fromEntries(headers.entries()),
                            body: data,
                        }
                    });
                }
                else if (event.data.msgType === 'WORKER_READY') {
                    /// The worker is ready, so we create the iframe to render the response
                    const webiFrame = document.createElement('iframe');
                    webiFrame.title = 'Embedded browser. It shows the responses from the environment';
                    webiFrame.src = 'http://localhost:9001/'; // Replace with your target URL
                    webiFrame.style.width = '100%';
                    webiFrame.style.height = '100%';
                    webiFrame.style.background = 'white';
                    // iframe.sandbox = 'allow-scripts allow-forms allow-same-origin allow-popups allow-downloads allow-modals';
                    webiFrame.allow = 'geolocation; ch-ua-full-version-list; cross-origin-isolated; screen-wake-lock; publickey-credentials-get; shared-storage-select-url; ch-ua-arch; bluetooth; ch-prefers-reduced-transparency; usb; ch-save-data; publickey-credentials-create; shared-storage; ch-ua-form-factors; ch-downlink; otp-credentials; payment; ch-ua; ch-ua-model; ch-ect; autoplay; camera; accelerometer; ch-ua-platform-version; ch-viewport-height; local-fonts; ch-ua-platform; midi; ch-ua-full-version; xr-spatial-tracking; clipboard-read; gamepad; display-capture; ch-width; ch-prefers-reduced-motion; encrypted-media; gyroscope; serial; ch-rtt; ch-ua-mobile; window-management; unload; ch-dpr; ch-prefers-color-scheme; ch-ua-wow64; fullscreen; identity-credentials-get; hid; ch-ua-bitness; storage-access; sync-xhr; ch-device-memory; ch-viewport-width; picture-in-picture; magnetometer; clipboard-write; microphone';
                    document.body.appendChild(webiFrame);
                }
            }

            iframeWindow!.postMessage({
                msgType: 'SEND_CHANNEL',
                port: messageChannel.port2
            }, 'http://localhost:9001', [messageChannel.port2]);

        }

        window.addEventListener("message", function (event) {
            // Verify the origin
            if (event.origin === "http://localhost:9001") {
              console.log("Received from iframe:", event.data);
              // Handle the received message here
            }
          });
          // Send initial message
          sendMessageToChild();
    
      };

      });
    
    console.log("network", network);
    const instance = await pkg.entrypoint!.run({ args: ["-t", "/app", "-S", "0.0.0.0:8000"], networking: network, mount: {
        "/app": {
            "info.php": "<?php phpinfo(); ?>",
            "index.php": "<a href='info.php'>info</a>, <a href='form.php'>form</a>",
            "form.php": `
<form method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>">
<? var_dump($_POST) ?>
Name: <input type="text" name="name">
<span class="error">* <?php echo $nameErr;?></span>
<br><br>
E-mail:
<input type="text" name="email">
<span class="error">* <?php echo $emailErr;?></span>
<br><br>
Website:
<input type="text" name="website">
<span class="error"><?php echo $websiteErr;?></span>
<br><br>
Comment: <textarea name="comment" rows="5" cols="40"></textarea>
<br><br>
Gender:
<input type="radio" name="gender" value="female">Female
<input type="radio" name="gender" value="male">Male
<input type="radio" name="gender" value="other">Other
<span class="error">* <?php echo $genderErr;?></span>
<br><br>
<input type="submit" name="submit" value="Submit">

</form>
`,
        },
    } });
    console.log("network", network);
    const utf8_decoder = new TextDecoder("utf-8");
    instance.stdout.pipeTo(
        new WritableStream({ write: chunk => console.log(utf8_decoder.decode(chunk)) }),
      );
      instance.stderr.pipeTo(
        new WritableStream({ write: chunk => console.log(utf8_decoder.decode(chunk)) }),
      );
    
    // setTimeout(async () => {
    //     console.log("Sending request network", network);
    //     let request = new Request("/test", {
    //         method: "GET",
    //         headers: {
    //             "Content-Type": "text/html",
    //         },
    //     });
    //     console.log("Sending request network", network);
    //     let response = await network.handleRequest(request, "0.0.0.0:8000", "127.0.0.1:50000");
    //     response.body?.getReader().read().then(result => {
    //         console.log("Response received X", result);
    //     });
    //     // console.log("Response received");
    //     console.log(response);
    // }, 500);
    let onServerReady = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(true);
        }, 500);
    });
    


    //   iframeWindow!.postMessage(
    //     {
    //       msgType: "SEND_CHANNEL",
    //       port: messageChannel.port2,
    //     },
    //     "http://localhost:9001",
    //     [messageChannel.port2],
    //   );
    // Listen for messages from iframe
  
}

// Call the function when page loads
window.onload = createIframeAndCommunicate;

// Example of sending a message later
// function sendCustomMessage(text) {
//     const iframe = document.querySelector('iframe');
//     if (iframe) {
//         iframe.contentWindow.postMessage({
//             type: 'custom',
//             data: text
//         }, 'https://different-domain.com');
//     }
// }
