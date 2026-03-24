import { Suspense } from "react";
import { getSignals } from "@/actions/signals";
import { SignalsTable } from "@/components/signals/signals-table";
import { SignalFilters } from "@/components/signals/signal-filters";
import { AddSignalButton } from "@/components/signals/add-signal-modal";

export default async function SignalsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const allSignals = await getSignals({
    source_type: params.source_type,
    signal_strength: params.signal_strength,
    status: params.status,
    search: params.search,
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-mono font-bold text-text-primary">
            Signals Inbox
          </h1>
          <p className="text-xs text-text-secondary font-mono mt-1">
            {allSignals.length} signals captured
          </p>
        </div>
        <AddSignalButton />
      </div>

      <Suspense>
        <SignalFilters />
      </Suspense>

      <SignalsTable signals={allSignals} />
    </div>
  );
}
