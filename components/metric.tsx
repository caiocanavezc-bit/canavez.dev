"use client";

import { useRef } from "react";
import type { Metric as MetricData } from "@/content/perfil";
import { useCountUp } from "@/lib/use-count-up";

export function Metric({ metric }: { metric: MetricData }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const valor = useCountUp(metric.value, ref);
  return (
    <div>
      <p
        ref={ref}
        className="font-mono text-[40px] font-semibold leading-none tracking-[-0.02em] text-text tabular-nums"
      >
        {metric.prefix}
        {valor}
        {metric.suffix && (
          <span className="font-sans text-[28px] font-semibold tracking-[-0.02em]">
            {metric.suffix}
          </span>
        )}
      </p>
      <p className="mt-2 text-sm text-muted">{metric.label}</p>
    </div>
  );
}
