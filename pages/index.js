import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hey! I'm Sam Kirby's AI assistant. Tell me what you're looking for — budget, how you plan to use it, how many people, saltwater or freshwater — and I'll match you to the best boat in Sam's current inventory. What are you thinking? 🎣⚓" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [formStatus, setFormStatus] = useState('idle'); // idle | sending | done
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function sendMessage(text) {
    const userText = text || input.trim();
    if (!userText) return;
    setShowSuggestions(false);
    setInput('');
    const newHistory = [...history, { role: 'user', content: userText }];
    setHistory(newHistory);
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newHistory })
      });
      const data = await res.json();
      const reply = data.reply || "Something went wrong — try again or call Sam at (850) 307-7571!";
      setHistory(prev => [...prev, { role: 'assistant', content: reply }]);
      setMessages(prev => [...prev, { role: 'bot', text: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'bot', text: "Something went wrong. Call or text Sam directly at (850) 307-7571!" }]);
    }
    setLoading(false);
  }

  async function submitForm(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const firstName = fd.get('firstName')?.trim();
    const phone = fd.get('phone')?.trim();
    const email = fd.get('email')?.trim();
    if (!firstName || (!phone && !email)) {
      alert('Please fill in your name and at least a phone or email.');
      return;
    }
    setFormStatus('sending');
    try {
      const res = await fetch('https://formspree.io/f/xredrbdg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${firstName} ${fd.get('lastName') || ''}`.trim(),
          phone: phone || 'Not provided',
          email: email || 'Not provided',
          boat_type: fd.get('boatType') || 'Not specified',
          budget: fd.get('budget') || 'Not specified',
          message: fd.get('notes') || 'No details provided',
          _subject: `New boat lead: ${firstName} — ${fd.get('boatType') || 'General inquiry'}`
        })
      });
      if (res.ok) setFormStatus('done');
      else throw new Error();
    } catch {
      setFormStatus('idle');
      alert('Something went wrong. Please call or text Sam at (850) 307-7571.');
    }
  }

  const suggestions = ['Fishing under $50k', 'Family pontoon', 'Offshore capable', 'First time buyer', 'Something fast', 'Under $30k'];

  return (
    <>
      <Head>
        <title>Sam Kirby | Marine Sales Specialist — Destin, FL</title>
        <meta name="description" content="Sam Kirby — Marine Sales Specialist in Destin, FL with 15 years experience. Browse 29 boats, chat with AI to find your perfect match." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
        html { scroll-behavior: smooth; }
        body { background: var(--navy); color: var(--sand); font-family: var(--sans); font-weight: 300; line-height: 1.7; overflow-x: hidden; }
        body::before { content:''; position:fixed; inset:0; background: radial-gradient(ellipse 80% 50% at 20% 10%, rgba(26,58,92,0.6) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(10,22,40,0.8) 0%, transparent 60%); pointer-events:none; z-index:0; }
        a { color: inherit; text-decoration: none; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes wave { 0%,100% { transform:scaleX(1) translateX(0); opacity:.6; } 50% { transform:scaleX(1.02) translateX(-10px); opacity:1; } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:.5; } }
        @keyframes msgIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes blink { 0%,100% { opacity:.4; transform:translateY(0); } 50% { opacity:1; transform:translateY(-4px); } }
        .fade1 { animation: fadeUp .8s ease both; }
        .fade2 { animation: fadeUp .8s .15s ease both; }
        .fade3 { animation: fadeUp .8s .3s ease both; }
        .fade4 { animation: fadeUp .8s .45s ease both; }
        nav { position:fixed; top:0; left:0; right:0; z-index:100; padding:1.5rem 3rem; display:flex; align-items:center; justify-content:space-between; background:linear-gradient(to bottom, rgba(10,22,40,.97), transparent); backdrop-filter:blur(8px); }
        .nav-logo { font-family:var(--serif); font-size:1.2rem; font-weight:300; letter-spacing:.12em; color:var(--gold); text-transform:uppercase; }
        .nav-links { display:flex; gap:2.5rem; list-style:none; }
        .nav-links a { color:var(--muted); font-size:.78rem; letter-spacing:.12em; text-transform:uppercase; transition:color .3s; }
        .nav-links a:hover { color:var(--gold); }
        .hero { position:relative; z-index:1; min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:8rem 2rem 6rem; overflow:hidden; }
        .hero::before { content:''; position:absolute; bottom:0; left:0; right:0; height:300px; background:linear-gradient(to bottom, transparent, var(--navy)); z-index:2; }
        .water-lines { position:absolute; bottom:80px; left:0; right:0; height:120px; z-index:1; opacity:.12; overflow:hidden; }
        .wl { height:1px; background:linear-gradient(90deg, transparent, var(--gold), transparent); margin:14px 0; animation:wave 6s ease-in-out infinite; }
        .wl:nth-child(2){animation-delay:-1s;animation-duration:7s;margin-left:5%;width:90%;}
        .wl:nth-child(3){animation-delay:-2s;animation-duration:5s;margin-left:2%;width:96%;}
        .wl:nth-child(4){animation-delay:-3s;animation-duration:8s;}
        .wl:nth-child(5){animation-delay:-1.5s;animation-duration:6.5s;margin-left:8%;width:84%;}
        .eyebrow { font-size:.72rem; letter-spacing:.25em; text-transform:uppercase; color:var(--gold); margin-bottom:1.8rem; }
        .hero-name { font-family:var(--serif); font-size:clamp(4rem,10vw,8rem); font-weight:300; line-height:.95; color:var(--white); }
        .hero-name em { font-style:italic; color:var(--gold); display:block; }
        .hero-tag { font-family:var(--serif); font-size:clamp(1.1rem,2.5vw,1.5rem); font-style:italic; color:var(--muted); margin:2rem 0 3.5rem; max-width:520px; }
        .hero-btns { display:flex; gap:1rem; flex-wrap:wrap; justify-content:center; }
        .btn-gold { background:var(--gold); color:var(--navy); border:none; padding:1rem 2.2rem; font-family:var(--sans); font-size:.8rem; font-weight:500; letter-spacing:.1em; text-transform:uppercase; cursor:pointer; display:inline-block; transition:background .3s,transform .2s; }
        .btn-gold:hover { background:var(--gold-light); transform:translateY(-2px); }
        .btn-outline { background:transparent; color:var(--sand); border:1px solid rgba(200,169,110,.4); padding:1rem 2.2rem; font-family:var(--sans); font-size:.8rem; letter-spacing:.1em; text-transform:uppercase; cursor:pointer; display:inline-block; transition:border-color .3s,color .3s,transform .2s; }
        .btn-outline:hover { border-color:var(--gold); color:var(--gold); transform:translateY(-2px); }
        .stats { position:relative; z-index:1; display:flex; justify-content:center; padding:3rem 2rem; max-width:900px; margin:0 auto; border-top:1px solid rgba(200,169,110,.15); border-bottom:1px solid rgba(200,169,110,.15); }
        .stat { flex:1; text-align:center; padding:0 2rem; border-right:1px solid rgba(200,169,110,.15); }
        .stat:last-child { border-right:none; }
        .stat-n { font-family:var(--serif); font-size:2.8rem; font-weight:300; color:var(--gold); line-height:1; display:block; }
        .stat-l { font-size:.7rem; letter-spacing:.15em; text-transform:uppercase; color:var(--muted); margin-top:.5rem; display:block; }
        .section { position:relative; z-index:1; max-width:1100px; margin:5rem auto; padding:0 2rem; }
        .section-hdr { text-align:center; margin-bottom:3.5rem; }
        .sec-label { font-size:.7rem; letter-spacing:.2em; text-transform:uppercase; color:var(--gold); margin-bottom:1rem; }
        .sec-title { font-family:var(--serif); font-size:clamp(2rem,4vw,3rem); font-weight:300; color:var(--white); }
        .sec-title em { font-style:italic; color:var(--gold); }
        .about-grid { display:grid; grid-template-columns:1fr 1fr; gap:6rem; align-items:center; }
        .about-text { color:var(--muted); font-size:.95rem; line-height:1.9; margin-bottom:1.2rem; }
        .quote-card { background:linear-gradient(135deg,rgba(26,58,92,.6),rgba(17,34,64,.8)); border:1px solid rgba(200,169,110,.2); padding:3rem; position:relative; overflow:hidden; }
        .quote-card::before { content:'"'; position:absolute; top:-.5rem; left:1.5rem; font-family:var(--serif); font-size:8rem; color:var(--gold); opacity:.12; line-height:1; }
        .quote-text { font-family:var(--serif); font-size:1.3rem; font-style:italic; font-weight:300; line-height:1.6; color:var(--sand); margin-bottom:1.5rem; }
        .quote-cite { font-size:.75rem; letter-spacing:.1em; text-transform:uppercase; color:var(--gold); }
        .types-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1.5px; background:rgba(200,169,110,.15); }
        .type-card { background:var(--navy-mid); padding:2.5rem 2rem; text-align:center; transition:background .3s; }
        .type-card:hover { background:var(--navy-light); }
        .type-icon { font-size:2rem; margin-bottom:1rem; display:block; }
        .type-name { font-family:var(--serif); font-size:1.2rem; font-weight:400; color:var(--white); margin-bottom:.5rem; }
        .type-desc { font-size:.8rem; color:var(--muted); line-height:1.6; }
        .inv-banner { background:linear-gradient(135deg,rgba(26,58,92,.7),rgba(17,34,64,.9)); border:1px solid rgba(200,169,110,.25); padding:4rem; display:grid; grid-template-columns:1fr auto; gap:3rem; align-items:center; position:relative; overflow:hidden; }
        .inv-banner::after { content:''; position:absolute; right:-60px; top:-60px; width:200px; height:200px; border:1px solid rgba(200,169,110,.1); border-radius:50%; }
        .inv-label { font-size:.7rem; letter-spacing:.2em; text-transform:uppercase; color:var(--gold); margin-bottom:1rem; }
        .inv-title { font-family:var(--serif); font-size:clamp(1.8rem,3vw,2.5rem); font-weight:300; color:var(--white); margin-bottom:.8rem; line-height:1.2; }
        .inv-sub { color:var(--muted); font-size:.9rem; max-width:480px; }
        .chat-wrap { background:linear-gradient(135deg,rgba(17,34,64,.95),rgba(10,22,40,.98)); border:1px solid rgba(200,169,110,.25); overflow:hidden; box-shadow:0 40px 80px rgba(0,0,0,.5); }
        .chat-hdr { background:linear-gradient(90deg,rgba(26,58,92,.8),rgba(17,34,64,.8)); padding:1.2rem 1.8rem; display:flex; align-items:center; gap:1rem; border-bottom:1px solid rgba(200,169,110,.15); }
        .chat-av { width:40px; height:40px; background:var(--gold); border-radius:50%; display:flex; align-items:center; justify-content:center; font-family:var(--serif); font-size:1rem; font-weight:500; color:var(--navy); flex-shrink:0; }
        .chat-hdr-info h3 { font-family:var(--serif); font-size:1rem; font-weight:400; color:var(--white); }
        .chat-hdr-info p { font-size:.72rem; color:var(--gold); }
        .online { width:8px; height:8px; background:#4ade80; border-radius:50%; margin-left:auto; box-shadow:0 0 6px rgba(74,222,128,.5); animation:pulse 2s infinite; }
        .chat-msgs { padding:1.8rem; min-height:320px; max-height:440px; overflow-y:auto; display:flex; flex-direction:column; gap:1.2rem; scrollbar-width:thin; scrollbar-color:rgba(200,169,110,.2) transparent; }
        .msg { display:flex; gap:.8rem; align-items:flex-end; animation:msgIn .3s ease both; }
        .msg.user { flex-direction:row-reverse; }
        .msg-av { width:30px; height:30px; border-radius:50%; background:rgba(200,169,110,.2); display:flex; align-items:center; justify-content:center; font-size:.7rem; color:var(--gold); flex-shrink:0; }
        .msg.user .msg-av { background:rgba(200,169,110,.3); }
        .bubble { max-width:72%; padding:.9rem 1.2rem; font-size:.88rem; line-height:1.65; border-radius:2px; }
        .msg.bot .bubble { background:rgba(26,58,92,.7); border:1px solid rgba(200,169,110,.12); color:var(--sand); border-bottom-left-radius:0; }
        .msg.user .bubble { background:var(--gold); color:var(--navy); font-weight:400; border-bottom-right-radius:0; }
        .typing { display:flex; gap:4px; padding:.9rem 1.2rem; background:rgba(26,58,92,.7); border:1px solid rgba(200,169,110,.12); width:fit-content; border-radius:2px; }
        .dot { width:6px; height:6px; background:var(--gold); border-radius:50%; animation:blink 1.2s infinite; opacity:.4; }
        .dot:nth-child(2){animation-delay:.2s;} .dot:nth-child(3){animation-delay:.4s;}
        .suggestions { padding:0 1.8rem 1rem; display:flex; gap:.5rem; flex-wrap:wrap; }
        .sug { background:transparent; border:1px solid rgba(200,169,110,.25); color:var(--gold); padding:.4rem .9rem; font-size:.75rem; font-family:var(--sans); cursor:pointer; transition:all .2s; border-radius:1px; }
        .sug:hover { background:rgba(200,169,110,.1); border-color:var(--gold); }
        .chat-input-bar { padding:1.2rem 1.8rem; display:flex; gap:.8rem; border-top:1px solid rgba(200,169,110,.15); background:rgba(10,22,40,.5); }
        .chat-input { flex:1; background:rgba(26,58,92,.4); border:1px solid rgba(200,169,110,.2); color:var(--sand); padding:.8rem 1.2rem; font-family:var(--sans); font-size:.88rem; outline:none; border-radius:1px; transition:border-color .2s; }
        .chat-input::placeholder { color:rgba(245,240,232,.3); }
        .chat-input:focus { border-color:rgba(200,169,110,.5); }
        .chat-send { background:var(--gold); border:none; color:var(--navy); padding:.8rem 1.4rem; font-family:var(--sans); font-size:.8rem; font-weight:500; cursor:pointer; transition:background .2s; border-radius:1px; }
        .chat-send:hover { background:var(--gold-light); }
        .reviews-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1px; background:rgba(200,169,110,.12); }
        .review-card { background:var(--navy-mid); padding:2.2rem; transition:background .3s; }
        .review-card:hover { background:var(--navy-light); }
        .stars { color:var(--gold); font-size:.85rem; letter-spacing:2px; margin-bottom:1rem; }
        .review-text { font-family:var(--serif); font-style:italic; font-size:1rem; line-height:1.7; color:var(--sand); margin-bottom:1.2rem; }
        .review-author { font-size:.72rem; letter-spacing:.1em; text-transform:uppercase; color:var(--gold); }
        .contact-box { background:linear-gradient(135deg,rgba(26,58,92,.5),rgba(17,34,64,.8)); border:1px solid rgba(200,169,110,.2); padding:3.5rem; max-width:700px; margin:0 auto; }
        .form-row { display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1rem; }
        .field { display:flex; flex-direction:column; gap:.4rem; margin-bottom:1rem; }
        .field label { font-size:.7rem; letter-spacing:.12em; text-transform:uppercase; color:var(--gold); }
        .field input, .field select, .field textarea { background:rgba(10,22,40,.6); border:1px solid rgba(200,169,110,.2); color:var(--sand); padding:.8rem 1rem; font-family:var(--sans); font-size:.88rem; outline:none; width:100%; border-radius:1px; transition:border-color .2s; }
        .field input::placeholder, .field textarea::placeholder { color:rgba(245,240,232,.25); }
        .field input:focus, .field select:focus, .field textarea:focus { border-color:rgba(200,169,110,.5); }
        .field select option { background:var(--navy-mid); }
        .field textarea { resize:vertical; min-height:90px; }
        .form-submit { width:100%; background:var(--gold); border:none; color:var(--navy); padding:1rem; font-family:var(--sans); font-size:.82rem; font-weight:500; letter-spacing:.1em; text-transform:uppercase; cursor:pointer; transition:background .3s; margin-top:.5rem; border-radius:1px; }
        .form-submit:hover { background:var(--gold-light); }
        .form-submit:disabled { opacity:.6; cursor:not-allowed; }
        .contact-alt { margin-top:1.5rem; padding-top:1.5rem; border-top:1px solid rgba(200,169,110,.15); display:flex; gap:1.5rem; flex-wrap:wrap; }
        .contact-alt a { color:var(--gold); font-size:.82rem; display:flex; align-items:center; gap:.5rem; transition:color .2s; }
        .contact-alt a:hover { color:var(--gold-light); }
        .success { text-align:center; padding:2rem; }
        .success h3 { font-family:var(--serif); font-size:1.5rem; color:var(--gold); margin-bottom:.5rem; }
        .success p { color:var(--muted); font-size:.9rem; }
        footer { position:relative; z-index:1; border-top:1px solid rgba(200,169,110,.1); padding:3rem 2rem; text-align:center; }
        .footer-name { font-family:var(--serif); font-size:1.5rem; font-weight:300; color:var(--gold); letter-spacing:.1em; margin-bottom:.3rem; }
        .footer-sub { font-size:.75rem; letter-spacing:.15em; text-transform:uppercase; color:var(--muted); margin-bottom:2rem; }
        .footer-links { display:flex; justify-content:center; gap:2rem; list-style:none; margin-bottom:1.5rem; flex-wrap:wrap; }
        .footer-links a { color:var(--muted); font-size:.78rem; letter-spacing:.1em; text-transform:uppercase; transition:color .3s; }
        .footer-links a:hover { color:var(--gold); }
        .footer-contact { color:var(--gold); font-size:.82rem; margin-bottom:.5rem; }
        .footer-copy { font-size:.72rem; color:rgba(245,240,232,.25); }
        @media(max-width:768px){
          nav{padding:1.2rem 1.5rem;} .nav-links{display:none;}
          .about-grid{grid-template-columns:1fr;gap:2.5rem;}
          .types-grid{grid-template-columns:1fr;}
          .reviews-grid{grid-template-columns:1fr;}
          .inv-banner{grid-template-columns:1fr;gap:1.5rem;}
          .form-row{grid-template-columns:1fr;}
          .stats{flex-direction:column;gap:1.5rem;}
          .stat{border-right:none;border-bottom:1px solid rgba(200,169,110,.15);padding-bottom:1.5rem;}
          .stat:last-child{border-bottom:none;}
          .contact-box{padding:2rem 1.5rem;}
        }
      `}</style>

      {/* NAV */}
      <nav>
        <span className="nav-logo">Sam Kirby — Marine</span>
        <ul className="nav-links">
          <li><a href="#inventory">Inventory</a></li>
          <li><a href="#chat">Find My Boat</a></li>
          <li><a href="#reviews">Reviews</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="water-lines">
          <div className="wl"/><div className="wl"/><div className="wl"/><div className="wl"/><div className="wl"/>
        </div>
        <p className="eyebrow fade1">Marine Sales Specialist — Destin, Florida — 15 Years Experience</p>
        <h1 className="hero-name fade2">Sam Kirby<em>Find Your Boat.</em></h1>
        <p className="hero-tag fade3">No pressure. No guesswork. Just the right boat for your life — found fast.</p>
        <div className="hero-btns fade4">
          <a href="#chat" className="btn-gold">Find My Boat with AI</a>
          <a href="#inventory" className="btn-outline">View Inventory</a>
        </div>
      </section>

      {/* STATS */}
      <div className="stats">
        <div className="stat"><span className="stat-n">29</span><span className="stat-l">Boats In Stock</span></div>
        <div className="stat"><span className="stat-n">15</span><span className="stat-l">Years Experience</span></div>
        <div className="stat"><span className="stat-n">5★</span><span className="stat-l">Google Rating</span></div>
        <div className="stat"><span className="stat-n">FL</span><span className="stat-l">Destin Based</span></div>
      </div>

      {/* ABOUT */}
      <section className="section">
        <div className="about-grid">
          <div>
            <p className="sec-label">About Sam</p>
            <h2 className="sec-title" style={{marginBottom:'1.5rem'}}>15 years finding people <em>the right boat.</em></h2>
            <p className="about-text">I've been in marine sales for 15 years on the Gulf Coast. I've seen buyers overpay for the wrong boat, and I've seen buyers walk away from the perfect one because nobody took the time to understand what they actually needed.</p>
            <p className="about-text">My job is simple — figure out exactly how you live, fish, or play on the water, then match you to the right vessel at the right price. Buyers drive from across the country to work with me, and they leave with zero regrets.</p>
            <a href="#contact" className="btn-outline" style={{marginTop:'1rem'}}>Reach Out to Sam</a>
          </div>
          <div className="quote-card">
            <p className="quote-text">"If I could give Sam at Gregg Orr 10 out of 5 stars I would. One of the only salespeople I've ever dealt with at ANY dealership who genuinely listened to what I wanted."</p>
            <span className="quote-cite">Kurt Junkersfeld — Verified Buyer</span>
          </div>
        </div>
      </section>

      {/* BOAT TYPES */}
      <section className="section" id="inventory">
        <div className="section-hdr">
          <p className="sec-label">What I Specialize In</p>
          <h2 className="sec-title">Built for the <em>Gulf Coast</em></h2>
        </div>
        <div className="types-grid">
          {[
            {icon:'🎣', name:'Fishing Boats', desc:'Bay boats, center consoles, and offshore rigs built for the Gulf. Sea Fox, Excel, Sea Born and more.'},
            {icon:'⛵', name:'Pontoons & Tritoons', desc:'Family-ready pontoons and premium tritoons for cruising, entertaining, and relaxing on the water.'},
            {icon:'🚤', name:'Bowriders', desc:'Performance and fun — perfect for pulling tubes, skiing, and full day trips on the Emerald Coast.'},
            {icon:'🛥️', name:'Deck Boats', desc:'Maximum deck space and versatility for the whole crew. Great for families who want options.'},
            {icon:'⚓', name:'New & Pre-Owned', desc:'Full selection of new models and quality pre-owned boats at every price point.'},
            {icon:'🌊', name:'Not Sure Yet?', desc:"Use the AI chat below — describe your life on the water and I'll match you to the right boat."},
          ].map(t => (
            <div className="type-card" key={t.name}>
              <span className="type-icon">{t.icon}</span>
              <p className="type-name">{t.name}</p>
              <p className="type-desc">{t.desc}</p>
            </div>
          ))}
        </div>

        {/* INVENTORY BANNER */}
        <div className="inv-banner" style={{marginTop:'1.5px'}}>
          <div>
            <p className="inv-label">Live Inventory — Destin, FL</p>
            <h2 className="inv-title">29 boats ready to view right now</h2>
            <p className="inv-sub">Browse Sam's full current inventory — every boat, every price, no dealership runaround.</p>
          </div>
          <a href="/inventory" className="btn-gold" style={{whiteSpace:'nowrap'}}>Browse All 29 Boats →</a>
        </div>
      </section>

      {/* AI CHAT */}
      <section className="section" id="chat" style={{maxWidth:'820px'}}>
        <div className="section-hdr">
          <p className="sec-label">AI Boat Finder — Powered by Claude</p>
          <h2 className="sec-title">Tell me what you want. <em>I'll find it.</em></h2>
        </div>
        <p style={{textAlign:'center',color:'var(--muted)',fontSize:'.9rem',marginBottom:'2rem',marginTop:'-1.5rem'}}>Describe your budget, how you plan to use it, who's coming along — the AI matches you to the best boat in current inventory.</p>

        <div className="chat-wrap">
          <div className="chat-hdr">
            <div className="chat-av">SK</div>
            <div className="chat-hdr-info">
              <h3>Sam Kirby's Boat Finder</h3>
              <p>Marine Sales Specialist — Destin, FL — 15 Years</p>
            </div>
            <div className="online"/>
          </div>

          <div className="chat-msgs">
            {messages.map((m, i) => (
              <div className={`msg ${m.role}`} key={i}>
                <div className="msg-av">{m.role === 'user' ? 'You' : 'SK'}</div>
                <div className="bubble">{m.text}</div>
              </div>
            ))}
            {loading && (
              <div className="msg bot">
                <div className="msg-av">SK</div>
                <div className="typing"><div className="dot"/><div className="dot"/><div className="dot"/></div>
              </div>
            )}
            <div ref={messagesEndRef}/>
          </div>

          {showSuggestions && (
            <div className="suggestions">
              {suggestions.map(s => (
                <button className="sug" key={s} onClick={() => sendMessage(s)}>{s}</button>
              ))}
            </div>
          )}

          <div className="chat-input-bar">
            <input className="chat-input" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} placeholder="Describe what you're looking for in a boat..." />
            <button className="chat-send" onClick={() => sendMessage()}>Send</button>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="section" id="reviews">
        <div className="section-hdr">
          <p className="sec-label">What Buyers Say About Sam</p>
          <h2 className="sec-title">Real people. <em>Real results.</em></h2>
        </div>
        <div className="reviews-grid">
          {[
            {text:'"Sam and Chris and team were a pleasure to work with. Best boat buying experience I\'ve ever had. After the purchase they installed additional equipment and it went perfectly."', author:'Dennis Tune — Sea Fox 2022'},
            {text:'"Drove from Covington, Louisiana to Destin to do business with Sam Kirby. Straight forward pricing and great customer service. Pleasure doing business with you Sam."', author:'Dylan Bowles — Out-of-State Purchase'},
            {text:'"Worked with Sam on an out of state purchase of a 248 Commander. No pressure and willing to take the time to answer all questions. Absolutely recommend Sam Kirby."', author:'Kris Spevak — Sea Fox 248 Commander'},
            {text:'"My family and I have been working with Sam on a new boat purchase from 1200 miles away. He had items installed before we even arrived in Destin."', author:'JB Bailey — 1,200 Miles Away'},
            {text:'"Sam was great — he went the extra mile and included things that weren\'t even in the sale. Easy sale. No high pressure sales pitches whatsoever."', author:'Steve Jolivette — Verified Buyer'},
            {text:'"Our salesman Sam was the best we\'ve ever worked with — and we\'ve worked with a bunch. Very knowledgeable, friendly, easy to work with. We would give 10 stars if it was an option!"', author:'Shannon — Verified Buyer'},
          ].map((r,i) => (
            <div className="review-card" key={i}>
              <div className="stars">★★★★★</div>
              <p className="review-text">{r.text}</p>
              <p className="review-author">{r.author}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section className="section" id="contact">
        <div className="contact-box">
          <div style={{marginBottom:'2rem'}}>
            <p className="sec-label">Get in Touch</p>
            <h2 className="sec-title">Let Sam <em>reach out to you.</em></h2>
          </div>
          <p style={{color:'var(--muted)',fontSize:'.9rem',marginBottom:'2rem'}}>Fill this out and I'll personally follow up within a few hours. No spam, no pressure — just a real conversation about finding your boat.</p>

          {formStatus === 'done' ? (
            <div className="success">
              <h3>You're on Sam's radar.</h3>
              <p>Expect a personal follow-up within a few hours.<br/>Or call/text directly: (850) 307-7571</p>
            </div>
          ) : (
            <form onSubmit={submitForm}>
              <div className="form-row">
                <div className="field"><label>First Name</label><input name="firstName" placeholder="John"/></div>
                <div className="field"><label>Last Name</label><input name="lastName" placeholder="Smith"/></div>
              </div>
              <div className="form-row">
                <div className="field"><label>Best Phone Number</label><input name="phone" type="tel" placeholder="(850) 000-0000"/></div>
                <div className="field"><label>Email Address</label><input name="email" type="email" placeholder="john@email.com"/></div>
              </div>
              <div className="field">
                <label>What type of boat interests you?</label>
                <select name="boatType">
                  <option value="">Select a category...</option>
                  <option>Fishing / Center Console / Bay Boat</option>
                  <option>Pontoon / Tritoon</option>
                  <option>Bowrider / Deck Boat</option>
                  <option>Offshore / Commander</option>
                  <option>Not sure yet — need guidance</option>
                </select>
              </div>
              <div className="field">
                <label>Budget range</label>
                <select name="budget">
                  <option value="">Select a range...</option>
                  <option>Under $20,000</option>
                  <option>$20,000 – $40,000</option>
                  <option>$40,000 – $70,000</option>
                  <option>$70,000 – $100,000</option>
                  <option>$100,000+</option>
                </select>
              </div>
              <div className="field">
                <label>Tell me more — how do you plan to use it?</label>
                <textarea name="notes" placeholder="Fishing, family trips, watersports, how many people, Gulf or bay, timeline..."/>
              </div>
              <button type="submit" className="form-submit" disabled={formStatus === 'sending'}>
                {formStatus === 'sending' ? 'Sending...' : 'Send My Info to Sam →'}
              </button>
            </form>
          )}

          <div className="contact-alt">
            <a href="tel:8503077571">📞 Call or Text: (850) 307-7571</a>
            <a href="mailto:captskirby@gmail.com">✉️ captskirby@gmail.com</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <p className="footer-name">Sam Kirby</p>
        <p className="footer-sub">Marine Sales Specialist — Destin, Florida — 15 Years Experience</p>
        <ul className="footer-links">
          <li><a href="#inventory">Inventory</a></li>
          <li><a href="#chat">Find My Boat</a></li>
          <li><a href="#reviews">Reviews</a></li>
          <li><a href="#contact">Contact Sam</a></li>
          <li><a href="/inventory">Browse All Boats</a></li>
        </ul>
        <p className="footer-contact">(850) 307-7571 &nbsp;•&nbsp; captskirby@gmail.com</p>
        <p className="footer-copy">© 2026 Sam Kirby — Marine Sales Specialist, Destin, FL.</p>
      </footer>
    </>
  );
}
