import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { dateTimeFmt } from "@/lib/admin/labels"

export function StatutHistorique({ entries }: { entries: { id: string; ancienStatut: string | null; nouveauStatut: string; date: string }[] }) {
  const sorted = entries.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  return (
    <Card>
      <CardHeader><CardTitle>Historique de statut</CardTitle></CardHeader>
      <CardContent>
        {sorted.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucun changement de statut enregistré.</p>
        ) : (
          <ol className="space-y-3 border-l border-border pl-4">
            {sorted.map((h) => (
              <li key={h.id} className="relative text-sm">
                <span className="absolute -left-[19px] top-1 size-2 rounded-full bg-primary" />
                <p className="text-foreground">
                  {h.ancienStatut ? `${h.ancienStatut} → ` : ""}
                  <span className="font-medium">{h.nouveauStatut}</span>
                </p>
                <p className="text-xs text-muted-foreground">{dateTimeFmt(h.date)}</p>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  )
}
