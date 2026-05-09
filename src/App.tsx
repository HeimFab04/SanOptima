import { type FormEvent, type ReactNode, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { formConfig, type FormKey } from './config'
import alertsImage from './assets/Alerts.png'
import benjaminImage from './assets/Benjamin Schadow.png'
import biomarkersImage from './assets/Biomarkers.png'
import bloodSamplingImage from './assets/Blood Sampling.png'
import dashboardImage from './assets/Dashboard.png'
import fabianImage from './assets/Fabian Heim.png'
import frankfurtLabImage from './assets/Frankfurt Lab.png'
import headerVideo from './assets/Header Video.mp4'
import healthAspectImage from './assets/Health Aspect.png'
import insightsImage from './assets/Insights.png'
import jenniferImage from './assets/Jennifer Hsu Jao.png'
import lukasImage from './assets/Lukas Hein.png'
import nutritionImage from './assets/Nutrition.png'
import paulImage from './assets/Paul Holzer.png'
import programsImage from './assets/Program.png'
import recommendationsImage from './assets/Recommendations.png'
import logoImage from './assets/SanOptima Logo_White Background.png'
import supplementsImage from './assets/Supplements.png'
import wearablesImage from './assets/Wearables.png'
import justinImage from './assets/Justin Jordanek.png'
import './App.css'

type FormState = 'idle' | 'submitting' | 'success' | 'error'
type Answers = Record<string, string | string[]>

const assets = {
  logo: logoImage,
  headerVideo,
  bloodPatch: bloodSamplingImage,
  frankfurtLab: frankfurtLabImage,
  healthAspect: healthAspectImage,
  product: {
    dashboard: dashboardImage,
    wearables: wearablesImage,
    biomarkers: biomarkersImage,
    insights: insightsImage,
    recommendations: recommendationsImage,
    programs: programsImage,
    nutrition: nutritionImage,
    alerts: alertsImage,
    supplements: supplementsImage,
  },
  team: [fabianImage, benjaminImage, jenniferImage, lukasImage, paulImage, justinImage],
}

const navItems = [
  ['Pain points', 'pain'],
  ['Mission', 'mission'],
  ['Ecosystem', 'ecosystem'],
  ['Platform', 'platform'],
  ['Testing', 'testing'],
  ['Team', 'team'],
  ['Join', 'join'],
]

const painPoints = [
  ['Disconnected tools', 'Oura, Apple Health, CGMs, nutrition apps, and lab results rarely speak the same language.'],
  ['Numbers without meaning', 'You can see sleep, HRV, glucose, ferritin, or cortisol, but still wonder what actually matters.'],
  ['No clear next step', 'Most tools show what happened. Few help you decide what to change first.'],
  ['Supplement uncertainty', 'People spend money on routines without knowing whether they match their biology.'],
  ['Reactive health management', 'Signals often become obvious only after stress, fatigue, or metabolic issues build up.'],
  ['Goals without a system', 'Better sleep, marathon prep, longevity, muscle gain, and metabolic health need different guidance.'],
]

const ecosystemSteps = [
  ['Connect', 'Sync wearables, health apps, and device data.'],
  ['Add biology', 'Bring in biomarkers, nutrition, blood tests, and home testing.'],
  ['Define goals', 'Personalize around recovery, performance, longevity, stress, or metabolic health.'],
  ['Detect patterns', 'Compare signals over time and surface correlations that matter.'],
  ['Recommend', 'Turn data into focused action plans, routines, testing, referrals, and supplement guidance.'],
  ['Adapt', 'Update recommendations as new data, progress, and goals change.'],
]

const valueMaps = [
  {
    tab: 'Fragmented data',
    pain: 'My health data is scattered across too many apps and devices.',
    features: ['Wearable integrations', 'Unified dashboard', 'Biomarker center', 'Nutrition tracker', 'Goal-based overview'],
    solves: ['Disconnected health information', 'Fragmented understanding', 'No single overview'],
    gains: ['One place for all health data', 'Better clarity', 'Easier pattern recognition', 'More efficient decisions'],
    signal: 'Sleep, HRV, glucose, lab results, and meals live in separate tools.',
    action: 'SanOptima unifies the signals into one goal-based command center.',
  },
  {
    tab: 'No interpretation',
    pain: 'I track health metrics, but I still do not know what they actually mean.',
    features: ['Insights engine', 'Correlation analysis', 'Biomarker interpretation', 'Trend view', 'Alert system'],
    solves: ['Raw data without interpretation', 'Confusion', 'No clear next step'],
    gains: ['Understandable insights', 'Translated meaning', 'Smarter actions', 'Confidence in what to focus on'],
    signal: 'Your numbers move, but the meaning is unclear.',
    action: 'SanOptima translates patterns into insight, context, and priority.',
  },
  {
    tab: 'Supplement guesswork',
    pain: 'I take supplements, but I do not know if they are actually helping.',
    features: ['Biomarker tracking', 'Supplement effectiveness insights', 'Personalized recommendations', 'Correlation engine', '3 stack options + custom formula'],
    solves: ['Supplement guesswork', 'Wasted spending', 'Unclear effectiveness'],
    gains: ['More targeted supplementation', 'Reduced trial and error', 'Clearer efficacy tracking', 'More trust in what to keep or remove'],
    signal: 'You change routines, but cannot see what improves.',
    action: 'SanOptima connects supplementation with biomarkers, goals, and outcomes.',
  },
  {
    tab: 'Specific goals',
    pain: 'I want to improve my health, but my goals are very specific.',
    features: ['Programs section', 'Goal-based personalization', 'Custom goal input', 'Adaptive recommendations', 'Plan generation'],
    solves: ['Generic guidance', 'No goal personalization', 'Lack of structured plan'],
    gains: ['Personalized roadmap', 'Clearer priorities', 'More relevant recommendations', 'Better goal alignment'],
    signal: 'A marathon goal and a stress goal should not receive the same plan.',
    action: 'SanOptima adapts recommendations to your target outcome.',
  },
  {
    tab: 'Nutrition confusion',
    pain: 'I do not know what to eat for my goal.',
    features: ['Nutrition tracker', 'Manual meal entry', 'Photo meal analysis', 'Nutrition prompts', 'Recipe suggestions'],
    solves: ['Meal uncertainty', 'Lack of direction', 'Food-goal mismatch'],
    gains: ['Easier daily food choices', 'Better consistency', 'Meals aligned to goals', 'Less friction in healthy eating'],
    signal: 'Food decisions happen daily, but context is missing.',
    action: 'SanOptima turns nutrition into goal-aligned guidance.',
  },
  {
    tab: 'Prevention needs',
    pain: 'I want to catch health problems earlier, not only after something goes wrong.',
    features: ['Alerts section', 'Long-term trend analysis', 'Biomarker history', 'Early warning signals', 'Lab and home testing'],
    solves: ['Reactive health management', 'Missed warning signs', 'Late intervention'],
    gains: ['Earlier awareness', 'Proactive action', 'Stronger prevention', 'Better long-term resilience'],
    signal: 'Small changes become meaningful when seen early and over time.',
    action: 'SanOptima watches trends and flags what deserves attention.',
  },
  {
    tab: 'Convenient testing',
    pain: 'I want blood testing, but I need it to be convenient.',
    features: ['Frankfurt lab', 'In-person appointments', 'At-home blood patch', 'Upload own blood test', 'Testing history'],
    solves: ['Testing inconvenience', 'Lack of flexibility', 'Limited access to data'],
    gains: ['Accessible biomarker tracking', 'Flexible testing options', 'Easier health monitoring', 'Higher engagement'],
    signal: 'Testing should fit your life, not interrupt it.',
    action: 'SanOptima supports lab visits, home kits, uploads, and history.',
  },
  {
    tab: 'Flexible support',
    pain: 'I want guidance, but I do not want to be forced into one rigid product model.',
    features: ['Dashboard-only use', 'Recommendation layer', 'Testing add-ons', 'Supplement browsing', 'Expert referrals'],
    solves: ['Rigid subscriptions', 'Forced bundles', 'Lack of control'],
    gains: ['More flexibility', 'User choice', 'Personalized support level', 'Stronger trust'],
    signal: 'Different users need different levels of help.',
    action: 'SanOptima lets support expand with your needs.',
  },
  {
    tab: 'Personalization',
    pain: 'I want something truly personalized to my body, not generic advice.',
    features: ['Personalized profile', 'Goal engine', 'Biomarker analysis', 'Wearables integration', 'Dynamic plan generation'],
    solves: ['Generic recommendations', 'Low relevance', 'Weak personalization'],
    gains: ['Individualized guidance', 'Higher relevance', 'Meaningful recommendations', 'Stronger adherence'],
    signal: 'Your biology, goals, and behavior create your health context.',
    action: 'SanOptima builds guidance around your actual profile.',
  },
]

const platformSections = [
  {
    key: 'dashboard',
    eyebrow: 'Command center',
    title: 'A calm overview of what your body is telling you.',
    copy: 'SanOptima brings recovery, sleep, stress, nutrition, biomarker status, goals, and recommendations into one premium dashboard.',
  },
  {
    key: 'wearables',
    eyebrow: 'Connected signals',
    title: 'Your wearables become part of one health picture.',
    copy: 'Oura, Apple Watch, WHOOP, CGM, Garmin, and other tools can feed into one interpretation layer instead of separate apps.',
  },
  {
    key: 'biomarkers',
    eyebrow: 'Internal health',
    title: 'Biomarkers become trends, not isolated PDFs.',
    copy: 'Blood values, uploaded lab results, home tests, and planned in-lab appointments can be tracked as a living profile.',
  },
  {
    key: 'insights',
    eyebrow: 'Pattern intelligence',
    title: 'Correlations make the hidden obvious.',
    copy: 'The platform is designed to connect lifestyle, supplements, sleep, glucose, hormones, inflammation, and performance signals.',
  },
  {
    key: 'recommendations',
    eyebrow: 'Personalized action',
    title: 'Recommendations are tied to your goals and data.',
    copy: 'Plans can combine sleep, nutrition, training, biomarker follow-up, supplementation, and expert guidance into one path.',
  },
  {
    key: 'programs',
    eyebrow: 'Goal systems',
    title: 'Programs adapt to the health outcome you care about.',
    copy: 'Choose structured programs for marathon preparation, longevity, muscle gain, recovery, sleep, stress, or metabolic health.',
  },
  {
    key: 'nutrition',
    eyebrow: 'Food context',
    title: 'Nutrition becomes connected to recovery and biology.',
    copy: 'Meals, macros, hydration, glucose response, and goal-based guidance can explain what your body responds to best.',
  },
  {
    key: 'alerts',
    eyebrow: 'Earlier signals',
    title: 'Know when something deserves attention.',
    copy: 'Alerts are imagined as timely, contextual signals for recovery, stress, hydration, biomarkers, sleep, and metabolic patterns.',
  },
  {
    key: 'supplements',
    eyebrow: 'Optional support',
    title: 'Supplement guidance becomes transparent and personal.',
    copy: 'Optional supplement stacks can be based on biomarkers, goals, preferences, and evidence, with clear rationale.',
  },
] as const

const founders = [
  ['Fabian Heim', 'Founder', 'Product vision, customer discovery, and health-tech strategy.'],
  ['Benjamin Schadow', 'Founding team', 'Platform thinking, execution, and health intelligence systems.'],
  ['Jennifer Hsu Jao', 'Founding team', 'User research, operations, and customer trust.'],
  ['Lukas Hein', 'Founding team', 'Technology, analytics, and scalable product development.'],
  ['Paul Holzer', 'Founding team', 'Growth, partnerships, and customer-centered execution.'],
  ['Justin Jordanek', 'Founding team', 'Research, strategy, and product validation.'],
]

const faqs = [
  ['Is SanOptima a live medical product?', 'No. This is a frontend prototype for customer discovery and interest testing. It does not provide diagnosis or medical advice.'],
  ['What data would SanOptima connect?', 'The long-term vision includes wearables, biomarkers, nutrition, lifestyle context, goals, testing, and optional supplement guidance.'],
  ['Do I need a wearable?', 'No. Wearables would make the experience richer, but biomarker, nutrition, goal, and questionnaire data can still be useful.'],
  ['How would privacy be handled?', 'A real product would require explicit consent, strong security, privacy controls, and careful handling of health data. This prototype stores no accounts.'],
  ['Will SanOptima sell supplements?', 'Optional supplements are part of the vision, but recommendations should be transparent, goal-based, and easy to decline.'],
  ['Can I join without committing?', 'Yes. Joining the waitlist only signals interest and helps shape the first version.'],
]

const questionnaireSteps = [
  {
    title: 'About you',
    fields: [
      { id: 'profile', type: 'radio', label: 'What best describes you?', options: ['Student', 'Professional', 'Athlete', 'Coach', 'Healthcare professional', 'Health-conscious consumer', 'Investor', 'Other'] },
      { id: 'age', type: 'radio', label: 'How old are you?', options: ['Under 18', '18-24', '25-34', '35-44', '45-54', '55+'] },
      { id: 'country', type: 'text', label: 'Which country are you based in?' },
    ],
  },
  {
    title: 'Current health behavior',
    fields: [
      { id: 'tools', type: 'checkbox', label: 'Which of the following do you currently use?', options: ['Apple Watch', 'Oura Ring', 'WHOOP', 'Garmin', 'Fitbit', 'Continuous glucose monitor', 'Nutrition tracking app', 'Blood testing', 'Supplements', 'None of the above'] },
      { id: 'tracking_frequency', type: 'radio', label: 'How often do you actively track your health?', options: ['Daily', 'A few times per week', 'Occasionally', 'Rarely'] },
      { id: 'supplements_current', type: 'radio', label: 'Do you currently take supplements?', options: ['Yes, regularly', 'Sometimes', 'No'] },
      { id: 'blood_tests', type: 'radio', label: 'Do you currently do blood tests or biomarker tests?', options: ['Yes, regularly', 'Occasionally', 'Rarely', 'Never'] },
      { id: 'food_tracking', type: 'radio', label: 'Do you currently track your food or meals?', options: ['Yes, every day', 'Sometimes', 'Rarely', 'Never'] },
    ],
  },
  {
    title: 'Frustrations and needs',
    fields: [
      { id: 'frustrations', type: 'checkbox', label: 'What frustrates you most about current health tracking tools?', options: ['Data is spread across too many apps', 'I do not know what the data means', 'I do not know what action to take', 'Too much manual effort', 'Too expensive', 'I do not trust the recommendations', 'Other'] },
      { id: 'goal', type: 'radio', label: 'What is your biggest health goal right now?', options: ['Better sleep', 'Less stress', 'Recovery', 'Marathon / endurance preparation', 'Muscle gain', 'Fat loss', 'Longevity', 'Metabolic health', 'Diabetes prevention/support', 'General wellbeing', 'Other'] },
      { id: 'unified_value', type: 'rating', label: 'How valuable would it be to have all your health data in one place?' },
      { id: 'recommendation_value', type: 'rating', label: 'How valuable would personalized recommendations be?' },
      { id: 'warning_value', type: 'rating', label: 'How valuable would early warning signals be?' },
      { id: 'features', type: 'checkbox', label: 'Which features would interest you most?', options: ['Unified health dashboard', 'Wearable integration', 'Biomarker tracking', 'Food / meal tracking', 'Supplement recommendations', 'Early warnings', 'Goal-based coaching', 'Expert referrals', 'Home blood patch testing', 'In-lab testing', 'Long-term health insights'] },
      { id: 'concerns', type: 'checkbox', label: 'What concerns would you have about a platform like this?', options: ['Data privacy', 'Accuracy of recommendations', 'Too complicated', 'Cost', 'Trust in health advice', 'Too much manual tracking', 'No major concerns', 'Other'] },
    ],
  },
  {
    title: 'Willingness and interest',
    fields: [
      { id: 'try_interest', type: 'radio', label: 'Would you be interested in trying a platform like SanOptima?', options: ['Yes', 'Maybe', 'No'] },
      { id: 'model_interest', type: 'radio', label: 'Which model would interest you most?', options: ['Dashboard / analytics only', 'Dashboard + recommendations', 'Dashboard + testing', 'Full premium platform', 'Not sure yet'] },
      { id: 'monthly_price', type: 'radio', label: 'How much would you potentially pay per month for a valuable platform like this?', options: ['EUR 0', 'EUR 1-9', 'EUR 10-19', 'EUR 20-39', 'EUR 40-59', 'EUR 60+'] },
      { id: 'supplement_recommendations', type: 'radio', label: 'Would you want optional supplement recommendations?', options: ['Yes', 'Maybe', 'No'] },
      { id: 'coach_access', type: 'radio', label: 'Would you want optional access to coaches or specialists?', options: ['Yes', 'Maybe', 'No'] },
      { id: 'trust_drivers', type: 'textarea', label: 'What would make you trust a platform like this?' },
      { id: 'today_help', type: 'textarea', label: 'If SanOptima existed today, what would you most want it to help you with?' },
    ],
  },
]

function useFormSubmit(formKey: FormKey, successLabel: string) {
  const [state, setState] = useState<FormState>('idle')
  const [message, setMessage] = useState('')

  async function submit(payload: Record<string, unknown>) {
    const endpoint = formConfig[formKey]
    setState('submitting')
    setMessage('')

    if (!endpoint) {
      window.setTimeout(() => {
        const existing = JSON.parse(window.localStorage.getItem('sanoptima_prototype_submissions') || '[]') as Record<string, unknown>[]
        window.localStorage.setItem(
          'sanoptima_prototype_submissions',
          JSON.stringify([...existing, { form: formKey, payload }]),
        )
        setState('success')
        setMessage(`${successLabel} This prototype saved your submission locally. Add a form endpoint in src/config.ts to send real submissions.`)
      }, 450)
      return
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error('Form endpoint rejected the submission.')
      setState('success')
      setMessage(successLabel)
    } catch {
      setState('error')
      setMessage('The form could not be sent. Please check the configured endpoint and try again.')
    }
  }

  return { state, message, submit }
}

function Reveal({ children, className = '', platformRow }: { children: ReactNode; className?: string; platformRow?: number }) {
  return (
    <motion.div
      className={className}
      data-platform-row={platformRow}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

function AssetImage({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  const [loaded, setLoaded] = useState(true)

  return (
    <div className={`asset-frame ${className} ${loaded ? '' : 'missing'}`}>
      {loaded ? <img src={src} alt={alt} onError={() => setLoaded(false)} /> : <span>{alt}</span>}
    </div>
  )
}

function Logo() {
  return (
    <a className="brand" href="#home" aria-label="SanOptima home">
      <img className="brand-logo-img" src={assets.logo} alt="SanOptima" />
      <span className="brand-fallback">SanOptima</span>
    </a>
  )
}

function SectionHeading({ eyebrow, title, children, center = false }: { eyebrow: string; title: string; children: ReactNode; center?: boolean }) {
  return (
    <div className={`section-heading ${center ? 'center' : ''}`}>
      <span>{eyebrow}</span>
      <h2>{title}</h2>
      <p>{children}</p>
    </div>
  )
}

function Hero() {
  return (
    <section id="home" className="hero-journey">
      <video className="hero-video" src={assets.headerVideo} autoPlay muted loop playsInline aria-hidden="true" />
      <div className="hero-shade" />
      <Reveal className="hero-inner">
        <motion.div
          className="hero-main"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.75 }}
        >
          <span className="eyebrow">SanOptima</span>
          <h1>
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>Optimize your health.</motion.span>
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}> Elevate your life.</motion.span>
          </h1>
          <p>
            A personalized health intelligence platform for connecting wearables, biomarkers, nutrition, testing, goals, and recommendations into one guided system.
          </p>
          <div className="button-row">
            <a className="btn primary" href="#join">Join the waitlist</a>
            <a className="btn secondary" href="#platform">Explore the platform</a>
            <a className="btn ghost" href="#questionnaire">Take the questionnaire</a>
          </div>
        </motion.div>
      </Reveal>
    </section>
  )
}

function PainRecognition() {
  return (
    <section id="pain" className="section">
      <SectionHeading eyebrow="Problem recognition" title="You are not missing data. You are missing clarity.">
        Modern health tools produce more signals than ever, but the human experience is still fragmented, uncertain, and hard to act on.
      </SectionHeading>
      <div className="pain-grid">
        {painPoints.map(([title, copy], index) => (
          <Reveal key={title} className="pain-card">
            <span>{String(index + 1).padStart(2, '0')}</span>
            <h3>{title}</h3>
            <p>{copy}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function Mission() {
  return (
    <section id="mission" className="mission-section">
      <Reveal className="exist-card">
        <span className="eyebrow">Why we exist</span>
        <h2>Health-conscious people already collect more data than ever. They still lack one intelligent system that turns it into clarity, guidance, and meaningful action.</h2>
      </Reveal>
      <div className="vision-grid">
        <Reveal className="vision-card">
          <span>Vision</span>
          <h3>A future where personal health is proactive, connected, understandable, and deeply personalized.</h3>
        </Reveal>
        <Reveal className="vision-card">
          <span>Mission</span>
          <h3>Combine wearable, biomarker, nutrition, and lifestyle data into one system that helps people make better decisions and act earlier.</h3>
        </Reveal>
      </div>
    </section>
  )
}

function HumanLandscape() {
  const statements = [
    'I have Oura, Apple Health, and lab results, but none of it connects.',
    'I take supplements, but I do not know if they are actually helping.',
    'I want to get fitter, sleep better, run farther, or reduce stress, but I do not know how my biology affects that.',
    'I want prevention, not guesswork.',
  ]

  return (
    <section className="section human-section">
      <SectionHeading eyebrow="User landscape" title="The pain is practical, but it feels personal.">
        SanOptima starts with the questions people already carry quietly when they look at their health data.
      </SectionHeading>
      <div className="quote-stack">
        {statements.map((statement) => (
          <Reveal key={statement} className="quote-card">"{statement}"</Reveal>
        ))}
      </div>
    </section>
  )
}

function Solution() {
  const solutionPillars = [
    ['Unify', 'Wearables, biomarkers, nutrition, testing, and goals in one profile.'],
    ['Interpret', 'Turn signals into patterns, correlations, alerts, and clear meaning.'],
    ['Act', 'Translate insight into plans, routines, testing, referrals, and optional supplements.'],
  ]

  return (
    <section className="solution-section">
      <Reveal className="solution-hero-card">
        <div className="solution-copy">
          <span className="eyebrow">Our solution</span>
          <h2>One health intelligence layer for the decisions your apps cannot make alone.</h2>
          <p>
            SanOptima connects your external signals, internal biomarkers, daily behavior, and goals, then turns them into clearer priorities and next actions.
          </p>
        </div>
        <div className="solution-system">
          <div className="solution-core">
            <strong>SanOptima</strong>
            <span>Health intelligence</span>
          </div>
          {['Wearables', 'Biomarkers', 'Nutrition', 'Goals', 'Testing', 'Alerts', 'Programs', 'Supplements'].map((item, index) => (
            <span className={`solution-node node-${index + 1}`} key={item}>{item}</span>
          ))}
        </div>
        <div className="solution-pillar-grid">
          {solutionPillars.map(([title, copy], index) => (
            <article key={title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
            </article>
          ))}
        </div>
      </Reveal>
    </section>
  )
}

function Ecosystem() {
  return (
    <section id="ecosystem" className="section ecosystem-section">
      <SectionHeading eyebrow="How the ecosystem works" title="A guided loop from signal to action.">
        The platform vision is not another place to store charts. It is a connected journey that helps you decide what to do next.
      </SectionHeading>
      <div className="process-track">
        {ecosystemSteps.map(([title, copy], index) => (
          <Reveal key={title} className="process-step">
            <div className="process-node">
              <span>{index + 1}</span>
              <i />
            </div>
            <div>
              <h3>{title}</h3>
              <p>{copy}</p>
            </div>
            {index < ecosystemSteps.length - 1 && <strong className="process-arrow">{'->'}</strong>}
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function ValueEngine() {
  const [active, setActive] = useState(0)
  const item = valueMaps[active]

  return (
    <section className="value-section">
      <SectionHeading eyebrow="Value engine" title="From fragmented data to clear health decisions." center>
        SanOptima connects the pain you feel, the product capability that addresses it, and the practical gain you can understand.
      </SectionHeading>
      <div className="value-engine">
        <div className="value-tabs" role="tablist" aria-label="Pain point map">
          {valueMaps.map((map, index) => (
            <button
              key={map.tab}
              type="button"
              className={active === index ? 'active' : ''}
              onClick={() => setActive(index)}
              role="tab"
              aria-selected={active === index}
            >
              <span>{String(index + 1).padStart(2, '0')}</span>
              {map.tab}
            </button>
          ))}
        </div>
        <motion.div
          className="value-panel"
          key={item.tab}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="value-flow">
            <article>
              <span>Pain point</span>
              <h3>"{item.pain}"</h3>
              <p>{item.signal}</p>
            </article>
            <div className="value-connector">{'->'}</div>
            <article>
              <span>SanOptima feature</span>
              <h3>{item.features[0]}</h3>
              <ul>{item.features.slice(1).map((feature) => <li key={feature}>{feature}</li>)}</ul>
            </article>
            <div className="value-connector">{'->'}</div>
            <article>
              <span>Gain created</span>
              <h3>{item.gains[0]}</h3>
              <ul>{item.gains.slice(1).map((gain) => <li key={gain}>{gain}</li>)}</ul>
            </article>
          </div>
          <div className="value-micro">
            <div>
              <span>What this solves</span>
              {item.solves.map((solve) => <strong key={solve}>{solve}</strong>)}
            </div>
            <div>
              <span>{'Signal -> interpretation -> action -> gain'}</span>
              <p>{item.signal} {item.action}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function Platform() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const rows = Array.from(document.querySelectorAll<HTMLElement>('[data-platform-row]'))
    const observer = new IntersectionObserver(
      (entries) => {
        const focused = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (focused?.target instanceof HTMLElement) {
          setActiveIndex(Number(focused.target.dataset.platformRow || 0))
        }
      },
      { rootMargin: '-35% 0px -35% 0px', threshold: [0.18, 0.32, 0.5, 0.68] },
    )

    rows.forEach((row) => observer.observe(row))
    return () => observer.disconnect()
  }, [])

  return (
    <section id="platform" className="platform-section">
      <SectionHeading eyebrow="Product experience" title="A platform designed to feel calm, intelligent, and alive." center>
        These sections use the final SanOptima prototype visuals and frame each product area around the customer value it creates.
      </SectionHeading>
      <div className="platform-stack">
        <span
          className="platform-traveler"
          style={{
            top: `${1.85 + activeIndex * 11.13}%`,
            left: activeIndex % 2 ? '67.9%' : '0.15%',
          }}
          aria-hidden="true"
        />
        {platformSections.map((item, index) => (
          <Reveal
            key={item.key}
            className={`platform-row ${index % 2 ? 'reverse' : ''} ${activeIndex === index ? 'active' : ''}`}
            platformRow={index}
          >
            <div className="platform-copy">
              <span>{item.eyebrow}</span>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </div>
            <AssetImage
              src={assets.product[item.key]}
              alt={`SanOptima ${item.key} prototype`}
              className="platform-image"
            />
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function Testing() {
  return (
    <section id="testing" className="section testing-section">
      <SectionHeading eyebrow="Testing ecosystem" title="Biomarker access when and where it fits your life.">
        SanOptima is imagined with both in-person blood testing and convenient home collection as part of the long-term platform.
      </SectionHeading>
      <div className="testing-grid">
        <Reveal className="lab-card">
          <div>
            <span className="eyebrow">In-person blood testing</span>
            <h3>Planned lab location: Frankfurt</h3>
            <p>Book a clinic visit for comprehensive biomarker analysis and bring results directly into your SanOptima profile.</p>
          </div>
          <AssetImage src={assets.frankfurtLab} alt="Frankfurt laboratory location preview" className="lab-image" />
        </Reveal>
        <Reveal className="home-test-card">
          <AssetImage src={assets.bloodPatch} alt="SanOptima at-home blood sampling patch" />
          <div>
            <span className="eyebrow">At-home blood patch</span>
            <h3>Test from home, then send it back.</h3>
            <p>The kit arrives by mail, you apply the patch at home, return it with included packaging, and your results become part of your profile.</p>
            <div className="mini-steps">
              {['Order kit', 'Apply at home', 'Return sample', 'View results'].map((item) => <span key={item}>{item}</span>)}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Team() {
  const [active, setActive] = useState(0)
  const previous = (active - 1 + founders.length) % founders.length
  const next = (active + 1) % founders.length
  const visible = [
    { index: previous, position: 'side left' },
    { index: active, position: 'center' },
    { index: next, position: 'side right' },
  ]

  function go(direction: number) {
    setActive((current) => (current + direction + founders.length) % founders.length)
  }

  return (
    <section id="team" className="team-section">
      <SectionHeading eyebrow="Founding team" title="Built by a team close to the problem." center>
        SanOptima is shaped by customer discovery, product thinking, health ambition, and a belief that personal health should feel understandable.
      </SectionHeading>
      <div className="team-carousel" aria-label="Founding team carousel">
        <button className="team-control left" type="button" onClick={() => go(-1)} aria-label="Previous founder">‹</button>
        <div className="team-stage">
          {visible.map(({ index, position }) => {
            const [name, role, descriptor] = founders[index]
            return (
              <motion.article
                className={`team-card ${position}`}
                key={`${name}-${position}`}
                initial={{ opacity: 0, scale: position === 'center' ? 0.92 : 0.82 }}
                animate={{ opacity: position === 'center' ? 1 : 0.72, scale: position === 'center' ? 1 : 0.82 }}
                transition={{ duration: 0.36 }}
                onClick={() => setActive(index)}
              >
                <AssetImage src={assets.team[index]} alt={`${name} portrait`} />
                <div>
                  <h3>{name}</h3>
                  <span>{role}</span>
                  <p>{descriptor}</p>
                </div>
              </motion.article>
            )
          })}
        </div>
        <button className="team-control right" type="button" onClick={() => go(1)} aria-label="Next founder">›</button>
        <div className="team-dots" aria-label="Founder position">
          {founders.map(([name], index) => (
            <button
              key={name}
              type="button"
              className={active === index ? 'active' : ''}
              onClick={() => setActive(index)}
              aria-label={`Show ${name}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function Join() {
  return (
    <section id="join" className="join-section">
      <SectionHeading eyebrow="Early access" title="Help shape SanOptima before it becomes a product." center>
        Join the waitlist, leave feedback, or complete the questionnaire. These are the only active actions in this frontend prototype.
      </SectionHeading>
      <div className="form-tabs">
        <Waitlist />
        <Feedback />
        <Questionnaire />
      </div>
    </section>
  )
}

function ThankYou({ title, text }: { title: string; text: string }) {
  async function share() {
    const url = 'https://sanoptima.de'
    if (navigator.share) {
      await navigator.share({ title: 'SanOptima', url })
      return
    }
    await navigator.clipboard?.writeText(url)
  }

  return (
    <div className="success-card">
      <span className="status-pill">Submitted</span>
      <h3>{title}</h3>
      <p>{text}</p>
      <div className="button-row">
        <a className="btn secondary" href="#home">Return home</a>
        <a className="btn primary" href="#platform">Explore platform</a>
        <button className="btn ghost" type="button" onClick={share}>Share link</button>
      </div>
    </div>
  )
}

function Waitlist() {
  const form = useFormSubmit('WAITLIST_FORM_URL', 'You are on the SanOptima waitlist.')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = Object.fromEntries(new FormData(event.currentTarget).entries())
    form.submit({ ...data, source: 'waitlist', submittedAt: new Date().toISOString() })
  }

  if (form.state === 'success') return <ThankYou title="Thank you for joining" text={form.message} />

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <h3>Join the early waitlist</h3>
      <div className="field-grid two">
        <label>First name<input name="firstName" required /></label>
        <label>Last name<input name="lastName" required /></label>
      </div>
      <div className="field-grid two">
        <label>Email<input type="email" name="email" required /></label>
        <label>Country<input name="country" required /></label>
      </div>
      <label>Role / category
        <select name="role" required>
          <option value="">Select one</option>
          {['Student', 'Athlete', 'Health-conscious consumer', 'Professional', 'Coach', 'Healthcare professional', 'Investor', 'Other'].map((item) => <option key={item}>{item}</option>)}
        </select>
      </label>
      <label>What would you want SanOptima to help you with?<textarea name="note" rows={4} /></label>
      <FormStatus state={form.state} message={form.message} />
      <button className="btn primary" type="submit" disabled={form.state === 'submitting'}>Join waitlist</button>
    </form>
  )
}

function Feedback() {
  const form = useFormSubmit('FEEDBACK_FORM_URL', 'Your feedback has been received.')
  const ratings = ['clarity of concept', 'usefulness', 'trustworthiness', 'likelihood to use']

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = Object.fromEntries(new FormData(event.currentTarget).entries())
    form.submit({ ...data, source: 'feedback', submittedAt: new Date().toISOString() })
  }

  if (form.state === 'success') return <ThankYou title="Thank you for the signal" text={form.message} />

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <h3>Share feedback</h3>
      <div className="field-grid two">
        <label>Name optional<input name="name" /></label>
        <label>Email optional<input type="email" name="email" /></label>
      </div>
      <label>Overall impression<textarea name="overallImpression" rows={3} required /></label>
      <div className="rating-grid">
        {ratings.map((rating) => (
          <div className="rating-field" key={rating}>
            <span>{rating}</span>
            <div>
              {[1, 2, 3, 4, 5].map((value) => (
                <label key={value} className="rating-option">
                  <input type="radio" name={rating.replaceAll(' ', '_')} value={value} required />
                  <span>{value}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
      {['What was most interesting?', 'What was unclear?', 'What would make you use this?', 'What concerns would you have?', 'Additional comment'].map((label) => (
        <label key={label}>{label}<textarea name={label.toLowerCase().replaceAll(' ', '_').replaceAll('?', '')} rows={3} /></label>
      ))}
      <FormStatus state={form.state} message={form.message} />
      <button className="btn primary" type="submit" disabled={form.state === 'submitting'}>Send feedback</button>
    </form>
  )
}

function Questionnaire() {
  const form = useFormSubmit('QUESTIONNAIRE_FORM_URL', 'Your questionnaire response has been received.')
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const current = questionnaireSteps[step]
  const progress = useMemo(() => Math.round(((step + 1) / questionnaireSteps.length) * 100), [step])

  function setAnswer(id: string, value: string, multi = false) {
    setAnswers((previous) => {
      if (!multi) return { ...previous, [id]: value }
      const existing = Array.isArray(previous[id]) ? previous[id] as string[] : []
      const next = existing.includes(value) ? existing.filter((item) => item !== value) : [...existing, value]
      return { ...previous, [id]: next }
    })
  }

  if (form.state === 'success') return <ThankYou title="Questionnaire completed" text={form.message} />

  return (
    <div id="questionnaire" className="questionnaire-card">
      <h3>Tell us how you manage your health today</h3>
      <div className="progress-line"><span style={{ width: `${progress}%` }} /></div>
      <div className="questionnaire-top">
        <span>Step {step + 1} of {questionnaireSteps.length}</span>
        <strong>{current.title}</strong>
      </div>
      <div className="question-list">
        {current.fields.map((field) => <QuestionField key={field.id} field={field} answers={answers} onChange={setAnswer} />)}
      </div>
      <FormStatus state={form.state} message={form.message} />
      <div className="button-row">
        <button className="btn secondary" type="button" disabled={step === 0} onClick={() => setStep((value) => value - 1)}>Back</button>
        {step < questionnaireSteps.length - 1 ? (
          <button className="btn primary" type="button" onClick={() => setStep((value) => value + 1)}>Continue</button>
        ) : (
          <button className="btn primary" type="button" disabled={form.state === 'submitting'} onClick={() => form.submit({ source: 'questionnaire', answers, submittedAt: new Date().toISOString() })}>Complete questionnaire</button>
        )}
      </div>
    </div>
  )
}

function QuestionField({ field, answers, onChange }: { field: { id: string; type: string; label: string; options?: string[] }; answers: Answers; onChange: (id: string, value: string, multi?: boolean) => void }) {
  const value = answers[field.id]

  if (field.type === 'text') {
    return <label className="question-field">{field.label}<input value={(value as string) || ''} onChange={(event) => onChange(field.id, event.target.value)} /></label>
  }

  if (field.type === 'textarea') {
    return <label className="question-field">{field.label}<textarea rows={4} value={(value as string) || ''} onChange={(event) => onChange(field.id, event.target.value)} /></label>
  }

  if (field.type === 'rating') {
    return (
      <div className="question-field">
        <span>{field.label}</span>
        <div className="choice-row">
          {[1, 2, 3, 4, 5].map((item) => (
            <button key={item} type="button" className={value === String(item) ? 'selected' : ''} onClick={() => onChange(field.id, String(item))}>
              {item}{item === 1 ? ' Not valuable' : item === 5 ? ' Very valuable' : ''}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="question-field">
      <span>{field.label}</span>
      <div className="choice-row">
        {field.options?.map((option) => {
          const checked = field.type === 'checkbox' ? Array.isArray(value) && value.includes(option) : value === option
          return (
            <button key={option} type="button" className={checked ? 'selected' : ''} onClick={() => onChange(field.id, option, field.type === 'checkbox')}>
              {option}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function FormStatus({ state, message }: { state: FormState; message: string }) {
  if (state === 'idle') return null
  return <p className={`form-status ${state}`}>{state === 'submitting' ? 'Submitting...' : message}</p>
}

function FAQ() {
  return (
    <section id="faq" className="section faq-section">
      <SectionHeading eyebrow="Trust and FAQ" title="A prototype, presented responsibly.">
        SanOptima handles health as a sensitive subject. The current site is for learning, not diagnosis or treatment.
      </SectionHeading>
      <div className="trust-strip">
        {['Frontend prototype only', 'No accounts or database', 'No medical advice', 'Form endpoints configurable'].map((item) => <span key={item}>{item}</span>)}
      </div>
      <div className="faq-grid">
        {faqs.map(([question, answer]) => (
          <details key={question}>
            <summary>{question}</summary>
            <p>{answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer>
      <Logo />
      <p>Optimize your health. Elevate your life.</p>
      <div>
        <a href="#join">Waitlist</a>
        <a href="#questionnaire">Questionnaire</a>
        <a href="#faq">Trust</a>
      </div>
    </footer>
  )
}

function App() {
  const [headerHidden, setHeaderHidden] = useState(false)

  useEffect(() => {
    let previousY = window.scrollY

    function onScroll() {
      const currentY = window.scrollY
      setHeaderHidden(currentY > 120 && currentY > previousY)
      previousY = currentY
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header className={`site-header ${headerHidden ? 'hidden' : ''}`}>
        <nav>
          {navItems.map(([label, href]) => <a key={href} href={`#${href}`}>{label}</a>)}
        </nav>
      </header>
      <main>
        <Hero />
        <PainRecognition />
        <ValueEngine />
        <Mission />
        <HumanLandscape />
        <Solution />
        <Ecosystem />
        <Platform />
        <Testing />
        <Team />
        <Join />
        <FAQ />
      </main>
      <Footer />
    </>
  )
}

export default App
