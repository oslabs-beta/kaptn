Changelog for kaptn v3.0.0 and earlier.

## Version 3.0.0 -

Kaptn 3.0.0 is a major release centered on a completely reimagined Cluster Metrics experience, a new Prometheus-backed history source for Krane, always-on stats that persist across sessions, and a broad round of stability fixes.

**Cluster Metrics Visualizer — now built into the app**

- **The Grafana dashboard now opens inside Kaptn** instead of launching an external web browser. Click "Open Metrics Visualizer" and the setup steps collapse as the live Kubernetes API Server dashboard fills the page — you never leave the app to watch your cluster. A "Back to setup" link returns you at any time.

- **Automatic Grafana login — no password screen.** Kaptn reads your cluster's real Grafana admin password and authenticates the embedded dashboard for you, so you land straight on live metrics instead of a login page. (The old "Log in through browser" buttons are now "Open Metrics Visualizer.")

- **Automatic, self-healing port-forwarding.** The localhost:3000 → Grafana forward is now set up the moment the app launches, so metrics are ready even if you go straight to Krane. If port 3000 is already in use, Kaptn frees it and retries; if the forward later drops, it notices and updates status; and it's torn down cleanly on quit so no orphaned process lingers. Setup Step 3 reflects this real status automatically.

- **Live, theme-matched dashboard.** The embedded dashboard loads a rolling "last 24 hours → now" window that refreshes every 10 seconds (previously it froze at launch time). Its canvas, panels, toolbars, and footer are tinted to match Kaptn's light or dark theme, and toggling the app's mode re-styles the dashboard on the fly.

- **Reveal-and-copy Grafana password.** The setup card now shows your cluster's actual Grafana admin password (masked by default) with an eye toggle to reveal it and a one-click copy button — replacing the old hardcoded prom-operator placeholder.

**Krane — Prometheus history & a source toggle**

- **View historical CPU & memory from Prometheus.** Each expanded pod/node usage chart can now pull real historical data — up to 7 days — straight from Prometheus (via Grafana's data-source proxy), instead of only what the app sampled while open.
  Per-chart source toggle + time-range dropdown. A control bar above each chart lets you switch between live kubectl top and Prometheus history, and choose a window (15m, 1h, 6h, 24h, 2d, 5d, 7d). The Prometheus option auto-enables the instant the connection is ready, and stays disabled with an explanatory tooltip until then.
  Always-on stats & cross-session persistence

- **Collection now starts the moment the app opens** — cluster-wide, every 15 seconds, in the background — so charts already have backfilled history the first time you open them, and leaving Krane no longer interrupts recording.

- **History survives restarts.** Pod and node usage is saved to disk (crash-safely) and merged back in on the next launch, giving you a continuous timeline across sessions instead of starting blank.
  Honest gaps. When the app was closed for a stretch, charts now break the line across the missing period instead of drawing a misleading straight bridge — and the gap detection adapts to each source's own sampling rate.

- **Detail views stay live.** Open node/pod panels now re-sync to the latest data every cycle (with a brief LOADING sweep) rather than freezing on the values from when you clicked in.

**Stability & bug fixes**

- **Fixed the white-page crash** when opening Krane's node/pod views (a bundler mis-resolving Electron's ipcRenderer to undefined).

- **Fixed the slow-down-and-crash after long sessions** — IPC listeners were piling up on every render across the Pods, Nodes, and Deployments views (plus a leaked namespaces listener on the Krane page); memory now stays flat no matter how long the app runs.

- **Fixed mislabeled pod stats** — an off-by-one in the limits parser was shifting each pod's CPU/memory limits onto the wrong pod (e.g. etcd); values now line up correctly.

- **Fixed gauges getting stuck on LOADING** for a whole refresh cycle (a race between the pod/node list and the stats responses) — LOADING now resolves predictably in about half a second.

- **Fixed chart crashes** when switching source or time range (a Rules-of-Hooks violation), and a node memory-gauge crash caused by a misspelled property.

## Version 2.0.1 -

- Adds interactive, expandable visx graphs for pods' and nodes' historical cpu and memory usage.

- Adds variable refresh rate.

- Adds various other bugs fixes and additions including: Fixes bug with user directory in CLI

## Version 2.0.0 -

- **Kaptn Krane Cluster Manager:**
  View live and historical metrics, and scale, delete or restart resources like pods, nodes, and deployments in our revolutionary, easy-to-use interface that harnesses the power of kubectl commands. Features including filtering by namespace, sorting by cpu and memory percent, one-click control of your clusters, and much more makes taking command of Kubernetes easier than ever before!

- **New Start Page:**
  We've completely revamped the start page, including the addition of installation checks and quickstart links. Now you can troubleshoot problems more quickly, and get right into your workflow.

- Adds various other bugs fixes and additions including: clear terminal log button, redesign of CLI, Instant Help Desk, Learning Center and much more!

## Version 1.2.0 -

- Adds ability to use kubectl commands without choosing a working directory.

## Version 1.1.0 -

- **_Now available for Mac, Windows, and Linux_**

- **Cluster Metrics Visualizer:**
  Easily sync your Kaptn workspace to Grafana and Prometheus to allow for clear and real-time visualization of your clusters' health. Utilize our quick set-up if you are not already connected, and consider Kaptn your only stop for working with and monitoring your Kubernetes clusters.

- **Instant Help Desk:**
  Get help information on demand and at the click of a button with the Instant Help Desk. Now you can get more info about any command or type without leaving the command line, and losing the code you've already written.

- **Kaptn Learning Center:**
  Inside the Easy Setup page you can now find the Learning Center with resources you need to learn Kubernetes. You can follow tutorials, read articles and documentation, and master Kubernetes faster than ever.

- **Light/Dark Mode:**
  Whether it's eye strain, or just personal preference, we know engineers can be selective about their work environments. So we created a Light/Dark mode that allows you to work with your favorite color combination. Now you can focus on coding with no distractions to your workflow.

This update also includes various bugs fixes, including:

- Bug where kubectl commands could not be used on some Mac operating systems.
