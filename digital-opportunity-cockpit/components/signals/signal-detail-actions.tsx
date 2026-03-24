"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { dismissSignal } from "@/actions/signals";
import { ConvertToOpportunityModal } from "./convert-modal";
import type { Signal } from "@/db/schema";

export function SignalDetailActions({ signal }: { signal: Signal }) {
  const [showConvert, setShowConvert] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  async function handleDismiss() {
    await dismissSignal(signal.id);
    toast("Signal dismissed");
    router.push("/signals");
  }

  return (
    <div className="flex gap-2">
      {signal.status !== "dismissed" && signal.status !== "converted" && (
        <>
          <Button size="sm" variant="danger" onClick={handleDismiss}>
            Dismiss
          </Button>
          <Button size="sm" variant="accent" onClick={() => setShowConvert(true)}>
            Convert to Opportunity
          </Button>
        </>
      )}
      {showConvert && (
        <ConvertToOpportunityModal
          signal={signal}
          open={showConvert}
          onClose={() => {
            setShowConvert(false);
            router.push("/signals");
          }}
        />
      )}
    </div>
  );
}
