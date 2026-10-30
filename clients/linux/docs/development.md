# Development

## Build and run

```bash
cargo build
cargo run
```

Run the optimized build with:

```bash
cargo run --release
```

## Runtime prerequisites

The executable depends on system GStreamer plugins in addition to Rust crates. Before debugging Rust code, check that the runtime can create the required elements:

```bash
gst-inspect-1.0 moqsrc
gst-inspect-1.0 gtk4paintablesink
gst-inspect-1.0 pipewiresink
```

If `gst-inspect-1.0` succeeds in one environment but the application cannot find an element, check that both are using the same GStreamer installation, plugin paths, architecture, and registry.

## Debugging

The application logs dynamic pad caps, pad-link results, bus warnings, and bus errors to standard output and standard error.

Enable GStreamer diagnostics with:

```bash
GST_DEBUG=2 cargo run
```

To focus on a specific element, use a category filter:

```bash
GST_DEBUG=moqsrc:6,decodebin3:4 cargo run
```

## Before submitting changes

- Run `cargo fmt`.
- Run `cargo check`.
- Run `cargo clippy` and address relevant warnings.
- Test with the required GStreamer plugins installed.
- Check that applying new settings stops the previous pipelines.
- Update the README and relevant docs when runtime requirements, supported formats, or controls change.
