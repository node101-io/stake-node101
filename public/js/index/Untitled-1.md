## GitHub Copilot Chat

- Extension Version: 0.22.4 (prod)
- VS Code: vscode/1.95.3
- OS: Mac

## Network

User Settings:
```json
  "github.copilot.advanced": {
    "debug.useElectronFetcher": true,
    "debug.useNodeFetcher": false
  }
```

Connecting to https://api.github.com:
- DNS ipv4 Lookup: 140.82.121.6 (31 ms)
- DNS ipv6 Lookup: ::ffff:140.82.121.6 (1 ms)
- Electron Fetcher (configured): HTTP 200 (387 ms)
- Node Fetcher: HTTP 200 (144 ms)
- Helix Fetcher: HTTP 200 (307 ms)

Connecting to https://api.individual.githubcopilot.com/_ping:
- DNS ipv4 Lookup: 140.82.113.22 (5 ms)
- DNS ipv6 Lookup: ::ffff:140.82.113.22 (1 ms)
- Electron Fetcher (configured): HTTP 200 (392 ms)
- Node Fetcher: HTTP 200 (403 ms)
- Helix Fetcher: HTTP 200 (382 ms)

## Documentation

In corporate networks: [Troubleshooting firewall settings for GitHub Copilot](https://docs.github.com/en/copilot/troubleshooting-github-copilot/troubleshooting-firewall-settings-for-github-copilot).