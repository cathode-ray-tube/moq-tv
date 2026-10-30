# Clients

This folder contains client implementations for connecting to MoQ broadcasts. This currently includes:

- **Web** — Browser version. Open `index.html` through a local or HTTPS web server, enter a relay URL and broadcast name, and select **Connect & play**.
- **Linux** — Supporting various distros. See [`linux/README.md`](linux/README.md) for detailed instructions.
- **webOS** — LG webOS TV version. See [`webos/README.md`](webos/README.md) for setup and deployment instructions.
  
`Web` and `webOS` are are Javascript-based.  The webOS implementation includes the LG webOS TV SDK; the browser implementation does not.

`Linux` is Rust-based, using GTK4 and GStreamer.

Additional clients may be added to this folder as they are developed. Deployment details for each implementation will be documented in its own folder.
