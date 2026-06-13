const toneGradients: Record<string, string> = {
  green:  "linear-gradient(135deg,#dceee3,#ecf5ef)",
  amber:  "linear-gradient(135deg,#fbefd9,#f3ecdd)",
  rose:   "linear-gradient(135deg,#f7e2dc,#fdf0ee)",
  blue:   "linear-gradient(135deg,#e4ecf3,#eef2f8)",
  purple: "linear-gradient(135deg,#ede8f5,#f3f0fa)",
  slate:  "linear-gradient(135deg,#e4ecf3,#eef2f8)",
};

interface ThumbProps {
  emoji?: string;
  tone?: string;
  size?: number;
  radius?: number;
}

export function Thumb({ emoji = "📦", tone = "green", size = 42, radius = 10 }: ThumbProps) {
  return (
    <div
      style={{
        width: size, height: size, borderRadius: radius,
        background: toneGradients[tone] ?? toneGradients.green,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size * 0.45, flexShrink: 0,
      }}
    >
      {emoji}
    </div>
  );
}
