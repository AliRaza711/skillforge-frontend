import { Plus, Edit, Trash, Eye } from 'lucide-react';
import { useToastStore } from '../store/useToastStore';

export function CourseManagement() {
  const { addToast } = useToastStore();
  const mockCourses = [
    { id: '1', title: 'SOC2 Cybersecurity & Data Protection Compliance', chapters: 3, status: 'Active', updated: '2026-07-10' },
    { id: '2', title: 'Anti-Bribery & Corruption Conduct Policy', chapters: 2, status: 'Active', updated: '2026-07-08' },
    { id: '3', title: 'HIPAA Information Security & Privacy Regulations', chapters: 2, status: 'Draft', updated: '2026-06-25' },
  ];

  const handleAction = (action: string) => {
    addToast(`${action} action triggered (demo mode)`, 'info');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold text-white">Course Management Console</h2>
          <p className="text-sm text-slate-400">Curate and publish compliance training courses for the organization.</p>
        </div>
        <button
          onClick={() => handleAction('Create Course')}
          className="flex items-center gap-1.5 bg-nexara-accent hover:bg-nexara-accent/80 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all"
        >
          <Plus className="w-4 h-4" />
          Create New Course
        </button>
      </div>

      <div className="bg-nexara-navy/30 border border-slate-800/80 rounded-2xl overflow-hidden backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900/40 border-b border-slate-850 text-slate-500 font-bold uppercase tracking-wider">
                <th className="p-4">Course Title</th>
                <th className="p-4">Curriculum Chapters</th>
                <th className="p-4">Status</th>
                <th className="p-4">Last Updated</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {mockCourses.map((course) => (
                <tr key={course.id} className="hover:bg-slate-850/10 text-slate-300">
                  <td className="p-4 font-semibold text-white">{course.title}</td>
                  <td className="p-4">{course.chapters} Chapters</td>
                  <td className="p-4">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      course.status === 'Active'
                        ? 'bg-emerald-950/60 border border-emerald-500/30 text-emerald-400'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {course.status}
                    </span>
                  </td>
                  <td className="p-4">{course.updated}</td>
                  <td className="p-4 text-right flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleAction('Edit')}
                      className="p-2 bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 hover:text-white"
                      title="Edit"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleAction('Preview')}
                      className="p-2 bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 hover:text-white"
                      title="Preview Content"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleAction('Delete')}
                      className="p-2 bg-slate-900 border border-slate-800 rounded-lg hover:border-rose-900 text-rose-450"
                      title="Archive"
                    >
                      <Trash className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
