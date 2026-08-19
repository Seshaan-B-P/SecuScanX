const fs = require('fs');
const path = require('path');
const { app } = require('electron');

class ScanDatabase {
  constructor() {
    // Determine database storage file path
    const userDataPath = app ? app.getPath('userData') : process.cwd();
    this.dbPath = path.join(userDataPath, 'secuscanx_history.json');
    this.ensureDatabaseExists();
  }

  ensureDatabaseExists() {
    if (!fs.existsSync(this.dbPath)) {
      try {
        fs.writeFileSync(this.dbPath, JSON.stringify({ scans: [] }, null, 2), 'utf8');
      } catch (err) {
        console.error('Failed to initialize scan history file:', err);
      }
    }
  }

  getScans() {
    try {
      this.ensureDatabaseExists();
      const raw = fs.readFileSync(this.dbPath, 'utf8');
      const data = JSON.parse(raw);
      return data.scans || [];
    } catch (err) {
      console.error('Error reading scan history:', err);
      return [];
    }
  }

  saveScan(scanRecord) {
    try {
      const scans = this.getScans();
      const newScan = {
        id: scanRecord.id || `SCAN-${Date.now()}`,
        timestamp: scanRecord.timestamp || new Date().toISOString(),
        dateFormatted: new Date().toLocaleDateString(),
        timeFormatted: new Date().toLocaleTimeString(),
        type: scanRecord.type || 'Full Scan',
        score: scanRecord.score ?? 100,
        rating: scanRecord.rating || 'Excellent',
        duration: scanRecord.duration || '5s',
        totalFindings: scanRecord.totalFindings || 0,
        critical: scanRecord.critical || 0,
        high: scanRecord.high || 0,
        medium: scanRecord.medium || 0,
        low: scanRecord.low || 0,
        info: scanRecord.info || 0,
        systemInfo: scanRecord.systemInfo || {},
        findings: scanRecord.findings || []
      };

      scans.unshift(newScan); // add to top
      fs.writeFileSync(this.dbPath, JSON.stringify({ scans }, null, 2), 'utf8');
      return newScan;
    } catch (err) {
      console.error('Error saving scan:', err);
      return null;
    }
  }

  clearHistory() {
    try {
      fs.writeFileSync(this.dbPath, JSON.stringify({ scans: [] }, null, 2), 'utf8');
      return true;
    } catch (err) {
      return false;
    }
  }
}

module.exports = new ScanDatabase();
