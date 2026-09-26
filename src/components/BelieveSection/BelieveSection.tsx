import ScrollReveal from '../ScrollReveal/ScrollReveal';

export default function BelieveSection() {
  return (
    <section className="relative bg-black overflow-hidden py-24 md:py-40">
      {/* Grid pattern behind logo — centered */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ opacity: 0.3 }}>
        <img
          src="/xspine/grid-pattern.svg"
          alt=""
          className="w-[50vw] max-w-[660px]"
          style={{ filter: 'brightness(0.7)' }}
        />
      </div>

      <div className="relative max-w-[1200px] mx-auto px-4 md:px-[120px]">
        {/* Desktop: overlapping diagonal layout. Mobile: stacked */}
        <div className="flex flex-col md:grid md:grid-cols-2 gap-12 md:gap-8 items-center">

          {/* Card: What we believe — upper left */}
          <div className="w-full md:self-start md:-mt-8">
            <ScrollReveal delay={0.1}>
              <div
                className="relative rounded-3xl p-6 md:p-8 overflow-hidden"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  boxShadow: 'inset 0 0 4px 0 #5e7169',
                }}
              >
                <div
                  className="absolute inset-0 rounded-3xl pointer-events-none"
                  style={{
                    background: 'radial-gradient(ellipse at center, rgba(59,167,120,0.08) 0%, rgba(49,142,228,0.04) 50%, transparent 100%)',
                  }}
                />
                <div className="relative flex flex-col gap-4 md:gap-6">
                  <h3
                    className="text-2xl md:text-[40px] font-semibold leading-tight"
                    style={{
                      background: 'radial-gradient(ellipse at center, rgba(255,255,255,1) 30%, rgba(255,255,255,0.4) 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    What we believe
                  </h3>
                  <div className="flex flex-col gap-0">
                    <p className="text-sm md:text-[20px] font-light text-[#8A8A8A] leading-normal">
                      We believe the most powerful thing a brand can do is sound like itself.
                    </p>
                    <p className="text-sm md:text-[20px] font-light text-[#8A8A8A] leading-normal">
                      A brand isn't remembered for how loudly it speaks, but for how unmistakably it sounds.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Center logo — spans both columns on desktop */}
          <div className="md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-[60%] md:w-[35%] max-w-[411px] mx-auto md:mx-0 md:z-10">
            <ScrollReveal>
              <img
                src="/xspine/believe-logo.png"
                alt="XSpine logo"
                className="w-full h-auto"
                style={{ filter: 'drop-shadow(0 0 40px rgba(59, 167, 120, 0.15))' }}
              />
            </ScrollReveal>
          </div>

          {/* Card: How we get there — lower right */}
          <div className="w-full md:self-end md:mt-8">
            <ScrollReveal delay={0.25}>
              <div
                className="relative rounded-3xl p-6 md:p-8 overflow-hidden"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  boxShadow: 'inset 0 0 4px 0 #5e7169',
                }}
              >
                <div className="relative flex flex-col gap-4 md:gap-6">
                  <h3
                    className="text-2xl md:text-[40px] font-semibold leading-tight"
                    style={{
                      background: 'radial-gradient(ellipse at center, rgba(255,255,255,1) 30%, rgba(255,255,255,0.4) 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    How we get there
                  </h3>
                  <p className="text-sm md:text-[20px] font-light text-[#8A8A8A] leading-normal max-w-[540px]">
                    We uncover the story at the heart of your brand, and help you tell it, consistently, distinctively and everywhere it counts.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>

        </div>
      </div>
    </section>
  );
}
