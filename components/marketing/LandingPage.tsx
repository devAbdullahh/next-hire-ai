import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { GradientMesh } from "./GradientMesh";
import { VoiceWavePreview } from "./VoiceWavePreview";
import { RadarChart } from "@/components/ui/RadarChart";
import { AvatarShowcase } from "./AvatarShowcase";
import { ReportPreview } from "./ReportPreview";
import { APP_NAME } from "@/lib/constants";
import { INTERVIEWER_AVATARS } from "@/lib/interviewer-avatars";

const features = [
  {
    title: "Resume-driven questions",
    desc: "Every question ties to your skills, projects, and experience — never generic filler.",
    icon: (
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    ),
  },
  {
    title: "Interview avatars",
    desc: "Choose an AI interviewer with a distinct voice and personality for every session.",
    icon: (
      <>
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </>
    ),
  },
  {
    title: "Target role practice",
    desc: "Paste a job description and practice questions that cross-reference your resume with the role.",
    icon: (
      <>
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
      </>
    ),
  },
  {
    title: "Live voice interviews",
    desc: "Zoom-style call UI with natural AI speech, turn-taking, and hands-free listening.",
    icon: (
      <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
    ),
  },
  {
    title: "Your session, your rules",
    desc: "Set answer length, tone, and question count per interview — or save defaults in settings.",
    icon: <path d="M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />,
  },
  {
    title: "Scored performance reports",
    desc: "Per-answer scores, radar breakdowns, gap analysis, and job-fit insights when you target a role.",
    icon: <path d="M12 20V10M18 20V4M6 20v-4" />,
  },
];

const steps = [
  {
    step: "01",
    label: "Upload your resume",
    sub: "PDF parsed into skills, experience, and projects.",
  },
  {
    step: "02",
    label: "Configure the session",
    sub: "Choose an avatar, optional target role, and interview settings.",
  },
  {
    step: "03",
    label: "Go live",
    sub: "Speak or type answers in a real-time voice interview.",
  },
  {
    step: "04",
    label: "Review your report",
    sub: "Scores, feedback, and a roadmap to improve before the real thing.",
  },
];

interface LandingPageProps {
  user?: { name: string; email: string } | null;
}

export function LandingPage({ user }: LandingPageProps) {
  return (
    <div className="app-gradient flex min-h-screen flex-col">
      <Navbar user={user} />

      <GradientMesh className="relative border-b border-border">
        <section className="relative z-10 mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <div className="animate-in">
              <Badge variant="accent" className="gap-2">
                <span className="size-1.5 rounded-full bg-accent pulse-dot" />
                AI voice mock interviews
              </Badge>
            </div>
            <h1 className="mt-6 animate-in animate-in-delay-1 text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.25rem]">
              Practice like it&apos;s real — with{" "}
              <span className="text-gradient">your resume & your avatar</span>
            </h1>
            <p className="mt-6 max-w-lg animate-in animate-in-delay-2 text-lg leading-relaxed text-muted">
              Upload a resume, pick an interviewer avatar, optionally target a job
              posting, and run a live voice mock interview with scored feedback and
              a full performance report.
            </p>
            <div className="mt-9 flex animate-in animate-in-delay-3 flex-wrap gap-3">
              {user ? (
                <Link href="/dashboard">
                  <Button size="lg">Open app</Button>
                </Link>
              ) : (
                <>
                  <Link href="/register">
                    <Button size="lg">Get started free</Button>
                  </Link>
                  <Link href="/login">
                    <Button variant="secondary" size="lg">
                      Log in
                    </Button>
                  </Link>
                </>
              )}
            </div>
            <div className="mt-10 flex animate-in animate-in-delay-4 flex-wrap gap-x-4 gap-y-2 text-sm text-subtle">
              <span>Multiple avatars</span>
              <span>·</span>
              <span>Natural AI voices</span>
              <span>·</span>
              <span>JD-targeted mode</span>
              <span>·</span>
              <span>Instant scoring</span>
            </div>
          </div>

          <div className="animate-in animate-in-delay-3 lg:justify-self-end">
            <div className="glow-border rounded-[var(--radius-card)] bg-surface p-1 shadow-elevated">
              <div className="overflow-hidden rounded-[calc(var(--radius-card)-4px)] bg-[#12100e]">
                <div className="grid sm:grid-cols-2">
                  <div className="flex flex-col items-center border-b border-border bg-[#1a1714] p-5 sm:border-b-0 sm:border-r">
                    <div className="relative size-16 overflow-hidden rounded-full border-2 border-accent/40">
                      <Image
                        src={INTERVIEWER_AVATARS[0].imageSrc}
                        alt="Monica"
                        width={64}
                        height={64}
                        className="size-full object-cover object-top"
                        unoptimized
                      />
                    </div>
                    <p className="mt-3 text-sm font-medium text-foreground">Interview avatar</p>
                    <p className="text-xs text-accent">Engineering Manager</p>
                    <p className="mt-3 line-clamp-3 text-center text-xs leading-relaxed text-muted">
                      How does authentication work in web applications? Can you explain the different types of authentication?
                    </p>
                  </div>
                  <div className="flex flex-col items-center justify-center bg-[#141210] p-5">
                    <div className="flex size-16 items-center justify-center rounded-full border-2 border-border bg-surface-muted text-lg font-semibold text-foreground/80">
                      You
                    </div>
                    <p className="mt-3 text-xs text-subtle">Your turn</p>
                    <div className="mt-4 w-full rounded-[10px] border border-border bg-surface px-3 py-2">
                      <VoiceWavePreview />
                      <p className="mt-2 text-center text-xs text-accent">Listening…</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-surface-muted px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">Senior SWE · Acme</Badge>
                    <Badge variant="muted">8 questions</Badge>
                  </div>
                  <Badge variant="success">Live</Badge>
                </div>
                <div className="flex items-center justify-center gap-4 border-t border-border bg-surface px-4 py-4">
                  <RadarChart
                    size={120}
                    axes={[
                      { label: "Technical", value: 8 },
                      { label: "Depth", value: 7.5 },
                      { label: "Clarity", value: 7 },
                      { label: "Job fit", value: 7.8 },
                    ]}
                  />
                  <div className="text-center">
                    <p className="text-2xl font-bold text-accent">7.6</p>
                    <p className="text-xs text-subtle">Session score</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </GradientMesh>

      <section className="relative overflow-hidden border-y border-border/60 py-16 sm:py-20">
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 50%, rgb(240 98 122 / 0.08), transparent 70%)",
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <p className="animate-in text-center text-sm font-medium uppercase tracking-wider text-accent">
            Meet the avatars
          </p>
          <h2 className="animate-in animate-in-delay-1 mt-2 text-center text-2xl font-bold text-foreground sm:text-3xl">
            Distinct voices. Distinct interviewing styles.
          </h2>
          <p className="animate-in animate-in-delay-2 mx-auto mt-3 max-w-2xl text-center text-muted">
            Browse our roster of AI interviewers — each with their own personality
            and natural-sounding voice. Pick one when you start a session.
          </p>
        </div>
        <AvatarShowcase />
      </section>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-16 sm:px-6 sm:py-20">
        <section>
          <p className="animate-in text-center text-sm font-medium uppercase tracking-wider text-accent">
            Why {APP_NAME}
          </p>
          <h2 className="animate-in animate-in-delay-1 mt-2 text-center text-2xl font-bold text-foreground sm:text-3xl">
            Not a chatbot. A real interview loop.
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((item, i) => (
              <Card
                key={item.title}
                variant="muted"
                className={`hover-lift animate-in ${["animate-in-delay-2", "animate-in-delay-2", "animate-in-delay-3", "animate-in-delay-3", "animate-in-delay-4", "animate-in-delay-4"][i]}`}
              >
                <CardHeader className="mb-0">
                  <span className="mb-3 inline-flex size-11 items-center justify-center rounded-[10px] bg-accent-soft text-accent">
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {item.icon}
                    </svg>
                  </span>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>{item.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <ReportPreview />
        </section>

        <section className="mt-20">
          <Card variant="elevated" padding="lg" className="overflow-hidden">
            <div className="relative">
              <div
                className="pointer-events-none absolute inset-0 opacity-30"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgb(240 98 122 / 0.06), transparent)",
                }}
                aria-hidden
              />
              <p className="text-center text-sm font-medium text-muted">How it works</p>
              <ol className="relative mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {steps.map((s, i) => (
                  <li
                    key={s.step}
                    className={`animate-in ${["", "animate-in-delay-1", "animate-in-delay-2", "animate-in-delay-3"][i]} text-center sm:text-left`}
                  >
                    <span className="inline-flex size-10 items-center justify-center rounded-full bg-accent-soft font-mono text-sm font-bold text-accent">
                      {s.step}
                    </span>
                    <p className="mt-4 font-semibold text-foreground">{s.label}</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{s.sub}</p>
                  </li>
                ))}
              </ol>
            </div>
          </Card>
        </section>

        <section className="mt-20">
          <GradientMesh className="animate-in rounded-[var(--radius-card)] border border-border px-6 py-14 text-center sm:px-12">
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                Ready for your next mock interview?
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-muted">
                Upload a resume, pick your avatar, and practice for the roles you
                care about — with feedback you can act on before the real interview.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {user ? (
                  <>
                    <Link href="/dashboard">
                      <Button size="lg">Go to dashboard</Button>
                    </Link>
                    <Link href="/avatars">
                      <Button variant="secondary" size="lg">
                        Browse avatars
                      </Button>
                    </Link>
                  </>
                ) : (
                  <Link href="/register">
                    <Button size="lg">Create free account</Button>
                  </Link>
                )}
              </div>
            </div>
          </GradientMesh>
        </section>
      </main>
    </div>
  );
}
