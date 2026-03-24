import { getArchivedOpportunities } from "@/actions/opportunities";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CategoryBadge, Badge } from "@/components/ui/badge";
import { RestoreButton } from "@/components/opportunities/opportunity-actions";

export default async function ArchivePage() {
  const archivedOpps = await getArchivedOpportunities();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-lg font-mono font-bold text-text-primary">Archive</h1>
        <p className="text-xs text-text-secondary font-mono mt-1">
          {archivedOpps.length} killed & archived opportunities
        </p>
      </div>

      {archivedOpps.length === 0 ? (
        <Card>
          <CardContent>
            <p className="text-sm text-text-secondary font-mono text-center py-8">
              No archived opportunities.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {archivedOpps.map((opp) => (
            <Card key={opp.id} className="opacity-60 hover:opacity-80 transition-opacity">
              <CardHeader>
                <CardTitle>{opp.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  <CategoryBadge category={opp.category} />
                  <Badge variant="danger">{opp.status}</Badge>
                </div>
                {opp.founder_fit_notes && (
                  <p className="text-[10px] font-mono text-text-secondary mb-2">
                    {opp.founder_fit_notes}
                  </p>
                )}
                <RestoreButton id={opp.id} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
