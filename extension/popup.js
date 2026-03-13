const form = document.getElementById("config-form");
const status = document.getElementById("status");
const pingButton = document.getElementById("ping-button");

function setStatus(value) {
  status.textContent = typeof value === "string" ? value : JSON.stringify(value, null, 2);
}

function formToConfig() {
  const fd = new FormData(form);
  return {
    worldUrl: String(fd.get("worldUrl") || "").trim(),
    agentId: String(fd.get("agentId") || "").trim(),
    agentEndpoint: String(fd.get("agentEndpoint") || "").trim(),
    transportPath: String(fd.get("transportPath") || "").trim() || "/eow/bridge/chat",
    healthPath: String(fd.get("healthPath") || "").trim() || "/health",
    enabled: form.enabled.checked
  };
}

async function loadConfig() {
  const response = await chrome.runtime.sendMessage({ type: "elo:get-config" });
  if (!response?.ok) throw new Error(response?.error || "failed to load config");
  const config = response.config || {};
  form.worldUrl.value = config.worldUrl || "";
  form.agentId.value = config.agentId || "";
  form.agentEndpoint.value = config.agentEndpoint || "";
  form.transportPath.value = config.transportPath || "/eow/bridge/chat";
  form.healthPath.value = config.healthPath || "/health";
  form.enabled.checked = Boolean(config.enabled);
  setStatus(config);
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const response = await chrome.runtime.sendMessage({
    type: "elo:set-config",
    config: formToConfig()
  });
  if (!response?.ok) {
    setStatus(response?.error || "save failed");
    return;
  }
  setStatus(response.config);
});

pingButton.addEventListener("click", async () => {
  const response = await chrome.runtime.sendMessage({ type: "elo:ping-agent" });
  setStatus(response?.ok ? response.result : response?.error || "ping failed");
});

loadConfig().catch((error) => setStatus(error.message));
