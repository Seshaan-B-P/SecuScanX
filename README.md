# SecuScanX – Agent-less Windows Security Assessment System

Tagline: **Scan. Assess. Secure.**

SecuScanX (WinSecureX) is a desktop cybersecurity application designed for authorized security assessment of local Windows computers and workstations. Built with **Electron**, **React**, **Vite**, **Tailwind CSS**, and **Node.js**, SecuScanX operates entirely **agent-less**—it collects Windows configuration parameters and evaluates network exposures without installing background services or persistent agents on target systems.

---

## Key Features

1. **Agent-less System Information Collection**:
   - Gathers host computer name, Windows release, build number, OS architecture, CPU model, RAM memory usage, local user accounts, UAC status, and storage disk usage.
2. **System Security Scanner**:
   - Inspects Windows Firewall Domain, Private, and Public profile statuses.
   - Evaluates Microsoft Defender status, Real-Time Protection state, and antivirus signature freshness.
   - Checks Remote Desktop Protocol (RDP) state and Network Level Authentication (NLA) enforcement.
   - Audits Windows Update service and installed security patches.
3. **Network Exposure Scanner**:
   - Inspects local IPv4 interface addresses, default gateways, and ARP cache tables.
   - Enumerates listening TCP ports and flags high-risk network services (SMB 445, RDP 3389, RPC 135).
4. **Vulnerability Rule Engine & Scoring**:
   - JavaScript rule engine evaluating 9 security categories: OS Security, User Security, Patch Management, Firewall, Defender, RDP, Network Exposure, Services, and Security Policies.
   - Configurable risk scoring starting from 100 baseline down to 0, mapping scores to ratings (*Excellent*, *Good*, *Moderate*, *Poor*, *Critical*).
5. **Remediation Center**:
   - Detailed breakdown for each finding: **Problem**, **Risk**, **Recommendation**, and **Verification**.
   - Copyable administrative PowerShell commands for manual remediation. No automatic setting modifications.
6. **Scan History & PDF/HTML Reports**:
   - Local JSON/SQLite persistence storing scan records and score trend charts.
   - Downloadable PDF and HTML executive audit reports.

---

## Technology Stack

- **Frontend**: React.js 18, Vite, React Router v6, Tailwind CSS, Lucide React Icons, Recharts, Framer Motion
- **Desktop & System Access**: Electron.js, Node.js `child_process`, `os`, `fs`
- **Scripting & Commands**: PowerShell (`Get-CimInstance`, `Get-NetFirewallProfile`, `Get-MpComputerStatus`, `Get-NetTCPConnection`, `netstat`)
- **Reporting**: jsPDF, html2canvas

---

## Architecture Overview

```text
Electron Desktop Application
        │
        ├── React Frontend (Vite + Tailwind CSS + Lucide + Recharts)
        │
        ├── Node.js Main Process (Electron IPC + Preload ContextBridge)
        │
        ├── PowerShell & Safe Windows Read-Only Commands
        │
        └── Scanner Engine (Firewall, Defender, RDP, Updates, Network)
```

---

## Prerequisites & Installation

### Requirements
- **OS**: Windows 10 / Windows 11 / Windows Server
- **Node.js**: v18.0.0 or higher
- **NPM**: v9.0.0 or higher

### Installation

```bash
# Clone or open project directory
cd d:\Projects\WinSecureX

# Install all package dependencies
npm install
```

---

## Development & Build Commands

```bash
# Start Vite development server (Browser Mode)
npm run dev

# Start Full Electron Desktop Application in Development Mode
npm run electron:dev

# Build Production Assets
npm run build

# Package Electron Application Bundle
npm run electron:build
```

---

## Administrator Permission Notes & Error Handling

- **Elevated Privileges**: Certain deep Windows security policies (such as `Get-MpComputerStatus` or `Get-LocalUser`) require Administrator privileges.
- **Graceful Fallback**: If a command is restricted or fails due to permissions, SecuScanX displays **`Unavailable`** or uses safe fallback baselines without crashing.
- **Read-Only Guarantee**: SecuScanX never alters system settings, passwords, or registry keys automatically.

---

## License & Security Considerations

Designed strictly for authorized security assessments and workstation compliance auditing on authorized Windows systems.
