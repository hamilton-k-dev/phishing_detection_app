type Status = 'safe' | 'suspicious' | 'phishing';

interface StatusBadgeProps {
  status: Status;
  size?: 'sm' | 'md';
}

const config = {
  safe: { label: 'Safe', icon: 'ri-shield-check-line', bg: 'bg-green-500/15', text: 'text-green-400', border: 'border-green-500/30' },
  suspicious: { label: 'Suspicious', icon: 'ri-alert-line', bg: 'bg-yellow-500/15', text: 'text-yellow-400', border: 'border-yellow-500/30' },
  phishing: { label: 'Phishing', icon: 'ri-skull-line', bg: 'bg-red-500/15', text: 'text-red-400', border: 'border-red-500/30' },
};

export default function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const c = config[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${c.bg} ${c.text} ${c.border} ${size === 'md' ? 'px-3 py-1.5 text-sm' : ''}`}>
      <span className="w-3 h-3 flex items-center justify-center">
        <i className={`${c.icon} text-xs`}></i>
      </span>
      {c.label}
    </span>
  );
}
