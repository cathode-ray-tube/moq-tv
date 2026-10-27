# Clients

This folder contains client implementations for connecting to MoQ broadcasts. Implementations currently include:

- **Web** — Browser version. Open `index.html` through a local or HTTPS web server, enter a relay URL and broadcast name, and select **Connect & play**.
- **webOS** — LG webOS TV version. See [`webos/README.md`](webos/README.md) for setup and deployment instructions.
- 
Both clients use the MoQ Watch player. The webOS implementation includes the LG webOS TV SDK; the browser implementation does not.

Additional clients may be added to this folder as they are developed. Deployment details for each implementation are documented in its own folder.
