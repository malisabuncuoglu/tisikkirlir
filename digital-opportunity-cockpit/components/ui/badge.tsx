type Variant = "default" | "accent" | "success" | "warning" | "danger" | "muted";

interface BadgeProps {
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<Variant, string> = {
  default: "bg-surface border border-border text-text-primary",
  accent: "bg-accent/15 border border-accent/30 text-accent",
  success: "bg-success/15 border border-success/30 text-success",
  warning: "bg-warning/15 border border-warning/30 text-warning",
  danger: "bg-danger/15 border border-danger/30 text-danger",
  muted: "bg-surface border border-border text-text-secondary",
};

export function Badge({ variant = "default", children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-mono ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

export function VerdictBadge({ verdict }: { verdict: string | null }) {
  const config: Record<string, { variant: Variant; label: string }> = {
    build_thesis: { variant: "accent", label: "BUILD THESIS" },
    explore: { variant: "success", label: "EXPLORE" },
    watchlist: { variant: "warning", label: "WATCHLIST" },
    ignore: { variant: "danger", label: "IGNORE" },
  };
  const c = config[verdict || ""] || { variant: "muted" as Variant, label: verdict || "—" };
  return <Badge variant={c.variant}>{c.label}</Badge>;
}

export function CategoryBadge({ category }: { category: string | null }) {
  const labels: Record<string, string> = {
    saas: "SaaS",
    ai_tool: "AI Tool",
    mobile_app: "Mobile App",
    web_app: "Web App",
    api_service: "API Service",
    productized_service: "Productized Service",
    other: "Other",
  };
  return <Badge variant="muted">{labels[category || ""] || category || "—"}</Badge>;
}

export function StatusBadge({ status }: { status: string | null }) {
  return <Badge variant="default">{status || "—"}</Badge>;
}
