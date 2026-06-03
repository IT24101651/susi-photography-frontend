import { useAbout } from '../../hooks/usePublicData'
import FadeInUp from '../ui/FadeInUp'

const FALLBACK = {
  image: null,
  heading: 'We Capture every moment of your beautiful life',
  subheading: 'Every frame tells a story worth keeping.',
  body_text: `At SUSI Photography, we believe the most valuable photographs are the ones that let you feel the moment all over again.

Based in Jaffna, our studio was founded in 2009, built on a love for capturing life's most meaningful occasions with elegance and heart. From weddings and engagements to portraits, family milestones, and cherished cultural celebrations, we document every story with a deep respect for emotion, detail, and authenticity.

For us, photography is more than beautiful imagery. It is the art of preserving fleeting expressions, quiet connections, joyful tears, and unforgettable celebrations in a way that feels timeless and true. Our approach blends premium visual craftsmanship with genuine storytelling, creating photographs that are both refined and deeply personal.

Every couple, every family, and every celebration carries a story worth honoring. At SUSI Photography, we are privileged to transform those once-in-a-lifetime moments into lasting memories you can return to for years to come.`,
}

export default function About() {
  const { data: apiAbout, isError } = useAbout()
  const about = (!isError && apiAbout?.heading) ? apiAbout : FALLBACK

  return (
    <section id="about" className="bg-white py-24">
      <div className="mx-auto grid max-w-6xl gap-16 px-6 md:grid-cols-2 md:items-center">
        <FadeInUp>
          <div className="mx-auto w-full max-w-[600px] rounded-[28px] bg-[#f6f1e8] p-3 shadow-[0_24px_60px_rgba(44,44,44,0.12)] sm:p-4">
            <div className="flex h-[400px] items-start justify-center overflow-hidden rounded-[22px] bg-white sm:h-[520px] lg:h-[590px]">
              {about.image ? (
                <img
                  src={about.image}
                  alt={about.heading}
                  className="h-full w-full object-cover object-top"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(184,148,91,0.22),_transparent_38%),linear-gradient(180deg,_#f7f0e6_0%,_#efe4d4_100%)] p-10 text-center">
                  <div>
                    <p className="font-ui text-xs uppercase tracking-[0.32em] text-[#b8945b]">Susi Photography</p>
                    <p className="mt-5 font-times-italic text-[2rem] leading-[1.02] tracking-[-0.02em] text-[#2d211a]">
                      Real moments, told with warmth and intention.
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="px-3 pb-3 pt-5 text-center sm:px-4 sm:pb-4">
              <div className="inline-flex flex-col items-center">
                <p className="font-times-italic text-[1.9rem] leading-none tracking-[-0.02em] text-[#b8945b] sm:text-[2.15rem]">Founder</p>
                <div className="mt-3 flex items-center gap-3 text-[#d1b27d]">
                  <span className="h-px w-16 bg-[#dcc6a2] sm:w-20" />
                  <span className="font-heading text-[0.72rem] leading-none tracking-[0.18em]">•</span>
                  <span className="h-px w-16 bg-[#dcc6a2] sm:w-20" />
                </div>
              </div>
            </div>
          </div>
        </FadeInUp>

        <FadeInUp delay={0.15}>
          <p className="mb-4 font-editorial text-[0.78rem] font-semibold uppercase tracking-[0.36em] text-[#6f5743] [font-variant:small-caps]">
            Our Story
          </p>
          <h2 className="mb-3 font-times-italic text-[2.45rem] leading-[0.98] tracking-[-0.02em] text-text sm:text-[3.25rem]">
            {about.heading}
          </h2>
          {about.subheading ? (
          <p className="mb-6 font-cormorant-medium text-[1.28rem] leading-8 tracking-[0.018em] text-[#72665b] sm:text-[1.36rem]">{about.subheading}</p>
          ) : null}
          <div className="whitespace-pre-line font-cormorant-medium text-[1.18rem] leading-8 tracking-[0.018em] text-text/80 sm:text-[1.24rem]">{about.body_text}</div>
        </FadeInUp>
      </div>
    </section>
  )
}
