export const metadata = {
  title: "Tech Stack — Arbeitsblatt-Generator",
  robots: "noindex",
};

export default function StackPage() {
  return (
    <div className="h-screen bg-zinc-950 text-white flex flex-col overflow-hidden p-6">
      {/* HEADER — compact */}
      <div className="flex items-baseline justify-between mb-5">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Arbeitsblatt-Generator
          </h1>
          <p className="text-zinc-500 text-sm mt-0.5">
            Prompt → Payment → Download — zero infrastructure, 100% serverless
          </p>
        </div>
        <p className="text-zinc-600 text-xs tracking-widest uppercase">
          Architecture Overview
        </p>
      </div>

      {/* FLOW — horizontal pipeline */}
      <div className="flex items-center justify-center gap-1.5 mb-5 py-3 bg-zinc-900 rounded-lg border border-zinc-800">
        <FlowBox label="User" highlight={false} />
        <Arrow />
        <FlowBox label="Next.js" highlight />
        <Arrow />
        <FlowBox label="Brave Search" highlight={false} />
        <Arrow />
        <FlowBox label="Claude API" highlight />
        <Arrow />
        <FlowBox label="docx-js" highlight={false} />
        <Arrow />
        <FlowBox label="Stripe" highlight={false} />
        <Arrow />
        <FlowBox label="Download" highlight={false} />
      </div>

      {/* MAIN GRID — 3 columns */}
      <div className="grid grid-cols-3 gap-4 flex-1 min-h-0">
        {/* LEFT COLUMN: Stack */}
        <div className="flex flex-col gap-2">
          <SectionLabel>Tech Stack</SectionLabel>
          <div className="grid grid-cols-2 gap-2 flex-1">
            <StackCard cat="FRONTEND" name="Next.js 16" detail="React · Tailwind · Turbopack" />
            <StackCard cat="BACKEND" name="API Routes" detail="Serverless · Edge Runtime" />
            <StackCard cat="AI ENGINE" name="Claude" detail="Anthropic · JSON Output" />
            <StackCard cat="REAL-TIME" name="Brave Search" detail="Live Web · Auto Context" />
            <StackCard cat="DOCUMENT" name="docx-js" detail="DOCX · Print-optimized B/W" />
            <StackCard cat="PAYMENTS" name="Stripe" detail="Checkout · Webhooks" />
            <StackCard cat="HOSTING" name="Vercel" detail="CDN · SSL · Auto-deploy" />
            <StackCard cat="SOURCE" name="GitHub" detail="CI/CD · Version Control" />
          </div>
        </div>

        {/* MIDDLE COLUMN: Architecture + Metrics */}
        <div className="flex flex-col gap-2">
          <SectionLabel>Architecture Decisions</SectionLabel>
          <DecisionCard
            title="Zero Infrastructure"
            items={["No database", "No server", "No Docker", "No DevOps"]}
            result="Fixed costs: €0/month"
          />
          <DecisionCard
            title="API Orchestration"
            items={[
              "Brave → live context",
              "Claude → structured content",
              "docx-js → document build",
              "Stripe → payment flow",
            ]}
            result="4 APIs · 1 serverless function"
          />

          {/* METRICS inline */}
          <SectionLabel>Key Metrics</SectionLabel>
          <div className="grid grid-cols-4 gap-2">
            <MetricCard value="~30s" label="Generate" />
            <MetricCard value="0" label="Servers" />
            <MetricCard value="€0" label="Fixed Cost" />
            <MetricCard value="∞" label="Scale" />
          </div>
        </div>

        {/* RIGHT COLUMN: Product */}
        <div className="flex flex-col gap-2">
          <SectionLabel>Product Intelligence</SectionLabel>
          <FeatureCard
            title="Didactic Engine"
            features={[
              "7-step pedagogy framework",
              "3 difficulty levels (★ ★★ ★★★)",
              "Language level A2–B1 (DaZ)",
              "Auto-generated answer key",
              "Misconceptions section",
            ]}
          />
          <FeatureCard
            title="Print-First Design"
            features={[
              "B/W only — no color printer",
              "Survives 5th gen school copier",
              "4 box types (solid/double/dash/accent)",
              "13pt+ fonts · thick borders",
              "Centered flowcharts",
            ]}
          />

          {/* FOOTER inline */}
          <div className="mt-auto text-right">
            <p className="text-zinc-500 text-xs">Built in one afternoon.</p>
            <p className="text-zinc-300 text-sm font-bold">
              arbeitsblatt-generator.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// COMPONENTS — compact versions
// ============================================================

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] tracking-[0.2em] text-zinc-500 uppercase font-semibold">
      {children}
    </p>
  );
}

function FlowBox({ label, highlight }: { label: string; highlight: boolean }) {
  return (
    <div
      className={`px-3 py-1.5 rounded text-center text-xs font-bold ${
        highlight
          ? "bg-white text-black"
          : "bg-zinc-800 text-zinc-300 border border-zinc-700"
      }`}
    >
      {label}
    </div>
  );
}

function Arrow() {
  return <span className="text-zinc-600 text-sm">→</span>;
}

function StackCard({ cat, name, detail }: { cat: string; name: string; detail: string }) {
  return (
    <div className="border border-zinc-800 rounded p-2.5 hover:border-zinc-600 transition-colors">
      <p className="text-[9px] tracking-widest text-zinc-600 uppercase">{cat}</p>
      <p className="text-sm font-bold mt-0.5 leading-tight">{name}</p>
      <p className="text-[11px] text-zinc-500 mt-0.5 leading-tight">{detail}</p>
    </div>
  );
}

function DecisionCard({
  title,
  items,
  result,
}: {
  title: string;
  items: string[];
  result: string;
}) {
  return (
    <div className="border border-zinc-800 rounded p-3 flex-1">
      <p className="font-bold text-sm mb-1.5">{title}</p>
      <ul className="space-y-0.5 mb-2">
        {items.map((item, i) => (
          <li key={i} className="text-xs text-zinc-400 flex items-center gap-1.5">
            <span className="text-zinc-600">›</span>
            {item}
          </li>
        ))}
      </ul>
      <div className="border-t border-zinc-800 pt-1.5">
        <p className="text-xs font-mono text-green-400">{result}</p>
      </div>
    </div>
  );
}

function MetricCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center bg-zinc-900 rounded border border-zinc-800 py-2">
      <p className="text-xl font-bold font-mono leading-none">{value}</p>
      <p className="text-[9px] text-zinc-500 mt-1 uppercase tracking-wider">
        {label}
      </p>
    </div>
  );
}

function FeatureCard({
  title,
  features,
}: {
  title: string;
  features: string[];
}) {
  return (
    <div className="border border-zinc-800 rounded p-3 flex-1">
      <p className="font-bold text-sm mb-1.5">{title}</p>
      <ul className="space-y-0.5">
        {features.map((f, i) => (
          <li key={i} className="text-xs text-zinc-400 flex items-center gap-1.5">
            <span className="text-white text-[8px]">■</span>
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}
