import type { Metric as MetricData } from "@/content/perfil";

export function Metric({ metric }: { metric: MetricData }) {
  return (
    <div>
      <p className="font-mono text-[40px] font-semibold leading-none tracking-[-0.02em] text-text">
        {metric.prefix}
        {metric.value}
        {metric.suffix && (
          <span className="font-sans text-[28px] font-semibold tracking-[-0.02em]">{metric.suffix}</span>
        )}
      </p>
      <p className="mt-2 text-sm text-muted">{metric.label}</p>
    </div>
  );
}
