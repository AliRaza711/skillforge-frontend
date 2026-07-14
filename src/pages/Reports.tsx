import { Download, FileText, CheckCircle, Clock } from 'lucide-react';
import { useToastStore } from '../store/useToastStore';

export function Reports() {
  const { addToast } = useToastStore();
  const reports = [
    { id: '1', title: 'Q2 Global Compliance Audit Summary', type: 'PDF Report', date: '2026-07-01', size: '2.4 MB' },
    { id: '2', title: 'SOC2 Scope Audit Verification Log', type: 'Excel Spreadsheet', date: '2026-06-20', size: '1.1 MB' },
    { id: '3', title: 'Anti-Corruption Certifications Audit Record', type: 'CSV Audit Log', date: '2026-06-15', size: '890 KB' },
  ];

  const handleDownload = (title: string) => {
    addToast(`Initiated download of report: "${title}"`, 'success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-white">Compliance Reporting</h2>
        <p className="text-sm text-slate-400">Generate, compile, and download formal compliance audit records.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Metric Cards */}
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex items-center gap-3 text-nexara-light mb-4">
            <CheckCircle className="w-6 h-6" />
            <h4 className="font-bold text-white text-sm">Audit Preparedness Score</h4>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-white">96%</span>
            <span className="text-xs text-slate-500 block mt-1">Excellent compliance standing for ISO 27001 scope.</span>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex items-center gap-3 text-amber-500 mb-4">
            <Clock className="w-6 h-6" />
            <h4 className="font-bold text-white text-sm">Average Completion Time</h4>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-white">12 Days</span>
            <span className="text-xs text-slate-500 block mt-1">Average training period from assignment to certificate.</span>
          </div>
        </div>
      </div>

      <div className="bg-nexara-navy/30 border border-slate-800/80 rounded-2xl overflow-hidden backdrop-blur-md">
        <div className="p-5 border-b border-slate-850 bg-slate-900/20 flex items-center justify-between">
          <h3 className="font-bold text-white text-sm">Compiled Audit Reports</h3>
        </div>
        <div className="divide-y divide-slate-850">
          {reports.map((rep) => (
            <div key={rep.id} className="p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-slate-400" />
                <div>
                  <h4 className="font-semibold text-white text-xs leading-normal">{rep.title}</h4>
                  <span className="text-[10px] text-slate-500 font-mono">{rep.type} • {rep.size} • Published: {rep.date}</span>
                </div>
              </div>

              <button
                onClick={() => handleDownload(rep.title)}
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-white transition-all"
                title="Download Report"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
