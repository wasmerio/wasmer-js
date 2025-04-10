/*
 * Service worker to capture requests and send them to the VMs when required.
 */

// Prefix for endor resources. Any pathname that starts with this prefix
// must be sent to the remote server.
const ENDOR_RESOURCES_PREFIX = "/wasmer@";
// These prefixes are for development.
const VITE_RESOURCES_PREFIX = "/@vite";
const FS_RESOURCES_PREFIX = "/@fs";

const uniqueServiceWorkerId = parseInt(Math.random() * 100);

console.log("[R/SW] Unique service worker id", uniqueServiceWorkerId);

// Communication port
let channelPort; //: MessagePort | null = null;
// Timeout for VM URLs: 1 min.
let vmTimeout = 60 * 1000;
// Wait 500ms to retrieve the channel again.
let resetTimeout = 500;
// Broadcast channel to communicate with the renderer page.
// const broadcast = new BroadcastChannel('endor@channel-sync');

self.addEventListener("install", () => {
  console.log("[R/SW] Renderer service worker installed");
  // Force to install the new version. The iframe code will reset the channels.
  self.skipWaiting();
});

self.addEventListener("activate", () => {
  // Force controlling existing pages.
  self.clients.claim();
  console.log("[R/SW] Renderer service worker activated!");
});

self.addEventListener("message", e => {
  console.log("[R/SW] Message received", e);
  if (e.data && e.data.msgType != null) {
    switch (e.data.msgType) {
      case "SEND_CHANNEL": {
        console.log("[R/SW] Configure communication channel");
        channelPort = e.data.port;
        channelPort.start();
        channelPort.postMessage({
          msgType: "WORKER_READY",
        });
        break;
      }
    }
  } else {
    console.warn(
      "[R/SW] Unknown message. The event doesn't include a type: ",
      e.data,
    );
  }
});

console.log("[R/SW] Load renderer service worker");

const initChannel = () => {
  return new Promise((resolve, reject) => {
    if (channelPort != null) {
      resolve();
    } else {
      reject(new Error("No channel port found"));
    }
    // 	// Send the request to the main tab and wait...
    // 	broadcast.postMessage({ msgType: 'RESET_CHANNELS' });

    // 	setTimeout(() => {
    // 		resolve();
    // 	}, resetTimeout);
    // }
  });
};

const requestDataToVm = request => {
  let url = new URL(request.url);
  let serverUrl = url.pathname + url.search;

  // console.log('requestDataToVm', request);

  return new Promise((resolve, reject) => {
    let timeout;
    let requestId = Math.random().toString(36).substring(2, 15);
    // setTimeout(() => {
    // 	resolve(new Response(`PATH2 ${uniqueServiceWorkerId}: ${url.toString()}`, {
    // 		headers: {
    // 			"access-control-allow-origin": "*",
    // 			"cache-control": "no-store",
    // 			"cross-origin-embedder-policy": "require-corp",
    // 			"cross-origin-opener-policy": "same-origin",
    // 			"cross-origin-resource-policy": "cross-origin",
    // 		}
    // 	}));
    // }, 10);
    const bcListener = ({ data }) => {
      if (data.msgType === "RESPONSE" && data.requestId === requestId) {
        channelPort.removeEventListener("message", this);

		clearTimeout(timeout);

        resolve(
          new Response(data.response.body, {
            headers: data.response.headers,
            status: data.response.status,
            statusText: data.response.statusText,
          }),
        );
      }
    };

    channelPort.addEventListener("message", bcListener);

    request
      // 	// Use a buffer to avoid converting non-utf8 data to string.
      .arrayBuffer()
      .then(buf => {
        channelPort.postMessage({
          msgType: "REQUEST",
          host: "localhost",
          url: serverUrl,
          requestId,
          request: {
            method: request.method,
            url: request.url,
            headers: Object.fromEntries(request.headers.entries()),
            body: new Uint8Array(buf),
          },
          // method: request.method,
          // headers: objHeaders,
        });
      }).catch((err) => {
		reject(err);
	});;

    channelPort.start();

    // // Retrieve the request body.
    // request
    // 	// Use a buffer to avoid converting non-utf8 data to string.
    // 	.arrayBuffer()
    // 	.then((buf) => {
    // 		let objHeaders = {};

    // 		for (let [k, v] of request.headers.entries()) {
    // 			objHeaders[k] = v;
    // 		}

    // 		channelPort.postMessage({
    // 			msgType: 'REQUEST',
    // 			host: 'localhost',
    // 			url: serverUrl,
    // 			method: request.method,
    // 			headers: objHeaders,
    // 			body: new Uint8Array(buf)
    // 		});
    // 	})
    // 	.catch((err) => {
    // 		reject(err);
    // 	});

    timeout = setTimeout(() => {
      reject(new Error("VM Timeout!"));
    }, vmTimeout);
  });
};

self.addEventListener("fetch", e => {
  let url = new URL(e.request.url);

  if (
    url.pathname.startsWith(ENDOR_RESOURCES_PREFIX) ||
    // TODO: Takes these only into consideration in dev mode.
    url.pathname.startsWith(FS_RESOURCES_PREFIX) ||
    url.pathname.startsWith(VITE_RESOURCES_PREFIX)
  ) {
    // Endor required files. Skip them
    e.respondWith(fetch(e.request));
  } else if (
    url.hostname == "localhost" ||
    url.hostname == "renderer.endor.dev" ||
    url.hostname.endsWith(".endor-renderer.pages.dev")
  ) {
    // Any URL to these domains refer to the VM. Send it.
    // if (e.request.destination == 'iframe') {
    // 	// Send the request to the main tab and wait...
    // 	broadcast.postMessage({ msgType: 'IFRAME_REQUEST', url: e.request.url });
    // }

    // Send the request to the VM
    e.respondWith(requestDataToVm(e.request));
    // e.respondWith(initChannel(e.clientId).then(() => requestDataToVm(e.request)));
  } else {
    // Send requests to the remote servers for other domains
    e.respondWith(fetch(e.request));
  }
});
