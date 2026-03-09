import React, { useState } from 'react';
import { ChevronLeft, Menu, X, Moon, Sun } from 'lucide-react';

export default function KalaidScopeApp() {
  const [userRole, setUserRole] = useState('admin');
  const [darkMode, setDarkMode] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedTalent, setSelectedTalent] = useState(null);
  const [activeTab, setActiveTab] = useState('summary');
  const [filterStatus, setFilterStatus] = useState('all');

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
      projects: [
        { date: '15 mars', name: 'Campagne Moynat', status: 'confirmé', earnings: '€12,500', day: 15 },
        { date: '22 mars', name: 'Shooting Dior Parfums', status: 'confirmé', earnings: '€8,900', day: 22 }
      ],
      salary: { gross: 21400, commission: 3210, net: 18190 },
      contracts: {
        representation: {
          signedDate: '12 jan 2026',
          endDate: '12 jan 2028',
          commissions: { agencyBrings: 20, talentBrings: 15, rights: 10 },
          exclusive: true
        },
        cessions: [
          { projectName: 'Campagne Moynat', client: 'Moynat', budget: 12500, appliedCommission: 20, talentEarnings: 10000, status: 'signed' }
        ]
      }
    },
    { id: 2, name: 'Pierre Mossé', role: 'Réalisateur', status: 'En tournage', monthlyEarnings: '€15,600', projects: [], salary: { gross: 16800, commission: 1200, net: 15600 }, contracts: { representation: { commissions: { agencyBrings: 15, talentBrings: 10, rights: 5 }, exclusive: true }, cessions: [] } },
    { id: 3, name: 'Sophie Durand', role: 'Styliste', status: 'Vacances', monthlyEarnings: '€12,400', projects: [], salary: { gross: 13200, commission: 800, net: 12400 }, contracts: { representation: { commissions: { agencyBrings: 20, talentBrings: 15, rights: 10 }, exclusive: false }, cessions: [] } }
  ];

  const projects = [
    { id: 1, name: 'Campagne Moynat', client: 'Moynat', budget: 25000, status: 'En cours', createdBy: 'agent', talents: [{ talentId: 1, percentage: 20 }] },
    { id: 2, name: 'Shooting Dior', client: 'Dior Beauty', budget: 18000, status: 'Confirmé', createdBy: 'admin', talents: [{ talentId: 1, percentage: 25 }] }
  ];

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

  const TalentView = ({ talent }) => (
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
            {[{ label: 'Projets', value: talent.projects.length }, { label: 'Revenus', value: talent.monthlyEarnings }, { label: 'Contrats', value: talent.contracts.cessions.length + 1 }].map((s, i) => (
              <div key={i} className={`${subtle} p-8 border ${border} text-center`}>
                <p className={`text-xs tracking-widest mb-4 ${muted}`}>{s.label}</p>
                <p className="text-2xl font-light">{s.value}</p>
              </div>
            ))}
          </div>

          <div className="mb-16">
            <h2 className="text-xs tracking-widest mb-8 uppercase">Statut représentation</h2>
            <div className={`${subtle} border ${border} p-8`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-light mb-2">Contrat {talent.contracts.representation.exclusive ? 'exclusif' : 'non exclusif'}</p>
                  <p className={`text-sm ${muted}`}>Jusqu'au {talent.contracts.representation.endDate}</p>
                </div>
                <span className={`text-xs tracking-widest px-3 py-1 ${talent.contracts.representation.exclusive ? `${darkMode ? 'bg-purple-950 text-purple-400' : 'bg-purple-100 text-purple-800'}` : `${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-600'}`}`}>
                  {talent.contracts.representation.exclusive ? 'EXCLUSIF' : 'NON EXCLUSIF'}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xs tracking-widest mb-8 uppercase">Prochains projets</h2>
            <div className="space-y-3">
              {talent.projects.slice(0, 3).map((p, i) => (
                <div key={i} className={`flex justify-between py-4 px-6 border ${border} ${hover}`}>
                  <div><p className={`text-xs ${muted} mb-1`}>{p.date}</p><p className="font-light">{p.name}</p></div>
                  <p className="text-lg font-light">{p.earnings}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'planning' && (
        <div>
          <h3 className="text-xs tracking-widest mb-8 uppercase">Calendrier mars 2026</h3>
          <div className={`border ${border} p-6 mb-12`}>
            <div className="grid grid-cols-7 gap-2 mb-6">
              {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
                <div key={day} className="text-center"><p className={`text-xs tracking-widest ${muted}`}>{day}</p></div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2 mb-12">
              {[...Array(31)].map((_, i) => {
                const day = i + 1;
                const hasEvent = talent.projects.some(p => p.day === day);
                return (
                  <div key={i} className={`aspect-square flex items-center justify-center text-sm font-light transition ${hasEvent ? `${darkMode ? 'bg-white text-black' : 'bg-black text-white'}` : `${subtle} border ${border}`}`}>
                    {day}
                  </div>
                );
              })}
            </div>
          </div>

          <h3 className="text-xs tracking-widest mb-8 uppercase">Détail des projets</h3>
          <div className="space-y-3">
            {talent.projects.length > 0 ? (
              talent.projects.map((p, i) => (
                <div key={i} className={`flex justify-between py-4 px-6 border ${border}`}>
                  <div><p className={`text-xs ${muted} mb-1`}>{p.date}</p><p className="font-light">{p.name}</p></div>
                  <p className="text-lg font-light">{p.earnings}</p>
                </div>
              ))
            ) : (
              <p className={`text-sm ${muted} text-center py-8`}>Aucun projet ce mois</p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'contracts' && (
        <div>
          <h3 className="text-xs tracking-widest mb-8 uppercase">Contrat de représentation</h3>
          <div className={`${subtle} border ${border} p-6 mb-12`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-light mb-2">Contrat {talent.contracts.representation.exclusive ? 'exclusif' : 'non exclusif'}</p>
                <p className={`text-sm ${muted}`}>Signé le {talent.contracts.representation.signedDate}</p>
              </div>
              <span className={`text-xs tracking-widest px-3 py-1 ${talent.contracts.representation.exclusive ? `${darkMode ? 'bg-purple-950 text-purple-400' : 'bg-purple-100 text-purple-800'}` : `${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-600'}`}`}>
                {talent.contracts.representation.exclusive ? 'EXCLUSIF' : 'NON EXCLUSIF'}
              </span>
            </div>
          </div>

          <h3 className="text-xs tracking-widest mb-8 uppercase">Contrats de cession</h3>
          {talent.contracts.cessions.length > 0 ? (
            talent.contracts.cessions.map((c, i) => (
              <div key={i} className={`border ${border} p-6 mb-4`}>
                <p className="font-light">{c.projectName}</p>
                <p className={`text-xs ${muted} mt-2`}>{c.client} - €{c.budget.toLocaleString()}</p>
              </div>
            ))
          ) : (
            <p className={`text-sm ${muted}`}>Aucun contrat de cession</p>
          )}
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

          <h3 className="text-xs tracking-widest mb-8 uppercase">Commissions contractuelles</h3>
          <div className="grid grid-cols-3 gap-4">
            {[{ label: 'Agence apporte', value: `${talent.contracts.representation.commissions.agencyBrings}%` }, { label: 'Talent apporte', value: `${talent.contracts.representation.commissions.talentBrings}%` }, { label: 'Droits', value: `${talent.contracts.representation.commissions.rights}%` }].map((s, i) => (
              <div key={i} className={`border ${border} p-4 text-center`}>
                <p className={`text-xs ${muted} mb-2`}>{s.label}</p>
                <p className="text-xl font-light">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

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

            <div className="mb-16">
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

            <div>
              <h2 className="text-xs tracking-widest mb-8 uppercase">Mes projets en cours</h2>
              <div className="space-y-3">
                {projects.filter(p => p.createdBy === 'agent').slice(0, 2).map(p => (
                  <div key={p.id} className={`border ${border} p-6`}>
                    <p className="font-light">{p.name}</p>
                    <p className={`text-xs ${muted} mt-1`}>{p.client} - €{p.budget.toLocaleString()}</p>
                  </div>
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
            <h2 className="text-xs tracking-widest mb-8 uppercase">Projets créés</h2>
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
        <h1 className="text-6xl lg:text-7xl font-light mb-2">Admin</h1>
        <p className={`text-sm tracking-widest ${muted} mb-12`}>Gestion complète</p>

        <div className={`flex gap-12 border-b ${border} mb-12 overflow-x-auto`}>
          {[{ id: 'summary', label: 'Résumé' }, { id: 'overview', label: 'Aperçu' }, { id: 'talents', label: 'Talents' }, { id: 'contracts', label: 'Contrats' }, { id: 'projects', label: 'Projets' }].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`text-sm tracking-widest py-4 border-b-2 whitespace-nowrap transition ${activeTab === tab.id ? 'border-current' : 'border-transparent ' + muted}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'summary' && (
          <div>
            <div className="grid grid-cols-4 gap-6 mb-16">
              {[{ label: 'Chiffre d\'affaires', value: '€156,200' }, { label: 'Commissions agence', value: '€23,430' }, { label: 'Talents rémunérés', value: '€132,770' }, { label: 'Projets actifs', value: '12' }].map((s, i) => (
                <div key={i} className={`${subtle} p-6 border ${border} text-center`}>
                  <p className={`text-xs tracking-widest mb-4 ${muted}`}>{s.label}</p>
                  <p className="text-2xl font-light">{s.value}</p>
                </div>
              ))}
            </div>

            <div className="mb-16">
              <h2 className="text-xs tracking-widest mb-8 uppercase">Paiements à venir — 31 mars</h2>
              <div className="space-y-3">
                {talents.map((t, i) => (
                  <div key={i} className={`flex justify-between py-4 px-6 border ${border}`}>
                    <p className="font-light">{t.name}</p>
                    <p className="text-lg font-light">{t.monthlyEarnings}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xs tracking-widest mb-8 uppercase">Talents actifs</h2>
              <div className="space-y-3">
                {talents.slice(0, 3).map(t => (
                  <div key={t.id} className={`flex justify-between py-4 px-6 border ${border}`}>
                    <div><p className="font-light">{t.name}</p><p className={`text-xs ${muted} mt-1`}>{t.role}</p></div>
                    <p className={`text-xs px-3 py-1 ${t.status === 'Disponible' ? `${darkMode ? 'bg-green-950 text-green-400' : 'bg-green-100 text-green-800'}` : subtle}`}>{t.status}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'overview' && (
          <div>
            <h2 className="text-xs tracking-widest mb-8 uppercase">Mars 2026 — Détails financiers</h2>
            <div className="grid grid-cols-4 gap-6">
              {[{ label: 'CA', value: '€156,200' }, { label: 'Commissions', value: '€23,430' }, { label: 'Talents rému', value: '€132,770' }, { label: 'Projets', value: '12' }].map((s, i) => (
                <div key={i} className={`${subtle} p-6 border ${border} text-center`}>
                  <p className={`text-xs tracking-widest mb-4 ${muted}`}>{s.label}</p>
                  <p className="text-2xl font-light">{s.value}</p>
                </div>
              ))}
            </div>
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

        {activeTab === 'contracts' && (
          <div>
            <h2 className="text-xs tracking-widest mb-8 uppercase">Contrats de représentation</h2>
            <div className="space-y-3 mb-16">
              {talents.map(t => (
                <div key={t.id} className={`border ${border} p-6`}>
                  <div className="flex items-center justify-between mb-4">
                    <div><p className="font-light">{t.name}</p><p className={`text-xs ${muted} mt-1`}>Actif</p></div>
                    <span className={`text-xs tracking-widest px-3 py-1 ${t.contracts.representation.exclusive ? `${darkMode ? 'bg-purple-950 text-purple-400' : 'bg-purple-100 text-purple-800'}` : `${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-600'}`}`}>
                      {t.contracts.representation.exclusive ? 'EXCLUSIF' : 'NON EXCLUSIF'}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-xs">
                    {[{ label: 'Agence apporte', v: t.contracts.representation.commissions.agencyBrings }, { label: 'Talent apporte', v: t.contracts.representation.commissions.talentBrings }, { label: 'Droits', v: t.contracts.representation.commissions.rights }].map((c, i) => (
                      <div key={i}><p className={muted}>{c.label}</p><p className="font-light mt-1">{c.v}%</p></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <h2 className="text-xs tracking-widest mb-8 uppercase">Contrats de cession</h2>
            <div className="space-y-3">
              {talents.filter(t => t.contracts.cessions.length > 0).map(t => (
                t.contracts.cessions.map((c, i) => (
                  <div key={`${t.id}-${i}`} className={`border ${border} p-6`}>
                    <div className="flex justify-between mb-3">
                      <div><p className="font-light">{c.projectName}</p><p className={`text-xs ${muted} mt-1`}>{t.name}</p></div>
                      <span className={`text-xs tracking-widest px-3 py-1 ${c.status === 'signed' ? `${darkMode ? 'bg-blue-950 text-blue-400' : 'bg-blue-100 text-blue-800'}` : subtle}`}>{c.status === 'signed' ? 'SIGNÉ' : 'EN ATTENTE'}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-xs">
                      <div><p className={muted}>Budget</p><p className="font-light mt-1">€{c.budget.toLocaleString()}</p></div>
                      <div><p className={muted}>Commission</p><p className="font-light mt-1">{c.appliedCommission}%</p></div>
                      <div><p className={muted}>Talent gagne</p><p className="font-light mt-1">€{c.talentEarnings.toLocaleString()}</p></div>
                      <div><p className={muted}>Agence gagne</p><p className="font-light mt-1">€{(c.budget - c.talentEarnings).toLocaleString()}</p></div>
                    </div>
                  </div>
                ))
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
                  <div className={`text-xs ${muted}`}>
                    {p.talents.map(t => {
                      const talent = talents.find(ta => ta.id === t.talentId);
                      return <p key={t.talentId}>{talent?.name}: <span className="font-light">{t.percentage}%</span></p>;
                    })}
                  </div>
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
      {userRole === 'talent' && <TalentView talent={talents[0]} />}
      {userRole === 'agent' && <AgentView />}
      {userRole === 'admin' && <AdminView />}
      <footer className={`border-t ${border} mt-20 py-12 px-6 lg:px-12 text-center text-xs ${muted}`}>
        <p className="tracking-widest">KALAID SCOPE — v0.8 PROTOTYPE</p>
      </footer>
    </div>
  );
}
