# MoQ TV — Browser Demo

A small browser-based player for watching a MoQ broadcast. It uses the
`<moq-watch>` custom element from `@moq/watch` and lets you enter a relay URL,
optional port, and broadcast name.

This is a static web page: no build step or application server is required.
The page imports the MoQ player module from esm.sh at runtime.

## Run locally

1. Clone or download this repository.
2. Serve the project folder over HTTP. For example, with Python:

   ```sh
   python3 -m http.server 8000
   ```

3. Open <http://localhost:8000> in a browser.
4. Enter the relay URL and broadcast name, then select **Connect & play**.

Serving the page from localhost is preferable to opening `index.html` directly.
For deployment outside localhost, use HTTPS. The relay also needs a valid
certificate, unless its certificate fingerprint is pinned by the client.

## Connect to a broadcast

- **Relay URL:** The HTTPS URL of the MoQ relay, such as
  `https://cdn.moq.dev/demo`.
- **Port:** Optional. Leave blank to use the port from the URL.
- **Broadcast name:** The exact name of the broadcast to watch, such as
  `bbb.hang`.

The relay must be reachable from the viewer’s browser, and the broadcast must
be available there. A successful connection also depends on the browser
supporting the transport and media codecs used by the stream.

## Browser support

The player uses browser media APIs, including WebCodecs. Support depends on the
browser, operating system, and codecs used by the broadcast. MoQ’s browser
documentation describes current transport support and fallback behavior:
<https://doc.moq.dev/lib/js/>

## Customize

Edit `index.html` to change the default relay URL or broadcast name, page
styling, connection form, and player behavior. The player is configured by
setting its `url` and `name` attributes.

The optional debug panel is controlled by `DEBUG_UI` in `index.html`. Set it
to `true` while troubleshooting to show browser-side messages.

## Dependencies

The page loads `@moq/watch/element` from esm.sh:

```html
<script type="module">
  import "https://esm.sh/@moq/watch/element";
</script>
```

This means the browser needs network access to esm.sh as well as to the relay.
For a production deployment, consider pinning a tested package version or
bundling the dependency so the page does not rely on an unversioned CDN import.
