export const metadata = {
  title: "Tech Stack — Arbeitsblatt-Generator",
  robots: "noindex",
};

export default function StackPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* HEADER */}
      <div className="border-b border-zinc-800 px-8 py-6">
        <p className="text-zinc-500 text-sm tracking-widest uppercase">
          Architecture Overview
        </p>
        <h1 className="text-4xl font-bold mt-1 tracking-tight">
          Arbeitsblatt-Generator
        </h1>
        <p className="text-zinc-400 mt-2">
          From prompt to paid download — zero infrastructure, 100% serverless.
        </p>
      </div>

      {/* FLOW DIAGRAM */}
      <div className="px-8 py-10 border-b border-zinc-800">
        <h2 className="text-xs tracking-widest text-zinc-500 uppercase mb-8">
          Request Flow
        </h2>
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-4">
          <FlowBox label="User" sub="Browser" />
          <Arrow />
          <FlowBox label="Next.js" sub="Vercel Edge" highlight />
          <Arrow />
          <FlowBox label="Brave Search" sub="Current Data" />
          <Arrow />
          <FlowBox label="Claude API" sub="Content Gen" highlight />
          <Arrow />
          <FlowBox label="docx-js" sub="DOCX Build" />
          <Arrow />
          <FlowBox label="Stripe" sub="Payment" />
          <Arrow />
          <FlowBox label="Download" sub=".docx File" />
        </div>
      </div>

      {/* STACK GRID */}
      <div className="px-8 py-10 border-b border-zinc-800">
        <h2 className="text-xs tracking-widest text-zinc-500 uppercase mb-8">
          Tech Stack
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StackCard
            category="FRONTEND"
            name="Next.js 16"
            detail="React · Tailwind CSS · Turbopack"
          />
          <StackCard
            category="BACKEND"
            name="API Routes"
            detail="Serverless Functions · Edge Runtime"
          />
          <StackCard
            category="AI ENGINE"
            name="Claude 4"
            detail="Anthropic API · Structured JSON Output"
          />
          <StackCard
            category="REAL-TIME DATA"
            name="Brave Search"
            detail="Live Web Results · Auto-injected Context"
          />
          <StackCard
            category="DOCUMENT"
            name="docx-js"
            detail="Programmatic DOCX · Print-optimized B/W"
          />
          <StackCard
            category="PAYMENTS"
            name="Stripe"
            detail="Checkout Sessions · Webhook Verification"
          />
          <StackCard
            category="HOSTING"
            name="Vercel"
            detail="Auto-deploy on Push · Global CDN · SSL"
          />
          <StackCard
            category="SOURCE"
            name="GitHub"
            detail="CI/CD Pipeline · Version Control"
          />
        </div>
      </div>

      {/* ARCHITECTURE DECISIONS */}
      <div className="px-8 py-10 border-b border-zinc-800">
        <h2 className="text-xs tracking-widest text-zinc-500 uppercase mb-8">
          Architecture Decisions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DecisionCard
            title="Zero Infrastructure"
            items={[
              "No database",
              "No server",
              "No Docker",
              "No DevOps",
            ]}
            result="Fixed costs: €0/month"
          />
          <DecisionCard
            title="API Orchestration"
            items={[
              "Brave Search → current context",
              "Claude API → structured content",
              "docx-js → document generation",
              "Stripe → payment in one call",
            ]}
            result="4 APIs, 1 serverless function"
          />
          <DecisionCard
            title="Smart Prompt Engineering"
            items={[
              "7-step didactic framework",
              "JSON schema enforcement",
              "Few-shot examples",
              "Automatic solution generation",
            ]}
            result="Consistent quality, every time"
          />
        </div>
      </div>

      {/* NUMBERS */}
      <div className="px-8 py-10 border-b border-zinc-800">
        <h2 className="text-xs tracking-widest text-zinc-500 uppercase mb-8">
          Key Metrics
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <MetricCard value="~30s" label="Time to Generate" />
          <MetricCard value="0" label="Servers to Maintain" />
          <MetricCard value="€0" label="Monthly Fixed Cost" />
          <MetricCard value="∞" label="Scalability" />
        </div>
      </div>

      {/* PRODUCT FEATURES */}
      <div className="px-8 py-10 border-b border-zinc-800">
        <h2 className="text-xs tracking-widest text-zinc-500 uppercase mb-8">
          Product Intelligence
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FeatureCard
            title="Didactic Engine"
            features={[
              "7-step pedagogy: everyday → concept → term → exercise",
              "3 difficulty levels per worksheet (★ ★★ ★★★)",
              "Language level A2–B1 (DaZ-compatible)",
              "Auto-generated answer key for teachers",
              "Common misconceptions section",
            ]}
          />
          <FeatureCard
            title="Print-First Design"
            features={[
              "Black & white only — no color printer needed",
              "Copy-proof: survives 5th gen school copier",
              "4 distinct box types (solid, double, dashed, accent)",
              "13pt+ fonts, no italics, thick borders",
              "Centered flowcharts with ASCII connectors",
            ]}
          />
        </div>
      </div>

      {/* FOOTER */}
      <div className="px-8 py-10 text-center">
        <p className="text-zinc-600 text-sm">
          Built in one afternoon. Prompt to production.
        </p>
        <p className="text-zinc-400 text-xl font-bold mt-2">
          arbeitsblatt-generator.com
        </p>
      </div>
    </div>
  );
}

// ============================================================
// COMPONENTS
// ============================================================

function FlowBox({
  label,
  sub,
  highlight = false,
}: {
  label: string;
  sub: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex-shrink-0 px-4 py-3 rounded border text-center min-w-[100px] ${
        highlight
          ? "border-white bg-white text-black"
          : "border-zinc-700 bg-zinc-900"
      }`}
    >
      <p className={`font-bold text-sm ${highlight ? "text-black" : ""}`}>
        {label}
      </p>
      <p
        className={`text-xs mt-0.5 ${
          highlight ? "text-zinc-600" : "text-zinc-500"
        }`}
      >
        {sub}
      </p>
    </div>
  );
}

function Arrow() {
  return <span className="text-zinc-600 text-lg flex-shrink-0">→</span>;
}

function StackCard({
  category,
  name,
  detail,
}: {
  category: string;
  name: string;
  detail: string;
}) {
  return (
    <div className="border border-zinc-800 rounded-lg p-4 hover:border-zinc-600 transition-colors">
      <p className="text-[10px] tracking-widest text-zinc-600 uppercase">
        {category}
      </p>
      <p className="text-lg font-bold mt-1">{name}</p>
      <p className="text-xs text-zinc-500 mt-1">{detail}</p>
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
    <div className="border border-zinc-800 rounded-lg p-5">
      <p className="font-bold text-lg mb-3">{title}</p>
      <ul className="space-y-1.5 mb-4">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-zinc-400 flex items-start gap-2">
            <span className="text-zinc-600 mt-0.5">›</span>
            {item}
          </li>
        ))}
      </ul>
      <div className="border-t border-zinc-800 pt-3">
        <p className="text-sm font-mono text-green-400">{result}</p>
      </div>
    </div>
  );
}

function MetricCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-4xl font-bold font-mono">{value}</p>
      <p className="text-xs text-zinc-500 mt-1 uppercase tracking-wider">
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
    <div className="border border-zinc-800 rounded-lg p-5">
      <p className="font-bold text-lg mb-3">{title}</p>
      <ul className="space-y-2">
        {features.map((f, i) => (
          <li key={i} className="text-sm text-zinc-400 flex items-start gap-2">
            <span className="text-white mt-0.5">■</span>
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}
