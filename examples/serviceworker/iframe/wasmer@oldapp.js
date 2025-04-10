(function () {
    const linkElement = document.createElement("link").relList;
    if (linkElement && linkElement.supports && linkElement.supports("modulepreload")) return;
    for (const preloadLink of document.querySelectorAll('link[rel="modulepreload"]')) 
      fetchPreloadLink(preloadLink);
    
    new MutationObserver(mutations => {
      for (const mutation of mutations)
        if (mutation.type === "childList")
          for (const addedNode of mutation.addedNodes)
            addedNode.tagName === "LINK" && 
            addedNode.rel === "modulepreload" && 
            fetchPreloadLink(addedNode);
    }).observe(document, { childList: true, subtree: true });
  
    function getFetchOptions(link) {
      const options = {};
      if (link.integrity) options.integrity = link.integrity;
      if (link.referrerPolicy) options.referrerPolicy = link.referrerPolicy;
      
      if (link.crossOrigin === "use-credentials") {
        options.credentials = "include";
      } else if (link.crossOrigin === "anonymous") {
        options.credentials = "omit";
      } else {
        options.credentials = "same-origin";
      }
      return options;
    }
  
    function fetchPreloadLink(link) {
      if (link.ep) return;
      link.ep = true;
      const fetchOptions = getFetchOptions(link);
      fetch(link.href, fetchOptions);
    }
  })();
  
  const BASE_URL = "https://endor.dev";
  const FADE_TIMEOUT = 1000;
  const syncChannel = new BroadcastChannel("endor@channel-sync");
  
  let messageChannel, 
      navigationChannel,
      isReady = false;
  
  const initializeChannels = serviceWorker => {
    messageChannel = new MessageChannel();
    navigationChannel = new MessageChannel();
    
    console.log("[IFR] Initializing channels.");
    
    window.parent.postMessage(
      { msgType: "SEND_CHANNEL", port: messageChannel.port2 }, 
      BASE_URL, 
      [messageChannel.port2]
    );
    window.parent.postMessage(
      { msgType: "NAV_CHANNEL", port: navigationChannel.port2 }, 
      BASE_URL, 
      [navigationChannel.port2]
    );
    
    serviceWorker.postMessage(
      { msgType: "SEND_CHANNEL", port: messageChannel.port1 }, 
      [messageChannel.port1]
    );
  
    navigationChannel.port1.onmessage = event => {
      if (!event.data.msgType) return;
      
      let iframe = document.getElementById("targetIframe");
      if (event.data.msgType === "VM_STATE") {
        if (isReady) return;
        
        requestAnimationFrame(() => {
          let stateLabel = document.getElementById("vmStateLabel");
          let statusText = event.data.state.label;
          
          switch (event.data.state.id) {
            case "init":
              updateProgressBar(0);
              break;
            case "downloading-snapshot": {
              statusText = `${statusText} (${event.data.state.data.progress}%)`;
              let progress = (event.data.state.data.progress * 90) / 100;
              updateProgressBar(Math.round(progress));
              break;
            }
            case "init-networking":
              updateProgressBar(90);
              break;
            case "ready":
              updateProgressBar(100);
              isReady = true;
              navigateTo("/");
              break;
          }
          stateLabel.textContent = statusText;
          requestAnimationFrame(() => {});
        });
      } else {
        switch (event.data.msgType) {
          case "NAVIGATE":
            navigateTo(event.data.path);
            break;
          case "NAVIGATE_BACK":
            iframe.contentWindow.history.back();
            break;
          case "NAVIGATE_FORWARD":
            iframe.contentWindow.history.forward();
            break;
          case "RELOAD":
            iframe.contentWindow.location.reload();
            break;
        }
      }
    };
  };
  
  const navigateTo = path => {
    let iframe = document.getElementById("targetIframe");
    let introElement = document.getElementById("intro");
    
    if (!introElement.classList.contains("fade-out")) {
      introElement.classList.add("fade-out");
      setTimeout(() => {
        introElement.classList.add("hidden");
        iframe.classList.remove("hidden");
      }, FADE_TIMEOUT);
    }
    
    const fullUrl = `${window.location.protocol}//${window.location.host}${path}`;
    iframe.src = fullUrl;
  };
  
  console.log("[IFR] Loading renderer iframe");
  const targetIframe = document.getElementById("targetIframe");
  const iframeObserver = new MutationObserver(mutations => {
    mutations.some(mutation => {
      if (mutation.type === "attributes" && mutation.attributeName === "href") {
        if (navigationChannel != null) {
          const currentUrl = new URL(targetIframe.contentWindow.location.href);
          navigationChannel.port1.postMessage({
            msgType: "UPDATE_NAV",
            path: currentUrl.pathname + currentUrl.search,
          });
        }
        return true;
      }
      return false;
    });
  });
  
  targetIframe.addEventListener("load", () => {
    iframeObserver.disconnect();
    iframeObserver.observe(targetIframe.contentWindow.document.body, {
      attributes: true,
      childList: true,
      subtree: true,
    });
  });
  
  const updateProgressBar = progress => {
    const progressElement = document.querySelector(".loader_progress");
    progressElement.style.width = `${progress}%`;
  };
  
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/endor@sw.js").then(registration => {
      if (registration.active != null) {
        console.log("[IFR] Init channels from registration.");
        updateProgressBar(20);
        initializeChannels(registration.active);
      }
    });
  
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      console.log("[IFR] A new service worker is taking control of the page");
      initializeChannels(navigator.serviceWorker.controller);
    });
  
    syncChannel.addEventListener("message", event => {
      if (event.data.msgType === "RESET_CHANNELS") {
        console.log("[IFR] The service worker requested to reset the channels");
        initializeChannels(navigator.serviceWorker.controller);
      } else if (event.data.msgType === "IFRAME_REQUEST") {
        let url = new URL(event.data.url);
        let path = url.pathname + url.search;
        if (navigationChannel != null) {
          navigationChannel.port1.postMessage({ 
            msgType: "UPDATE_NAV", 
            path: path 
          });
        }
      }
    });
  }
  
  