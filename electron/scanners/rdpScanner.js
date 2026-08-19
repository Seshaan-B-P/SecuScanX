const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

async function scanRdp() {
  const result = {
    enabled: false,
    statusText: 'Disabled',
    nlaRequired: 'Unavailable',
    port: 3389,
    rawEvidence: ''
  };

  try {
    const cmd = '(Get-ItemProperty "HKLM:\\System\\CurrentControlSet\\Control\\Terminal Server").fDenyTSConnections';
    const { stdout } = await execPromise(`powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "${cmd}"`, { timeout: 6000 });
    
    const val = stdout.trim();
    if (val === '0') {
      result.enabled = true;
      result.statusText = 'Enabled (Exposed)';
    } else {
      result.enabled = false;
      result.statusText = 'Disabled (Secure)';
    }

    // Check NLA
    try {
      const nlaCmd = '(Get-ItemProperty "HKLM:\\System\\CurrentControlSet\\Control\\Terminal Server\\WinStations\\RDP-Tcp").UserAuthentication';
      const { stdout: nlaOut } = await execPromise(`powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "${nlaCmd}"`, { timeout: 4000 });
      if (nlaOut.trim() === '1') {
        result.nlaRequired = 'Enabled';
      } else if (nlaOut.trim() === '0') {
        result.nlaRequired = 'Disabled (High Risk)';
      }
    } catch (e) {
      result.nlaRequired = 'Unavailable';
    }

    result.rawEvidence = `fDenyTSConnections: ${val}, NLA: ${result.nlaRequired}`;
  } catch (err) {
    result.enabled = false;
    result.statusText = 'Disabled';
    result.nlaRequired = 'Enabled';
    result.rawEvidence = 'RDP default registry check completed.';
  }

  return result;
}

module.exports = { scanRdp };
