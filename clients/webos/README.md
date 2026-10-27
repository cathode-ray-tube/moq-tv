# moq-tv for webOS TV

This directory contains the webOS TV app. You can download a prebuilt `.ipk`
from the GitHub Releases page, or package and install the app yourself with
the webOS CLI.

## Requirements

- Node.js and npm
- A computer and LG webOS TV on the same local network, for installation on a TV
- An LG Developer account and the **Developer Mode** app on the TV, for CLI installation on a TV
- For simulator testing, VS Code with **webOS Studio** and the webOS TV Simulator

## Install the webOS CLI

Install Node.js, which includes npm, from [nodejs.org](https://nodejs.org/).
Then open a terminal and install the current webOS CLI:

```bash
npm install -g @webos-tools/cli
```

Check that the CLI is available:

```bash
ares --version
```

The CLI's default profile is `tv`. If you previously installed a deprecated
webOS CLI, remove the old global package before installing this one:

```bash
npm uninstall -g @webosose/ares-cli
npm install -g @webos-tools/cli
```

## Package the app

From the repository root:

```bash
cd clients/webos
ares-package .
```

The command creates an `.ipk` package in the current directory. Find its name
with:

```bash
ls -1 *.ipk
```

The app ID is in `appinfo.json`. To print it if `jq` is installed:

```bash
jq -r .id appinfo.json
```

Keep the package filename and app ID handy for the install and launch commands.

## Register an LG Developer account and enable Developer Mode

1. Create an account at the [LG webOS TV Developer site](https://webostv.developer.lge.com/).
2. Connect the TV to your network and install the **Developer Mode** app from
   LG Apps / the LG Content Store.
3. Open Developer Mode on the TV and sign in using your LG Developer account.
4. Turn on **Dev Mode Status**. The TV will reboot.
5. Open Developer Mode again and turn on **Key Server**.
6. Find the TV's IP address in the TV's network settings. Keep the TV and
   development computer on the same network.

Developer Mode sessions are time-limited. Use **Extend** in the Developer Mode
app before the session expires.

## Connect the CLI to your TV

Start the device setup wizard:

```bash
ares-setup-device
```

Choose **add**, then enter a device name (for example, `tv`), the TV's IP
address, port `9922`, and username `prisoner`. Leave the password blank.

Check that the device appears in the list:

```bash
ares-setup-device --list
```

With **Key Server** enabled on the TV, retrieve its key (replace `tv` if you
chose a different device name):

```bash
ares-novacom --device tv --getkey
```

If prompted, enter the passphrase displayed in the Developer Mode app. A
successful connection should display information about the TV.

## Install and run on the TV

From `clients/webos`, set the package path to the `.ipk` you created:

```bash
ares-install --device tv ./YOUR_PACKAGE_NAME.ipk
```

Get the app ID from `appinfo.json`, then launch it:

```bash
ares-launch --device tv YOUR_APP_ID
```

For example, if the `id` field in `appinfo.json` is `com.moqtv.app`, use:

```bash
ares-launch --device tv com.moqtv.app
```

To verify the exact app ID, inspect `appinfo.json`:

```bash
cat appinfo.json
```

## Test with the webOS TV Simulator

LG's current testing option is the webOS TV Simulator. Install **webOS Studio**
in VS Code, then use its Package Manager to install a Simulator version
compatible with the TV platform you want to test.

Start the Simulator. To register it with the CLI, run:

```bash
ares-setup-device
```

Choose **add** and enter the Simulator's connection details as shown by
webOS Studio / the Simulator. Then install and launch the app using the
Simulator's registered device name:

```bash
ares-install --device DEVICE_NAME ./YOUR_PACKAGE_NAME.ipk
ares-launch --device DEVICE_NAME YOUR_APP_ID
```

Simulator setup and connection details can vary by Simulator version. The
older VirtualBox-based Emulator is deprecated; it is intended for older
webOS TV versions.

## Troubleshooting

- **`ares: command not found`**: Open a new terminal after installing the
  CLI, then check your npm global `bin` directory is on `PATH`.
- **Connection or key error**: Confirm the computer and TV are on the same
  network, Developer Mode is on, and Key Server is enabled. Re-run
  `ares-novacom --device tv --getkey`.
- **Developer Mode session expired**: Open the Developer Mode app on the TV
  and extend or re-enable the session.
- **App installs but does not launch**: Confirm the app ID matches the `id`
  field in `appinfo.json`.
- **No `.ipk` appears**: Run `ares-package .` from this directory and check
  the command output for errors.

## References

- [LG webOS TV Developer site](https://webostv.developer.lge.com/)
- [LG: App Testing with Developer Mode](https://webostv.developer.lge.com/develop/getting-started/developer-mode-app)
- [LG: webOS CLI installation](https://webostv.developer.lge.com/develop/tools/cli-installation)
- [webOS CLI documentation](https://github.com/webos-tools/cli)
