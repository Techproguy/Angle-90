import { useEffect, useMemo, useRef, useState } from "react";
import {
  Anchor,
  ArrowRight,
  BadgeCheck,
  Car,
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock,
  Download,
  FileText,
  Container,
  Gauge,
  MapPin,
  Search,
  Ship,
  ShieldCheck,
  Truck,
  Waves,
} from "lucide-react";

/*
 * ExportTrack — vehicle journey platform (Dubai → Africa)
 * Single-file React prototype. In-memory state only.
 *
 * Design system — "Abyssal Teal" premium logistics
 *   hull / base ........ #07171E   (deepest)
 *   panel .............. #0E2A33
 *   panel raised ....... #123640
 *   hairline ........... #1E454F
 *   ink ................ #ECF4F2   (foreground)
 *   muted ink .......... #8AA6AC
 *   beacon (accent) .... #E9B25C   (the one disciplined accent — "live" signal)
 *   ocean .............. #5FC8C1   (in-transit / sea leg)
 *   arrived ............ #6FC79A   (completed)
 *
 * Type: Space Grotesk (display) · Inter (body) · IBM Plex Mono (data)
 */

// ----------------------------------------------------------------------------
// Mock data — structured as if it came from an API
// ----------------------------------------------------------------------------

type StageState = "complete" | "current" | "upcoming";

interface Stage {
  id: string;
  title: string;
  blurb: string; // buyer-facing reassurance line
  place: string;
  ts: string; // human timestamp
  state: StageState;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}

// The single milestone we count down to (next arrival at Apapa).
const ETA_TARGET = new Date("2026-06-24T14:30:00+01:00");

const ORDER = {
  ref: "MLE-LAG-2026-0847",
  buyer: "Chinedu Okafor",
  exporter: "Marhaba Luxury Exports FZE",
  vehicle: {
    name: "Toyota Land Cruiser 300",
    year: 2025,
    trim: "VX-R · 3.5L V6 Twin-Turbo",
    color: "Pearl White",
    vin: "JTMHV05J9N5123847",
    odometer: "12 km (export-fresh)",
  },
  origin: { port: "Jebel Ali", city: "Dubai, UAE" },
  destination: { port: "Apapa", city: "Lagos, Nigeria" },
  vessel: { name: "MV Grande Lagos", line: "Grimaldi Lines", voyage: "GL-2614-W" },
  paid: "AED 412,000",
};

const STAGES: Stage[] = [
  {
    id: "paid",
    title: "Order confirmed & paid",
    blurb: "Your payment cleared and the vehicle is reserved in your name.",
    place: "Marhaba Luxury Exports, Dubai",
    ts: "28 May 2026 · 10:14 GST",
    state: "complete",
    icon: BadgeCheck,
  },
  {
    id: "docs",
    title: "Export documentation cleared",
    blurb: "Invoice, title transfer and customs paperwork are all in order.",
    place: "Dubai Customs",
    ts: "01 Jun 2026 · 16:40 GST",
    state: "complete",
    icon: FileText,
  },
  {
    id: "port-dxb",
    title: "Vehicle at Jebel Ali Port",
    blurb: "Loaded, sealed and staged in the export yard, ready to sail.",
    place: "Jebel Ali Port, Dubai",
    ts: "05 Jun 2026 · 09:05 GST",
    state: "complete",
    icon: Container,
  },
  {
    id: "transit",
    title: "Crossing the ocean",
    blurb: "On board MV Grande Lagos, sailing the Gulf toward West Africa.",
    place: "Indian Ocean → Atlantic",
    ts: "Departed 09 Jun 2026 · 22:10 GST",
    state: "current",
    icon: Ship,
  },
  {
    id: "arrive",
    title: "Arrives at Lagos Port (Apapa)",
    blurb: "Berths at Apapa and is offloaded onto Nigerian soil.",
    place: "Apapa Port, Lagos",
    ts: "Est. 24 Jun 2026 · 14:30 WAT",
    state: "upcoming",
    icon: Anchor,
  },
  {
    id: "customs",
    title: "Customs cleared · SONCAP verified",
    blurb: "Nigeria Customs releases the vehicle; SONCAP compliance confirmed.",
    place: "Nigeria Customs Service, Apapa",
    ts: "Est. 27 Jun 2026 · WAT",
    state: "upcoming",
    icon: ShieldCheck,
  },
  {
    id: "delivered",
    title: "Delivered to you",
    blurb: "Handed over with keys, documents and a final inspection.",
    place: "Lekki, Lagos",
    ts: "Est. 30 Jun 2026 · WAT",
    state: "upcoming",
    icon: Car,
  },
];

interface DocItem {
  id: string;
  name: string;
  meta: string;
  code: string;
  size: string;
  status: "Ready" | "Pending";
}

const DOCUMENTS: DocItem[] = [
  {
    id: "invoice",
    name: "Commercial Invoice",
    meta: "Issued by Marhaba Luxury Exports FZE",
    code: "INV-2026-0847",
    size: "PDF · 184 KB",
    status: "Ready",
  },
  {
    id: "bol",
    name: "Bill of Lading",
    meta: "Grimaldi Lines · Voyage GL-2614-W",
    code: "BL-GL2614-0847",
    size: "PDF · 221 KB",
    status: "Ready",
  },
  {
    id: "soncap",
    name: "SONCAP Certificate",
    meta: "Nigeria compliance — issued on customs clearance",
    code: "SC-NG-PENDING",
    size: "Awaiting arrival",
    status: "Pending",
  },
  {
    id: "inspection",
    name: "Inspection Report",
    meta: "Pre-shipment condition & odometer verification",
    code: "INS-2026-0847",
    size: "PDF · 3.1 MB",
    status: "Ready",
  },
  {
    id: "insurance",
    name: "Insurance Certificate",
    meta: "Marine cargo cover · door-to-port",
    code: "MAR-2026-0847",
    size: "PDF · 142 KB",
    status: "Ready",
  },
];

interface FleetVehicle {
  ref: string;
  model: string;
  year: number;
  destination: string;
  stage: string;
  stageKind: "transit" | "port" | "customs" | "docs";
  eta: string;
}

const FLEET: FleetVehicle[] = [
  {
    ref: "MLE-LAG-2026-0847",
    model: "Toyota Land Cruiser 300",
    year: 2025,
    destination: "Lagos · Apapa",
    stage: "Crossing the ocean",
    stageKind: "transit",
    eta: "Jun 24",
  },
  {
    ref: "MLE-ACC-2026-0791",
    model: "Lexus LX 600",
    year: 2025,
    destination: "Accra · Tema",
    stage: "Customs · SONCAP",
    stageKind: "customs",
    eta: "Jun 22",
  },
  {
    ref: "MLE-LOM-2026-0712",
    model: "Mercedes-Benz G 63",
    year: 2024,
    destination: "Lomé Port",
    stage: "Crossing the ocean",
    stageKind: "transit",
    eta: "Jun 28",
  },
  {
    ref: "MLE-COT-2026-0805",
    model: "Toyota Land Cruiser Prado",
    year: 2025,
    destination: "Cotonou Port",
    stage: "Arrived at port",
    stageKind: "port",
    eta: "Jun 21",
  },
  {
    ref: "MLE-LAG-2026-0863",
    model: "Toyota Hilux Adventure",
    year: 2024,
    destination: "Lagos · Apapa",
    stage: "At Jebel Ali Port",
    stageKind: "port",
    eta: "Jul 02",
  },
  {
    ref: "MLE-LAG-2026-0888",
    model: "Range Rover Sport",
    year: 2025,
    destination: "Lagos · Tin Can",
    stage: "Documentation",
    stageKind: "docs",
    eta: "Jul 05",
  },
];

// ----------------------------------------------------------------------------
// Small helpers
// ----------------------------------------------------------------------------

function useCountdown(target: Date) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target.getTime() - now);
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);
  return { days, hours, minutes, seconds };
}

const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(" ");

// ----------------------------------------------------------------------------
// Stylized SUV illustration (placeholder vehicle image)
// ----------------------------------------------------------------------------

function VehicleArt() {
  return (
    <svg
      viewBox="0 0 320 150"
      className="h-full w-full"
      role="img"
      aria-label="Toyota Land Cruiser 300, pearl white"
    >
      <defs>
        <linearGradient id="body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FBFDFC" />
          <stop offset="100%" stopColor="#C9D6D6" />
        </linearGradient>
        <linearGradient id="glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#16323B" />
          <stop offset="100%" stopColor="#0B2027" />
        </linearGradient>
      </defs>
      {/* ground shadow */}
      <ellipse cx="160" cy="132" rx="120" ry="9" fill="#000000" opacity="0.35" />
      {/* body */}
      <path
        d="M28 104 L40 70 Q44 58 58 56 L116 50 Q132 36 156 35 L214 36 Q236 37 252 54 L286 64 Q298 68 298 82 L298 104 Q298 110 292 110 L34 110 Q28 110 28 104 Z"
        fill="url(#body)"
        stroke="#9FB0B0"
        strokeWidth="1.5"
      />
      {/* roof rail */}
      <rect x="92" y="33" width="120" height="5" rx="2.5" fill="#D7E0E0" />
      {/* windows */}
      <path
        d="M118 52 Q132 41 154 40 L186 41 L190 52 Z"
        fill="url(#glass)"
      />
      <path d="M196 41 L210 42 Q228 44 240 55 L196 55 Z" fill="url(#glass)" />
      {/* beltline accent */}
      <rect x="40" y="86" width="252" height="3" rx="1.5" fill="#E9B25C" opacity="0.9" />
      {/* wheels */}
      <g>
        <circle cx="92" cy="110" r="22" fill="#0B1418" />
        <circle cx="92" cy="110" r="11" fill="#33474D" />
        <circle cx="92" cy="110" r="4" fill="#E9B25C" />
        <circle cx="236" cy="110" r="22" fill="#0B1418" />
        <circle cx="236" cy="110" r="11" fill="#33474D" />
        <circle cx="236" cy="110" r="4" fill="#E9B25C" />
      </g>
      {/* headlight */}
      <rect x="286" y="74" width="12" height="8" rx="2" fill="#FFF4DC" />
    </svg>
  );
}

// ----------------------------------------------------------------------------
// Signature element — the journey timeline
// ----------------------------------------------------------------------------

function TimelineNode({ stage, isLast }: { stage: Stage; isLast: boolean }) {
  const Icon = stage.icon;
  const complete = stage.state === "complete";
  const current = stage.state === "current";

  return (
    <li className="relative flex gap-4 pb-7 last:pb-0">
      {/* rail */}
      {!isLast && (
        <span
          aria-hidden
          className={cx(
            "absolute left-[19px] top-10 h-[calc(100%-1.5rem)] w-0.5 rounded-full",
            complete ? "bg-[#E9B25C]/60" : "bg-[#1E454F]"
          )}
        />
      )}

      {/* node */}
      <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center">
        {current && (
          <>
            <span className="absolute inline-flex h-10 w-10 rounded-full bg-[#E9B25C]/30 motion-safe:animate-ping motion-reduce:hidden" />
            <span className="absolute inline-flex h-7 w-7 rounded-full bg-[#E9B25C]/20 motion-safe:animate-pulse" />
          </>
        )}
        <span
          className={cx(
            "relative flex h-10 w-10 items-center justify-center rounded-full border",
            complete && "border-[#E9B25C]/40 bg-[#E9B25C]/15 text-[#E9B25C]",
            current && "border-[#E9B25C] bg-[#E9B25C] text-[#07171E] shadow-[0_0_22px_rgba(233,178,92,0.55)]",
            stage.state === "upcoming" && "border-[#1E454F] bg-[#0B2027] text-[#5b7980]"
          )}
        >
          {complete ? (
            <CheckCircle2 className="h-5 w-5" strokeWidth={2.2} />
          ) : (
            <Icon className="h-5 w-5" strokeWidth={2} />
          )}
        </span>
      </div>

      {/* content */}
      <div className="flex-1 pt-0.5">
        <div className="flex flex-wrap items-center gap-2">
          <h3
            className={cx(
              "font-['Space_Grotesk'] text-[15px] font-semibold leading-tight",
              stage.state === "upcoming" ? "text-[#8AA6AC]" : "text-[#ECF4F2]"
            )}
          >
            {stage.title}
          </h3>
          {current && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#E9B25C]/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#E9B25C]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#E9B25C] motion-safe:animate-pulse" />
              Live now
            </span>
          )}
        </div>
        <p className="mt-1 max-w-prose text-[13px] leading-relaxed text-[#8AA6AC]">
          {stage.blurb}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 font-['IBM_Plex_Mono'] text-[11px] text-[#6f9298]">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" /> {stage.place}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" /> {stage.ts}
          </span>
        </div>

        {/* ocean-crossing visual lives under the in-transit node */}
        {current && <OceanLeg />}
      </div>
    </li>
  );
}

function OceanLeg() {
  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-[#1E454F] bg-[#0B2027]/80 p-3">
      <div className="mb-2 flex items-center justify-between font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-wider text-[#6f9298]">
        <span className="inline-flex items-center gap-1.5 text-[#5FC8C1]">
          <Container className="h-3.5 w-3.5" /> Jebel Ali
        </span>
        <span>{ORDER.vessel.name} · {ORDER.vessel.voyage}</span>
        <span className="inline-flex items-center gap-1.5">
          Apapa <Anchor className="h-3.5 w-3.5" />
        </span>
      </div>
      <div className="relative h-8">
        {/* route line */}
        <div className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-gradient-to-r from-[#5FC8C1]/70 via-[#5FC8C1]/30 to-[#1E454F]" />
        <div
          className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-[#5FC8C1]/20"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg,transparent,transparent 6px,rgba(95,200,193,0.35) 6px,rgba(95,200,193,0.35) 10px)",
          }}
        />
        {/* moving ship ~58% across */}
        <div className="absolute top-1/2 -translate-y-1/2 motion-safe:animate-[drift_4s_ease-in-out_infinite]" style={{ left: "54%" }}>
          <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[#5FC8C1]/50 bg-[#0E2A33] text-[#5FC8C1] shadow-[0_0_16px_rgba(95,200,193,0.4)]">
            <Ship className="h-4 w-4" strokeWidth={2} />
          </div>
        </div>
        {/* endpoints */}
        <span className="absolute left-0 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-[#5FC8C1]" />
        <span className="absolute right-0 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full border border-[#5FC8C1]/60 bg-[#0B2027]" />
      </div>
      <div className="mt-1 flex items-center justify-center gap-1.5 font-['IBM_Plex_Mono'] text-[10px] text-[#6f9298]">
        <Waves className="h-3 w-3" /> ~58% of the voyage complete · open Atlantic
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Countdown
// ----------------------------------------------------------------------------

function CountdownBlock() {
  const { days, hours, minutes, seconds } = useCountdown(ETA_TARGET);
  const cell = (value: number, label: string) => (
    <div className="flex flex-col items-center">
      <span
        className="font-['IBM_Plex_Mono'] text-2xl font-semibold tabular-nums text-[#ECF4F2] sm:text-3xl"
        aria-hidden
      >
        {String(value).padStart(2, "0")}
      </span>
      <span className="mt-0.5 font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-wider text-[#6f9298]">
        {label}
      </span>
    </div>
  );
  return (
    <div>
      <div className="flex items-center gap-2 text-[#E9B25C]">
        <Clock className="h-4 w-4" />
        <span className="font-['Space_Grotesk'] text-xs font-semibold uppercase tracking-wider">
          Arriving at Apapa in
        </span>
      </div>
      <div
        className="mt-3 flex items-end gap-3 sm:gap-5"
        role="timer"
        aria-label={`Arriving in ${days} days, ${hours} hours, ${minutes} minutes`}
      >
        {cell(days, "days")}
        <span className="pb-6 text-2xl text-[#1E454F]">:</span>
        {cell(hours, "hrs")}
        <span className="pb-6 text-2xl text-[#1E454F]">:</span>
        {cell(minutes, "min")}
        <span className="pb-6 text-2xl text-[#1E454F]">:</span>
        {cell(seconds, "sec")}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Track view
// ----------------------------------------------------------------------------

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-xl border border-[#1E454F] bg-[#0E2A33] p-3">
      <p className="font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-wider text-[#6f9298]">
        {label}
      </p>
      <p className="mt-1 font-['IBM_Plex_Mono'] text-sm font-medium text-[#ECF4F2]">
        {value}
      </p>
      {sub && <p className="text-[11px] text-[#6f9298]">{sub}</p>}
    </div>
  );
}

function TrackView() {
  const [query, setQuery] = useState(ORDER.ref);
  const [tracked, setTracked] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const onLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const v = query.trim().toUpperCase();
    if (v === ORDER.ref) {
      setError(null);
      setTracked(true);
      requestAnimationFrame(() =>
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      );
    } else {
      setTracked(false);
      setError(
        `We couldn't find “${query.trim()}”. Try the demo reference ${ORDER.ref}.`
      );
    }
  };

  const completed = STAGES.filter((s) => s.state === "complete").length;
  const progressPct = Math.round((completed / (STAGES.length - 1)) * 100);

  return (
    <div className="space-y-6">
      {/* lookup */}
      <form onSubmit={onLookup} className="space-y-2">
        <label
          htmlFor="orderRef"
          className="font-['Space_Grotesk'] text-sm font-medium text-[#ECF4F2]"
        >
          Track your vehicle
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6f9298]" />
            <input
              id="orderRef"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. MLE-LAG-2026-0847"
              className="w-full rounded-xl border border-[#1E454F] bg-[#0B2027] py-3 pl-9 pr-3 font-['IBM_Plex_Mono'] text-sm text-[#ECF4F2] placeholder:text-[#5b7980] outline-none transition focus-visible:border-[#E9B25C] focus-visible:ring-2 focus-visible:ring-[#E9B25C]/40"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#E9B25C] px-4 py-3 font-['Space_Grotesk'] text-sm font-semibold text-[#07171E] transition hover:bg-[#f0c179] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E9B25C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#07171E]"
          >
            Track <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        {error && (
          <p className="text-[13px] text-[#e98c8c]">{error}</p>
        )}
      </form>

      {tracked && (
        <div ref={resultRef} className="space-y-6">
          {/* vehicle hero card */}
          <div className="overflow-hidden rounded-2xl border border-[#1E454F] bg-[#0E2A33]">
            <div className="relative bg-gradient-to-br from-[#123640] to-[#0B2027] px-5 pt-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-wider text-[#6f9298]">
                    {ORDER.ref}
                  </p>
                  <h2 className="mt-1 font-['Space_Grotesk'] text-xl font-bold leading-tight text-[#ECF4F2]">
                    {ORDER.vehicle.name}
                  </h2>
                  <p className="text-[13px] text-[#8AA6AC]">
                    {ORDER.vehicle.year} · {ORDER.vehicle.trim}
                  </p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#5FC8C1]/40 bg-[#5FC8C1]/10 px-2.5 py-1 font-['IBM_Plex_Mono'] text-[11px] text-[#5FC8C1]">
                  <Ship className="h-3.5 w-3.5" /> In transit
                </span>
              </div>
              <div className="mt-2 h-28">
                <VehicleArt />
              </div>
            </div>

            {/* route */}
            <div className="flex items-center justify-between gap-2 border-t border-[#1E454F] px-5 py-3">
              <div>
                <p className="font-['Space_Grotesk'] text-sm font-semibold text-[#ECF4F2]">
                  {ORDER.origin.port}
                </p>
                <p className="text-[11px] text-[#6f9298]">{ORDER.origin.city}</p>
              </div>
              <div className="flex flex-1 items-center px-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#E9B25C]" />
                <span className="h-px flex-1 bg-gradient-to-r from-[#E9B25C] via-[#5FC8C1]/50 to-[#1E454F]" />
                <Ship className="h-4 w-4 shrink-0 text-[#5FC8C1]" />
                <span className="h-px flex-1 bg-[#1E454F]" />
                <Anchor className="h-3.5 w-3.5 shrink-0 text-[#6f9298]" />
              </div>
              <div className="text-right">
                <p className="font-['Space_Grotesk'] text-sm font-semibold text-[#ECF4F2]">
                  {ORDER.destination.port}
                </p>
                <p className="text-[11px] text-[#6f9298]">
                  {ORDER.destination.city}
                </p>
              </div>
            </div>

            {/* countdown */}
            <div className="border-t border-[#1E454F] bg-[#0B2027]/60 px-5 py-4">
              <CountdownBlock />
            </div>

            {/* spec grid */}
            <div className="grid grid-cols-2 gap-2 px-5 pb-5 pt-4 sm:grid-cols-4">
              <StatCard label="VIN" value={ORDER.vehicle.vin} />
              <StatCard label="Colour" value={ORDER.vehicle.color} />
              <StatCard label="Odometer" value={ORDER.vehicle.odometer} />
              <StatCard label="Paid" value={ORDER.paid} sub="Settled in full" />
            </div>
          </div>

          {/* progress summary */}
          <div className="rounded-2xl border border-[#1E454F] bg-[#0E2A33] p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gauge className="h-4 w-4 text-[#E9B25C]" />
                <h3 className="font-['Space_Grotesk'] text-sm font-semibold text-[#ECF4F2]">
                  Journey progress
                </h3>
              </div>
              <span className="font-['IBM_Plex_Mono'] text-xs text-[#8AA6AC]">
                {progressPct}% · stage {completed} of {STAGES.length}
              </span>
            </div>
            <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-[#0B2027]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#E9B25C] to-[#5FC8C1] transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>

            {/* the signature timeline */}
            <ol className="mt-1">
              {STAGES.map((s, i) => (
                <TimelineNode
                  key={s.id}
                  stage={s}
                  isLast={i === STAGES.length - 1}
                />
              ))}
            </ol>
          </div>

          <p className="px-1 text-center text-[12px] text-[#6f9298]">
            Updates arrive automatically as your vehicle moves. Questions?
            Message your exporter, {ORDER.exporter}.
          </p>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------------
// Documents view
// ----------------------------------------------------------------------------

function DocumentsView() {
  const ready = DOCUMENTS.filter((d) => d.status === "Ready").length;
  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-['Space_Grotesk'] text-lg font-bold text-[#ECF4F2]">
          Your documents
        </h2>
        <p className="mt-1 text-[13px] text-[#8AA6AC]">
          Every paper tied to order{" "}
          <span className="font-['IBM_Plex_Mono'] text-[#5FC8C1]">
            {ORDER.ref}
          </span>
          . {ready} of {DOCUMENTS.length} ready to download.
        </p>
      </div>

      <ul className="space-y-3">
        {DOCUMENTS.map((doc) => {
          const ready = doc.status === "Ready";
          return (
            <li
              key={doc.id}
              className="flex items-center gap-4 rounded-xl border border-[#1E454F] bg-[#0E2A33] p-4"
            >
              <div
                className={cx(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border",
                  ready
                    ? "border-[#6FC79A]/30 bg-[#6FC79A]/10 text-[#6FC79A]"
                    : "border-[#E9B25C]/30 bg-[#E9B25C]/10 text-[#E9B25C]"
                )}
              >
                <FileText className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate font-['Space_Grotesk'] text-[15px] font-semibold text-[#ECF4F2]">
                    {doc.name}
                  </h3>
                </div>
                <p className="truncate text-[12px] text-[#8AA6AC]">{doc.meta}</p>
                <p className="mt-0.5 font-['IBM_Plex_Mono'] text-[11px] text-[#6f9298]">
                  {doc.code} · {doc.size}
                </p>
              </div>
              {ready ? (
                <button
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-[#1E454F] bg-[#0B2027] px-3 py-2 font-['Space_Grotesk'] text-[13px] font-medium text-[#ECF4F2] transition hover:border-[#E9B25C]/60 hover:text-[#E9B25C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E9B25C]/50"
                  aria-label={`Download ${doc.name}`}
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Download</span>
                </button>
              ) : (
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-[#E9B25C]/30 bg-[#E9B25C]/10 px-3 py-2 font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-wide text-[#E9B25C]">
                  <Clock className="h-3.5 w-3.5" /> Pending
                </span>
              )}
            </li>
          );
        })}
      </ul>

      <div className="flex items-start gap-2 rounded-xl border border-[#1E454F] bg-[#0B2027]/60 p-4">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#5FC8C1]" />
        <p className="text-[12px] leading-relaxed text-[#8AA6AC]">
          Your SONCAP Certificate is issued the moment Nigeria Customs clears the
          vehicle at Apapa — it will appear here automatically, no action needed.
        </p>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Dealer dashboard
// ----------------------------------------------------------------------------

const STAGE_STYLE: Record<FleetVehicle["stageKind"], string> = {
  transit: "border-[#5FC8C1]/40 bg-[#5FC8C1]/10 text-[#5FC8C1]",
  port: "border-[#E9B25C]/40 bg-[#E9B25C]/10 text-[#E9B25C]",
  customs: "border-[#b79be0]/40 bg-[#b79be0]/10 text-[#c4b0e8]",
  docs: "border-[#8AA6AC]/30 bg-[#8AA6AC]/10 text-[#aebfc3]",
};

const STAGE_ICON: Record<FleetVehicle["stageKind"], React.ComponentType<{ className?: string }>> = {
  transit: Ship,
  port: Anchor,
  customs: ShieldCheck,
  docs: FileText,
};

function DealerView() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-['Space_Grotesk'] text-lg font-bold text-[#ECF4F2]">
          Fleet overview
        </h2>
        <p className="mt-1 text-[13px] text-[#8AA6AC]">
          Every vehicle you have moving, at a glance.
        </p>
      </div>

      {/* summary stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "In transit", value: "6", icon: Ship, tint: "text-[#5FC8C1]" },
          { label: "Arriving this week", value: "2", icon: Anchor, tint: "text-[#E9B25C]" },
          { label: "Delivered (Jun)", value: "9", icon: Truck, tint: "text-[#6FC79A]" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="rounded-xl border border-[#1E454F] bg-[#0E2A33] p-3"
            >
              <Icon className={cx("h-4 w-4", s.tint)} />
              <p className="mt-2 font-['Space_Grotesk'] text-2xl font-bold text-[#ECF4F2]">
                {s.value}
              </p>
              <p className="font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-wider text-[#6f9298]">
                {s.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* fleet list */}
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {FLEET.map((v) => {
          const Icon = STAGE_ICON[v.stageKind];
          return (
            <li
              key={v.ref}
              className="group rounded-xl border border-[#1E454F] bg-[#0E2A33] p-4 transition hover:border-[#E9B25C]/40"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="truncate font-['Space_Grotesk'] text-[15px] font-semibold text-[#ECF4F2]">
                    {v.model}
                  </h3>
                  <p className="font-['IBM_Plex_Mono'] text-[11px] text-[#6f9298]">
                    {v.year} · {v.ref}
                  </p>
                </div>
                <span
                  className={cx(
                    "inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 font-['IBM_Plex_Mono'] text-[10px]",
                    STAGE_STYLE[v.stageKind]
                  )}
                >
                  <Icon className="h-3 w-3" /> {v.stage}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-[#1E454F] pt-3">
                <span className="inline-flex items-center gap-1.5 text-[12px] text-[#8AA6AC]">
                  <MapPin className="h-3.5 w-3.5 text-[#6f9298]" /> {v.destination}
                </span>
                <span className="inline-flex items-center gap-1.5 font-['IBM_Plex_Mono'] text-[12px] text-[#ECF4F2]">
                  <Clock className="h-3.5 w-3.5 text-[#E9B25C]" /> ETA {v.eta}
                  <ChevronRight className="h-3.5 w-3.5 text-[#6f9298] transition group-hover:translate-x-0.5 group-hover:text-[#E9B25C]" />
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Shell
// ----------------------------------------------------------------------------

type Tab = "track" | "documents" | "dealer";

const TABS: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "track", label: "Track", icon: MapPin },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "dealer", label: "Dealer", icon: Gauge },
];

export default function ExportTrack() {
  const [tab, setTab] = useState<Tab>("track");

  const view = useMemo(() => {
    switch (tab) {
      case "documents":
        return <DocumentsView />;
      case "dealer":
        return <DealerView />;
      default:
        return <TrackView />;
    }
  }, [tab]);

  return (
    <div className="min-h-screen bg-[#07171E] font-['Inter'] text-[#ECF4F2] antialiased">
      {/* keyframes for the sailing ship (motion-safe gated via Tailwind classes) */}
      <style>{`
        @keyframes drift {
          0%, 100% { transform: translate(-2px, -50%); }
          50% { transform: translate(2px, calc(-50% - 2px)); }
        }
      `}</style>

      {/* ambient backdrop */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(900px 500px at 80% -10%, rgba(95,200,193,0.10), transparent 60%), radial-gradient(700px 400px at 0% 0%, rgba(233,178,92,0.08), transparent 55%)",
        }}
      />

      <div className="relative mx-auto flex min-h-screen max-w-2xl flex-col">
        {/* top bar */}
        <header className="sticky top-0 z-20 border-b border-[#1E454F] bg-[#07171E]/85 backdrop-blur">
          <div className="flex items-center justify-between px-4 py-3.5 sm:px-6">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E9B25C] text-[#07171E]">
                <Ship className="h-5 w-5" strokeWidth={2.4} />
              </div>
              <div className="leading-none">
                <p className="font-['Space_Grotesk'] text-[17px] font-bold tracking-tight">
                  Export<span className="text-[#E9B25C]">Track</span>
                </p>
                <p className="mt-1 font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-[0.18em] text-[#6f9298]">
                  Dubai → Africa
                </p>
              </div>
            </div>
            <span className="hidden items-center gap-1.5 rounded-full border border-[#1E454F] bg-[#0E2A33] px-2.5 py-1 font-['IBM_Plex_Mono'] text-[11px] text-[#8AA6AC] sm:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-[#6FC79A] motion-safe:animate-pulse" />
              Live tracking
            </span>
          </div>

          {/* tab bar */}
          <nav className="flex px-2 sm:px-4" role="tablist" aria-label="Views">
            {TABS.map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(t.id)}
                  className={cx(
                    "relative flex flex-1 items-center justify-center gap-1.5 px-3 py-3 font-['Space_Grotesk'] text-[13px] font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#E9B25C]/60",
                    active ? "text-[#E9B25C]" : "text-[#8AA6AC] hover:text-[#ECF4F2]"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {t.label}
                  {active && (
                    <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-[#E9B25C]" />
                  )}
                </button>
              );
            })}
          </nav>
        </header>

        {/* content */}
        <main className="flex-1 px-4 py-6 sm:px-6">{view}</main>

        {/* footer */}
        <footer className="border-t border-[#1E454F] px-4 py-5 text-center sm:px-6">
          <p className="font-['IBM_Plex_Mono'] text-[11px] text-[#6f9298]">
            ExportTrack · transparent vehicle journeys, purchase to delivery
          </p>
        </footer>
      </div>
    </div>
  );
}
