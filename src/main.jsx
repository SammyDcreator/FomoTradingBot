import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Bell, ChevronDown, Copy, ExternalLink, LayoutDashboard, Menu, MoreHorizontal, Plus, Search, Settings, Sparkles, TrendingUp, Wallet, Zap } from 'lucide-react';
import './styles.css';

const positions = [
  { token: 'POPCAT', chain: 'SOL', amount: '14,250', value: '$4,887.31', change: '+18.24%', color: '#e7a277', icon: 'P' },
  { token: 'WIF', chain: 'SOL', amount: '6,422', value: '$3,091.07', change: '+9.68%', color: '#8567d6', icon: 'W' },
  { token: 'PEPE', chain: 'ETH', amount: '24.5M', value: '$2,403.50', change: '+4.12%', color: '#55bf65', icon: 'P' },
];

function App() {
  const [connected, setConnected] = useState(false);
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const wallet = '6RkH...XvP9';
  const copy = () => { navigator.clipboard?.writeText('6RkHhkjQ5b5CPLnVL2fs35qfs91XvP9'); setCopied(true); setTimeout(() => setCopied(false), 1500); };
  return <main className="shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark"><Zap size={19} fill="currentColor" /></div><span>Fomo<span>Bot</span></span></div>
      <nav>
        <a className="active"><LayoutDashboard size={19}/> Overview</a>
        <a><TrendingUp size={19}/> Trade</a>
        <a><Wallet size={19}/> Portfolio</a>
        <a><Sparkles size={19}/> Alerts <i>New</i></a>
      </nav>
      <div className="side-bottom"><a><Settings size={19}/> Settings</a><div className="telegram"><div className="tg-icon">➤</div><div><b>Telegram is connected</b><small>@fomotrader</small></div><span className="online"/></div></div>
    </aside>
    <section className="content">
      <header><button className="menu"><Menu size={22}/></button><div className="welcome"><p>Good morning, trader <span>✦</span></p><small>Here’s what’s happening with your portfolio.</small></div><div className="header-actions"><button className="round"><Bell size={18}/><em/></button><button className="account" onClick={() => setOpen(!open)}><div className="avatar">FT</div><span>Fomo Trader</span><ChevronDown size={16}/></button>{open && <div className="account-menu">Account settings<br/><small>Signed in via Telegram</small></div>}</div></header>
      <div className="hero"><div><p className="eyebrow">TOTAL PORTFOLIO VALUE</p><div className="balance">$24,780<span>.52</span></div><div className="gain"><TrendingUp size={16}/> <b>+$1,936.42 (8.47%)</b><span> today</span></div></div><div className="hero-actions"><button className="ghost" onClick={copy}>{copied ? 'Address copied!' : <><Copy size={16}/> Copy address</>}</button><button className="primary" onClick={() => setConnected(!connected)}><Wallet size={17}/>{connected ? wallet : 'Connect wallet'}</button></div></div>
      <section className="metrics"><article><p>24H VOLUME</p><strong>$12,948.26</strong><small className="up">↑ 24.8%</small></article><article><p>OPEN POSITIONS</p><strong>03</strong><small>Across 2 chains</small></article><article><p>WIN RATE</p><strong>68.4%</strong><small className="up">↑ 5.2% this week</small></article></section>
      <section className="grid"><article className="panel positions"><div className="panel-heading"><div><h2>Your positions</h2><p>Assets you’re currently holding</p></div><button className="view">View all <span>→</span></button></div><div className="table"><div className="table-head"><span>ASSET</span><span>AMOUNT</span><span>VALUE</span><span>24H</span><span/></div>{positions.map(p => <div className="row" key={p.token}><div className="asset"><b style={{background:p.color}}>{p.icon}</b><div><strong>{p.token}</strong><small>{p.chain}</small></div></div><span>{p.amount}</span><span>{p.value}</span><span className="up">{p.change}</span><MoreHorizontal size={19}/></div>)}</div></article>
      <article className="panel activity"><div className="panel-heading"><div><h2>Recent activity</h2><p>Your latest bot activity</p></div><button className="dots"><MoreHorizontal size={20}/></button></div><div className="activity-item"><div className="activity-icon purple"><Zap size={18}/></div><div><strong>Buy order filled</strong><p>POPCAT · 14,250 tokens</p></div><span>12m ago</span></div><div className="activity-item"><div className="activity-icon green"><TrendingUp size={18}/></div><div><strong>Take profit triggered</strong><p>WIF · +32.4% profit</p></div><span>2h ago</span></div><div className="activity-item"><div className="activity-icon blue"><Bell size={18}/></div><div><strong>Price alert</strong><p>PEPE crossed $0.0000098</p></div><span>5h ago</span></div><button className="activity-footer">View all activity <ExternalLink size={14}/></button></article></section>
      <section className="quick"><div><p className="eyebrow">QUICK TRADE</p><h2>Ready for your next move?</h2><span>Search any token to trade instantly through Fomo Trading Bot.</span></div><button className="search"><Search size={18}/> Search tokens <kbd>⌘ K</kbd></button><button className="trade-btn"><Plus size={18}/> New trade</button></section>
    </section>
  </main>;
}
createRoot(document.getElementById('root')).render(<App/>);
