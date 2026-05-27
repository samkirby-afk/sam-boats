import Head from 'next/head';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const FILTERS = ['All', 'Fishing', 'Pontoon', 'Tritoon', 'Bowrider', 'Deck Boat', 'Offshore'];

export default function Inventory() {
  const [boats, setBoats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchBoats() {
      const { data } = await supabase
        .from('boats')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false });
      setBoats(data || []);
      setLoading(false);
    }
    fetchBoats();
  }, []);

  const filtered = boats.filter(b => {
    const matchFilter = filter === 'All' || (b.boat_type || '').toLowerCase().includes(filter.toLowerCase());
    const matchSearch = !search || [b.make, b.model, b.year, b.boat_type, b.description]
      .some(f => (f || '').toString().toLowerCase().includes(search.toLowerCase()));
    return matchFilter && matchSearch;
  });

  function formatPrice(p) {
    if (!p) return 'Call for Price';
    return '$' + Number(p).toLocaleString();
  }

  return (
    <>
      <Head>
        <title>Boat Inventory | Sam Kirby — Destin, FL</title>
        <meta name="description" content="Browse Sam Kirby's full boat inventory in Destin, FL. Fishing boats, pontoons, bowriders and more." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      </Head>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --navy: #0a1628; --navy-mid: #112240; --navy-light: #1a3a5c;
          --gold: #c8a96e; --gold-light: #e4c98a;
          --sand: #f5f0e8; --white: #ffffff;
          --muted: rgba(245,240,232,0.55);
          --serif: 'Cormorant Garamond', Georgia, serif;
          --sans: 'DM Sans', system-ui, sans-serif;
        }
        body { background: var(--navy); color: var(--sand); font-family: var(--sans); font-weight: 300; line-height: 1.7; min-height: 100vh; }
        body::before { content:''; position:fixed; inset:0; background: radial-gradient(ellipse 80% 50% at 20% 10%, rgba(26,58,92,0.5) 0%, transparent 60%); pointer-events:none; z-index:0; }
        nav { position:sticky; top:0; z-index:100; padding:1.2rem 3rem; display:flex; align-items:center; justify-content:space-between; background:rgba(10,22,40,.97); backdrop-filter:blur(8px); border-bottom:1px solid rgba(200,169,110,.1); }
        .nav-logo { font-family:var(--serif); font-size:1.2rem; font-weight:300; letter-spacing:.12em; color:var(--gold); text-transform:uppercase; text-decoration:none; }
        .nav-back { color:var(--muted); font-size:.78rem; letter-spacing:.12em; text-transform:uppercase; text-decoration:none; transition:color .3s; }
        .nav-back:hover { color:var(--gold); }
        .page-header { position:relative; z-index:1; text-align:center; padding:5rem 2rem 3rem; }
        .page-eyebrow { font-size:.72rem; letter-spacing:.25em; text-transform:uppercase; color:var(--gold); margin-bottom:1rem; }
        .page-title { font-family:var(--serif); font-size:clamp(2.5rem,6vw,5rem); font-weight:300; color:var(--white); line-height:1; }
        .page-title em { font-style:italic; color:var(--gold); }
        .page-sub { color:var(--muted); font-size:.95rem; margin-top:1rem; }
        .controls { position:relative; z-index:1; max-width:1100px; margin:0 auto 2rem; padding:0 2rem; display:flex; gap:1rem; flex-wrap:wrap; align-items:center; }
        .search-input { flex:1; min-width:200px; background:rgba(26,58,92,.4); border:1px solid rgba(200,169,110,.2); color:var(--sand); padding:.7rem 1rem; font-family:var(--sans); font-size:.88rem; outline:none; border-radius:1px; }
        .search-input::placeholder { color:rgba(245,240,232,.3); }
        .search-input:focus { border-color:rgba(200,169,110,.5); }
        .filter-btns { display:flex; gap:.5rem; flex-wrap:wrap; }
        .filter-btn { background:transparent; border:1px solid rgba(200,169,110,.25); color:var(--muted); padding:.45rem 1rem; font-size:.75rem; font-family:var(--sans); letter-spacing:.08em; text-transform:uppercase; cursor:pointer; transition:all .2s; border-radius:1px; }
        .filter-btn.active { background:var(--gold); border-color:var(--gold); color:var(--navy); font-weight:500; }
        .filter-btn:hover:not(.active) { border-color:var(--gold); color:var(--gold); }
        .count { color:var(--muted); font-size:.8rem; letter-spacing:.05em; white-space:nowrap; }
        .grid { position:relative; z-index:1; max-width:1100px; margin:0 auto; padding:0 2rem 5rem; display:grid; grid-template-columns:repeat(3,1fr); gap:1.5px; background:rgba(200,169,110,.12); }
        .boat-card { background:var(--navy-mid); overflow:hidden; transition:background .3s; display:flex; flex-direction:column; }
        .boat-card:hover { background:var(--navy-light); }
        .boat-img { width:100%; height:200px; object-fit:cover; display:block; background:var(--navy-light); }
        .boat-img-placeholder { width:100%; height:200px; background:linear-gradient(135deg,rgba(26,58,92,.8),rgba(17,34,64,.9)); display:flex; align-items:center; justify-content:center; font-size:3rem; }
        .boat-body { padding:1.5rem; flex:1; display:flex; flex-direction:column; }
        .boat-type { font-size:.68rem; letter-spacing:.15em; text-transform:uppercase; color:var(--gold); margin-bottom:.5rem; }
        .boat-name { font-family:var(--serif); font-size:1.3rem; font-weight:400; color:var(--white); margin-bottom:.3rem; line-height:1.2; }
        .boat-specs { font-size:.78rem; color:var(--muted); margin-bottom:.8rem; }
        .boat-desc { font-size:.82rem; color:var(--muted); line-height:1.6; flex:1; margin-bottom:1rem; }
        .boat-footer { display:flex; align-items:center; justify-content:space-between; padding-top:1rem; border-top:1px solid rgba(200,169,110,.12); }
        .boat-price { font-family:var(--serif); font-size:1.5rem; font-weight:300; color:var(--gold); }
        .boat-cta { background:var(--gold); color:var(--navy); border:none; padding:.5rem 1rem; font-size:.72rem; font-family:var(--sans); font-weight:500; letter-spacing:.08em; text-transform:uppercase; cursor:pointer; text-decoration:none; display:inline-block; transition:background .2s; border-radius:1px; }
        .boat-cta:hover { background:var(--gold-light); }
        .empty { position:relative; z-index:1; text-align:center; padding:5rem 2rem; }
        .empty h3 { font-family:var(--serif); font-size:2rem; color:var(--gold); margin-bottom:1rem; }
        .empty p { color:var(--muted); }
        .loading-state { position:relative; z-index:1; text-align:center; padding:5rem; }
        .loading-state p { font-family:var(--serif); font-size:1.5rem; color:var(--gold); font-style:italic; }
        footer { position:relative; z-index:1; border-top:1px solid rgba(200,169,110,.1); padding:2rem; text-align:center; }
        .footer-links { display:flex; justify-content:center; gap:2rem; list-style:none; margin-bottom:1rem; flex-wrap:wrap; }
        .footer-links a { color:var(--muted); font-size:.78rem; letter-spacing:.1em; text-transform:uppercase; text-decoration:none; transition:color .3s; }
        .footer-links a:hover { color:var(--gold); }
        .footer-copy { font-size:.72rem; color:rgba(245,240,232,.25); }
        @media(max-width:768px){
          nav{padding:1rem 1.5rem;}
          .grid{grid-template-columns:1fr;}
          .controls{flex-direction:column;align-items:stretch;}
        }
        @media(min-width:769px) and (max-width:1024px){
          .grid{grid-template-columns:repeat(2,1fr);}
        }
      `}</style>

      <nav>
        <a href="/" className="nav-logo">Sam Kirby — Marine</a>
        <a href="/" className="nav-back">← Back to Home</a>
      </nav>

      <div className="page-header">
        <p className="page-eyebrow">Current Inventory — Destin, Florida</p>
        <h1 className="page-title">Sam's <em>Boats</em></h1>
        <p className="page-sub">Every boat personally known. Every deal handled start to finish.</p>
      </div>

      <div className="controls">
        <input className="search-input" placeholder="Search make, model, type..." value={search} onChange={e => setSearch(e.target.value)} />
        <div className="filter-btns">
          {FILTERS.map(f => (
            <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
        {!loading && <span className="count">{filtered.length} boat{filtered.length !== 1 ? 's' : ''}</span>}
      </div>

      {loading ? (
        <div className="loading-state"><p>Loading inventory...</p></div>
      ) : filtered.length === 0 ? (
        <div className="empty">
          <h3>No boats match that filter.</h3>
          <p>Try a different search or <a href="tel:8503077571" style={{color:'var(--gold)'}}>call Sam at (850) 307-7571</a> — he knows every boat in stock.</p>
        </div>
      ) : (
        <div className="grid">
          {filtered.map(boat => (
            <div className="boat-card" key={boat.id}>
              {boat.image_url
                ? <img className="boat-img" src={boat.image_url} alt={`${boat.year} ${boat.make} ${boat.model}`} />
                : <div className="boat-img-placeholder">⚓</div>
              }
              <div className="boat-body">
                {boat.boat_type && <p className="boat-type">{boat.boat_type}</p>}
                <h2 className="boat-name">{boat.year} {boat.make} {boat.model}</h2>
                <p className="boat-specs">
                  {[boat.length_ft && `${boat.length_ft}ft`, boat.condition].filter(Boolean).join(' · ')}
                </p>
                {boat.description && <p className="boat-desc">{boat.description}</p>}
                <div className="boat-footer">
                  <span className="boat-price">{formatPrice(boat.price)}</span>
                  <a href={`/#contact`} className="boat-cta">Inquire →</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <footer>
        <ul className="footer-links">
          <li><a href="/">Home</a></li>
          <li><a href="/#chat">Find My Boat</a></li>
          <li><a href="/#contact">Contact Sam</a></li>
          <li><a href="tel:8503077571">(850) 307-7571</a></li>
        </ul>
        <p className="footer-copy">© 2026 Sam Kirby — Marine Sales Specialist, Destin, FL.</p>
      </footer>
    </>
  );
}
