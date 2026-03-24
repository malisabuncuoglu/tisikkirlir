interface SignalStrengthProps {
  strength: "weak" | "medium" | "strong" | string | null;
}

export function SignalStrength({ strength }: SignalStrengthProps) {
  const dots = strength === "strong" ? 3 : strength === "medium" ? 2 : 1;
  return (
    <span className="inline-flex gap-0.5 items-center" title={strength || "weak"}>
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          className={`w-1.5 h-1.5 rounded-full ${
            i <= dots ? "bg-accent" : "bg-border"
          }`}
        />
      ))}
    </span>
  );
}
