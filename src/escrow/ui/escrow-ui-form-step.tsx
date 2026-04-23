import { Badge } from '@/core/ui/badge'

export function EscrowUiFormStep({ description, step, title }: { description: string; step: string; title: string }) {
  return (
    <div className="bg-[radial-gradient(circle_at_top_left,var(--color-primary),transparent_55%)]/8 rounded-2xl border border-border/60 p-4">
      <div className="flex items-center gap-2">
        <Badge className="border-primary/20 bg-primary/10 text-primary" variant="outline">
          {step}
        </Badge>
        <div className="text-sm font-medium">{title}</div>
      </div>
      <div className="mt-1 text-xs/relaxed text-muted-foreground">{description}</div>
    </div>
  )
}
