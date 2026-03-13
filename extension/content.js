const INJECTED_ID = "elo-agent-web-plugin-injected";

function injectBridge() {
  if (document.getElementById(INJECTED_ID)) return;
  const script = document.createElement("script");
  script.id = INJECTED_ID;
  script.src = chrome.runtime.getURL("injected.js");
  script.type = "module";
  (document.head || document.documentElement).appendChild(script);
}

window.addEventListener("message", (event) => {
  if (event.source !== window) return;
  const data = event.data;
  if (!data || data.channel !== "elo-agent-web-plugin") return;
  chrome.runtime.sendMessage(data.message, (response) => {
    window.postMessage({
      channel: "elo-agent-web-plugin:response",
      requestId: data.requestId,
      response
    }, "*");
  });
});

injectBridge();
