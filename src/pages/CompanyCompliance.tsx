import { useState } from 'react';
import { 
  ShieldAlert, 
  Download, 
  AlertTriangle, 
  Clock,
  CheckCircle,
  Building,
  TrendingUp
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { useToastStore } from '../store/useToastStore';

// Department vs Course Mock Data
const DEPARTMENT_COMPLIANCE = [
  { department: 'Engineering', completionRate: 88, targetRate: 100 },
  { department: 'Finance & Sales', completionRate: 94, targetRate: 100 },
  { department: 'HR & Legal', completionRate: 100, targetRate: 100 },
  { department: 'Product Ops', completionRate: 72, targetRate: 100 },
  { department: 'Operations', completionRate: 64, targetRate: 100 },
];

// Heatmap Matrix: Department vs Course completion percentage
const HEATMAP_DATA = [
  { dept: 'Engineering', course: 'SOC2 Cybersecurity', rate: 92 },
  { dept: 'Engineering', course: 'Anti-Bribery', rate: 84 },
  { dept: 'Engineering', course: 'HIPAA Security', rate: 88 },
  
  { dept: 'Finance & Sales', course: 'SOC2 Cybersecurity', rate: 96 },
  { dept: 'Finance & Sales', course: 'Anti-Bribery', rate: 92 },
  { dept: 'Finance & Sales', course: 'HIPAA Security', rate: 94 },
  
  { dept: 'HR & Legal', course: 'SOC2 Cybersecurity', rate: 100 },
  { dept: 'HR & Legal', course: 'Anti-Bribery', rate: 100 },
  { dept: 'HR & Legal', course: 'HIPAA Security', rate: 100 },
  
  { dept: 'Product Ops', course: 'SOC2 Cybersecurity', rate: 68 },
  { dept: 'Product Ops', course: 'Anti-Bribery', rate: 76 },
  { dept: 'Product Ops', course: 'HIPAA Security', rate: 72 },
  
  { dept: 'Operations', course: 'SOC2 Cybersecurity', rate: 60 },
  { dept: 'Operations', course: 'Anti-Bribery', rate: 68 },
  { dept: 'Operations', course: 'HIPAA Security', rate: 64 },
];

const DEADLINES = [
  { id: 'dl-1', employee: 'Bob Miller', department: 'Operations', course: 'SOC2 Cybersecurity', daysLeft: 2, status: 'Critical', color: 'text-rose-400 bg-rose-950/60 border-rose-500/40' },
  { id: 'dl-2', employee: 'Amanda Ross', department: 'Engineering', course: 'Anti-Bribery Conduct', daysLeft: 6, status: 'Warning', color: 'text-amber-400 bg-amber-950/60 border-amber-500/40' },
  { id: 'dl-3', employee: 'David Chen', department: 'Engineering', course: 'Anti-Bribery Conduct', daysLeft: 12, status: 'On Track', color: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40' },
  { id: 'dl-4', employee: 'Evelyn Carter', department: 'Product Ops', course: 'HIPAA Security', daysLeft: 25, status: 'On Track', color: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40' },
];

export function CompanyCompliance() {
  const { addToast } = useToastStore();
  const [isExporting, setIsExporting] = useState(false);

  // Dynamic Heatmap block colors depending on completion rate
  const getHeatmapColor = (rate: number) => {
    if (rate >= 90) return 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'; // High Compliant
    if (rate >= 70) return 'bg-amber-950/80 border-amber-500/40 text-amber-300';   // Modest Warning
    return 'bg-rose-950/80 border-rose-500/40 text-rose-300';                  // High Risk Danger
  };

  const handleExportCSV = () => {
    setIsExporting(true);
    setTimeout(() => {
      // Create mock CSV content
      const csvHeaders = 'Department,Course Name,Completion Rate,Compliance Status\n';
      const csvRows = HEATMAP_DATA.map(
        (row) => `"${row.dept}","${row.course}",${row.rate}%,${row.rate >= 90 ? 'Compliant' : row.rate >= 70 ? 'Warning' : 'Risk'}`
      ).join('\n');
      
      const csvContent = csvHeaders + csvRows;
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Nexara_Company_Compliance_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      addToast('Corporate compliance audit logs exported to CSV successfully', 'success');
      setIsExporting(false);
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Title & Action controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-nexara-light" />
            Company-Wide Compliance Analytics
          </h2>
          <p className="text-sm text-slate-400">Auditing department status, course coverage, and critical upcoming timelines.</p>
        </div>

        <button
          onClick={handleExportCSV}
          disabled={isExporting}
          className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all shadow-md disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          {isExporting ? 'Generating Report...' : 'Export to CSV'}
        </button>
      </div>

      {/* Grid of Key Metrics summaries */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-nexara-navy/30 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md flex items-center gap-4">
          <div className="p-3 bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 rounded-xl">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block uppercase font-bold">Overall Compliance</span>
            <span className="text-xl font-bold text-white mt-0.5">83.6%</span>
          </div>
        </div>

        <div className="bg-nexara-navy/30 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md flex items-center gap-4">
          <div className="p-3 bg-rose-950/60 border border-rose-500/30 text-rose-400 rounded-xl">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block uppercase font-bold">High Risk Sectors</span>
            <span className="text-xl font-bold text-white mt-0.5">2 Departments</span>
          </div>
        </div>

        <div className="bg-nexara-navy/30 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md flex items-center gap-4">
          <div className="p-3 bg-amber-950/60 border border-amber-500/30 text-amber-400 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block uppercase font-bold">Expiring Audits</span>
            <span className="text-xl font-bold text-white mt-0.5">14 Certificates</span>
          </div>
        </div>

        <div className="bg-nexara-navy/30 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md flex items-center gap-4">
          <div className="p-3 bg-nexara-accent/15 border border-nexara-accent/30 text-nexara-light rounded-xl">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block uppercase font-bold">Completion Rate</span>
            <span className="text-xl font-bold text-white mt-0.5">+4.2% MoM</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Compliance Risk Heatmap Grid representation */}
        <div className="lg:col-span-2 bg-nexara-navy/30 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Building className="w-4 h-4 text-nexara-light" />
              Compliance Risk Heatmap
            </h3>
            <p className="text-xs text-slate-500">Cross-reference tracking completion density by sector vs modules.</p>
          </div>

          {/* Heatmap Layout Grid */}
          <div className="space-y-3 mb-6">
            <div className="grid grid-cols-4 gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-wider text-center border-b border-slate-850 pb-2">
              <div className="text-left pl-1">Department</div>
              <div>SOC2 Cyber</div>
              <div>Anti-Bribery</div>
              <div>HIPAA Security</div>
            </div>

            {['Engineering', 'Finance & Sales', 'HR & Legal', 'Product Ops', 'Operations'].map((dept) => {
              const soc2 = HEATMAP_DATA.find(h => h.dept === dept && h.course === 'SOC2 Cybersecurity')?.rate || 0;
              const anti = HEATMAP_DATA.find(h => h.dept === dept && h.course === 'Anti-Bribery')?.rate || 0;
              const hipaa = HEATMAP_DATA.find(h => h.dept === dept && h.course === 'HIPAA Security')?.rate || 0;

              return (
                <div key={dept} className="grid grid-cols-4 gap-2 items-center text-center">
                  <div className="text-left text-xs font-semibold text-white truncate pl-1">{dept}</div>
                  <div className={`p-3 rounded-lg border text-xs font-mono font-bold shadow ${getHeatmapColor(soc2)}`}>
                    {soc2}%
                  </div>
                  <div className={`p-3 rounded-lg border text-xs font-mono font-bold shadow ${getHeatmapColor(anti)}`}>
                    {anti}%
                  </div>
                  <div className={`p-3 rounded-lg border text-xs font-mono font-bold shadow ${getHeatmapColor(hipaa)}`}>
                    {hipaa}%
                  </div>
                </div>
              );
            })}
          </div>

          {/* Color Key Guide */}
          <div className="flex items-center gap-4 text-[10px] text-slate-400 font-semibold border-t border-slate-850 pt-4">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-emerald-950 border border-emerald-500/40"></div>
              <span>High (90%+)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-amber-950 border border-amber-500/40"></div>
              <span>Moderate (70%-89%)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-rose-950 border border-rose-500/40"></div>
              <span>Critical Risk (&lt;70%)</span>
            </div>
          </div>

        </div>

        {/* Deadline Risk Countdown Tracker */}
        <div className="bg-nexara-navy/30 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md flex flex-col">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-rose-500" />
              Timeline Risk Alert List
            </h3>
            <p className="text-xs text-slate-500 font-medium">Critical upcoming training compliance deadlines.</p>
          </div>

          <div className="flex-1 space-y-3">
            {DEADLINES.map((dl) => (
              <div 
                key={dl.id}
                className="p-4 bg-slate-950/40 border border-slate-850 rounded-xl space-y-2 flex flex-col justify-between"
              >
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h4 className="font-semibold text-white text-xs leading-normal">{dl.employee}</h4>
                    <span className="text-[10px] text-slate-500 font-medium">{dl.department}</span>
                  </div>
                  <span className={`text-[9px] px-2 py-0.5 rounded font-bold border ${dl.color}`}>
                    {dl.daysLeft} Days Left
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-medium">
                  Course: <strong className="text-slate-200">{dl.course}</strong>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* Analytics chart area */}
      <div className="bg-nexara-navy/30 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-nexara-light" />
              Completion comparison chart
            </h3>
            <p className="text-xs text-slate-500">Cross-department status rates vs target goals.</p>
          </div>
        </div>

        {/* Recharts BarChart */}
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={DEPARTMENT_COMPLIANCE}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
              <XAxis dataKey="department" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} unit="%" domain={[0, 100]} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0b1329', borderColor: '#1e293b', borderRadius: '12px' }}
                labelStyle={{ fontWeight: 'bold', color: '#fff' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="completionRate" name="Current Coverage" radius={[6, 6, 0, 0]}>
                {
                  DEPARTMENT_COMPLIANCE.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.completionRate >= 90 ? '#10b981' : entry.completionRate >= 70 ? '#f59e0b' : '#ef4444'} 
                    />
                  ))
                }
              </Bar>
              <Bar dataKey="targetRate" name="Target Target" fill="#0284c7" opacity={0.15} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
