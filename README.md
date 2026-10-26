# MoQ-TV

![moq tv logo](./assets/moq-tv.jpg)

**MoQ-TV** is a project to bring Media Over QUIC (MOQ) to Smart TVs — focused on low-latency broadcasting and smooth viewer experience for live streams.

This project implements the [moq-lite](https://github.com/moq-dev/moq) specification initially, with IETF compatability to be added later.

## Goals
- Provide a reference implementation for low-latency Media Over QUIC (MOQ) on Smart TV platforms.
- Produce example apps for major Smart TV platforms that developers can run, study and modify.
- Demonstrate best practices for adaptive streaming, synchronization and resiliency using MOQ.

## Key Features
- Low-latency broadcasting with QUIC transport  
- Reference/example applications for main Smart TV platforms (initial targets below)  
- Modular design so developers can adapt or replace components  
- Simple APIs for ingesting, packaging, and playback

## Initial Platform Targets

*Current working implementations in bold:*

- **Web-based Smart TV apps (HTML5/JS)**
- **LG webOS**
- Samsung Tizen - *coming soon*
- Android TV / Google TV - *coming soon*
- Roku (when feasible) - *coming soon*

## Project Structure
- `/docs` — design notes and integration guides  
- `/server` — see Getting Started for instructions to use moq-relay  
- `/clients`  
  - `/web` — HTML5 reference player (should work on most web browsers, including Smart TV browsers)
  - `/tizen` — example Tizen app  
  - `/webos` — example webOS app  
  - `/androidtv` — example Android TV app  
  - `/roku` — example Roku app  
- `/assets` — logo and images (including `moq-tv-navy.jpeg`)  
- `/scripts` — helper scripts to run test streams, app packaging, etc

## Quick Start (LG webOS):

1. Open [moq-tv Releases](https://github.com/cathode-ray-tube/moq-tv/releases)
   and download the `.ipk` file attached to the latest release.
2. Install the **Developer Mode** app on your LG TV, sign in with an
   [LG webOS TV Developer account](https://webostv.developer.lge.com/), and
   enable **Dev Mode Status**.
3. Install the webOS CLI on your computer:

   ```bash
   npm install -g @webos-tools/cli
   ```

4. On the TV, open the Developer Mode app and enable **Key Server**. Make sure
   the TV and computer are on the same network.
5. Register the TV with the CLI:

   ```bash
   ares-setup-device
   ```

   Choose **add** and enter a device name such as `tv`, the TV's IP address,
   port `9922`, and username `prisoner`. Leave the password blank. Then
   retrieve the TV key:

   ```bash
   ares-novacom --device tv --getkey
   ```

   Enter the passphrase shown in the Developer Mode app if prompted.
6. Install the downloaded package (replace the filename with the one you
   downloaded):

   ```bash
   ares-install --device tv ./YOUR_PACKAGE_NAME.ipk
   ```

7. Launch the app using the app ID in the `id` field of
   [`clients/webos/appinfo.json`](clients/webos/appinfo.json):

   ```bash
   ares-launch --device tv YOUR_APP_ID
   ```

For packaging, Simulator setup, and troubleshooting, see
[`clients/webos/README.md`](clients/webos/README.md).

## Contributing

All example apps are intentionally permissive for modification. Fork, adapt and open pull requests with improvements.

## License

This project is dual-licensed: MIT OR Apache-2.0, choose either. See `LICENSE-MIT` and `LICENSE-APACHE-2.0` in the repository root.

## Contact
    
Questions/pull requests welcome, particularly for any currently-unsupported platform.

![moq tv logo](./assets/moq-tv-navy.jpeg)
