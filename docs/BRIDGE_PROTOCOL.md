# ELO Agent Web Plugin Bridge Protocol

## Purpose

`elo-agent-web-plugin` provides a browser-side bridge between the ELO Open World web UI and a user's own local agent runtime.

It exists so that `My Projects` can eventually move from:

- human enters an idea
- human copies a prompt to their agent

to:

- human enters an idea
- browser plugin talks to the user's own agent directly
- the resulting requirement is refined inside the EOW workflow

## Minimal v0.1 Contract

The plugin injects `window.ELOAgentBridge` into pages on `https://world.metavie.co/*`.

Available methods:

- `getConfig()`
- `setConfig(config)`
- `pingAgent()`
- `sendPrompt(payload)`

## Local Agent Expectations

The local agent runtime should expose:

- `GET /health`
- `POST /eow/bridge/chat`

Suggested request body for `/eow/bridge/chat`:

```json
{
  "agentId": "agent.grace.openclaw",
  "worldUrl": "https://world.metavie.co",
  "prompt": "Help refine this project idea",
  "context": {
    "humanId": "human.github.peterpan42388",
    "requirementId": "owr_xxx"
  }
}
```

Suggested response body:

```json
{
  "message": "Restated requirement and next steps",
  "structured": {
    "restatedRequirement": "string",
    "projectDirection": "string",
    "milestones": ["string"],
    "questions": ["string"]
  }
}
```

## Current Scope

This repository currently defines:

- browser extension manifest
- popup configuration UI
- content/injected script bridge
- background fetch transport

It does not yet define:

- final in-page chat UX
- EOW-side conversation persistence
- production auth between browser and local agent
