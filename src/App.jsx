import React, { useState, useEffect } from 'react';
import { ChevronLeft, Menu, X, Moon, Sun, Plus, Copy, Check } from 'lucide-react';

export default function KalaidScopeApp() {
  const [userRole, setUserRole] = useState('admin');
  const [darkMode, setDarkMode] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedTalent, setSelectedTalent] = useState(null);
  const [activeTab, setActiveTab] = useState('summary');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [projects, setProjects] = useState([]);
  const [talents, setTalents] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [inviteLink, setInviteLink] = useState('');
  const [copiedInvite, setCopiedInvite] = useState(false);
  const [signupMode, setSignupMode] = useState(false);
  const [currentInvite, setCurrentInvite] = useState(null);

  const bg = darkMode ? 'bg-black' : 'bg-white';
  const text = darkMode ? 'text-white' : 'text-black';
  const border = darkMode ? 'border-gray-900' : 'border-gray-100';
  const muted = darkMode ? 'text-gray-500' : 'text-gray-600';
  const subtle = darkMode ? 'bg-gray-950' : 'bg-gray-50';
  const hover = darkMode ? 'hover:bg-gray-950' : 'hover:bg-gray-50';

  // Init localStorage
  useEffect(() => {
    const savedTalents = localStorage.getItem('kalaidTalents');
    const savedProjects = localStorage.getItem('kalaidProjects');
    const savedInvitations = localStorage.getItem('kalaidInvitations');

    if (savedTalents) {
      setTalents(JSON.parse(savedTalents));
    } else {
      const defaultTalents = [
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
      setTalents(defaultTalents);
      localStorage.setItem('kalaidTalents', JSON.stringify(defaultTalents));
    }

    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    } else {
      const defaultProjects = [
        { id: 1, name: 'Campagne Moynat', client: 'Moynat', budget: 25000, talentPrice: 20000, agencyEarnings: 5000, agencyCommission: 25, status: 'En cours', createdBy: 'admin', startDate: '2026-03-01', endDate: '2026-03-31', talents: [{ talentId: 1, percentage: 20 }] },
        { id: 2, name: 'Shooting Dior', client: 'Dior Beauty', budget: 18000, talentPrice: 14400, agencyEarnings: 3600, agencyCommission: 25, status: 'Confirmé', createdBy: 'admin', startDate: '2026-03-15', endDate: '2026-03-22', talents: [{ talentId: 1, percentage: 25 }] }
      ];
      setProjects(defaultProjects);
      localStorage.setItem('kalaidProjects', JSON.stringify(defaultProjects));
    }

    if (savedInvitations) {
      setInvitations(JSON.parse(savedInvitations));
    }

    // Check URL for invite
    const params = new URLSearchParams(window.location.search);
    const inviteToken = params.get('invite');
    if (inviteToken) {
      const savedInvites = JSON.parse(localStorage.getItem('kalaidInvitations') || '[]');
      const found = savedInvites.find(i => i.token === inviteToken);
      if (found) {
        setSignupMode(true);
        setCurrentInvite(found);
      }
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

  const createInvitation = (email) => {
    const token = Math.random().toString(36).substring(2, 15);
    const invite = {
      token,
      email,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    const updated = [...invitations, invite];
    setInvitations(updated);
    localStorage.setItem('kalaidInvitations', JSON.stringify(updated));
    
    const link = `${window.location.origin}?invite=${token}`;
    setInviteLink(link);
    return link;
  };

  const completeSignup = (talentData) => {
    const newTalent = {
      id: Date.now(),
      ...talentData,
      monthlyEarnings: `€${parseInt(talentData.salary).toLocaleString()}`,
      salary: { gross: parseInt(talentData.salary || 0), commission: 0, net: parseInt(talentData.salary || 0) },
      contracts: {
        representation: {
          signedDate: new Date().toISOString().split('T')[0],
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          commissions: { agencyBrings: 20, talentBrings: 15, rights: 10 },
          exclusive: true
        },
        cessions: []
      }
    };

    const updated = [...talents, newTalent];
    setTalents(updated);
    localStorage.setItem('kalaidTalents', JSON.stringify(updated));

    // Mark invite as used
    const updatedInvites = invitations.map(i => 
      i.token === currentInvite.token ? { ...i, status: 'completed' } : i
    );
    setInvitations(updatedInvites);
    localStorage.setItem('kalaidInvitations', JSON.stringify(updatedInvites));

    setSignupMode(false);
    setCurrentInvite(null);
    setUserRole('talent');
  };

  const getTalentProjects = (talentId) => {
    return projects.filter(p => p.talents.some(t => t.talentId === talentId));
  };

  const filteredTalents = talents.filter(t => filterStatus === 'all' || t.status.toLowerCase().includes(filterStatus));

  if (signupMode && currentInvite) {
    return <SignupPage invite={currentInvite} darkMode={darkMode} onComplete={completeSignup} />;
  }

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
      <div className={`${subtle} border ${border} rounded p-8 max-w-md w-full max-h-96 overflow-y-auto`}>
        <h2 className="text-2xl font-light mb-6">Créer un projet</h2>
        <ProjectForm onAdd={addProject} onCancel={() => setShowProjectForm(false)} talents={talents} darkMode={darkMode} border={border} subtle={subtle} />
      </div>
    </div>
  );

  const InviteFormModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${subtle} border ${border} rounded p-8 max-w-md w-full`}>
        <h2 className="text-2xl font-light mb-6">Inviter un talent</h2>
        <InviteForm onInvite={createInvitation} onCancel={() => { setShowInviteForm(false); setInviteLink(''); }} darkMode={darkMode} border={border} subtle={subtle} inviteLink={inviteLink} copiedInvite={copiedInvite} setCopiedInvite={setCopiedInvite} />
      </div>
    </div>
  );

  const ProjectForm = ({ onAdd, onCancel, talents, darkMode, border, subtle }) => {
    const [formData, setFormData] = useState({
      name: '',
      client: '',
      talentPrice: '',
      agencyCommission: '',
      status: 'En cours',
      startDate: '',
      endDate: '',
      talentIds: []
    });

    const talentPriceNum = parseInt(formData.talentPrice) || 0;
    const commissionNum = parseInt(formData.agencyCommission) || 0;
    const agencyEarnings = Math.round(talentPriceNum * (commissionNum / 100));
    const totalBudget = talentPriceNum + agencyEarnings;

    const handleSubmit = (e) => {
      e.preventDefault();
      if (formData.name && formData.client && formData.talentPrice && formData.agencyCommission) {
        onAdd({
          name: formData.name,
          client: formData.client,
          budget: totalBudget,
          talentPrice: talentPriceNum,
          agencyEarnings: agencyEarnings,
          agencyCommission: commissionNum,
          status: formData.status,
          startDate: formData.startDate,
          endDate: formData.endDate,
          talents: formData.talentIds.map(id => ({ talentId: parseInt(id), percentage: 20 }))
        });
        setFormData({ name: '', client: '', talentPrice: '', agencyCommission: '', status: 'En cours', startDate: '', endDate: '', talentIds: [] });
      }
    };

    const muted = darkMode ? 'text-gray-500' : 'text-gray-600';

    return (
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-xs tracking-widest block mb-1">Nom</label>
          <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className={`w-full px-2 py-1 text-sm border ${border} ${subtle}`} required />
        </div>
        <div>
          <label className="text-xs tracking-widest block mb-1">Client</label>
          <input type="text" value={formData.client} onChange={(e) => setFormData({...formData, client: e.target.value})} className={`w-full px-2 py-1 text-sm border ${border} ${subtle}`} required />
        </div>
        <div>
          <label className="text-xs tracking-widest block mb-1">Prix talent (€)</label>
          <input type="number" value={formData.talentPrice} onChange={(e) => setFormData({...formData, talentPrice: e.target.value})} className={`w-full px-2 py-1 text-sm border ${border} ${subtle}`} required />
        </div>
        <div>
          <label className="text-xs tracking-widest block mb-1">Commission agence (%)</label>
          <input type="number" min="0" max="100" value={formData.agencyCommission} onChange={(e) => setFormData({...formData, agencyCommission: e.target.value})} className={`w-full px-2 py-1 text-sm border ${border} ${subtle}`} required />
        </div>
        
        {talentPriceNum > 0 && commissionNum > 0 && (
          <div className={`${subtle} border ${border} p-3 rounded text-xs`}>
            <p>Talent: €{talentPriceNum.toLocaleString()} | Agence: €{agencyEarnings.toLocaleString()} | Total: €{totalBudget.toLocaleString()}</p>
          </div>
        )}

        <div>
          <label className="text-xs tracking-widest block mb-1">Statut</label>
          <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className={`w-full px-2 py-1 text-sm border ${border} ${subtle}`}>
            <option>En cours</option>
            <option>Confirmé</option>
            <option>En attente</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button type="submit" className={`flex-1 py-1 px-2 ${darkMode ? 'bg-white text-black' : 'bg-black text-white'} text-xs tracking-widest`}>Créer</button>
          <button type="button" onClick={onCancel} className={`flex-1 py-1 px-2 border ${border} text-xs tracking-widest`}>Annuler</button>
        </div>
      </form>
    );
  };

  const InviteForm = ({ onInvite, onCancel, darkMode, border, subtle, inviteLink, copiedInvite, setCopiedInvite }) => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
      if (email) {
        onInvite(email);
        setEmail('');
      }
    };

    const copyLink = () => {
      navigator.clipboard.writeText(inviteLink);
      setCopiedInvite(true);
      setTimeout(() => setCopiedInvite(false), 2000);
    };

    const muted = darkMode ? 'text-gray-500' : 'text-gray-600';

    return (
      <div className="space-y-4">
        {!inviteLink ? (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs tracking-widest block mb-2">Email du talent</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`w-full px-3 py-2 border ${border} ${subtle} text-sm`} placeholder="talent@exemple.com" required />
            </div>
            <div className="flex gap-2">
              <button type="submit" className={`flex-1 py-2 px-3 ${darkMode ? 'bg-white text-black' : 'bg-black text-white'} text-sm tracking-widest`}>Générer lien</button>
              <button type="button" onClick={onCancel} className={`flex-1 py-2 px-3 border ${border} text-sm tracking-widest`}>Annuler</button>
            </div>
          </form>
        ) : (
          <div className="space-y-3">
            <p className="text-sm">Lien d'invitation généré ! Partage-le :</p>
            <div className={`border ${border} p-3 rounded flex items-center gap-2`}>
              <input type="text" value={inviteLink} readOnly className={`flex-1 bg-transparent text-xs ${muted}`} />
              <button onClick={copyLink} className={`p-2`}>
                {copiedInvite ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
            <button onClick={onCancel} className={`w-full py-2 px-3 border ${border} text-sm tracking-widest`}>Fermer</button>
          </div>
        )}
      </div>
    );
  };

  const SignupPage = ({ invite, darkMode, onComplete }) => {
    const [formData, setFormData] = useState({
      name: '',
      role: '',
      salary: '',
      status: 'Disponible'
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      if (formData.name && formData.role && formData.salary) {
        onComplete(formData);
      }
    };

    const bg = darkMode ? 'bg-black' : 'bg-white';
    const text = darkMode ? 'text-white' : 'text-black';
    const border = darkMode ? 'border-gray-900' : 'border-gray-100';
    const subtle = darkMode ? 'bg-gray-950' : 'bg-gray-50';
    const muted = darkMode ? 'text-gray-500' : 'text-gray-600';

    return (
      <div className={`${bg} ${text} min-h-screen flex items-center justify-center p-4`}>
        <div className={`${subtle} border ${border} rounded p-8 max-w-md w-full`}>
          <h1 className="text-4xl font-light mb-2">Bienvenue !</h1>
          <p className={`text-sm mb-8 ${muted}`}>Complète ton profil pour rejoindre KALAID SCOPE</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs tracking-widest block mb-2">Nom complet</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className={`w-full px-3 py-2 border ${border} ${subtle}`} required />
            </div>
            <div>
              <label className="text-xs tracking-widest block mb-2">Métier / Rôle</label>
              <input type="text" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className={`w-full px-3 py-2 border ${border} ${subtle}`} placeholder="Ex: Réalisateur, Photographe..." required />
            </div>
            <div>
              <label className="text-xs tracking-widest block mb-2">Tarif mensuel estimé (€)</label>
              <input type="number" value={formData.salary} onChange={(e) => setFormData({...formData, salary: e.target.value})} className={`w-full px-3 py-2 border ${border} ${subtle}`} required />
            </div>
            <div>
              <label className="text-xs tracking-widest block mb-2">Statut</label>
              <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className={`w-full px-3 py-2 border ${border} ${subtle}`}>
                <option>Disponible</option>
                <option>En tournage</option>
                <option>Vacances</option>
              </select>
            </div>
            <button type="submit" className={`w-full py-3 px-4 ${darkMode ? 'bg-white text-black' : 'bg-black text-white'} text-sm tracking-widest font-light`}>
              Rejoindre l'app
            </button>
          </form>
        </div>
      </div>
    );
  };

  const TalentView = ({ talent }) => {
    const talentProjects = getTalentProjects(talent.id);
    return (
      <div className="px-6 lg:px-12 py-12">
        <h1 className="text-6xl lg:text-7xl font-light mb-2">{talent.name}</h1>
        <p className={`text-sm tracking-widest ${muted} mb-12`}>{talent.role}</p>

        <div className={`flex gap-12 border-b ${border} mb-12 overflow-x-auto`}>
          {[{ id: 'summary', label: 'Résumé' }, { id: 'planning', label: 'Planning' }].map(tab => (
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

            <div>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xs tracking-widest uppercase">Projets assignés</h2>
                <button onClick={() => setShowProjectForm(true)} className={`flex items-center gap-2 px-3 py-2 border ${border} text-xs tracking-widest ${hover}`}>
                  <Plus size={14} /> Ajouter
                </button>
              </div>
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
              {[{ label: 'CA', value: `€${projects.reduce((a, b) => a + b.budget, 0).toLocaleString()}` }, { label: 'Projets', value: projects.length }, { label: 'Talents', value: talents.length }, { label: 'En cours', value: projects.filter(p => p.status === 'En cours').length }].map((s, i) => (
                <div key={i} className={`${subtle} p-6 border ${border} text-center`}>
                  <p className={`text-xs tracking-widest mb-4 ${muted}`}>{s.label}</p>
                  <p className="text-2xl font-light">{s.value}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowProjectForm(true)} className={`flex items-center gap-2 px-4 py-3 border ${border} text-sm tracking-widest ${hover}`}>
                <Plus size={16} /> Projet
              </button>
              <button onClick={() => setShowInviteForm(true)} className={`flex items-center gap-2 px-4 py-3 border ${border} text-sm tracking-widest ${hover}`}>
                <Plus size={16} /> Talent
              </button>
            </div>
          </div>
        )}

        {activeTab === 'talents' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xs tracking-widest uppercase">Tous les talents</h2>
              <button onClick={() => setShowInviteForm(true)} className={`flex items-center gap-2 px-3 py-2 border ${border} text-xs tracking-widest ${hover}`}>
                <Plus size={14} /> Inviter
              </button>
            </div>
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
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xs tracking-widest uppercase">Tous les projets</h2>
              <button onClick={() => setShowProjectForm(true)} className={`flex items-center gap-2 px-3 py-2 border ${border} text-xs tracking-widest ${hover}`}>
                <Plus size={14} /> Créer
              </button>
            </div>
            <div className="space-y-4">
              {projects.map(p => (
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

  return (
    <div style={{ fontFamily: '"Futura PT", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }} className={`${bg} ${text} min-h-screen`}>
      <Header />
      {showProjectForm && <ProjectFormModal />}
      {showInviteForm && <InviteFormModal />}
      {userRole === 'talent' && talents.length > 0 && <TalentView talent={talents[0]} />}
      {userRole === 'admin' && <AdminView />}
      <footer className={`border-t ${border} mt-20 py-12 px-6 lg:px-12 text-center text-xs ${muted}`}>
        <p className="tracking-widest">KALAID SCOPE — v1.1 avec invitations</p>
      </footer>
    </div>
  );
}
