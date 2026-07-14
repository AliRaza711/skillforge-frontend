import { useState } from 'react';
import { UserPlus, CheckSquare, Square, Search, BookOpen } from 'lucide-react';
import { useToastStore } from '../store/useToastStore';

export function AssignCourses() {
  const { addToast } = useToastStore();
  const [selectedCourse, setSelectedCourse] = useState('soc2');
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [search, setSearch] = useState('');

  const employees = [
    { id: '1', name: 'Sarah Jenkins', role: 'Security Engineer' },
    { id: '2', name: 'David Chen', role: 'Backend Engineer' },
    { id: '3', name: 'Amanda Ross', role: 'Frontend Lead' },
  ];

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelectEmployee = (id: string) => {
    setSelectedEmployees(prev =>
      prev.includes(id) ? prev.filter(empId => empId !== id) : [...prev, id]
    );
  };

  const handleAssign = () => {
    if (selectedEmployees.length === 0) {
      addToast('Please select at least one employee', 'warning');
      return;
    }
    const courseTitle = selectedCourse === 'soc2' ? 'SOC2 Security' : 'Anti-Bribery Conduct';
    addToast(
      `Assigned "${courseTitle}" to ${selectedEmployees.length} team members successfully`,
      'success'
    );
    setSelectedEmployees([]);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-white">Assign Training Modules</h2>
        <p className="text-sm text-slate-400">Distribute compliance requirements across your team members.</p>
      </div>

      <div className="bg-nexara-navy/30 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md space-y-5">
        
        {/* Step 1: Select Course */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            1. Select Compliance Module
          </label>
          <div className="relative">
            <BookOpen className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full bg-slate-950/60 border border-slate-800/85 focus:border-nexara-accent rounded-xl py-3.5 pl-11 pr-4 text-sm text-white focus:outline-none appearance-none"
            >
              <option value="soc2">SOC2 Cybersecurity & Data Protection Compliance</option>
              <option value="anti-bribery">Anti-Bribery & Corruption Conduct Policy</option>
              <option value="hipaa">HIPAA Information Security & Privacy Regulations</option>
            </select>
          </div>
        </div>

        {/* Step 2: Search & Select Employees */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            2. Choose Recipients
          </label>
          
          <div className="relative mb-3">
            <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search team member name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950/60 border border-slate-800/80 focus:border-nexara-accent rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none"
            />
          </div>

          <div className="border border-slate-850 rounded-xl divide-y divide-slate-850 max-h-60 overflow-y-auto bg-slate-900/20">
            {filteredEmployees.map((emp) => {
              const isChecked = selectedEmployees.includes(emp.id);
              return (
                <button
                  key={emp.id}
                  onClick={() => toggleSelectEmployee(emp.id)}
                  className="w-full p-4 flex items-center justify-between hover:bg-slate-800/20 text-left transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-nexara-light" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-600" />
                    )}
                    <div>
                      <h4 className="text-sm font-semibold text-white">{emp.name}</h4>
                      <p className="text-[10px] text-slate-500">{emp.role}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: Trigger Assign */}
        <button
          onClick={handleAssign}
          className="w-full bg-gradient-to-r from-nexara-accent to-nexara-light hover:opacity-95 text-slate-900 font-bold py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg"
        >
          <UserPlus className="w-4 h-4" />
          Dispatch Course Requirements
        </button>

      </div>
    </div>
  );
}
