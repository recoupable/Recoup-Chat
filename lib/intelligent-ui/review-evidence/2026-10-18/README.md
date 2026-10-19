# Browser evidence — October 18, 2026

Synthetic local fixtures in the Codex in-app Chromium browser on macOS.
[SHA-256 manifest](manifest.json) records captured source `cae767d6e` and the
later core runtime `a0b2c2eea`; latest retry correction is referenced by the PR head. Final seekability changes are DOM-test verified;
post-restart native-browser readback was blocked on a generated connection-refused
error page. These screenshots are earlier observed states, not proof of that
later native path, physical devices or measured user benefit.

| Capture                                                     | Observed state                                    |
| ----------------------------------------------------------- | ------------------------------------------------- |
| [Supplier, desktop](supplier-desktop.jpg)                   | Ordinary Markdown and source access               |
| [Distribution, desktop](listening-desktop-final.jpg)        | Ranked values, reporting basis and interpretation |
| [Song, desktop](song-desktop.jpg)                           | Paused at chorus, loaded 48-second media          |
| [Supplier, 320px](supplier-320.jpg)                         | Wrapped table without page overflow               |
| [Distribution, 320px](listening-320.jpg)                    | Direct labels and values                          |
| [Song, 320px](song-320.jpg)                                 | Section controls reflow to two columns            |
| [Source keyboard focus, 390px](source-keyboard-390.jpg)     | Focus enters source heading                       |
| [Paused chorus seek, 390px](song-seek-390.jpg)              | 28 seconds without autoplay                       |
| [Dark song, 390px](song-dark-390.jpg)                       | Dark token and focus state                        |
| [Missing media, 390px](song-missing-audio-restored-390.jpg) | Restored chorus notes remain usable               |
