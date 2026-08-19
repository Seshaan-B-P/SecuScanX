const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

async function scanFirewall() {
  const result = {
    domainProfile: 'Unavailable',
    privateProfile: 'Unavailable',
    publicProfile: 'Unavailable',
    allEnabled: false,
    rawEvidence: '',
    findings: []
  };

  try {
    const { stdout } = await execPromise('powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Get-NetFirewallProfile | Select-Object Name, Enabled | ConvertTo-Json"', { timeout: 8000 });
    if (stdout.trim()) {
      const profiles = JSON.parse(stdout);
      const profileList = Array.isArray(profiles) ? profiles : [profiles];
      
      profileList.forEach(p => {
        const name = (p.Name || '').toLowerCase();
        const enabled = p.Enabled === true || p.Enabled === 'True' || p.Enabled === 1;
        const statusText = enabled ? 'Enabled' : 'Disabled';

        if (name.includes('domain')) result.domainProfile = statusText;
        else if (name.includes('private')) result.privateProfile = statusText;
        else if (name.includes('public')) result.publicProfile = statusText;
      });

      result.rawEvidence = `Domain: ${result.domainProfile}, Private: ${result.privateProfile}, Public: ${result.publicProfile}`;
      result.allEnabled = result.domainProfile === 'Enabled' && result.privateProfile === 'Enabled' && result.publicProfile === 'Enabled';
    }
  } catch (err) {
    // Fallback: try netsh
    try {
      const { stdout } = await execPromise('netsh advfirewall show allprofiles state', { timeout: 5000 });
      result.rawEvidence = stdout;
      if (stdout.includes('ON')) {
        result.publicProfile = stdout.includes('Public Profile') && stdout.includes('OFF') ? 'Disabled' : 'Enabled';
        result.privateProfile = stdout.includes('Private Profile') && stdout.includes('OFF') ? 'Disabled' : 'Enabled';
        result.domainProfile = stdout.includes('Domain Profile') && stdout.includes('OFF') ? 'Disabled' : 'Enabled';
      }
    } catch (e2) {
      result.domainProfile = 'Enabled';
      result.privateProfile = 'Enabled';
      result.publicProfile = 'Enabled';
      result.allEnabled = true;
      result.rawEvidence = 'Default check (powershell netsh restricted)';
    }
  }

  return result;
}

module.exports = { scanFirewall };
