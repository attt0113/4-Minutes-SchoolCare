import { useParams, useNavigate } from 'react-router-dom';
import { Camera, CheckCircle2, ChevronRight, TriangleAlert, Info, Phone } from 'lucide-react';
import Layout from '../components/Layout';
import { motion } from 'motion/react';

export default function AssessmentScreen() {
  const { level } = useParams();
  const navigate = useNavigate();

  const isLevel1 = level === 'mild';
  const isLevel2 = level === 'moderate';

  const title = isLevel1 ? 'Level 1 — Mild complaint' : 'Level 2 — Moderate attention';

  return (
    <Layout title={title} showBack onBack={() => navigate('/dashboard')}>
      <div className="px-6 pt-6 flex flex-col gap-6">
        
        {/* Status Banner */}
        {isLevel1 ? (
          <section className="bg-secondary/10 rounded-3xl p-6 border-l-4 border-secondary flex gap-4 items-start shadow-sm">
            <CheckCircle2 className="w-6 h-6 text-secondary mt-1 shrink-0" />
            <div>
              <h2 className="font-bold text-on-surface text-base leading-tight mb-1">Student does not need to go home.</h2>
              <p className="text-on-surface-variant text-sm font-medium">Manage in school.</p>
            </div>
          </section>
        ) : (
          <section className="bg-yellow-50 border-l-4 border-yellow-500 rounded-r-3xl rounded-l-md p-6 shadow-sm flex items-start gap-4">
            <TriangleAlert className="w-6 h-6 text-yellow-500 mt-1 shrink-0" />
            <div>
              <h2 className="text-yellow-800 font-bold text-xs tracking-widest uppercase mb-1">Status Alert</h2>
              <p className="text-on-surface font-medium">Student should be sent to the office. Notify counselor.</p>
            </div>
          </section>
        )}

        {/* Step 1: AI Scan */}
        <section className="space-y-4">
          <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest ml-1">
            Step 1 — {isLevel2 ? 'Diagnostic' : 'AI Scan'}
          </h3>
          <button 
            onClick={() => navigate('/student-profile')}
            className="w-full bg-gradient-to-r from-primary to-primary-container text-white font-bold rounded-3xl py-5 px-6 flex items-center justify-center gap-3 shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
          >
            <Camera className="w-6 h-6" />
            <span>AI Scan</span>
          </button>
        </section>

        {/* AI Suggestion */}
        <section className="space-y-4">
          <h3 className={`text-xs font-bold uppercase tracking-widest ml-1 ${isLevel2 ? 'text-primary' : 'text-on-surface-variant'}`}>
            AI Suggestion
          </h3>
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-surface-container-highest/20 space-y-4">
            <div className="space-y-4">
              {isLevel1 ? (
                <ol className="space-y-4">
                  {[
                    'Let the student rest.',
                    'Provide water.',
                    'Monitor their condition closely.'
                  ].map((item, idx) => (
                    <li key={idx} className="flex gap-4 text-sm font-medium text-on-surface">
                      <span className="text-primary font-bold">{idx + 1}.</span>
                      {item}
                    </li>
                  ))}
                </ol>
              ) : (
                <div className="space-y-4">
                  {[
                    'Escort student to the clinic.',
                    'Monitor for worsening symptoms.',
                    'Prepare incident documentation.'
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 bg-surface-container-low rounded-2xl">
                      <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0">
                        {idx + 1}
                      </div>
                      <p className="text-sm font-medium text-on-surface">{item}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {isLevel2 && (
              <div className="mt-6 bg-tertiary/10 border-l-4 border-tertiary rounded-r-2xl p-4 flex items-start gap-3">
                <TriangleAlert className="w-5 h-5 text-tertiary shrink-0" />
                <p className="text-tertiary font-bold text-xs uppercase tracking-tight">
                  AI Detection: Student is ALLERGIC to Ibuprofen. Do not administer.
                </p>
              </div>
            )}
            
            {isLevel2 && (
              <div className="mt-4 p-4 bg-surface-container-low rounded-2xl border border-surface-container-highest/30 text-on-surface-variant text-xs font-medium">
                If symptoms persist after 15 minutes, proceed to Step 3.
              </div>
            )}
          </div>
        </section>

        {/* Level 2 Additional Steps */}
        {isLevel2 && (
          <>
            <section className="space-y-4">
              <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest ml-1">Step 2 — Office Transfer</h3>
              <div className="bg-surface-container-low rounded-3xl p-6 space-y-4">
                <button className="w-full bg-gradient-to-r from-primary to-primary-container text-white font-bold rounded-full py-4 shadow-lg shadow-primary/20 active:scale-[0.98] transition-all">
                  Send to Office
                </button>
                <p className="text-center text-on-surface-variant text-xs font-medium italic">
                  This will notify the counselor and update student status to 'In Transit'.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest ml-1">Step 3 — If Still Unwell</h3>
              <button className="w-full bg-tertiary text-white font-bold rounded-full py-4 shadow-lg shadow-tertiary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                <Phone className="w-5 h-5" />
                Call guardian
              </button>
              <p className="text-center text-on-surface-variant text-xs font-medium">
                Contact verified guardian only. Do not let student call.
              </p>
            </section>
          </>
        )}

        {/* Primary Action */}
        <div className="mt-6">
          <button className="w-full bg-gradient-to-r from-primary to-primary-container text-white font-bold rounded-full py-5 shadow-xl shadow-primary/20 active:scale-[0.98] transition-all mb-10">
            {isLevel1 ? 'Confirm & Log' : 'Confirm & Send'}
          </button>
        </div>
      </div>
    </Layout>
  );
}
