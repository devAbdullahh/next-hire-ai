export function VoiceWavePreview() {
  const bars = [0, 1, 2, 3, 4, 5, 6, 7];

  return (
    <div className="flex h-[22px] shrink-0 items-end justify-center gap-1">
      {bars.map((i) => (
        <span
          key={i}
          className="voice-bar"
          style={{ animationDelay: `${i * 0.12}s` }}
        />
      ))}
    </div>
  );
}
