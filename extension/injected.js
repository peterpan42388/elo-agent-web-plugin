const pending = new Map();

function request(message) {
  return new Promise((resolve, reject) => {
    const requestId = crypto.randomUUID();
    pending.set(requestId, { resolve, reject });
    window.postMessage({
      channel: "elo-agent-web-plugin",
      requestId,
      message
    }, "*");
  });
}

window.addEventListener("message", (event) => {
  if (event.source !== window) return;
  const data = event.data;
  if (!data || data.channel !== "elo-agent-web-plugin:response") return;
  const entry = pending.get(data.requestId);
  if (!entry) return;
  pending.delete(data.requestId);
  if (data.response?.ok) entry.resolve(data.response);
  else entry.reject(new Error(data.response?.error || "unknown plugin error"));
});

window.ELOAgentBridge = {
  getConfig() {
    return request({ type: "elo:get-config" });
  },
  setConfig(config) {
    return request({ type: "elo:set-config", config });
  },
  pingAgent() {
    return request({ type: "elo:ping-agent" });
  },
  sendPrompt(payload) {
    return request({ type: "elo:send-prompt", payload });
  }
};
