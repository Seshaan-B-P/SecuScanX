export const SECURITY_RULES = [
  // 1. FIREWALL RULES
  {
    id: "SEC-FW-001",
    category: "Firewall",
    title: "Public Windows Firewall Profile Disabled",
    severity: "Critical",
    scoreImpact: 20,
    description: "The Windows Firewall Public profile is currently turned off. This leaves the system vulnerable to unauthorized incoming network connections from public or untrusted networks.",
    recommendation: "Enable the Public Firewall profile immediately to block unauthorized incoming traffic.",
    verification: "Run 'Get-NetFirewallProfile -Profile Public' and verify 'Enabled' is set to True.",
    remediationCmd: "Set-NetFirewallProfile -Profile Public -Enabled True",
    affectedComponent: "Windows Defender Firewall Service",
    check: (data) => {
      if (data.firewallInfo?.publicProfile === 'Disabled') {
        return {
          evidence: "Public Profile Status: Disabled"
        };
      }
      return null;
    }
  },
  {
    id: "SEC-FW-002",
    category: "Firewall",
    title: "Domain or Private Firewall Profile Disabled",
    severity: "High",
    scoreImpact: 10,
    description: "One or more internal firewall profiles (Domain/Private) are disabled, reducing perimeter defenses against lateral movement within trusted network segments.",
    recommendation: "Re-enable Domain and Private firewall profiles.",
    verification: "Run 'Get-NetFirewallProfile' in PowerShell to inspect profile states.",
    remediationCmd: "Set-NetFirewallProfile -Profile Domain,Private -Enabled True",
    affectedComponent: "Windows Defender Firewall Service",
    check: (data) => {
      if (data.firewallInfo?.domainProfile === 'Disabled' || data.firewallInfo?.privateProfile === 'Disabled') {
        return {
          evidence: `Domain Profile: ${data.firewallInfo.domainProfile}, Private Profile: ${data.firewallInfo.privateProfile}`
        };
      }
      return null;
    }
  },

  // 2. DEFENDER & ANTIVIRUS RULES
  {
    id: "SEC-DEF-001",
    category: "Defender",
    title: "Microsoft Defender Real-Time Protection Disabled",
    severity: "Critical",
    scoreImpact: 20,
    description: "Real-Time Antivirus Protection is turned off. Malicious software and ransomware can execute without detection or automated intervention.",
    recommendation: "Turn on Microsoft Defender Real-Time Protection immediately.",
    verification: "Run 'Get-MpComputerStatus' and verify RealTimeProtectionEnabled is True.",
    remediationCmd: "Set-MpPreference -DisableRealtimeMonitoring $false",
    affectedComponent: "Microsoft Defender Antivirus Engine",
    check: (data) => {
      if (data.defenderInfo?.realTimeProtection === 'Disabled') {
        return {
          evidence: "Real-Time Monitoring: Disabled"
        };
      }
      return null;
    }
  },
  {
    id: "SEC-DEF-002",
    category: "Defender",
    title: "Antivirus Signatures Outdated",
    severity: "Medium",
    scoreImpact: 5,
    description: "The antivirus definition signatures on this system are more than 7 days old, leaving it vulnerable to newly discovered zero-day malware threats.",
    recommendation: "Trigger a Microsoft Defender signature update.",
    verification: "Run 'Update-MpSignature' and re-check signature date.",
    remediationCmd: "Update-MpSignature",
    affectedComponent: "Microsoft Defender Intelligence Definitions",
    check: (data) => {
      if (data.defenderInfo?.signaturesUpToDate?.includes('Outdated')) {
        return {
          evidence: data.defenderInfo.signaturesUpToDate
        };
      }
      return null;
    }
  },

  // 3. RDP RULES
  {
    id: "SEC-RDP-001",
    category: "RDP",
    title: "Remote Desktop (RDP) Service Enabled",
    severity: "High",
    scoreImpact: 10,
    description: "Remote Desktop Protocol (RDP) is enabled on port 3389. RDP is a primary target for brute-force attacks and credential dumping.",
    recommendation: "Disable RDP if remote administration is not required, or restrict access via VPN and firewall rules.",
    verification: "Inspect registry key HKLM:\\System\\CurrentControlSet\\Control\\Terminal Server fDenyTSConnections.",
    remediationCmd: "Set-ItemProperty -Path 'HKLM:\\System\\CurrentControlSet\\Control\\Terminal Server' -Name 'fDenyTSConnections' -Value 1",
    affectedComponent: "Remote Desktop Services (TermService)",
    check: (data) => {
      if (data.rdpInfo?.enabled) {
        return {
          evidence: "fDenyTSConnections: 0 (RDP Active on Port 3389)"
        };
      }
      return null;
    }
  },
  {
    id: "SEC-RDP-002",
    category: "RDP",
    title: "RDP Network Level Authentication (NLA) Disabled",
    severity: "Critical",
    scoreImpact: 20,
    description: "Network Level Authentication (NLA) is not enforced for Remote Desktop. Attackers can connect to the login screen without prior authentication, exposing the host to vulnerability exploits (e.g. BlueKeep).",
    recommendation: "Require NLA for all Remote Desktop connections.",
    verification: "Inspect RDP-Tcp UserAuthentication registry property.",
    remediationCmd: "(Get-WmiObject -class 'Win32_TSGeneralSetting' -Namespace 'root\\cimv2\\terminalservices' -Filter \"TerminalName='RDP-Tcp'\").SetUserAuthenticationRequired(1)",
    affectedComponent: "Remote Desktop Configuration",
    check: (data) => {
      if (data.rdpInfo?.enabled && data.rdpInfo?.nlaRequired === 'Disabled (High Risk)') {
        return {
          evidence: "UserAuthentication (NLA): Disabled"
        };
      }
      return null;
    }
  },

  // 4. USER SECURITY & ACCOUNTS
  {
    id: "SEC-USR-001",
    category: "User Security",
    title: "User Account Control (UAC) Disabled",
    severity: "Critical",
    scoreImpact: 20,
    description: "User Account Control (UAC) is turned off. Applications can execute administrative tasks without prompting the user, allowing silent malware elevation.",
    recommendation: "Re-enable UAC to notify when apps attempt changes to the workstation.",
    verification: "Verify EnableLUA registry DWORD value is set to 1.",
    remediationCmd: "Set-ItemProperty -Path 'HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\System' -Name 'EnableLUA' -Value 1",
    affectedComponent: "Windows User Account Control Policy",
    check: (data) => {
      if (data.sysInfo?.uacStatus?.includes('Disabled')) {
        return {
          evidence: `UAC Registry Status: ${data.sysInfo.uacStatus}`
        };
      }
      return null;
    }
  },
  {
    id: "SEC-USR-002",
    category: "User Security",
    title: "Built-in Guest Account Enabled",
    severity: "Medium",
    scoreImpact: 5,
    description: "The built-in Windows Guest account is active. Guest accounts provide unauthenticated access to system resources.",
    recommendation: "Disable the built-in Guest user account.",
    verification: "Run 'Get-LocalUser -Name Guest' and verify Enabled is False.",
    remediationCmd: "Disable-LocalUser -Name 'Guest'",
    affectedComponent: "Windows Local SAM Database",
    check: (data) => {
      const guest = (data.sysInfo?.localUsers || []).find(u => u.name.toLowerCase() === 'guest');
      if (guest && guest.enabled) {
        return {
          evidence: "Local Account 'Guest': Active / Enabled"
        };
      }
      return null;
    }
  },

  // 5. PATCH MANAGEMENT & UPDATES
  {
    id: "SEC-PAT-001",
    category: "Patch Management",
    title: "Windows Update Service Disabled or Stopped",
    severity: "High",
    scoreImpact: 10,
    description: "The Windows Update service (wuauserv) is stopped or disabled, preventing critical security patches from downloading.",
    recommendation: "Start and configure the Windows Update service to automatic startup.",
    verification: "Run 'Get-Service wuauserv' and ensure status is Running.",
    remediationCmd: "Set-Service -Name 'wuauserv' -StartupType Automatic; Start-Service -Name 'wuauserv'",
    affectedComponent: "Windows Update Service (wuauserv)",
    check: (data) => {
      if (data.updateInfo?.serviceStatus === 'Stopped' || data.updateInfo?.serviceStatus === 'Disabled') {
        return {
          evidence: `wuauserv Service Status: ${data.updateInfo.serviceStatus}`
        };
      }
      return null;
    }
  },

  // 6. NETWORK EXPOSURE
  {
    id: "SEC-NET-001",
    category: "Network Exposure",
    title: "Critical Port 445 (SMB File Sharing) Open & Listening",
    severity: "Critical",
    scoreImpact: 20,
    description: "Server Message Block (SMB) file sharing port 445 is actively listening on network interfaces. Exposed SMB services are high-severity vectors for worm replication and ransomware (e.g. EternalBlue).",
    recommendation: "Ensure port 445 is filtered by firewall on untrusted networks, or disable SMBv1 and unneeded file sharing.",
    verification: "Run 'Get-NetTCPConnection -LocalPort 445 -State Listen' to inspect socket bindings.",
    remediationCmd: "Set-SmbServerConfiguration -EnableSMB1Protocol $false -Force",
    affectedComponent: "Windows Server Message Block (SMB)",
    check: (data) => {
      const openSmb = (data.networkInfo?.listeningPorts || []).find(p => p.port === 445);
      if (openSmb) {
        return {
          evidence: `Port 445 TCP (${openSmb.process}) actively listening on interface.`
        };
      }
      return null;
    }
  },
  {
    id: "SEC-NET-002",
    category: "Network Exposure",
    title: "Windows RPC Endpoint Mapper (Port 135) Listening",
    severity: "High",
    scoreImpact: 10,
    description: "RPC Endpoint Mapper port 135 is listening. Attackers query RPC to enumerate available services and active local RPC endpoints.",
    recommendation: "Restrict RPC access to authorized management subnets using Windows Firewall.",
    verification: "Check listening status of TCP port 135 in Netstat or Get-NetTCPConnection.",
    remediationCmd: "New-NetFirewallRule -DisplayName 'Block External RPC' -Direction Inbound -LocalPort 135 -Protocol TCP -Action Block",
    affectedComponent: "Windows Remote Procedure Call (RPC)",
    check: (data) => {
      const openRpc = (data.networkInfo?.listeningPorts || []).find(p => p.port === 135);
      if (openRpc) {
        return {
          evidence: "Port 135 TCP (RPC Endpoint Mapper) actively listening."
        };
      }
      return null;
    }
  },

  // 7. OS SECURITY
  {
    id: "SEC-OS-001",
    category: "OS Security",
    title: "Process Running Under Administrator Privileges",
    severity: "Informational",
    scoreImpact: 0,
    description: "The assessment tool is currently running under administrative privileges. This permits full hardware and security policy inspection.",
    recommendation: "Maintain administrative access hygiene and avoid performing routine web browsing under elevated privileges.",
    verification: "Verify session token privilege levels.",
    remediationCmd: "N/A - Informational Notice",
    affectedComponent: "Local User Access Control Token",
    check: (data) => {
      if (data.sysInfo?.isAdmin) {
        return {
          evidence: `Current user '${data.sysInfo.currentUser}' has Administrator privileges.`
        };
      }
      return null;
    }
  },

  // 8. SERVICES & POLICIES
  {
    id: "SEC-SVC-001",
    category: "Services",
    title: "High Number of Listening Network Services",
    severity: "Medium",
    scoreImpact: 5,
    description: "More than 5 listening network ports were detected. Broad attack surface increases exposure to remote exploitation.",
    recommendation: "Audit active background services and close non-essential listening sockets.",
    verification: "Review active process listening list in Network Scanner module.",
    remediationCmd: "Stop-Service -Name <UnnecessaryServiceName>",
    affectedComponent: "Network Application Listeners",
    check: (data) => {
      const total = data.networkInfo?.totalListeningPorts || (data.networkInfo?.listeningPorts || []).length;
      if (total >= 5) {
        return {
          evidence: `${total} active listening ports detected on system.`
        };
      }
      return null;
    }
  }
];

export function runSecurityRuleEngine(scanData) {
  const findings = [];

  SECURITY_RULES.forEach(rule => {
    try {
      const result = rule.check(scanData);
      if (result) {
        findings.push({
          id: rule.id,
          category: rule.category,
          title: rule.title,
          severity: rule.severity,
          scoreImpact: rule.scoreImpact,
          description: rule.description,
          recommendation: rule.recommendation,
          verification: rule.verification,
          remediationCmd: rule.remediationCmd,
          affectedComponent: rule.affectedComponent,
          evidence: result.evidence || "Detected during security policy assessment.",
          status: 'Open'
        });
      }
    } catch (err) {
      console.error(`Rule execution error [${rule.id}]:`, err);
    }
  });

  return findings;
}
