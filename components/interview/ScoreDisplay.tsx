import { RadarChart } from "@/components/ui/RadarChart";
import { answerScoreToRadarAxes } from "@/lib/score-radar";
import type { AnswerScore } from "@/types";

interface ScoreDisplayProps {
  score: AnswerScore;
  compact?: boolean;
}

export function ScoreDisplay({ score, compact = false }: ScoreDisplayProps) {
  const axes = answerScoreToRadarAxes(score);

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <RadarChart
          axes={axes}
          size={88}
          showLabels={false}
          showValues={false}
        />
        <div>
          <p className="text-lg font-bold text-accent">{score.score}/10</p>
          <p className="text-xs text-subtle">Overall</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <RadarChart axes={axes} size={220} />
        <div className="text-center sm:text-left sm:pt-4">
          <p className="text-3xl font-bold text-accent">{score.score}</p>
          <p className="text-sm font-medium text-foreground">Overall score</p>
          <p className="text-xs text-subtle">out of 10</p>
        </div>
      </div>
      <p className="text-sm leading-relaxed text-muted">{score.justification}</p>
    </div>
  );
}
