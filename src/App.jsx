import React, { useState, useEffect } from 'react';
import { ChevronLeft, Menu, X, Moon, Sun, Plus } from 'lucide-react';

export default function KalaidScopeApp() {
  const [userRole, setUserRole] = useState('admin');
  const [darkMode, setDarkMode] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedTalent, setSelectedTalent] = useState(null);
  const [activeTab, setActiveTab] = useState('summary');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projects, setProjects] = useState([]);

  const bg = darkMode ? 'bg-black' : 'bg-white';
  const text = darkMode ? 'text-white' : 'text-black';
  const border = darkMode ? 'border-gray-900' : 'border-gray-100';
  const muted = darkMode ? 'text-gray-500' : 'text-gray-600';
  const subtle = darkMode ? 'bg-gray-950' : 'bg-gray-50';
  const hover = darkMode ? 'hover:bg-gray-950' : 'hover:bg-gray-50';

  const talents = [
    {
      id: 1,
      name: 'Emma Laurent',
      role: 'Directrice de Photographie',
      status: 'Disponible',
      monthlyEarnings: '€18,190',
      salary: { gross: 21400, commission: 3210, net: 18190 },
      contracts: {
        representation: {
          signedDate: '12 jan 2026',
          endDate: '12 jan 2028',
          commissions: { agencyBrings: 20, talentBrings: 15, rights: 10 },
          exclusive: true
        },
        cessions: []
      }
    },
    { id: 2, name: 'Pierre Mossé', role: 'Réalisateur', status: 'En tournage', monthlyEarnings: '€15,600', salary: { gross: 16800, commission: 1200, net: 15600 }, contracts: { representation: { commissions: { agencyBrings: 15, talentBrings: 10, rights: 5 }, exclusive: true }, cessions: [] } },
    { id: 3, name: 'Sophie Durand', role: 'Styliste', status: 'Vacances', monthlyEarnings: '€12,400', salary: { gross: 13200, commission: 800, net: 12400 }, contracts: { representation: { commissions: { agencyBrings: 20, talentBrings: 15, rights: 10 }, exclusive: false }, cessions: [] } }
  ];

  // Init localStorage
  useEffect(() => {
    const saved = localStorage.getItem('kalaidProjects');
    if (saved) {
      setProjects(JSON.parse(saved));
    } else {
      const defaultProjects = [
        { id: 1, name: 'Campagne Moynat', client: 'Moynat', budget: 25000, status: 'En cours', createdBy: 'admin', startDate: '2026-03-01', endDate: '2026-03-31', talents: [{ talentId: 1, percentage: 20 }] },
        { id: 2, name: 'Shooting Dior', client: 'Dior Beauty', budget: 18000, status: 'Confirmé', createdBy: 'admin', startDate: '2026-03-15', endDate: '2026-03-22', talents: [{ talentId: 1, percentage: 25 }] }
      ];
      setProjects(defaultProjects);
      localStorage.setItem('kalaidProjects', JSON.stringify(defaultProjects));
    }
  }, []);

  const addProject = (newProject) => {
    const project = {
      ...newProject,
      id: Date.now(),
      createdBy: userRole
    };
    const updated = [...projects, project];
    setProjects(updated);
    localStorage.setItem('kalaidProjects', JSON.stringify(updated));
    setShowProjectForm(false);
  };

  const getTalentProjects = (talentId) => {
    return projects.filter(p => p.talents.some(t => t.talentId === talentId));
  };

  const filteredTalents = talents.filter(t => filterStatus === 'all' || t.status.toLowerCase().includes(filterStatus));

  const Header = () => (
    <header className={`border-b ${border}`}>
      <div className="px-6 lg:px-12 py-8 flex items-center justify-between">
        <svg className="w-8 h-8" viewBox="0 0 200 200" fill="none">
          <g transform="translate(100, 100)">
            <rect x="-70" y="-70" width="140" height="140" fill="none" stroke="currentColor" strokeWidth="24" transform="rotate(45)" />
            <path d="M -40,-15 L -15,-40 L -15,0 L -40,25 Z" fill="currentColor" />
            <path d="M 40,-15 L 15,-40 L 15,0 L 40,25 Z" fill="currentColor" />
            <rect x="-16" y="-16" width="32" height="32" fill="currentColor" transform="rotate(45)" />
          </g>
        </svg>

        <nav className="hidden md:flex gap-12 text-xs tracking-widest font-light">
          {[{ id: 'talent', label: 'TALENT' }, { id: 'agent', label: 'AGENT' }, { id: 'admin', label: 'ADMIN' }].map(item => (
            <button key={item.id} onClick={() => { setUserRole(item.id); setSelectedTalent(null); setActiveTab('summary'); }} className={`pb-1 border-b-2 transition ${userRole === item.id ? 'border-current' : 'border-transparent ' + muted}`}>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex gap-3">
          <button onClick={() => setDarkMode(!darkMode)} className={`p-2 transition ${hover}`}>{darkMode ? <Sun size={16} /> : <Moon size={16} />}</button>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2">{mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}</button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className={`border-t ${border} px-6 py-6 space-y-3`}>
          {[{ id: 'talent', label: 'Talent' }, { id: 'agent', label: 'Agent' }, { id: 'admin', label: 'Admin' }].map(item => (
            <button key={item.id} onClick={() => { setUserRole(item.id); setSelectedTalent(null); setActiveTab('summary'); setMobileMenuOpen(false); }} className={`block text-left text-sm py-2 ${userRole === item.id ? 'font-light' : muted}`}>
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );

  const ProjectFormModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${subtle} border ${border} rounded p-8 max-w-md w-full`}>
        <h2 className="text-2xl font-light mb-6">Créer un projet</h2>
        <ProjectForm onAdd={addProject} onCancel={() => setShowProjectForm(false)} talents={talents} />
      </div>
    </div>
  );

  const ProjectForm = ({ onAdd, onCancel, talents }) => {
    const [formData, setFormData] = useState({
      name: '',
      client: '',
      budget: '',
      status: 'En cours',
      startDate: '',
      endDate: '',
      talentIds: []
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      if (formData.name && formData.client && formData.budget) {
        onAdd({
          name: formData.name,
          client: formData.client,
          budget: parseInt(formData.budget),
          status: formData.status,
          startDate: formData.startDate,
          endDate: formData.endDate,
          talents: formData.talentIds.map(id => ({ talentId: parseInt(id), percentage: 20 }))
        });
        setFormData({ name: '', client: '', budget: '', status: 'En cours', startDate: '', endDate: '', talentIds: [] });
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs tracking-widest block mb-2">Nom du projet</label>
          <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className={`w-full px-3 py-2 border ${border} ${subtle}`} required />
        </div>
        <div>
          <label className="text-xs tracking-widest block mb-2">Client</label>
          <input type="text" value={formData.client} onChange={(e) => setFormData({...formData, client: e.target.value})} className={`w-full px-3 py-2 border ${border} ${subtle}`} required />
        </div>
        <div>
          <label className="text-xs tracking-widest block mb-2">Budget (€)</label>
          <input type="number" value={formData.budget} onChange={(e) => setFormData({...formData, budget: e.target.value})} className={`w-full px-3 py-2 border ${border} ${subtle}`} required />
        </div>
        <div>
          <label className="text-xs tracking-widest block mb-2">Statut</label>
          <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className={`w-full px-3 py-2 border ${border} ${subtle}`}>
            <option>En cours</option>
            <option>Confirmé</option>
            <option>En attente</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs tracking-widest block mb-2">Début</label>
            <input type="date" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} className={`w-full px-3 py-2 border ${border} ${subtle} text-xs`} />
          </div>
          <div>
            <label className="text-xs tracking-widest block mb-2">Fin</label>
            <input type="date" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} className={`w-full px-3 py-2 border ${border} ${subtle} text-xs`} />
          </div>
        </div>
        <div>
          <label className="text-xs tracking-widest block mb-2">Talents</label>
          <div className="space-y-2">
            {talents.map(t => (
              <label key={t.id} className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={formData.talentIds.includes(t.id.toString())} onChange={(e) => {
                  if (e.target.checked) {
                    setFormData({...formData, talentIds: [...formData.talentIds, t.id.toString()]});
                  } else {
                    setFormData({...formData, talentIds: formData.talentIds.filter(id => id !== t.id.toString())});
                  }
                }} />
                {t.name}
              </label>
            ))}
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button type="submit" className={`flex-1 py-2 px-4 ${darkMode ? 'bg-white text-black' : 'bg-black text-white'} text-sm tracking-widest`}>Créer</button>
          <button type="button" onClick={onCancel} className={`flex-1 py-2 px-4 border ${border} text-sm tracking-widest`}>Annuler</button>
        </div>
      </form>
    );
  };

  const TalentView = ({ talent }) => {
    const talentProjects = getTalentProjects(talent.id);
    return (
      <div className="px-6 lg:px-12 py-12">
        <h1 className="text-6xl lg:text-7xl font-light mb-2">{talent.name}</h1>
        <p className={`text-sm tracking-widest ${muted} mb-12`}>{talent.role}</p>

        <div className={`flex gap-12 border-b ${border} mb-12 overflow-x-auto`}>
          {[{ id: 'summary', label: 'Résumé' }, { id: 'planning', label: 'Planning' }, { id: 'contracts', label: 'Contrats' }, { id: 'salary', label: 'Rémunération' }].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`text-sm tracking-widest py-4 border-b-2 whitespace-nowrap transition ${activeTab === tab.id ? 'border-current' : 'border-transparent ' + muted}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'summary' && (
          <div>
            <div className="grid grid-cols-3 gap-6 mb-16">
              {[{ label: 'Projets', value: talentProjects.length }, { label: 'Revenus', value: talent.monthlyEarnings }, { label: 'Contrats', value: '1' }].map((s, i) => (
                <div key={i} className={`${subtle} p-8 border ${border} text-center`}>
                  <p className={`text-xs tracking-widest mb-4 ${muted}`}>{s.label}</p>
                  <p className="text-2xl font-light">{s.value}</p>
                </div>
              ))}
            </div>

            <div className="mb-16">
              <h2 className="text-xs tracking-widest mb-8 uppercase">Projets assignés</h2>
              <div className="space-y-3">
                {talentProjects.length > 0 ? (
                  talentProjects.map((p, i) => (
                    <div key={i} className={`flex justify-between py-4 px-6 border ${border}`}>
                      <div><p className="font-light">{p.name}</p><p className={`text-xs ${muted} mt-1`}>{p.client}</p></div>
                      <p className="text-lg font-light">€{p.budget.toLocaleString()}</p>
                    </div>
                  ))
                ) : (
                  <p className={`text-sm ${muted}`}>Aucun projet assigné</p>
                )}
              </div>
            </div>

            <button onClick={() => setShowProjectForm(true)} className={`flex items-center gap-2 px-4 py-3 border ${border} text-sm tracking-widest ${hover}`}>
              <Plus size={16} /> Ajouter un projet
            </button>
          </div>
        )}

        {activeTab === 'planning' && (
          <div>
            <h3 className="text-xs tracking-widest mb-8 uppercase">Projets assignés</h3>
            <div className="space-y-3">
              {talentProjects.length > 0 ? (
                talentProjects.map((p, i) => (
                  <div key={i} className={`border ${border} p-6`}>
                    <p className="font-light">{p.name}</p>
                    <p className={`text-xs ${muted} mt-2`}>{p.startDate} à {p.endDate}</p>
                  </div>
                ))
              ) : (
                <p className={`text-sm ${muted}`}>Aucun projet</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'contracts' && (
          <div>
            <h3 className="text-xs tracking-widest mb-8 uppercase">Contrat de représentation</h3>
            <div className={`${subtle} border ${border} p-6`}>
              <p className="font-light mb-2">Contrat {talent.contracts.representation.exclusive ? 'exclusif' : 'non exclusif'}</p>
              <p className={`text-sm ${muted}`}>Signé le {talent.contracts.representation.signedDate}</p>
            </div>
          </div>
        )}

        {activeTab === 'salary' && (
          <div>
            <div className="grid grid-cols-3 gap-6 mb-12">
              {[{ label: 'Total', value: `€${talent.salary.gross.toLocaleString()}` }, { label: 'Commission', value: `-€${talent.salary.commission}` }, { label: 'Net', value: `€${talent.salary.net.toLocaleString()}` }].map((s, i) => (
                <div key={i} className={`${subtle} p-8 border ${border} text-center`}>
                  <p className={`text-xs tracking-widest mb-4 ${muted}`}>{s.label}</p>
                  <p className="text-2xl font-light">{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const AgentView = () => {
    if (selectedTalent) {
      return (
        <div className="px-6 lg:px-12 py-12">
          <button onClick={() => setSelectedTalent(null)} className={`flex items-center gap-2 mb-12 p-3 transition ${hover}`}>
            <ChevronLeft size={18} />
            <span className="text-sm">Retour</span>
          </button>
          <TalentView talent={selectedTalent} />
        </div>
      );
    }

    return (
      <div className="px-6 lg:px-12 py-12">
        <h1 className="text-6xl lg:text-7xl font-light mb-2">Agent</h1>
        <p className={`text-sm tracking-widest ${muted} mb-12`}>Disponibilité & Projets</p>

        <div className={`flex gap-12 border-b ${border} mb-12 overflow-x-auto`}>
          {[{ id: 'summary', label: 'Résumé' }, { id: 'availability', label: 'Disponibilité' }, { id: 'myprojects', label: 'Mes projets' }].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`text-sm tracking-widest py-4 border-b-2 whitespace-nowrap transition ${activeTab === tab.id ? 'border-current' : 'border-transparent ' + muted}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'summary' && (
          <div>
            <div className="grid grid-cols-3 gap-6 mb-16">
              {[{ label: 'Talents actifs', value: filteredTalents.length }, { label: 'Mes projets', value: projects.filter(p => p.createdBy === 'agent').length }, { label: 'En cours', value: projects.filter(p => p.status === 'En cours').length }].map((s, i) => (
                <div key={i} className={`${subtle} p-8 border ${border} text-center`}>
                  <p className={`text-xs tracking-widest mb-4 ${muted}`}>{s.label}</p>
                  <p className="text-2xl font-light">{s.value}</p>
                </div>
              ))}
            </div>

            <button onClick={() => setShowProjectForm(true)} className={`flex items-center gap-2 px-4 py-3 mb-12 border ${border} text-sm tracking-widest ${hover}`}>
              <Plus size={16} /> Créer un projet
            </button>

            <div>
              <h2 className="text-xs tracking-widest mb-8 uppercase">Talents disponibles</h2>
              <div className="space-y-3">
                {filteredTalents.slice(0, 3).map(t => (
                  <button key={t.id} onClick={() => setSelectedTalent(t)} className={`w-full text-left flex justify-between py-4 px-6 border ${border} transition ${hover}`}>
                    <div><p className="font-light">{t.name}</p><p className={`text-xs ${muted} mt-1`}>{t.role}</p></div>
                    <p className={`text-xs px-3 py-1 ${t.status === 'Disponible' ? `${darkMode ? 'bg-green-950 text-green-400' : 'bg-green-100 text-green-800'}` : subtle}`}>{t.status}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'availability' && (
          <div>
            <div className="flex gap-3 mb-12 flex-wrap">
              {[{ id: 'all', label: 'Tous' }, { id: 'disponible', label: 'Disponible' }, { id: 'tournage', label: 'En tournage' }, { id: 'vacances', label: 'Vacances' }].map(filter => (
                <button key={filter.id} onClick={() => setFilterStatus(filter.id)} className={`text-xs tracking-widest px-4 py-2 border ${border} transition ${filterStatus === filter.id ? `${darkMode ? 'bg-white text-black' : 'bg-black text-white'}` : hover}`}>
                  {filter.label}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {filteredTalents.map(t => (
                <button key={t.id} onClick={() => setSelectedTalent(t)} className={`w-full text-left flex justify-between py-4 px-6 border ${border} transition ${hover}`}>
                  <div><p className="font-light">{t.name}</p><p className={`text-xs ${muted} mt-1`}>{t.role}</p></div>
                  <p className={`text-xs px-3 py-1 ${subtle}`}>{t.status}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'myprojects' && (
          <div>
            <h2 className="text-xs tracking-widest mb-8 uppercase">Mes projets créés</h2>
            <div className="space-y-4">
              {projects.filter(p => p.createdBy === 'agent').map(p => (
                <div key={p.id} className={`${subtle} border ${border} p-8`}>
                  <div className="flex justify-between mb-4">
                    <div><h3 className="font-light text-lg">{p.name}</h3><p className={`text-xs ${muted} mt-1`}>{p.client}</p></div>
                    <span className={`text-xs tracking-widest px-3 py-1 ${p.status === 'En cours' ? `${darkMode ? 'bg-white text-black' : 'bg-black text-white'}` : subtle}`}>{p.status}</span>
                  </div>
                  <p className="text-2xl font-light">€{p.budget.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const AdminView = () => {
    return (
      <div className="px-6 lg:px-12 py-12">
        <h1 className="text-6xl lg:text-7xl font-light mb-2">Admin</h1>
        <p className={`text-sm tracking-widest ${muted} mb-12`}>Gestion complète</p>

        <div className={`flex gap-12 border-b ${border} mb-12 overflow-x-auto`}>
          {[{ id: 'summary', label: 'Résumé' }, { id: 'talents', label: 'Talents' }, { id: 'projects', label: 'Projets' }].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`text-sm tracking-widest py-4 border-b-2 whitespace-nowrap transition ${activeTab === tab.id ? 'border-current' : 'border-transparent ' + muted}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'summary' && (
          <div>
            <div className="grid grid-cols-4 gap-6 mb-16">
              {[{ label: 'Chiffre d\'affaires', value: `€${projects.reduce((a, b) => a + b.budget, 0).toLocaleString()}` }, { label: 'Projets total', value: projects.length }, { label: 'Talents', value: talents.length }, { label: 'Projets en cours', value: projects.filter(p => p.status === 'En cours').length }].map((s, i) => (
                <div key={i} className={`${subtle} p-6 border ${border} text-center`}>
                  <p className={`text-xs tracking-widest mb-4 ${muted}`}>{s.label}</p>
                  <p className="text-2xl font-light">{s.value}</p>
                </div>
              ))}
            </div>

            <button onClick={() => setShowProjectForm(true)} className={`flex items-center gap-2 px-4 py-3 mb-12 border ${border} text-sm tracking-widest ${hover}`}>
              <Plus size={16} /> Créer un projet
            </button>
          </div>
        )}

        {activeTab === 'talents' && (
          <div>
            <h2 className="text-xs tracking-widest mb-8 uppercase">Tous les talents</h2>
            <div className="space-y-3">
              {talents.map(t => (
                <button key={t.id} onClick={() => setSelectedTalent(t)} className={`w-full text-left flex justify-between py-4 px-6 border ${border} transition ${hover}`}>
                  <div><p className="font-light">{t.name}</p><p className={`text-xs ${muted} mt-1`}>{t.role}</p></div>
                  <p className="text-lg font-light">{t.monthlyEarnings}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div>
            <h2 className="text-xs tracking-widest mb-8 uppercase">Tous les projets</h2>
            <div className="space-y-4">
              {projects.map(p => (
                <div key={p.id} className={`${subtle} border ${border} p-8`}>
                  <div className="flex justify-between mb-4">
                    <div><h3 className="font-light text-lg">{p.name}</h3><p className={`text-xs ${muted} mt-1`}>{p.client}</p></div>
                    <span className={`text-xs tracking-widest px-3 py-1 ${p.status === 'En cours' ? `${darkMode ? 'bg-white text-black' : 'bg-black text-white'}` : subtle}`}>{p.status}</span>
                  </div>
                  <p className="text-2xl font-light mb-4">€{p.budget.toLocaleString()}</p>
                  <p className={`text-xs ${muted}`}>Créé par: {p.createdBy}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ fontFamily: '"Futura PT", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }} className={`${bg} ${text} min-h-screen`}>
      <Header />
      {showProjectForm && <ProjectFormModal />}
      {userRole === 'talent' && <TalentView talent={talents[0]} />}
      {userRole === 'agent' && <AgentView />}
      {userRole === 'admin' && <AdminView />}
      <footer className={`border-t ${border} mt-20 py-12 px-6 lg:px-12 text-center text-xs ${muted}`}>
        <p className="tracking-widest">KALAID SCOPE — v1.0 avec formulaires</p>
      </footer>
    </div>
  );
}
