"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/modal";
import { AddSignalInline } from "@/components/signals/add-signal-modal";

export function KeyboardShortcuts() {
  const router = useRouter();
  const [showAddSignal, setShowAddSignal] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Ignore if typing in input/textarea
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      // Cmd/Ctrl + K → Quick add signal
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowAddSignal(true);
        return;
      }

      // ? → Show help
      if (e.key === "?") {
        e.preventDefault();
        setShowHelp(true);
        return;
      }

      // Navigation shortcuts (no modifier)
      if (!e.metaKey && !e.ctrlKey && !e.altKey) {
        switch (e.key) {
          case "g":
            // Wait for next key
            break;
          case "1":
            router.push("/");
            break;
          case "2":
            router.push("/signals");
            break;
          case "3":
            router.push("/opportunities");
            break;
          case "4":
            router.push("/reports");
            break;
          case "5":
            router.push("/archive");
            break;
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  return (
    <>
      {showAddSignal && (
        <Modal
          open={showAddSignal}
          onClose={() => setShowAddSignal(false)}
          title="Quick Add Signal"
        >
          <AddSignalInline onClose={() => setShowAddSignal(false)} />
        </Modal>
      )}
      {showHelp && (
        <Modal
          open={showHelp}
          onClose={() => setShowHelp(false)}
          title="Keyboard Shortcuts"
        >
          <div className="space-y-3 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-text-secondary">Quick add signal</span>
              <kbd className="bg-bg border border-border px-2 py-0.5 rounded text-text-primary">
                Cmd+K
              </kbd>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Dashboard</span>
              <kbd className="bg-bg border border-border px-2 py-0.5 rounded text-text-primary">
                1
              </kbd>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Signals</span>
              <kbd className="bg-bg border border-border px-2 py-0.5 rounded text-text-primary">
                2
              </kbd>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Opportunities</span>
              <kbd className="bg-bg border border-border px-2 py-0.5 rounded text-text-primary">
                3
              </kbd>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Reports</span>
              <kbd className="bg-bg border border-border px-2 py-0.5 rounded text-text-primary">
                4
              </kbd>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Archive</span>
              <kbd className="bg-bg border border-border px-2 py-0.5 rounded text-text-primary">
                5
              </kbd>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Show this help</span>
              <kbd className="bg-bg border border-border px-2 py-0.5 rounded text-text-primary">
                ?
              </kbd>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
