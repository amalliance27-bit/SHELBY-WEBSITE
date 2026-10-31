import React, { useEffect, useMemo, useRef, useState } from 'react';

// Shelby's Arcade & Lounge — built Oct 30, 2026 on Master Paul's word, from
// the Prophete Universal site's Arcade Room + RadioPlayer technique, rebuilt
// in Shelby's brand with her own videos, her own dishes, and Miami/Caribbean
// local radio. Watch while you wait for your order.

const WAIT_VIDEOS = [
  { id: 'hsnHq2F-4fg', title: 'Timoun, mwen tounen! — Shelby says hello' },
  { id: 'pdA8bh0cHjs', title: 'Jambalaya — Shelby Style' },
  { id: 'PWJsNq4ZS5k', title: 'Coconut Seafood Soup' },
];

// All stations carried over from the Prophete Universal site's radio list
// (Master Paul, Oct 30, 2026 — "bring all stations over"), gospel included,
// plus WHUR 96.3 FM (Howard University Radio, Washington DC / Maryland) at
// his word the same night. Antilles Kompa Gold stays first — it is the
// station that autoplays when the site is entered.
const STATIONS = [
  { name: 'Antilles Kompa Gold', desc: 'Haitian Kompa, Zouk & Cultural Melodies', url: 'https://antillesmedia.pro-fhi.net/antillesmediakompa' },
  { name: 'JOY FM & Gospel Praise Radio', desc: 'Uplifting Contemporary Christian & Inspirational Gospel Music', url: 'https://ais-sa8.cdnstream1.com/3328_64/KSBJ.aac' },
  { name: 'K-LOVE 89.7 FM (WMLV South Florida)', desc: 'Positive, Encouraging Contemporary Christian Radio & Worship Hits', url: 'https://rtn.cdnstream1.com/2580_96.aac' },
  { name: 'JOY FM Florida', desc: 'Uplifting Contemporary Christian Music', url: 'https://rtn.cdnstream1.com/2580_96.aac' },
  { name: 'WHUR 96.3 FM', desc: 'Howard University Radio — Washington DC & Maryland', url: 'https://ais-sa1.streamon.fm/7028_48k.aac' },
  { name: 'FlavorJamz Caribbean', desc: 'Authentic Caribbean & Tropical Rhythms', url: 'https://stream.flavorjamz.com/stream.mp3' },
  { name: 'Miami Beach Radio', desc: 'Live from Miami Beach, Tropical & Dance', url: 'https://streaming.radiostreamlive.com/miamibeachradio_devices' },
  { name: 'BIG 105.9 Miami', desc: "South Florida's Classic Rock Station", url: 'https://stream.revma.ihrhls.com/zc557' },
  { name: 'El Nuevo Zol 106.7', desc: "Miami's Hottest Latin & Reggaeton", url: 'https://liveaudio.lamusica.com/MIA_WXDJ_icy' },
  { name: '100 Hip Hop and RNB FM', desc: "Florida's best Hip Hop and R&B hits", url: 'https://streaming.shoutcast.com/100-hip-hop-and-rnb-fm' },
  { name: 'Classical WQXR', desc: 'Timeless Classical Music and Soothing Symphonies', url: 'https://stream.wqxr.org/wqxr' },
  { name: 'Soothing Ambient Reading & Focus', desc: 'Soft, deeply relaxing ambient space music for quiet reading and focused thought', url: 'https://ice1.somafm.com/deepspaceone-128-mp3' },
  { name: 'Drone Zone Soothing Atmospheres', desc: 'Minimalist, tranquil, and seamless deep ambient soundscapes', url: 'https://ice1.somafm.com/dronezone-128-mp3' },
  { name: 'Sleepbot Soft Environmental Ambient', desc: 'Calm ambient electronics & quiet soundscapes ideal for reading and rest', url: 'https://ice1.somafm.com/sleepbot-128-mp3' },
  { name: 'Soothing Ambient & Chill', desc: 'Deeply relaxing ambient, chillout, and peaceful rhythms', url: 'https://ice1.somafm.com/groovesalad-128-mp3' },
  { name: 'Lush Soothing Lounge', desc: 'Sensuous, gentle vocals & soothing lounge sounds', url: 'https://ice1.somafm.com/lush-128-mp3' },
  { name: 'Illstreet Classic Lounge', desc: 'Smooth instrumental lounge, vintage chill, and light background beats', url: 'https://ice1.somafm.com/illstreet-128-mp3' },
  { name: 'Secret Agent Smooth', desc: 'Smooth, sophisticated & relaxing ambient lounge music', url: 'https://ice1.somafm.com/secretagent-128-mp3' },
  { name: 'Peaceful Nature & Rain', desc: 'Calm Rain, Forest, and Peaceful Nature Sounds', url: 'https://az1.mediacp.eu/listen/natureradiosleep/radio.mp3' },
  { name: 'Chill Lounge Florida', desc: 'Relaxing ambient and lounge sounds', url: 'https://vip2.fastcast4u.com/proxy/chillfla?mp=/1' },
];

const DISHES = [
  { src: 'https://i0.wp.com/shelbysfinecuisine.com/wp-content/uploads/2021/11/Soup-Joumou-I.png?fit=620%2C679&ssl=1', label: 'Soup Joumou' },
  { src: 'https://i0.wp.com/shelbysfinecuisine.com/wp-content/uploads/2021/11/Tassot-Cabrit-I-2.png?fit=726%2C669&ssl=1', label: 'Tassot' },
  { src: 'https://i0.wp.com/shelbysfinecuisine.com/wp-content/uploads/2021/11/Seafood-Rice-I.png?fit=621%2C689&ssl=1', label: 'Seafood Rice' },
  { src: 'https://i0.wp.com/shelbysfinecuisine.com/wp-content/uploads/2021/11/Lasagna-I.png?fit=614%2C707&ssl=1', label: 'Lasagna' },
  { src: 'https://i0.wp.com/shelbysfinecuisine.com/wp-content/uploads/2021/11/Gumbo-I.png?fit=598%2C681&ssl=1', label: 'Seafood Gumbo' },
  { src: 'https://i0.wp.com/shelbysfinecuisine.com/wp-content/uploads/2021/11/Fried-Fish-w-Fried-Plantain-I.png?fit=597%2C683&ssl=1', label: 'Fried Fish & Plantains' },
];

const RadioLounge: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [current, setCurrent] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [note, setNote] = useState('');

  const toggle = (i: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (current === i && playing) {
      audio.pause();
      setPlaying(false);
      return;
    }
    if (current !== i) {
      audio.src = STATIONS[i].url;
      setCurrent(i);
    }
    setNote('');
    audio.play().then(() => setPlaying(true)).catch(() => {
      setPlaying(false);
      setNote('That station did not answer — try another one.');
    });
  };

  // Autoplay on entry (Master Paul, Oct 30, 2026): Antilles Kompa Gold starts
  // when the Arcade Room opens. Browsers may block sound before the first tap,
  // so a blocked start retries once on the visitor's first tap or key press.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setCurrent(0);
    audio.src = STATIONS[0].url;
    const tryPlay = () => { audio.play().then(() => setPlaying(true)).catch(() => {}); };
    tryPlay();
    window.addEventListener('pointerdown', tryPlay, { once: true });
    window.addEventListener('keydown', tryPlay, { once: true });
    return () => {
      window.removeEventListener('pointerdown', tryPlay);
      window.removeEventListener('keydown', tryPlay);
      audio.pause();
    };
  }, []);

  return (
    <div className="bg-red-950 rounded-3xl border-2 border-yellow-500/70 shadow-2xl p-6 md:p-8 text-center">
      <h3 className="text-2xl md:text-3xl font-black font-serif text-yellow-400 uppercase tracking-wider mb-2">Local Radio</h3>
      <p className="text-red-100/90 mb-6">Miami and Caribbean stations, live — the kitchen soundtrack while you wait.</p>
      <audio ref={audioRef} preload="none" />
      <div className="flex flex-wrap justify-center gap-3">
        {STATIONS.map((s, i) => (
          <button
            key={s.name}
            onClick={() => toggle(i)}
            className={`px-4 py-3 rounded-full font-bold text-sm transition-all ${current === i && playing ? 'bg-yellow-500 text-red-950 scale-105' : 'bg-red-900 text-red-50 border border-red-700 hover:bg-red-800'}`}
          >
            {current === i && playing ? '❚❚ ' : '▶ '}{s.name}
            <span className="block text-[11px] font-semibold opacity-80">{s.desc}</span>
          </button>
        ))}
      </div>
      {current !== null && (
        <p className="mt-4 text-yellow-200 font-bold">{playing ? `Now playing: ${STATIONS[current].name}` : `Paused: ${STATIONS[current].name}`}</p>
      )}
      {note && <p className="mt-2 text-red-200 text-sm">{note}</p>}
    </div>
  );
};

const MemoryGame: React.FC = () => {
  const deck = useMemo(() => {
    const cards = [...DISHES, ...DISHES].map((d, i) => ({ key: i, label: d.label, src: d.src }));
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    return cards;
  }, []);
  const [open, setOpen] = useState<number[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);

  const flip = (idx: number) => {
    if (open.includes(idx) || matched.includes(deck[idx].label) || open.length === 2) return;
    const next = [...open, idx];
    setOpen(next);
    if (next.length === 2) {
      setMoves(m => m + 1);
      if (deck[next[0]].label === deck[next[1]].label) {
        setMatched(m => [...m, deck[idx].label]);
        setOpen([]);
      } else {
        setTimeout(() => setOpen([]), 900);
      }
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-stone-200 p-6">
      <h4 className="text-xl font-black font-serif text-red-900 uppercase tracking-wide mb-1">Match Shelby's Dishes</h4>
      <p className="text-stone-500 text-sm mb-4">Find the pairs. Moves: {moves}{matched.length === DISHES.length ? ' — You matched the whole table. Shelby tastes soo good!' : ''}</p>
      <div className="grid grid-cols-4 gap-2">
        {deck.map((c, i) => {
          const faceUp = open.includes(i) || matched.includes(c.label);
          return (
            <button key={c.key} onClick={() => flip(i)} className="aspect-square rounded-xl overflow-hidden border-2 border-red-100 bg-red-900 relative">
              {faceUp ? (
                <img src={c.src} alt={c.label} className="w-full h-full object-cover" />
              ) : (
                <span className="absolute inset-0 flex items-center justify-center text-yellow-400 font-serif font-black text-lg">S</span>
              )}
            </button>
          );
        })}
      </div>
      {matched.length === DISHES.length && (
        <button onClick={() => window.location.reload()} className="mt-4 px-5 py-2 bg-red-600 text-white font-bold rounded-full hover:bg-red-700">Play again</button>
      )}
    </div>
  );
};

const LINES = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
const winnerOf = (b: (string | null)[]) => {
  for (const [a, c, d] of LINES) if (b[a] && b[a] === b[c] && b[a] === b[d]) return b[a];
  return b.every(Boolean) ? 'draw' : null;
};

const TicTacToe: React.FC = () => {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const result = winnerOf(board);

  const play = (i: number) => {
    if (board[i] || result) return;
    const next = [...board];
    next[i] = 'X';
    if (!winnerOf(next)) {
      const empty = next.map((v, j) => (v ? -1 : j)).filter(j => j >= 0);
      if (empty.length) next[empty[Math.floor(Math.random() * empty.length)]] = 'O';
    }
    setBoard(next);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-stone-200 p-6 text-center">
      <h4 className="text-xl font-black font-serif text-red-900 uppercase tracking-wide mb-1">Tic Tac Toe</h4>
      <p className="text-stone-500 text-sm mb-4">{result === 'X' ? 'You win! Dinner is on the house (in spirit).' : result === 'O' ? 'The kitchen wins this round.' : result === 'draw' ? 'A draw — everybody eats.' : 'You are X. The kitchen is O.'}</p>
      <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto">
        {board.map((v, i) => (
          <button key={i} onClick={() => play(i)} className="aspect-square rounded-xl bg-stone-100 border-2 border-stone-200 text-3xl font-black text-red-900 hover:bg-yellow-100">
            {v}
          </button>
        ))}
      </div>
      <button onClick={() => setBoard(Array(9).fill(null))} className="mt-4 px-5 py-2 bg-red-600 text-white font-bold rounded-full hover:bg-red-700">New game</button>
    </div>
  );
};

export const ArcadeRoom: React.FC = () => (
  <div className="min-h-screen bg-stone-50 py-12 px-4">
    <div className="max-w-5xl mx-auto">
      <h2 className="text-4xl md:text-5xl font-black font-serif text-red-900 text-center uppercase tracking-wide">Shelby's Arcade</h2>
      <p className="text-center text-stone-600 mt-3 mb-10 text-lg">Good food takes a little time. Watch, listen, and play while you wait for your order.</p>

      <h3 className="text-2xl md:text-3xl font-black font-serif text-red-900 uppercase tracking-wider text-center mb-5">Watch While You Wait</h3>
      <div className="grid md:grid-cols-3 gap-5 mb-12">
        {WAIT_VIDEOS.map(v => (
          <div key={v.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-stone-200">
            <div className="aspect-video">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${v.id}?rel=0`}
                title={v.title}
                className="w-full h-full"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <p className="p-3 font-bold text-stone-700 text-sm">{v.title}</p>
          </div>
        ))}
      </div>

      <div className="mb-12">
        <RadioLounge />
      </div>

      <h3 className="text-2xl md:text-3xl font-black font-serif text-red-900 uppercase tracking-wider text-center mb-5">The Arcade</h3>
      <div className="grid md:grid-cols-2 gap-6">
        <MemoryGame />
        <TicTacToe />
      </div>
    </div>
  </div>
);
