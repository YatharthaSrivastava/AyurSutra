import type { PrakritiAssessment } from "@/lib/types";

const DOSHA_COLORS = {
  vata: "bg-dosha-vata",
  pitta: "bg-dosha-pitta",
  kapha: "bg-dosha-kapha",
};

export function PrakritiChart({ assessment }: { assessment: PrakritiAssessment }) {
  const bars = [
    { label: "Vata", score: assessment.vata_score, color: DOSHA_COLORS.vata },
    { label: "Pitta", score: assessment.pitta_score, color: DOSHA_COLORS.pitta },
    { label: "Kapha", score: assessment.kapha_score, color: DOSHA_COLORS.kapha },
  ];

  return (
    <div className="rounded-2xl border border-ayur-primary/10 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-serif text-xl text-ayur-primary">Prakriti Assessment</h3>
        <span className="rounded-full bg-ayur-accent/20 px-3 py-1 text-sm font-medium text-ayur-primary">
          Dominant: {assessment.dominant_dosha}
        </span>
      </div>
      <div className="space-y-4">
        {bars.map((bar) => (
          <div key={bar.label}>
            <div className="mb-1 flex justify-between text-sm">
              <span className="font-medium">{bar.label}</span>
              <span>{bar.score}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-gray-100">
              <div
                className={`h-full rounded-full transition-all ${bar.color}`}
                style={{ width: `${bar.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
