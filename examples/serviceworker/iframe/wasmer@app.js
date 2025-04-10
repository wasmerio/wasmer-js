const registerServiceWorker = async () => {
    if ("serviceWorker" in navigator) {
        try {
        const registration = await navigator.serviceWorker.register("/wasmer@sw.js", {
            scope: "/",
        });
        if (registration.installing) {
            console.log("Service worker installing");
        } else if (registration.waiting) {
            console.log("Service worker installed");
        } else if (registration.active) {
            console.log("Service worker active");
        }
        } catch (error) {
        console.error(`Registration failed with ${error}`);
        }

        navigator.serviceWorker.ready.then((registration) => {
            console.log('Service worker ready');
            window.addEventListener('message', (event) => {
                console.log('Message received', event);
                registration.active.postMessage(event.data, event.ports);
            });
        });

    }
};
// const onLoad = () => {
    console.log('onLoad');
    registerServiceWorker();
    if (!document.location.pathname.startsWith('/wasmer@')) {
        // this is a catchall page, refresh
        document.location.reload();
    }
// };
// window.addEventListener('load', onLoad);