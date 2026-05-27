interface RiskBarProps {
  score: number;
  showLabel?: boolean;
}

export default function RiskBar({ score, showLabel = false }: RiskBarProps) {
  const color = score >= 70 ? '#ef4444' : score >= 40 ? '#eab308' : '#22c55e';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden" style={{ minWidth: 60 }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${score}%`, background: color }}
        ></div>
      </div>
      {showLabel && <span className="text-xs font-mono font-semibold" style={{ color }}>{score}</span>}
    </div>
  );
}
