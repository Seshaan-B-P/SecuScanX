import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export function generateHTMLReport(scanResult) {
  const dateStr = scanResult.dateFormatted || new Date().toLocaleDateString();
  const sys = scanResult.systemInfo || {};
  const findings = scanResult.findings || [];

  const findingsRows = findings.map((f, i) => `
    <tr style="border-bottom: 1px solid #1e293b; background: ${i % 2 === 0 ? '#0f172a' : '#070b14'};">
      <td style="padding: 10px; font-family: monospace; color: #06b6d4; font-weight: bold;">${f.id}</td>
      <td style="padding: 10px; font-weight: 600; color: #f8fafc;">${f.title}</td>
      <td style="padding: 10px; color: #94a3b8;">${f.category}</td>
      <td style="padding: 10px;">
        <span style="padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: bold; display: inline-block; 
          background: ${f.severity === 'Critical' ? '#dc2626' : f.severity === 'High' ? '#ea580c' : f.severity === 'Medium' ? '#d97706' : '#0284c7'}; color: #fff;">
          ${f.severity}
        </span>
      </td>
      <td style="padding: 10px; color: #cbd5e1; font-size: 13px;">${f.recommendation}</td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>SecuScanX Security Assessment Report - ${scanResult.id}</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #070b14; color: #e2e8f0; margin: 0; padding: 40px; }
    .container { max-width: 1000px; margin: 0 auto; background: #0f172a; border: 1px solid #1e293b; border-radius: 12px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    .header { border-bottom: 2px solid #06b6d4; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
    .title { color: #06b6d4; font-size: 28px; font-weight: 800; margin: 0; text-transform: uppercase; letter-spacing: 1px; }
    .subtitle { color: #94a3b8; font-size: 14px; margin-top: 4px; }
    .tagline { color: #10b981; font-weight: 600; font-size: 12px; letter-spacing: 2px; }
    .score-card { background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border: 1px solid #334155; border-radius: 10px; padding: 25px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
    .score-number { font-size: 48px; font-weight: 900; color: ${scanResult.ratingHex || '#06b6d4'}; }
    .section-title { color: #06b6d4; font-size: 18px; font-weight: 700; border-left: 4px solid #06b6d4; padding-left: 12px; margin: 30px 0 15px 0; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; }
    .info-item { background: #070b14; padding: 12px 16px; border-radius: 6px; border: 1px solid #1e293b; font-size: 14px; }
    .info-label { color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; }
    .info-val { color: #f8fafc; font-weight: 600; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; margin-top: 15px; }
    th { background: #1e293b; color: #38bdf8; text-align: left; padding: 12px; font-size: 13px; text-transform: uppercase; }
    .footer { margin-top: 50px; border-top: 1px solid #1e293b; pt: 20px; text-align: center; color: #64748b; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div>
        <h1 class="title">SecuScanX</h1>
        <div class="subtitle">Agent-less Windows Security Assessment System</div>
      </div>
      <div style="text-align: right;">
        <div class="tagline">SCAN. ASSESS. SECURE.</div>
        <div style="color: #94a3b8; font-size: 12px; margin-top: 6px;">Report ID: ${scanResult.id}</div>
        <div style="color: #94a3b8; font-size: 12px;">Date: ${dateStr}</div>
      </div>
    </div>

    <!-- Executive Summary -->
    <div class="section-title">Executive Summary</div>
    <div class="score-card">
      <div>
        <div style="color: #94a3b8; font-size: 14px; font-weight: 600;">OVERALL SECURITY SCORE</div>
        <div style="color: #cbd5e1; font-size: 14px; margin-top: 4px;">Rating: <strong style="color: ${scanResult.ratingHex};">${scanResult.rating}</strong></div>
        <div style="color: #64748b; font-size: 12px; margin-top: 6px;">Total Findings: ${scanResult.totalFindings} (${scanResult.critical} Critical, ${scanResult.high} High, ${scanResult.medium} Medium, ${scanResult.low} Low)</div>
      </div>
      <div style="text-align: center;">
        <div class="score-number">${scanResult.score}</div>
        <div style="color: #94a3b8; font-size: 12px; font-weight: bold;">OUT OF 100</div>
      </div>
    </div>

    <!-- Target Workstation Information -->
    <div class="section-title">Target Information</div>
    <div class="grid">
      <div class="info-item"><div class="info-label">Computer Name</div><div class="info-val">${sys.computerName || 'N/A'}</div></div>
      <div class="info-item"><div class="info-label">Windows Version</div><div class="info-val">${sys.windowsVersion || 'N/A'}</div></div>
      <div class="info-item"><div class="info-label">Build & Architecture</div><div class="info-val">Build ${sys.buildNumber || 'N/A'} (${sys.architecture || 'x64'})</div></div>
      <div class="info-item"><div class="info-label">Current User</div><div class="info-val">${sys.currentUser || 'N/A'} (${sys.isAdmin ? 'Administrator' : 'Standard User'})</div></div>
      <div class="info-item"><div class="info-label">CPU</div><div class="info-val">${sys.cpu || 'N/A'}</div></div>
      <div class="info-item"><div class="info-label">RAM & Storage</div><div class="info-val">${sys.totalRAM || 'N/A'} RAM | ${scanResult.networkInfo?.localIP || 'Local IP'}</div></div>
    </div>

    <!-- Vulnerability Findings Summary -->
    <div class="section-title">Detailed Vulnerability Findings</div>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Finding Title</th>
          <th>Category</th>
          <th>Severity</th>
          <th>Remediation Recommendation</th>
        </tr>
      </thead>
      <tbody>
        ${findingsRows.length > 0 ? findingsRows : '<tr><td colspan="5" style="padding: 20px; text-align: center; color: #10b981;">No security vulnerabilities detected. System meets security baseline!</td></tr>'}
      </tbody>
    </table>

    <div class="footer">
      Generated by <strong>SecuScanX</strong> – Agent-less Windows Security Assessment System | Confidential Security Audit Report
    </div>
  </div>
</body>
</html>
  `;
}

export async function exportReportToPDF(scanResult) {
  // If running in Electron, use HTML container render + jsPDF output
  const htmlContent = generateHTMLReport(scanResult);

  // Create temporary offscreen container for PDF rendering
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '-9999px';
  container.style.width = '900px';
  container.innerHTML = htmlContent;
  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      backgroundColor: '#070b14',
      useCORS: true
    });

    document.body.removeChild(container);

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

    const fileName = `SecuScanX-Report-${scanResult.id}.pdf`;

    if (window.electronAPI && window.electronAPI.saveReportFile) {
      const pdfArrayBuffer = pdf.output('arraybuffer');
      await window.electronAPI.saveReportFile({
        content: pdfArrayBuffer,
        fileName,
        fileType: 'pdf'
      });
    } else {
      pdf.save(fileName);
    }
  } catch (err) {
    console.error('PDF export error, falling back to direct PDF structure:', err);
    document.body.removeChild(container);
    downloadFallbackPDF(scanResult);
  }
}

function downloadFallbackPDF(scanResult) {
  const doc = new jsPDF();
  doc.setFontSize(20);
  doc.setTextColor(6, 182, 212);
  doc.text('SecuScanX Security Report', 14, 20);
  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184);
  doc.text(`Report ID: ${scanResult.id} | Date: ${scanResult.dateFormatted || new Date().toLocaleDateString()}`, 14, 28);
  
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text(`Overall Security Score: ${scanResult.score} / 100 (${scanResult.rating})`, 14, 40);

  doc.setFontSize(11);
  doc.setTextColor(203, 213, 225);
  let y = 55;
  doc.text('Vulnerability Findings:', 14, y);
  y += 8;

  (scanResult.findings || []).forEach(f => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    doc.setFontSize(10);
    doc.setTextColor(6, 182, 212);
    doc.text(`[${f.id}] [${f.severity}] ${f.title}`, 14, y);
    y += 6;
    doc.setTextColor(148, 163, 184);
    doc.text(`Category: ${f.category} | Rec: ${f.recommendation.slice(0, 70)}...`, 14, y);
    y += 8;
  });

  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('Generated by SecuScanX - Agent-less Windows Security Assessment System', 14, 285);

  doc.save(`SecuScanX-Report-${scanResult.id}.pdf`);
}

export function downloadHTMLReportFile(scanResult) {
  const html = generateHTMLReport(scanResult);
  const fileName = `SecuScanX-Report-${scanResult.id}.html`;

  if (window.electronAPI && window.electronAPI.saveReportFile) {
    window.electronAPI.saveReportFile({
      content: html,
      fileName,
      fileType: 'html'
    });
  } else {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  }
}
