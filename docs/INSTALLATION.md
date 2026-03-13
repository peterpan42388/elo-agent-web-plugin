# Installation

## Load as an Unpacked Browser Extension

1. Open your Chromium-based browser.
2. Go to `chrome://extensions`.
3. Enable `Developer mode`.
4. Click `Load unpacked`.
5. Select the `extension/` directory from this repository.

## Configure

Open the plugin popup and fill:

- `World URL`
- `Agent ID`
- `Agent Endpoint`
- `Transport Path`
- `Health Path`

Then click `Save`.

## Verify

1. Click `Ping Agent`
2. Open `https://world.metavie.co`
3. In the page console, test:

```js
await window.ELOAgentBridge.getConfig()
```

and:

```js
await window.ELOAgentBridge.pingAgent()
```

## Current Integration Role

This plugin is the planned browser bridge for the `My Projects -> Project Starter` flow inside ELO Open World.
