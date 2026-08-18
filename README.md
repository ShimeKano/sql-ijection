# StoryGuard

Modular web security lab scanner for applications you own or are explicitly authorized to test.

## Safety boundary

- Loopback targets (`localhost`, `127.0.0.1`, `::1`) are allowed by default.
- Public targets require `--authorized` and should be your own lab/tunnel.
- v0.1 is non-destructive: discovery and low-impact checks only.
- It does not perform credential attacks, database writes, privilege escalation, or destructive actions.

## Run

```bash
npm install
npm run scan -- http://127.0.0.1:5000
npm run scan -- https://your-authorized-lab.example --authorized
```

## Modules

- target validation
- HTTP client
- crawler/discovery
- security headers
- reflected-input detection
- error disclosure heuristics
- cookie flags
- terminal report

The design intentionally keeps checks separate so future authorized lab checks can be added without turning the CLI into a monolith.
