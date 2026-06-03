import { motion } from 'framer-motion'
import { useTeam } from '../../hooks/usePublicData'
import FadeInUp from '../ui/FadeInUp'

const DEFAULT_INSTAGRAM_URL = 'https://www.instagram.com/susiphotography1?igsh=YzQxMWJpcWJsYWNk&utm_source=qr'
const NIRUSHAN_FACEBOOK_URL = 'https://www.facebook.com/share/18VGTeKuq1/?mibextid=wwXIfr'

const FALLBACK = [
  { id: 'f1', name: 'Cody Fisher', role: 'Founder & Creative Director', photo: null, instagram_url: '#' },
  { id: 'f2', name: 'Jacob Jones', role: 'Lead Fashion Photographer', photo: null, instagram_url: '#' },
  { id: 'f3', name: 'Annette Black', role: 'Art Director', photo: null, instagram_url: '#' },
  { id: 'f4', name: 'Jane Cooper', role: 'Senior Retouch Artist', photo: null, instagram_url: '#' },
  { id: 'f5', name: 'Esther Howard', role: 'Producer', photo: null, instagram_url: '#' },
  { id: 'f6', name: 'Marvin McKinney', role: 'Lighting Specialist', photo: null, instagram_url: '#' },
]

function PlaceholderPortrait({ name }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_26%),linear-gradient(180deg,#2d2d2d_0%,#191919_52%,#090909_100%)]">
      <div className="flex flex-col items-center gap-5 text-[#f7f4ef]">
        <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/25 bg-white/5 shadow-[0_22px_54px_rgba(0,0,0,0.28)] backdrop-blur-xl">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" className="h-11 w-11">
            <circle cx="12" cy="8" r="3.75" />
            <path d="M4.8 19c0-3.3 3.2-5.9 7.2-5.9s7.2 2.6 7.2 5.9" />
          </svg>
        </div>
        <p className="font-body text-[11px] uppercase tracking-[0.34em] text-[#f1ede5]">{name}</p>
      </div>
    </div>
  )
}

function TeamCard({ member }) {
  const normalizedName = (member.name || '').trim().toUpperCase()
  const profileUrl = normalizedName === 'NIRUSHAN PATHMANATHAN'
    ? NIRUSHAN_FACEBOOK_URL
    : (member.instagram_url || DEFAULT_INSTAGRAM_URL)

  return (
    <article
      onClick={() => window.open(profileUrl, '_blank', 'noopener,noreferrer')}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          window.open(profileUrl, '_blank', 'noopener,noreferrer')
        }
      }}
      aria-label={`Open ${member.name} on Instagram`}
      role="link"
      tabIndex={0}
      className="team-card group relative mx-auto h-[30rem] w-full max-w-[22rem] cursor-pointer overflow-hidden rounded-[2.2rem] border border-[#bda486]/65 bg-[#0f0f0f] shadow-[0_38px_110px_rgba(0,0,0,0.22)] transition-transform duration-300 hover:-translate-y-1 sm:h-[34rem] sm:max-w-[24rem] lg:h-[38rem] lg:max-w-[26rem]"
    >
      <div className="absolute inset-0 overflow-hidden rounded-[2.2rem]">
        {member.photo ? (
          <img
            src={member.photo}
            alt={member.name}
            loading="lazy"
            className="h-full w-full object-cover object-center grayscale transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <PlaceholderPortrait name={member.name} />
        )}
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.015)_26%,rgba(9,9,9,0.12)_52%,rgba(5,5,5,0.82)_100%)]" />
      <div className="absolute inset-[1px] rounded-[2.1rem] border border-white/18" />

      <div className="absolute inset-x-0 bottom-0 px-7 pb-7 pt-24 sm:px-8 sm:pb-8">
        <div className="border-t border-white/22 pt-4 text-[#f5f0e8]">
          <p className="font-heading text-[2rem] uppercase leading-[0.92] tracking-[0.015em] sm:text-[2.2rem]">
            {member.name}
          </p>
          {member.role ? (
            <p className="mt-3 border-b border-white/14 pb-3 font-body text-[0.72rem] uppercase tracking-[0.34em] text-[#d3c6b5]">
              {member.role}
            </p>
          ) : null}
          {member.bio ? (
            <p className="mt-4 max-h-[5.3rem] overflow-hidden font-cormorant-medium text-[1.1rem] leading-7 tracking-[0.018em] text-[#e5ddd1]">
              {member.bio}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  )
}

function LoadingCard({ delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: 'easeOut' }}
      className="mx-auto h-[25rem] w-full max-w-[20rem] overflow-hidden rounded-[30px] border border-white/70 bg-white/60 shadow-[0_24px_70px_rgba(17,17,17,0.08)] sm:h-[29rem] sm:max-w-[22rem] lg:h-[32rem] lg:max-w-[23rem]"
    >
      <div className="h-full w-full animate-pulse bg-[linear-gradient(135deg,rgba(255,255,255,0.92)_0%,rgba(233,233,233,0.96)_48%,rgba(255,255,255,0.92)_100%)] p-6">
        <div className="h-full rounded-[24px] border border-white/80 bg-[linear-gradient(180deg,rgba(0,0,0,0.03),rgba(0,0,0,0.10))]" />
      </div>
    </motion.div>
  )
}

export default function Team() {
  const { data: apiMembers = [], isLoading } = useTeam()
  const activeMembers = apiMembers.filter((member) => member.is_active)
  const members = [...(activeMembers.length > 0 ? activeMembers : FALLBACK)].slice(0, 2)

  return (
    <section
      id="team"
      className="relative scroll-mt-24 overflow-hidden bg-[#f4f1eb] pb-24 pt-32 text-[#2a211c] sm:scroll-mt-28 sm:py-28 lg:scroll-mt-32 lg:py-32"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.85),_transparent_26%),radial-gradient(circle_at_bottom,_rgba(201,180,151,0.16),_transparent_22%),linear-gradient(180deg,#f8f6f1_0%,#f1ede6_100%)]" />
        <div className="absolute left-10 top-24 h-52 w-52 rounded-full bg-white/50 blur-3xl" />
        <div className="absolute right-12 top-36 h-64 w-64 rounded-full bg-[#d8c2a0]/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-8 lg:px-10">
        <FadeInUp className="text-center">
          <p className="font-editorial text-[0.78rem] font-semibold uppercase tracking-[0.36em] text-[#6f5743] [font-variant:small-caps] sm:text-[0.82rem]">
            Creative Professionals
          </p>
          <h2 className="mt-4 font-times-italic text-[2.15rem] leading-[0.98] tracking-[-0.02em] text-[#1f1814] sm:mt-5 sm:text-[3.4rem]">
            Proprietors
          </h2>
          <div className="mx-auto mt-4 h-px w-12 bg-[#b49a7c]/55 sm:mt-5 sm:w-16" />
          <p className="mx-auto mt-5 max-w-[18rem] font-cormorant-medium text-[1.26rem] leading-8 tracking-[0.018em] text-[#72665b] sm:mt-6 sm:max-w-2xl sm:text-[1.34rem] sm:leading-9">
            <span className="sm:hidden">A studio ensemble shaped by fashion portraiture, cinematic direction, and quiet luxury detail.</span>
            <span className="hidden sm:inline">A studio ensemble shaped by fashion portraiture, cinematic direction, and quiet luxury detail.</span>
          </p>
        </FadeInUp>

        <div className="mt-12 sm:mt-20 lg:mt-24">
          <div className="relative">
            {isLoading && apiMembers.length === 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {[0, 1].map((index) => (
                  <LoadingCard key={index} delay={index * 0.08} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 justify-items-center gap-8 md:grid-cols-2 md:gap-10 lg:gap-14">
                {members.map((member) => (
                  <div key={member.id} className="flex h-full w-full items-center justify-center">
                    <TeamCard member={member} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <FadeInUp delay={0.18} className="mt-14 text-center sm:mt-18 lg:mt-20">
          <p className="font-body text-[0.82rem] uppercase tracking-[0.42em] text-[#8b735e]">
            Vision. Craft. Timeless.
          </p>
          <div className="mx-auto mt-4 h-px w-12 bg-[#b49a7c]/45" />
        </FadeInUp>
      </div>
    </section>
  )
}
