import { Award, Download, Calendar } from 'lucide-react';

export function Certificates() {
  const mockCertificates = [
    {
      id: 'cert-1',
      title: 'HIPAA Information Security & Privacy Regulations',
      issuedDate: '2026-06-15',
      expiryDate: '2027-06-15',
      score: '100%',
      verifiedId: 'SF-HIPAA-78392',
    },
  ];

  const triggerDownload = (title: string, id: string) => {
    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
        <rect width="800" height="600" fill="#0b1329" />
        <rect x="20" y="20" width="760" height="560" fill="none" stroke="#0284c7" stroke-width="4" />
        <rect x="30" y="30" width="740" height="540" fill="none" stroke="#64748b" stroke-width="1" />
        <text x="400" y="120" font-family="'Inter', sans-serif" font-size="24" fill="#38bdf8" text-anchor="middle" font-weight="bold" letter-spacing="4">NEXARA GROUP</text>
        <text x="400" y="200" font-family="'Inter', sans-serif" font-size="36" fill="#ffffff" text-anchor="middle" font-weight="bold">CERTIFICATE OF COMPLETION</text>
        <text x="400" y="250" font-family="'Inter', sans-serif" font-size="16" fill="#64748b" text-anchor="middle">This is proudly presented to the employee for successfully passing the course</text>
        <text x="400" y="320" font-family="'Inter', sans-serif" font-size="28" fill="#10b981" text-anchor="middle" font-weight="bold">${title}</text>
        <text x="400" y="380" font-family="'Inter', sans-serif" font-size="14" fill="#64748b" text-anchor="middle">Verification ID: ${id}</text>
        <line x1="250" y1="460" x2="550" y2="460" stroke="#64748b" stroke-width="1" />
        <text x="400" y="490" font-family="'Inter', sans-serif" font-size="14" fill="#ffffff" text-anchor="middle">Authorized by Nexara Compliance Board</text>
      </svg>
    `;
    
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SkillForge_Certificate_${title.replace(/\s+/g, '_')}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-white">Your Earned Credentials</h2>
        <p className="text-sm text-slate-400">View and download your official compliance certifications.</p>
      </div>

      {mockCertificates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockCertificates.map((cert) => (
            <div
              key={cert.id}
              className="bg-nexara-navy/30 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden flex flex-col justify-between"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-nexara-accent/10 to-transparent pointer-events-none"></div>
              
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-nexara-accent/10 border border-nexara-accent/30 text-nexara-light">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white leading-tight">{cert.title}</h3>
                    <span className="text-[10px] text-slate-500 font-mono">Verification: {cert.verifiedId}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-slate-900/40 p-4 rounded-xl border border-slate-850/60 mb-6 text-xs">
                  <div>
                    <span className="text-slate-500 block mb-1">Issued Date</span>
                    <span className="text-slate-200 font-semibold flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {cert.issuedDate}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-1">Expiry Date</span>
                    <span className="text-slate-200 font-semibold flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {cert.expiryDate}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => triggerDownload(cert.title, cert.verifiedId)}
                className="w-full bg-slate-800 hover:bg-slate-750 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <Download className="w-4 h-4" />
                Download Certificate (SVG)
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-nexara-navy/10 border border-slate-850 rounded-2xl p-12 text-center">
          <Award className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h4 className="font-semibold text-white mb-1">No Certificates Issued</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You haven't completed any certified training modules yet. Complete all chapters of an active course to trigger evaluation.
          </p>
        </div>
      )}
    </div>
  );
}
