"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/input";
import { killOpportunity, archiveOpportunity, restoreOpportunity } from "@/actions/opportunities";
import { useRouter } from "next/navigation";

export function KillButton({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleKill(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    await killOpportunity(id, form.get("reason") as string);
    setLoading(false);
    setOpen(false);
    router.push("/opportunities");
  }

  return (
    <>
      <Button size="sm" variant="danger" onClick={() => setOpen(true)}>
        Kill
      </Button>
      {open && (
        <Modal open={open} onClose={() => setOpen(false)} title="Kill Opportunity">
          <form onSubmit={handleKill} className="space-y-3">
            <Textarea
              name="reason"
              label="Reason (optional)"
              placeholder="Why is this being killed?"
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="danger" disabled={loading}>
                {loading ? "Killing..." : "Confirm Kill"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}

export function ArchiveButton({ id }: { id: string }) {
  const router = useRouter();
  async function handleArchive() {
    await archiveOpportunity(id);
    router.push("/opportunities");
  }
  return (
    <Button size="sm" variant="ghost" onClick={handleArchive}>
      Archive
    </Button>
  );
}

export function RestoreButton({ id }: { id: string }) {
  const router = useRouter();
  async function handleRestore() {
    await restoreOpportunity(id);
    router.refresh();
  }
  return (
    <Button size="sm" variant="accent" onClick={handleRestore}>
      Restore
    </Button>
  );
}
