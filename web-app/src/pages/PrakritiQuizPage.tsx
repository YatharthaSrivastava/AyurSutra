import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { PrakritiChart } from "@/components/PrakritiChart";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api-client";
import { PRAKRITI_QUESTIONS, type PrakritiAssessment } from "@/lib/types";
import { Sparkles, CheckCircle2, Award } from "lucide-react";

export default function PrakritiQuizPage() {
  const { session } = useAuth();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<{ assessment: PrakritiAssessment; holistic_health_index: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const setAnswer = (questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    if (!session) return;
    setLoading(true);
    setError("");
    try {
      const payload = Object.entries(answers).map(([question_id, value]) => ({ question_id, value }));
      const response = await api.assessPrakriti(session.token, payload);
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Assessment failed. Complete patient profile first.");
    } finally {
      setLoading(false);
    }
  };

  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-[#faf6f1] text-[#1b4332] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
          <div>
            <div className="flex items-center gap-2 text-[#1b4332] text-xs font-semibold tracking-wider uppercase mb-1">
              <Sparkles className="w-4 h-4 text-[#d4a373]" />
              <span>MOD-03 Prakriti Diagnostic Engine</span>
            </div>
            <h1 className="text-3xl font-bold font-serif text-[#1b4332]">
              Prakriti Diagnostic Quiz & Tripartite Dosha Score
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Answer diagnostic questions on a scale of 1 (never) to 5 (always) to calculate your Vata-Pitta-Kapha profile and Holistic Health Index (\(H_I\)).
            </p>
          </div>
        </div>

        {/* Quiz & Chart Grid */}
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Questions Column */}
          <div className="space-y-4 lg:col-span-8">
            {PRAKRITI_QUESTIONS.map((question, index) => (
              <div key={question.id} className="ayur-card p-5 space-y-3 bg-white border border-gray-200 shadow-sm rounded-2xl">
                <div className="flex items-start justify-between gap-4">
                  <p className="font-semibold text-[#1b4332] text-sm">
                    {index + 1}. {question.text}
                  </p>
                  <span className="shrink-0 rounded-full bg-amber-50 border border-amber-200 px-3 py-0.5 text-[11px] font-bold text-amber-900">
                    {question.doshaHint}
                  </span>
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setAnswer(question.id, value)}
                      className={`h-11 min-w-11 flex-1 rounded-xl border text-xs font-bold transition-all ${
                        answers[question.id] === value
                          ? "border-[#1b4332] bg-[#1b4332] text-white shadow-md"
                          : "border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700"
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {error && <p className="text-xs font-bold text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={loading || answeredCount < 3}
              className="w-full rounded-2xl bg-[#1b4332] py-4 font-bold text-white transition hover:bg-[#2d6a4f] shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
            >
              <CheckCircle2 className="w-4 h-4 text-[#d4a373]" />
              <span>{loading ? "Calculating Prakriti Score..." : `Submit Assessment (${answeredCount}/${PRAKRITI_QUESTIONS.length})`}</span>
            </button>
          </div>

          {/* Results Column */}
          <div className="space-y-6 lg:col-span-4">
            {result ? (
              <>
                <div className="ayur-card p-6 space-y-4 bg-white border border-gray-200 shadow-sm rounded-2xl">
                  <div className="flex items-center gap-2 border-b border-gray-100 pb-3 font-serif font-bold text-lg text-[#1b4332]">
                    <Award className="w-5 h-5 text-[#d4a373]" />
                    <span>Your Dosha Distribution</span>
                  </div>
                  <PrakritiChart assessment={result.assessment} />
                </div>

                <div className="ayur-card p-6 space-y-2 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 shadow-sm rounded-2xl">
                  <p className="text-xs text-amber-900 uppercase font-bold tracking-wider">Holistic Health Index (\(H_I\))</p>
                  <p className="font-serif text-4xl font-bold text-[#1b4332]">{result.holistic_health_index}</p>
                  <p className="text-[11px] text-gray-600">Calculated per PRD v1.1 formula</p>
                </div>
              </>
            ) : (
              <div className="ayur-card p-8 text-center space-y-3 bg-white border border-dashed border-gray-300 rounded-2xl">
                <Sparkles className="w-8 h-8 text-[#d4a373] mx-auto" />
                <p className="text-xs text-gray-500 leading-relaxed">
                  Complete at least 3 diagnostic questions and click submit to compute your tripartite Vata-Pitta-Kapha Prakriti chart.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
