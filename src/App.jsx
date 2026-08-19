import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';

import Dashboard from './pages/Dashboard';
import SystemInfo from './pages/SystemInfo';
import SystemScanner from './pages/SystemScanner';
import NetworkScanner from './pages/NetworkScanner';
import Vulnerabilities from './pages/Vulnerabilities';
import RiskAssessment from './pages/RiskAssessment';
import Remediation from './pages/Remediation';
import ScanHistory from './pages/ScanHistory';
import Reports from './pages/Reports';
import SettingsPage from './pages/Settings';

import { executeScanWorkflow, getLocalBrowserHistory } from './services/scanEngine';

export default function App() {
  const [currentScan, setCurrentScan] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState({ percent: 0, message: '' });
  const [currentScanType, setCurrentScanType] = useState('Full Scan');
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isAdmin, setIsAdmin] = useState(true);

  // Load history & admin privilege status on initial launch
  useEffect(() => {
    async function initApp() {
      // Check Admin
      if (window.electronAPI && window.electronAPI.checkAdminPrivileges) {
        try {
          const adminStatus = await window.electronAPI.checkAdminPrivileges();
          setIsAdmin(adminStatus);
        } catch (e) {
          setIsAdmin(true);
        }
      }

      // Load History
      let historyRecords = [];
      if (window.electronAPI && window.electronAPI.getScanHistory) {
        try {
          historyRecords = await window.electronAPI.getScanHistory();
        } catch (e) {
          historyRecords = getLocalBrowserHistory();
        }
      } else {
        historyRecords = getLocalBrowserHistory();
      }

      setScanHistory(historyRecords);

      // If history exists, populate current scan with latest record
      if (historyRecords.length > 0) {
        setCurrentScan(historyRecords[0]);
      }
    }

    initApp();
  }, []);

  const handleStartScan = async (scanType = 'Full Scan') => {
    if (isScanning) return;
    setIsScanning(true);
    setCurrentScanType(scanType);
    setScanProgress({ percent: 5, message: `Initializing ${scanType}...` });

    try {
      const result = await executeScanWorkflow({
        scanType,
        isDemoMode,
        onProgress: (progressData) => {
          setScanProgress(progressData);
        }
      });

      setCurrentScan(result);
      setScanHistory(prev => [result, ...prev]);
    } catch (err) {
      console.error('Scan Failed:', err);
    } finally {
      setTimeout(() => {
        setIsScanning(false);
      }, 500);
    }
  };

  const handleClearHistory = async () => {
    if (window.electronAPI && window.electronAPI.clearScanHistory) {
      await window.electronAPI.clearScanHistory();
    }
    localStorage.removeItem('secuscanx_history');
    setScanHistory([]);
    setCurrentScan(null);
  };

  return (
    <BrowserRouter>
      <MainLayout
        onStartScan={handleStartScan}
        isAdmin={isAdmin}
        isDemoMode={isDemoMode}
        setIsDemoMode={setIsDemoMode}
        scanProgress={scanProgress}
        isScanning={isScanning}
        currentScanType={currentScanType}
      >
        <Routes>
          <Route path="/" element={<Dashboard currentScan={currentScan} scanHistory={scanHistory} onStartScan={handleStartScan} />} />
          <Route path="/system-info" element={<SystemInfo systemInfo={currentScan?.systemInfo} networkInfo={currentScan?.networkInfo} />} />
          <Route path="/system-scanner" element={<SystemScanner currentScan={currentScan} onStartScan={handleStartScan} />} />
          <Route path="/network-scanner" element={<NetworkScanner networkInfo={currentScan?.networkInfo} onStartScan={handleStartScan} />} />
          <Route path="/vulnerabilities" element={<Vulnerabilities currentScan={currentScan} />} />
          <Route path="/risk-assessment" element={<RiskAssessment currentScan={currentScan} />} />
          <Route path="/remediation" element={<Remediation currentScan={currentScan} />} />
          <Route path="/history" element={<ScanHistory scanHistory={scanHistory} onSelectScan={setCurrentScan} onClearHistory={handleClearHistory} />} />
          <Route path="/reports" element={<Reports currentScan={currentScan} />} />
          <Route path="/settings" element={<SettingsPage isDemoMode={isDemoMode} setIsDemoMode={setIsDemoMode} />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}
