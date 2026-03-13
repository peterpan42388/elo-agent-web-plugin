const DEFAULT_CONFIG = {
  enabled: true,
  worldUrl: "https://world.metavie.co",
  agentId: "",
  agentEndpoint: "",
  transportPath: "/eow/bridge/chat",
  healthPath: "/health"
};

async function getConfig() {
  const stored = await chrome.storage.local.get("config");
  return { ...DEFAULT_CONFIG, ...(stored.config || {}) };
}

async function setConfig(nextConfig) {
  const merged = { ...(await getConfig()), ...nextConfig };
  await chrome.storage.local.set({ config: merged });
  return merged;
}

async function pingAgent(config) {
  if (!config.agentEndpoint) {
    throw new Error("agentEndpoint is required");
  }
  const res = await fetch(`${config.agentEndpoint}${config.healthPath}`);
  if (!res.ok) throw new Error(`health check failed: ${res.status}`);
  return await res.json().catch(() => ({ ok: true }));
}

async function sendPrompt(config, payload) {
  if (!config.agentEndpoint) {
    throw new Error("agentEndpoint is required");
  }
  const res = await fetch(`${config.agentEndpoint}${config.transportPath}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `agent bridge failed: ${res.status}`);
  }
  return data;
}

chrome.runtime.onInstalled.addListener(async () => {
  await chrome.storage.local.set({ config: DEFAULT_CONFIG });
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  (async () => {
    const config = await getConfig();
    if (message.type === "elo:get-config") {
      sendResponse({ ok: true, config });
      return;
    }
    if (message.type === "elo:set-config") {
      const next = await setConfig(message.config || {});
      sendResponse({ ok: true, config: next });
      return;
    }
    if (message.type === "elo:ping-agent") {
      const result = await pingAgent(config);
      sendResponse({ ok: true, result });
      return;
    }
    if (message.type === "elo:send-prompt") {
      const result = await sendPrompt(config, {
        agentId: config.agentId,
        worldUrl: config.worldUrl,
        ...message.payload
      });
      sendResponse({ ok: true, result });
      return;
    }
    sendResponse({ ok: false, error: "unsupported message type" });
  })().catch((error) => sendResponse({ ok: false, error: error.message }));
  return true;
});
