import React from 'react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import ScanProgressModal from '../components/scanner/ScanProgressModal';

export default function MainLayout({ 
  children, 
  onStartScan, 
  isAdmin, 
  isDemoMode, 
  setIsDemoMode, 
  scanProgress, 
  isScanning, 
  currentScanType 
}) {
  return (
    <div className="flex min-h-screen bg-[#070b14] text-slate-100 selection:bg-cyan-500 selection:text-slate-900">
      {/* Sidebar Navigation */}
      <Sidebar 
        onStartScan={onStartScan} 
        isAdmin={isAdmin} 
        currentScan={{ scanning: isScanning }} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          onStartScan={onStartScan} 
          isDemoMode={isDemoMode} 
          setIsDemoMode={setIsDemoMode} 
        />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Scan Progress Stepper Overlay */}
      <ScanProgressModal 
        isOpen={isScanning} 
        progress={scanProgress} 
        scanType={currentScanType} 
      />
    </div>
  );
}
