import React, { useState, useEffect, useMemo } from 'react';
import { db, matchesCollection } from './firebase';
import { 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc, 
  query 
} from 'firebase/firestore';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { 
  BarChart3, 
  FileText, 
  RotateCcw, 
  Swords, 
  Trophy, 
  Flame, 
  Ambulance, 
  Zap, 
  Trash2, 
  Plus, 
  X 
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const POS_LABELS = ["Slot 1 (Lead)", "Slot 2", "Slot 3", "Slot 4", "Slot 5 (Anchor)"];
const INITIAL_ROSTER = ["Bry", "Jiro", "DYLANX", "DALYU", "IkongJZM", "Arc", "Drejers", "SenJudes", "Juwi","Ulan","Zard X", "Miguel"];

// const INITIAL_MATCHES = [
//   { date: "2026-08-30", player: "JLanzado", position: 1, opponent: "HOBBY WORKS CAFE X BNG", result: "Win" },
//   { date: "2026-08-30", player: "MCaibal", position: 2, opponent: "HOBBY WORKS CAFE X BNG", result: "Win" },
//   { date: "2026-08-30", player: "JRianzares", position: 3, opponent: "HOBBY WORKS CAFE X BNG", result: "Loss" },
//   { date: "2026-08-30", player: "JMinosa", position: 4, opponent: "HOBBY WORKS CAFE X BNG", result: "Win" },
//   { date: "2026-08-30", player: "RSulit", position: 5, opponent: "HOBBY WORKS CAFE X BNG", result: "Loss" },
//   { date: "2026-08-30", player: "RSulit", position: 1, opponent: "ICEMATSURI D`SOURCE", result: "Win" },
//   { date: "2026-08-30", player: "JLanzado", position: 2, opponent: "ICEMATSURI D`SOURCE", result: "Win" },
//   { date: "2026-08-30", player: "EBaet", position: 3, opponent: "ICEMATSURI D`SOURCE", result: "Win" },
//   { date: "2026-08-30", player: "JLirio", position: 4, opponent: "ICEMATSURI D`SOURCE", result: "Win" },
//   { date: "2026-08-30", player: "JCruz", position: 5, opponent: "ICEMATSURI D`SOURCE", result: "Loss" },
//   { date: "2026-08-30", player: "EBaet", position: 1, opponent: "Anonymous Bladers PH", result: "Loss" },
//   { date: "2026-08-30", player: "JLirio", position: 2, opponent: "Anonymous Bladers PH", result: "Loss" },
//   { date: "2026-08-30", player: "JBrual", position: 3, opponent: "Anonymous Bladers PH", result: "Loss" },
//   { date: "2026-08-30", player: "JCruz", position: 4, opponent: "Anonymous Bladers PH", result: "Win" },
//   { date: "2026-08-30", player: "JRianzares", position: 5, opponent: "Anonymous Bladers PH", result: "Loss" },
//   { date: "2026-08-30", player: "JLanzado", position: 1, opponent: "Garuda Phoenix", result: "Win" },
//   { date: "2026-08-30", player: "RSulit", position: 2, opponent: "Garuda Phoenix", result: "Win" },
//   { date: "2026-08-30", player: "MCaibal", position: 3, opponent: "Garuda Phoenix", result: "Win" },
//   { date: "2026-08-30", player: "JMinosa", position: 4, opponent: "Garuda Phoenix", result: "Loss" },
//   { date: "2026-08-30", player: "JBrual", position: 5, opponent: "Garuda Phoenix", result: "Win" },
//   { date: "2026-08-30", player: "JLanzado", position: 1, opponent: "Ignited Fury", result: "Loss" },
//   { date: "2026-08-30", player: "RSulit", position: 2, opponent: "Ignited Fury", result: "Win" },
//   { date: "2026-08-30", player: "EBaet", position: 3, opponent: "Ignited Fury", result: "Win" },
//   { date: "2026-08-30", player: "JCruz", position: 4, opponent: "Ignited Fury", result: "Win" },
//   { date: "2026-08-30", player: "JBrual", position: 5, opponent: "Ignited Fury", result: "Win" },
//   { date: "2026-08-30", player: "JMinosa", position: 1, opponent: "BBA Yappie", result: "Loss" },
//   { date: "2026-08-30", player: "MCaibal", position: 2, opponent: "BBA Yappie", result: "Win" },
//   { date: "2026-08-30", player: "JRianzares", position: 3, opponent: "BBA Yappie", result: "Win" },
//   { date: "2026-08-30", player: "JLirio", position: 4, opponent: "BBA Yappie", result: "Loss" },
//   { date: "2026-08-30", player: "EBaet", position: 5, opponent: "BBA Yappie", result: "Loss" },
//   { date: "2026-09-06", player: "JLanzado", position: 1, opponent: "Sinflare", result: "Loss" },
//   { date: "2026-09-06", player: "MCaibal", position: 2, opponent: "Sinflare", result: "Win" },
//   { date: "2026-09-06", player: "JCruz", position: 3, opponent: "Sinflare", result: "Win" },
//   { date: "2026-09-06", player: "JMinosa", position: 4, opponent: "Sinflare", result: "Loss" },
//   { date: "2026-09-06", player: "JBrual", position: 5, opponent: "Sinflare", result: "Win" },
//   { date: "2026-09-06", player: "RSulit", position: 1, opponent: "Shinzoku", result: "Win" },
//   { date: "2026-09-06", player: "MCaibal", position: 2, opponent: "Shinzoku", result: "Loss" },
//   { date: "2026-09-06", player: "JCruz", position: 3, opponent: "Shinzoku", result: "Loss" },
//   { date: "2026-09-06", player: "JRianzares", position: 4, opponent: "Shinzoku", result: "Win" },
//   { date: "2026-09-06", player: "JBrual", position: 5, opponent: "Shinzoku", result: "Win" },
//   { date: "2026-09-06", player: "RSulit", position: 1, opponent: "Code Unknown Iris", result: "Win" },
//   { date: "2026-09-06", player: "EBaet", position: 2, opponent: "Code Unknown Iris", result: "Loss" },
//   { date: "2026-09-06", player: "JRianzares", position: 3, opponent: "Code Unknown Iris", result: "Loss" },
//   { date: "2026-09-06", player: "JLirio", position: 4, opponent: "Code Unknown Iris", result: "Win" },
//   { date: "2026-09-06", player: "JBrual", position: 5, opponent: "Code Unknown Iris", result: "Win" },
//   { date: "2026-09-06", player: "RSulit", position: 1, opponent: "J365 Royals", result: "Loss" },
//   { date: "2026-09-06", player: "JLanzado", position: 2, opponent: "J365 Royals", result: "Loss" },
//   { date: "2026-09-06", player: "JLirio", position: 3, opponent: "J365 Royals", result: "Loss" },
//   { date: "2026-09-06", player: "JMinosa", position: 4, opponent: "J365 Royals", result: "Loss" },
//   { date: "2026-09-06", player: "JBrual", position: 5, opponent: "J365 Royals", result: "Win" },
//   { date: "2026-09-06", player: "JLanzado", position: 1, opponent: "SUNACCHI NIDAI", result: "Win" },
//   { date: "2026-09-06", player: "RSulit", position: 2, opponent: "SUNACCHI NIDAI", result: "Loss" },
//   { date: "2026-09-06", player: "MCaibal", position: 3, opponent: "SUNACCHI NIDAI", result: "Loss" },
//   { date: "2026-09-06", player: "JCruz", position: 4, opponent: "SUNACCHI NIDAI", result: "Win" },
//   { date: "2026-09-06", player: "JRianzares", position: 5, opponent: "SUNACCHI NIDAI", result: "Win" },
//   { date: "2026-09-06", player: "JLanzado", position: 1, opponent: "Skyclaw Plus Ultra", result: "Loss" },
//   { date: "2026-09-06", player: "JMinosa", position: 2, opponent: "Skyclaw Plus Ultra", result: "Loss" },
//   { date: "2026-09-06", player: "EBaet", position: 3, opponent: "Skyclaw Plus Ultra", result: "Loss" },
//   { date: "2026-09-06", player: "JLirio", position: 4, opponent: "Skyclaw Plus Ultra", result: "Win" },
//   { date: "2026-09-06", player: "JRianzares", position: 5, opponent: "Skyclaw Plus Ultra", result: "Win" },
//   { date: "2026-09-06", player: "RSulit", position: 1, opponent: "BBA Shirokuro Sharks", result: "Win" },
//   { date: "2026-09-06", player: "JLirio", position: 2, opponent: "BBA Shirokuro Sharks", result: "Win" },
//   { date: "2026-09-06", player: "JRianzares", position: 3, opponent: "BBA Shirokuro Sharks", result: "Win" },
//   { date: "2026-09-06", player: "JCruz", position: 4, opponent: "BBA Shirokuro Sharks", result: "Loss" },
//   { date: "2026-09-06", player: "JBrual", position: 5, opponent: "BBA Shirokuro Sharks", result: "Win" },
//   { date: "2026-09-06", player: "EBaet", position: 1, opponent: "IKG | TCG", result: "Win" },
//   { date: "2026-09-06", player: "MCaibal", position: 2, opponent: "IKG | TCG", result: "Win" },
//   { date: "2026-09-06", player: "JCruz", position: 3, opponent: "IKG | TCG", result: "Loss" },
//   { date: "2026-09-06", player: "JLirio", position: 4, opponent: "IKG | TCG", result: "Loss" },
//   { date: "2026-09-06", player: "JBrual", position: 5, opponent: "IKG | TCG", result: "Win" },
//   { date: "2026-09-06", player: "EBaet", position: 1, opponent: "INVICTUS", result: "Win" },
//   { date: "2026-09-06", player: "MCaibal", position: 2, opponent: "INVICTUS", result: "Win" },
//   { date: "2026-09-06", player: "JMinosa", position: 3, opponent: "INVICTUS", result: "Win" },
//   { date: "2026-09-06", player: "JRianzares", position: 4, opponent: "INVICTUS", result: "Win" },
//   { date: "2026-09-06", player: "JLanzado", position: 5, opponent: "INVICTUS", result: "Loss" }
// ];

export default function BeybladeTracker() {
  const [roster, setRoster] = useState(() => JSON.parse(localStorage.getItem('beybladeRoster')) || INITIAL_ROSTER);
  const [matchHistory, setMatchHistory] = useState(() => JSON.parse(localStorage.getItem('beybladeMatchHistory')) || []);
  const [unavailableBladers, setUnavailableBladers] = useState(() => JSON.parse(localStorage.getItem('beybladeUnavailable')) || []);

  const [filterSearch, setFilterSearch] = useState('');
  const [filterResult, setFilterResult] = useState('ALL');
  const [filterSlot, setFilterSlot] = useState('ALL');

  const [selectedSlots, setSelectedSlots] = useState({ 1: '', 2: '', 3: '', 4: '', 5: '' });
  const [simulationOutput, setSimulationOutput] = useState(null);

  const [selectedBladerModal, setSelectedBladerModal] = useState(null);

  const [formPlayer, setFormPlayer] = useState('');
  const [formNewPlayer, setFormNewPlayer] = useState('');
  const [formPosition, setFormPosition] = useState(1);
  const [formOpponent, setFormOpponent] = useState('');
  const [formResult, setFormResult] = useState('Win');

  useEffect(() => {
    localStorage.setItem('beybladeRoster', JSON.stringify(roster));
    localStorage.setItem('beybladeMatchHistory', JSON.stringify(matchHistory));
    localStorage.setItem('beybladeUnavailable', JSON.stringify(unavailableBladers));
  }, [roster, matchHistory, unavailableBladers]);

  useEffect(() => {
    try {
      const q = query(matchesCollection);
      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const fetchedMatches = [];
          const newBladers = new Set(roster);
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            fetchedMatches.push({ id: docSnap.id, ...data });
            if (data.player) newBladers.add(data.player);
          });
          setMatchHistory(fetchedMatches);
          setRoster(Array.from(newBladers));
        }
      }, (error) => {
        console.warn("Firestore offline or disabled. Using local storage.", error);
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn("Firestore initialization error.", e);
    }
  }, []);

  const positionMatrix = useMemo(() => {
    const matrix = {};
    roster.forEach(name => {
      matrix[name] = { 1: { wins: 0, total: 0 }, 2: { wins: 0, total: 0 }, 3: { wins: 0, total: 0 }, 4: { wins: 0, total: 0 }, 5: { wins: 0, total: 0 } };
    });

    matchHistory.forEach(log => {
      const name = log.player;
      const pos = Number(log.position);
      if (!matrix[name]) {
        matrix[name] = { 1: { wins: 0, total: 0 }, 2: { wins: 0, total: 0 }, 3: { wins: 0, total: 0 }, 4: { wins: 0, total: 0 }, 5: { wins: 0, total: 0 } };
      }
      if (matrix[name][pos]) {
        matrix[name][pos].total += 1;
        if (log.result === "Win") matrix[name][pos].wins += 1;
      }
    });
    return matrix;
  }, [roster, matchHistory]);

  const optimalLineup = useMemo(() => {
    const lineup = {};
    for (let pos = 1; pos <= 5; pos++) {
      let bestBlader = null;
      let maxRate = -1;
      let maxWins = -1;

      Object.keys(positionMatrix).forEach(blader => {
        if (unavailableBladers.includes(blader)) return;
        const stats = positionMatrix[blader][pos];
        if (stats && stats.total > 0) {
          const rate = stats.wins / stats.total;
          if (rate > maxRate || (rate === maxRate && stats.wins > maxWins)) {
            maxRate = rate;
            maxWins = stats.wins;
            bestBlader = {
              name: blader,
              rate: (rate * 100).toFixed(0),
              wins: stats.wins,
              total: stats.total
            };
          }
        }
      });
      lineup[pos] = bestBlader;
    }
    return lineup;
  }, [positionMatrix, unavailableBladers]);

  const totalMatchesCount = matchHistory.length;
  const totalWinsCount = useMemo(() => matchHistory.filter(m => m.result === "Win").length, [matchHistory]);
  const teamWinRate = totalMatchesCount > 0 ? ((totalWinsCount / totalMatchesCount) * 100).toFixed(1) : '0';

  const streakInfo = useMemo(() => {
    if (matchHistory.length === 0) return "N/A";
    const lastResult = matchHistory[matchHistory.length - 1].result;
    let count = 0;
    for (let i = matchHistory.length - 1; i >= 0; i--) {
      if (matchHistory[i].result === lastResult) count++;
      else break;
    }
    return `${count}${lastResult === "Win" ? "W Streak" : "L Streak"}`;
  }, [matchHistory]);

  const toggleAvailability = (blader) => {
    setUnavailableBladers(prev => 
      prev.includes(blader) ? prev.filter(b => b !== blader) : [...prev, blader]
    );
  };

  const handleMatchDelete = async (log, index) => {
    if (window.confirm("Delete this match log entry?")) {
      if (log.id) {
        try {
          await deleteDoc(doc(db, "matches", log.id));
        } catch (e) {
          console.error("Firestore delete error:", e);
        }
      } else {
        setMatchHistory(prev => prev.filter((_, i) => i !== index));
      }
    }
  };

  const handleAddMatch = async (e) => {
    e.preventDefault();
    const player = formPlayer === '__NEW__' ? formNewPlayer.trim() : formPlayer;
    if (!player) return;

    if (!roster.includes(player)) {
      setRoster(prev => [...prev, player]);
    }

    const newMatch = {
      date: new Date().toISOString().slice(0, 10),
      player,
      position: Number(formPosition),
      opponent: formOpponent.trim(),
      result: formResult
    };

    try {
      await addDoc(matchesCollection, newMatch);
    } catch (err) {
      console.warn("Saved match locally due to Firestore network state.", err);
      setMatchHistory(prev => [...prev, newMatch]);
    }

    setFormOpponent('');
    setFormNewPlayer('');
    if (formPlayer === '__NEW__') setFormPlayer(player);
  };

  const handleResetData = () => {
    if (window.confirm("Reset application data to defaults?")) {
      setRoster([...INITIAL_ROSTER]);
      setMatchHistory([...INITIAL_MATCHES]);
      setUnavailableBladers([]);
    }
  };

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,Slot,Blader,Opponent,Result\n";
    matchHistory.forEach(row => {
      csvContent += `${row.position},"${row.player}","${row.opponent}",${row.result}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `beyblade_matches_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const calculateBinomialSetWinRate = (p) => {
    let winProb = 0;
    for (let mask = 0; mask < (1 << 5); mask++) {
      let wins = 0;
      let prob = 1;
      for (let i = 0; i < 5; i++) {
        if ((mask & (1 << i)) !== 0) { wins++; prob *= p[i]; }
        else { prob *= (1 - p[i]); }
      }
      if (wins >= 3) winProb += prob;
    }
    return winProb * 100;
  };

  const evaluateLineup = () => {
    const probs = [];
    const lineupDetails = [];

    for (let i = 1; i <= 5; i++) {
      const blader = selectedSlots[i];
      if (!blader) {
        alert(`Please select a blader for Slot #${i}`);
        return;
      }
      const stats = positionMatrix[blader] ? positionMatrix[blader][i] : null;
      const winRate = stats && stats.total > 0 ? (stats.wins / stats.total) : 0.50;
      probs.push(winRate);
      lineupDetails.push({
        label: POS_LABELS[i - 1],
        blader,
        winRate,
        totalMatches: stats ? stats.total : 0,
        wins: stats ? stats.wins : 0
      });
    }

    const projectedSetWinRate = calculateBinomialSetWinRate(probs);
    const avgSlotWinRate = (probs.reduce((a, b) => a + b, 0) / 5) * 100;

    setSimulationOutput({
      projectedSetWinRate,
      avgSlotWinRate,
      lineupDetails
    });
  };

  const handleAutoFillOptimal = () => {
    const newSlots = {};
    for (let i = 1; i <= 5; i++) {
      if (optimalLineup[i]) newSlots[i] = optimalLineup[i].name;
    }
    setSelectedSlots(newSlots);
  };

  const trendChartData = useMemo(() => {
    const teamMatchesMap = {};
    const matchOrder = [];

    matchHistory.forEach(log => {
      if (!teamMatchesMap[log.opponent]) {
        teamMatchesMap[log.opponent] = { wins: 0, total: 0 };
        matchOrder.push(log.opponent);
      }
      teamMatchesMap[log.opponent].total++;
      if (log.result === "Win") teamMatchesMap[log.opponent].wins++;
    });

    const labels = matchOrder.map(opp => `vs ${opp}`);
    const data = matchOrder.map(opp => {
      const item = teamMatchesMap[opp];
      return ((item.wins / item.total) * 100).toFixed(1);
    });

    return {
      labels,
      datasets: [
        {
          label: 'Match Win Rate (%)',
          data,
          borderColor: '#10b981',
          borderWidth: 3,
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          fill: true,
          tension: 0.4,
          pointRadius: 5,
          pointBackgroundColor: '#10b981',
        }
      ]
    };
  }, [matchHistory]);

  const doughnutChartData = useMemo(() => {
    return {
      labels: ['Wins', 'Losses'],
      datasets: [
        {
          data: [totalWinsCount, totalMatchesCount - totalWinsCount],
          backgroundColor: ['#10b981', '#f43f5e'],
          borderColor: '#030712',
          borderWidth: 4,
          hoverOffset: 4
        }
      ]
    };
  }, [totalWinsCount, totalMatchesCount]);

  const filteredMatches = useMemo(() => {
    return matchHistory.filter(log => {
      const matchesSearch = log.player.toLowerCase().includes(filterSearch.toLowerCase()) || 
                            log.opponent.toLowerCase().includes(filterSearch.toLowerCase());
      const matchesResult = filterResult === 'ALL' || log.result === filterResult;
      const matchesSlot = filterSlot === 'ALL' || log.position.toString() === filterSlot;
      return matchesSearch && matchesResult && matchesSlot;
    });
  }, [matchHistory, filterSearch, filterResult, filterSlot]);

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 p-3 sm:p-6 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER & EXPORT TOOLBAR */}
        <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b border-slate-800/80 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
              </span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400">
                BEYBLADE X TEAM TRACKER
              </h1>
            </div>
            <p className="text-xs md:text-sm text-slate-400 font-medium">Live Tournament Match Analytics & Deck Optimization</p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto print:hidden">
            <button onClick={handleExportCSV} className="bg-slate-900/90 hover:bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 text-xs font-extrabold px-4 py-2 rounded-xl transition-all flex items-center gap-2">
              <BarChart3 className="w-4 h-4" /> Export CSV
            </button>
            <button onClick={() => window.print()} className="bg-slate-900/90 hover:bg-indigo-950/60 text-indigo-400 border border-indigo-500/30 text-xs font-extrabold px-4 py-2 rounded-xl transition-all flex items-center gap-2">
              <FileText className="w-4 h-4" /> Print / PDF
            </button>
            <button onClick={handleResetData} className="bg-rose-950/20 hover:bg-rose-900/40 text-rose-400 border border-rose-800/30 text-xs font-extrabold px-4 py-2 rounded-xl transition-all flex items-center gap-2">
              <RotateCcw className="w-4 h-4" /> Reset Data
            </button>
          </div>
        </header>

        {/* TOP METRICS (KPI Cards) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/75 backdrop-blur-md border border-white/10 p-5 rounded-2xl relative overflow-hidden">
            <Swords className="absolute -right-2 -bottom-2 w-16 h-16 opacity-5" />
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Total Matches</p>
            <p className="text-3xl font-black mt-2 text-slate-100">{totalMatchesCount}</p>
          </div>
          <div className="bg-slate-900/75 backdrop-blur-md border border-emerald-500/20 p-5 rounded-2xl relative overflow-hidden">
            <Trophy className="absolute -right-2 -bottom-2 w-16 h-16 opacity-10 text-emerald-400" />
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Game Win Rate</p>
            <p className="text-3xl font-black mt-2 text-emerald-400">{teamWinRate}%</p>
          </div>
          <div className="bg-slate-900/75 backdrop-blur-md border border-white/10 p-5 rounded-2xl relative overflow-hidden">
            <BarChart3 className="absolute -right-2 -bottom-2 w-16 h-16 opacity-5" />
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Game Record</p>
            <p className="text-3xl font-black mt-2 text-slate-100">{totalWinsCount}W - {totalMatchesCount - totalWinsCount}L</p>
          </div>
          <div className="bg-slate-900/75 backdrop-blur-md border border-indigo-500/20 p-5 rounded-2xl relative overflow-hidden">
            <Flame className="absolute -right-2 -bottom-2 w-16 h-16 opacity-10 text-indigo-400" />
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Current Streak</p>
            <p className="text-3xl font-black mt-2 text-indigo-400">{streakInfo}</p>
          </div>
        </div>

        {/* AVAILABILITY TRACKER */}
        <div className="bg-slate-900/75 backdrop-blur-md border border-amber-500/20 rounded-2xl p-5 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-amber-950/20">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-extrabold text-amber-400 flex items-center gap-2.5">
              <Ambulance className="w-5 h-5 text-amber-400" /> Blader Status Tracker
            </h2>
            <span className="text-[10px] font-extrabold uppercase bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2.5 py-1 rounded-full">Active Roster Filter</span>
          </div>
          <p className="text-xs text-slate-400 mb-4">Click to toggle player status. Offline bladers are automatically excluded from the lineup simulator.</p>
          <div className="flex flex-wrap gap-2.5">
            {roster.sort().map(blader => {
              const isUnavailable = unavailableBladers.includes(blader);
              return (
                <button
                  key={blader}
                  onClick={() => toggleAvailability(blader)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black border transition-all flex items-center gap-2 ${
                    isUnavailable 
                      ? 'bg-rose-950/30 border-rose-800/50 text-rose-400 line-through opacity-60 hover:opacity-100' 
                      : 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300 hover:border-emerald-400 shadow-sm'
                  }`}
                >
                  <span>{isUnavailable ? '❌' : '✅'}</span> {blader}
                </button>
              );
            })}
          </div>
        </div>

        {/* TREND & WIN/LOSS CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-900/75 backdrop-blur-md border border-white/10 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-extrabold text-slate-100">Match Trend Timeline</h2>
                <p className="text-xs text-slate-400">Team win rate percentage across registered opponent matchups</p>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-xl">Live Graph</span>
            </div>
            <div className="w-full h-64">
              <Line 
                data={trendChartData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: { min: 0, max: 100, ticks: { color: '#94a3b8', callback: v => v + '%' }, grid: { color: 'rgba(51, 65, 85, 0.3)' } },
                    x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(51, 65, 85, 0.3)' } }
                  },
                  plugins: { legend: { display: false } }
                }} 
              />
            </div>
          </div>

          <div className="bg-slate-900/75 backdrop-blur-md border border-white/10 rounded-2xl p-5 flex flex-col justify-between items-center">
            <h2 className="text-base font-extrabold text-slate-100 w-full text-left">Win/Loss Distribution</h2>
            <div className="w-48 h-48 my-auto relative flex items-center justify-center">
              <Doughnut 
                data={doughnutChartData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8' } } },
                  cutout: '70%'
                }} 
              />
            </div>
          </div>
        </div>

        {/* MATCHUP SIMULATOR */}
        <div className="bg-slate-900/75 backdrop-blur-md border border-indigo-500/30 rounded-2xl p-6 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-indigo-950/30 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
            <div>
              <h2 className="text-base sm:text-lg font-black text-indigo-400 flex items-center gap-2.5">
                <Zap className="w-5 h-5 text-indigo-400" /> Squad Matchup Simulator
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Configure 5-slot lineup to calculate optimal tournament win probability</p>
            </div>
            <button onClick={handleAutoFillOptimal} className="bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/40 font-extrabold px-4 py-2 rounded-xl text-xs transition-all flex items-center gap-2">
              <Zap className="w-4 h-4" /> Auto-Fill Optimal Squad
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {[1, 2, 3, 4, 5].map((slot) => (
              <div key={slot}>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">{POS_LABELS[slot - 1]}</label>
                <select
                  value={selectedSlots[slot]}
                  onChange={(e) => setSelectedSlots(prev => ({ ...prev, [slot]: e.target.value }))}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  <option value="">-- Select Blader --</option>
                  {roster.sort().map(name => {
                    const isInjured = unavailableBladers.includes(name);
                    return (
                      <option key={name} value={name}>
                        {name} {isInjured ? '(Offline)' : ''}
                      </option>
                    );
                  })}
                </select>
              </div>
            ))}
          </div>

          <button onClick={evaluateLineup} className="w-full bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white font-black py-3 rounded-xl text-xs sm:text-sm transition-all shadow-lg shadow-indigo-500/20">
            RUN MATCH SIMULATION
          </button>

          {simulationOutput && (
            <div className="border-t border-slate-800/80 pt-5 mt-3 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-950/90 p-5 rounded-xl border border-indigo-500/30 gap-3">
                <div>
                  <span className="text-[10px] uppercase font-black text-indigo-400 tracking-wider">Projected Set Win Rate (Best of 5)</span>
                  <p className="text-3xl font-black text-indigo-300 mt-0.5">{simulationOutput.projectedSetWinRate.toFixed(1)}%</p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Avg Individual Slot Win Rate</span>
                  <p className="text-xl font-extrabold text-slate-200 mt-0.5">{simulationOutput.avgSlotWinRate.toFixed(1)}%</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {simulationOutput.lineupDetails.map((item, idx) => {
                  const percentage = (item.winRate * 100).toFixed(0);
                  const textColor = percentage >= 70 ? 'text-emerald-400' : percentage >= 50 ? 'text-amber-400' : 'text-rose-400';
                  return (
                    <div key={idx} className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-center">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{item.label}</p>
                      <p className="text-xs font-bold text-slate-200 mt-0.5">{item.blader}</p>
                      <p className={`text-base font-black ${textColor} mt-1`}>{percentage}%</p>
                      <p className="text-[10px] text-slate-500">
                        {item.totalMatches > 0 ? `(${item.wins}W - ${item.totalMatches - item.wins}L)` : 'No slot data'}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* STATISTICALLY OPTIMAL LINEUP */}
        <div className="bg-slate-900/75 backdrop-blur-md border border-emerald-500/20 rounded-2xl p-6 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-emerald-950/20">
          <h2 className="text-base font-extrabold text-emerald-400 flex items-center gap-2.5 mb-1">
            <Zap className="w-5 h-5 text-emerald-400" /> Statistically Optimal Lineup
          </h2>
          <p className="text-xs text-slate-400 mb-4">Highest win-rate bladers dynamically calculated per position</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {[1, 2, 3, 4, 5].map(p => {
              const best = optimalLineup[p];
              return best ? (
                <div key={p} className="bg-slate-950/90 border border-emerald-500/30 p-3.5 rounded-xl text-center shadow-lg">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{POS_LABELS[p-1]}</p>
                  <p className="text-sm font-black text-emerald-400 mt-1">{best.name}</p>
                  <p className="text-xs text-slate-200 font-extrabold mt-0.5">{best.rate}% Win Rate</p>
                  <p className="text-[10px] text-slate-500">({best.wins}W - {best.total - best.wins}L)</p>
                </div>
              ) : (
                <div key={p} className="bg-slate-950/50 border border-slate-800 p-3.5 rounded-xl text-center">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider">{POS_LABELS[p-1]}</p>
                  <p className="text-xs text-slate-600 mt-2 font-bold">No Active Blader</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* BLADER POSITION MATRIX TABLE */}
        <div className="bg-slate-900/75 backdrop-blur-md border border-white/10 rounded-2xl p-6">
          <div className="mb-4">
            <h2 className="text-base font-extrabold text-slate-100">Blader Position Matrix</h2>
            <p className="text-xs text-slate-400">Detailed win percentage and total record across all 5 deck slots</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead className="text-[11px] font-black uppercase text-slate-400 border-b border-slate-800 bg-slate-950/50">
                <tr>
                  <th className="py-3 px-4 w-1/6 rounded-l-xl">Blader</th>
                  <th className="py-3 px-4 text-center">Slot 1</th>
                  <th className="py-3 px-4 text-center">Slot 2</th>
                  <th className="py-3 px-4 text-center">Slot 3</th>
                  <th className="py-3 px-4 text-center">Slot 4</th>
                  <th className="py-3 px-4 text-center rounded-r-xl">Slot 5</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {Object.keys(positionMatrix).map(blader => (
                  <tr key={blader} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-black text-slate-100">{blader}</td>
                    {[1, 2, 3, 4, 5].map(pos => {
                      const stats = positionMatrix[blader][pos];
                      if (stats && stats.total > 0) {
                        const winRate = Math.round((stats.wins / stats.total) * 100);
                        const losses = stats.total - stats.wins;
                        const rateColorClass = winRate >= 70 ? 'text-emerald-400' : winRate < 50 ? 'text-rose-400' : 'text-amber-400';
                        return (
                          <td key={pos} className="py-3 px-4 text-center">
                            <div className={`font-black text-xs sm:text-sm ${rateColorClass}`}>{winRate}%</div>
                            <div className="text-[10px] text-slate-500 font-bold mt-0.5">({stats.wins}W-{losses}L)</div>
                          </td>
                        );
                      }
                      return <td key={pos} className="py-3 px-4 text-center text-slate-700 font-black text-xs">—</td>;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* LEADERBOARD & SLOT DISTRIBUTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-900/75 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <h2 className="text-base font-extrabold text-slate-100 mb-4">Blader Leaderboard</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="text-[11px] text-slate-400 uppercase font-black border-b border-slate-800">
                  <tr>
                    <th className="pb-3 px-3">Blader</th>
                    <th className="pb-3 px-3 text-center">Matches</th>
                    <th className="pb-3 px-3 text-center">Wins</th>
                    <th className="pb-3 px-3 text-center">Losses</th>
                    <th className="pb-3 px-3 text-right">Win Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {roster.map(bladerName => {
                    let matches = 0, wins = 0, losses = 0;
                    matchHistory.forEach(log => {
                      if (log.player === bladerName) {
                        matches++;
                        if (log.result === "Win") wins++;
                        else losses++;
                      }
                    });
                    const winRate = matches > 0 ? ((wins / matches) * 100).toFixed(1) : '0.0';
                    const isInjured = unavailableBladers.includes(bladerName);

                    return (
                      <tr 
                        key={bladerName} 
                        onClick={() => setSelectedBladerModal(bladerName)}
                        className={`hover:bg-slate-800/50 cursor-pointer transition ${isInjured ? 'opacity-40' : ''}`}
                      >
                        <td className="py-3 px-3 font-bold text-slate-200 flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${isInjured ? 'bg-rose-500' : 'bg-emerald-400'}`}></span>
                          {bladerName} {isInjured && <span className="text-[10px] text-rose-400 font-extrabold">(Offline)</span>}
                        </td>
                        <td className="py-3 px-3 text-center text-slate-300 font-bold">{matches}</td>
                        <td className="py-3 px-3 text-center text-emerald-400 font-black">{wins}</td>
                        <td className="py-3 px-3 text-center text-rose-400 font-black">{losses}</td>
                        <td className="py-3 px-3 text-right font-black text-slate-100">{winRate}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-slate-900/75 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <h2 className="text-base font-extrabold mb-4 text-slate-100">Slot Win Rate Distribution</h2>
            <div className="grid grid-cols-1 gap-2.5">
              {[1, 2, 3, 4, 5].map(pos => {
                let totalPosMatches = 0;
                let totalPosWins = 0;

                Object.keys(positionMatrix).forEach(blader => {
                  const stats = positionMatrix[blader][pos];
                  if (stats) {
                    totalPosMatches += stats.total;
                    totalPosWins += stats.wins;
                  }
                });

                const rate = totalPosMatches > 0 ? ((totalPosWins / totalPosMatches) * 100).toFixed(1) : '0.0';

                return (
                  <div key={pos} className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{POS_LABELS[pos - 1]}</p>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">{totalPosWins}W - {totalPosMatches - totalPosWins}L ({totalPosMatches} games)</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-base font-black ${Number(rate) >= 50 ? 'text-emerald-400' : 'text-rose-400'}`}>{rate}%</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* MATCH LOGS TABLE */}
        <div className="bg-slate-900/75 backdrop-blur-md border border-white/10 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-100">Match Logs & Management</h2>
              <p className="text-xs text-slate-400">Search, filter, or delete registered match logs</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full md:w-auto">
              <input 
                type="text" 
                placeholder="Search Blader/Opponent..." 
                value={filterSearch}
                onChange={(e) => setFilterSearch(e.target.value)}
                className="bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
              <select 
                value={filterResult} 
                onChange={(e) => setFilterResult(e.target.value)}
                className="bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="ALL">All Results</option>
                <option value="Win">Wins Only</option>
                <option value="Loss">Losses Only</option>
              </select>
              <select 
                value={filterSlot} 
                onChange={(e) => setFilterSlot(e.target.value)}
                className="bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="ALL">All Slots</option>
                <option value="1">Slot 1</option>
                <option value="2">Slot 2</option>
                <option value="3">Slot 3</option>
                <option value="4">Slot 4</option>
                <option value="5">Slot 5</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto max-h-80">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="text-[11px] text-slate-400 uppercase font-black border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
                <tr>
                  <th className="pb-3 px-3">Slot</th>
                  <th className="pb-3 px-3">Blader</th>
                  <th className="pb-3 px-3">Opponent Team</th>
                  <th className="pb-3 px-3 text-center">Result</th>
                  <th className="pb-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filteredMatches.slice().reverse().map((log, index) => {
                  const badgeClass = log.result === 'Win' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border-rose-500/30';
                  return (
                    <tr key={log.id || index} className="hover:bg-slate-800/40 transition">
                      <td className="py-2.5 px-3 text-slate-400 font-extrabold">Slot #{log.position}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-200">{log.player}</td>
                      <td className="py-2.5 px-3 text-slate-400 font-medium">{log.opponent}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`${badgeClass} border text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase`}>{log.result}</span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button onClick={() => handleMatchDelete(log, index)} className="text-slate-600 hover:text-rose-400 font-bold p-1 transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* INPUT FORM & BRACKET */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:hidden">
          <div className="lg:col-span-1 bg-slate-900/75 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <h2 className="text-base font-extrabold mb-4 text-slate-100 flex items-center gap-2">
              <span className="text-emerald-400">📝</span> Log Match Record
            </h2>
            <form onSubmit={handleAddMatch} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Blader Name</label>
                <select 
                  value={formPlayer} 
                  onChange={(e) => setFormPlayer(e.target.value)} 
                  required 
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                >
                  <option value="">-- Select Blader --</option>
                  {roster.sort().map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                  <option value="__NEW__">➕ Add New Blader...</option>
                </select>

                {formPlayer === '__NEW__' && (
                  <input 
                    type="text" 
                    placeholder="Enter new blader name" 
                    value={formNewPlayer}
                    onChange={(e) => setFormNewPlayer(e.target.value)}
                    required
                    className="mt-2 w-full bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Blader Position</label>
                <select 
                  value={formPosition} 
                  onChange={(e) => setFormPosition(e.target.value)} 
                  required 
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                >
                  <option value="1">Slot 1 (Lead)</option>
                  <option value="2">Slot 2</option>
                  <option value="3">Slot 3</option>
                  <option value="4">Slot 4</option>
                  <option value="5">Slot 5 (Anchor)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Opponent Team</label>
                <input 
                  type="text" 
                  placeholder="e.g. Garuda Phoenix" 
                  value={formOpponent}
                  onChange={(e) => setFormOpponent(e.target.value)}
                  required 
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Result</label>
                <select 
                  value={formResult} 
                  onChange={(e) => setFormResult(e.target.value)} 
                  required 
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Win">Win</option>
                  <option value="Loss">Loss</option>
                </select>
              </div>

              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3 rounded-xl text-xs sm:text-sm transition-all shadow-lg shadow-emerald-500/20">
                SAVE MATCH RECORD
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-slate-900/75 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <h2 className="text-base font-extrabold mb-0.5 text-slate-100">Live Tournament Bracket</h2>
            <p className="text-xs text-slate-400 mb-4">PBBL S7 Pilipinas Cup B</p>
              <div className="overflow-hidden rounded-xl border border-slate-800/80 bg-slate-950">
              <iframe 
                src="https://challonge.com/PBBLS7PILIPINASCUP_B/module" 
                width="100%" 
                height="320" 
                className="border-0"
                frameBorder="0" 
                scrolling="auto" 
                allowTransparency="true"
                title="Tournament Bracket"
              />
            </div>
          </div>
        </div>

      </div>

      {/* BLADER PROFILE MODAL */}
      {selectedBladerModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700/80 w-full max-w-lg rounded-2xl p-6 space-y-4 shadow-2xl relative">
            <button onClick={() => setSelectedBladerModal(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 text-xl font-black p-1">
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-indigo-500/20 border border-emerald-500/40 flex items-center justify-center text-xl font-black text-emerald-400">
                {selectedBladerModal.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-100">{selectedBladerModal}</h3>
                <p className="text-xs text-slate-400">
                  {unavailableBladers.includes(selectedBladerModal) ? 'Status: Offline / Unavailable' : 'Status: Active Roster'}
                </p>
              </div>
            </div>

            {(() => {
              const stats = positionMatrix[selectedBladerModal];
              let totalWins = 0, totalMatches = 0;
              for (let p = 1; p <= 5; p++) {
                if (stats && stats[p]) {
                  totalWins += stats[p].wins;
                  totalMatches += stats[p].total;
                }
              }
              const winRate = totalMatches > 0 ? ((totalWins / totalMatches) * 100).toFixed(1) : "0.0";

              return (
                <>
                  <div className="grid grid-cols-3 gap-2.5 pt-2">
                    <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl text-center">
                      <p className="text-[10px] font-black text-slate-400 uppercase">Matches</p>
                      <p className="text-lg font-black text-slate-100 mt-0.5">{totalMatches}</p>
                    </div>
                    <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl text-center">
                      <p className="text-[10px] font-black text-slate-400 uppercase">Win Rate</p>
                      <p className="text-lg font-black text-emerald-400 mt-0.5">{winRate}%</p>
                    </div>
                    <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl text-center">
                      <p className="text-[10px] font-black text-slate-400 uppercase">Record</p>
                      <p className="text-lg font-black text-slate-100 mt-0.5">{totalWins}W-{totalMatches - totalWins}L</p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <h4 className="text-xs font-black text-slate-300 uppercase tracking-wider">Slot Breakdown</h4>
                    <div className="space-y-1.5">
                      {[1, 2, 3, 4, 5].map(p => {
                        const s = stats ? stats[p] : { wins: 0, total: 0 };
                        const rate = s.total > 0 ? ((s.wins / s.total) * 100).toFixed(0) : "—";
                        return (
                          <div key={p} className="flex items-center justify-between bg-slate-950 px-3.5 py-2 rounded-xl text-xs border border-slate-800">
                            <span className="text-slate-400 font-bold">{POS_LABELS[p-1]}</span>
                            <div className="text-right">
                              <span className="font-black text-slate-200">{rate}{rate !== "—" ? "%" : ""}</span>
                              <span className="text-[10px] text-slate-500 ml-1">({s.wins}W-{s.total - s.wins}L)</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}