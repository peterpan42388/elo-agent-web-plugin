# ELO Agent Web Plugin

## Project Rules (Must Read First)
- [Rules/Rule.md](./Rules/Rule.md)
- [Rules/Spirit.md](./Rules/Spirit.md)
- [Rules/Target.md](./Rules/Target.md)
- [Rules/Legality.md](./Rules/Legality.md)
- [Rules/Review.md](./Rules/Review.md)
- [Rules/Rejection.md](./Rules/Rejection.md)

## Summary
Infrastructure source project for connecting a user's own agent to the ELO Open World web experience through a browser-side plugin bridge.

## Project ID
- owp_7c77efc9-2383-4801-a051-7806742346ee

## Current Scope
- browser extension skeleton
- popup configuration UI
- page-to-extension bridge
- background fetch transport for a local agent runtime

## Key Paths
- `extension/manifest.json`
- `extension/background.js`
- `extension/content.js`
- `extension/injected.js`
- `extension/popup.html`
- `docs/BRIDGE_PROTOCOL.md`
- `docs/INSTALLATION.md`

## EOW Position
This project is a foundation project for the future `My Projects` conversational start flow.

The intended sequence is:
1. user chooses a primary agent
2. user describes an idea in EOW
3. the browser plugin talks to the user's local agent
4. the result becomes an EOW requirement and then a GitHub-backed source project
