# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

We provide security updates for the latest minor version. Older versions
may receive fixes at our discretion.

## Reporting a Vulnerability

**Please do not open a public issue for security vulnerabilities.**

Send a private report to **security@maison.example** with:

1. A clear description of the vulnerability and its impact.
2. Steps to reproduce, including a proof-of-concept if available.
3. Affected version(s) and commit SHA(s).
4. Your name / handle (optional) for credit in the advisory.

You should receive an acknowledgement within **3 business days**. We aim
to triage and respond with a fix timeline within **10 business days**.

## Disclosure Process

- We follow a coordinated disclosure model.
- We will work with you to confirm the issue, develop a fix, and agree on
  a public disclosure date.
- Once a fix is released, we will publish a security advisory on GitHub
  and credit the reporter (unless they prefer to remain anonymous).

## Scope

The following are **in scope**:

- Authentication and authorization flaws in `app/(auth)` and `proxy.ts`.
- Payment or order-flow logic in `app/checkout`, `app/api/checkout/*`,
  and `app/api/webhooks/stripe`.
- Input validation / injection in server actions and API routes.
- XSS, CSRF, or open-redirect bugs that bypass our defenses.
- Sensitive data exposure in `data/`, `.env`, or build artifacts.

The following are **out of scope**:

- Denial of service via large file uploads or rate-limit evasion.
- Issues requiring a compromised admin/employee account.
- Self-XSS that requires the victim to paste content into the devtools.
- Theoretical vulnerabilities without a working proof of concept.

## Safe Harbor

We will not pursue legal action against researchers who:

- Make a good-faith effort to avoid privacy violations and disruption.
- Only interact with accounts they own or have explicit permission to test.
- Stop testing immediately if they encounter user data and report it to us.
- Do not exploit a vulnerability beyond what is necessary to demonstrate it.

## Acknowledgements

We are grateful to the security community. Contributors who report
verified issues will be listed in the release notes (with their consent).
