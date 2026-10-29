// features/ScrollMotionDemo/pages/ScrollMotionDemoPage.tsx

import { ScrollMotion } from "../components/ScrollMotion";


const cards = Array.from(
  { length: 12 },
  (_, i) => i + 1
);

export default function ScrollMotionDemoPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <section className="h-screen flex flex-col items-center justify-center">
        <ScrollMotion
          effect="scale"
          duration={1000}
        >
          <h1 className="text-6xl font-bold">
            Scroll Motion
          </h1>
        </ScrollMotion>

        <ScrollMotion
          effect="fade"
          delay={200}
          duration={1000}
        >
          <p className="text-slate-400 mt-4">
            Reusable scroll interaction system
          </p>
        </ScrollMotion>
      </section>

      {/* Cards */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <ScrollMotion
              key={card}
              effect="fade-up"
              delay={index * 80}
              duration={800}
              distance={60}
            >
              <div className="h-56 rounded-3xl bg-slate-900 border border-slate-800 p-6">
                <div className="text-4xl font-bold text-blue-500">
                  {card}
                </div>

                <h2 className="text-xl font-semibold mt-4">
                  Motion Card
                </h2>

                <p className="text-slate-400 mt-2">
                  Smooth reveal animation
                  powered by reusable
                  scroll motion container.
                </p>
              </div>
            </ScrollMotion>
          ))}
        </div>
      </section>

      {/* Different Effects */}
      <section className="space-y-32 py-32">
        <ScrollMotion
          effect="fade-left"
          duration={1200}
        >
          <div className="max-w-4xl mx-auto bg-slate-900 rounded-3xl p-16">
            <h2 className="text-5xl font-bold">
              Fade Left
            </h2>
          </div>
        </ScrollMotion>

        <ScrollMotion
          effect="fade-right"
          duration={1200}
        >
          <div className="max-w-4xl mx-auto bg-slate-900 rounded-3xl p-16">
            <h2 className="text-5xl font-bold">
              Fade Right
            </h2>
          </div>
        </ScrollMotion>

        <ScrollMotion
          effect="scale"
          duration={1200}
          scale={0.7}
        >
          <div className="max-w-4xl mx-auto bg-slate-900 rounded-3xl p-16">
            <h2 className="text-5xl font-bold">
              Scale Reveal
            </h2>
          </div>
        </ScrollMotion>

        <ScrollMotion
          effect="blur"
          duration={1400}
          blur={20}
        >
          <div className="max-w-4xl mx-auto bg-slate-900 rounded-3xl p-16">
            <h2 className="text-5xl font-bold">
              Blur Reveal
            </h2>
          </div>
        </ScrollMotion>
      </section>
    </div>
  );
}