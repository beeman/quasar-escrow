import type { EscrowUiLatestResultCardProps } from '@/escrow/data-access/escrow-feature-types'

import { Alert, AlertDescription, AlertTitle } from '@/core/ui/alert'
import { Badge } from '@/core/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/ui/card'
import { formatEscrowAddress } from '@/escrow/util/escrow-format'
import { SolanaUiExplorerLink } from '@/solana/ui/solana-ui-explorer-link'

export function EscrowUiLatestResultCard({
  errorMessage,
  generatedAccounts,
  isLoading,
  lastAction,
  signature,
}: EscrowUiLatestResultCardProps) {
  const latestAction = formatActionLabel(lastAction)
  const latestStatusLabel = errorMessage ? 'Failed' : isLoading ? 'Sending' : signature ? 'Confirmed' : 'Ready'
  const latestStatusVariant = errorMessage ? 'destructive' : isLoading ? 'secondary' : signature ? 'default' : 'outline'

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle>Latest Result</CardTitle>
        <CardDescription>
          Tracks the last escrow action from this screen, including any fresh token account signers generated in the
          browser.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm font-medium">{latestAction ? `${latestAction} status` : 'Action status'}</div>
          <Badge variant={latestStatusVariant}>{latestStatusLabel}</Badge>
        </div>
        {errorMessage ? (
          <Alert variant="destructive">
            <AlertTitle>{latestAction ? `${latestAction} failed` : 'Transaction failed'}</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        ) : null}
        {signature ? (
          <div className="space-y-2 text-xs">
            <div className="font-medium">Latest signature</div>
            <SolanaUiExplorerLink
              className="inline-flex gap-1 font-mono text-xs break-all"
              label={formatEscrowAddress(signature)}
              path={`/tx/${signature}`}
            />
          </div>
        ) : null}
        {generatedAccounts.length ? (
          <div className="space-y-2">
            <div className="text-xs font-medium">Generated signer accounts</div>
            <div className="flex flex-wrap gap-2">
              {generatedAccounts.map((generatedAccount) => (
                <Badge key={`${generatedAccount.label}:${generatedAccount.address}`} variant="outline">
                  {generatedAccount.label}: {formatEscrowAddress(generatedAccount.address)}
                </Badge>
              ))}
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}

function formatActionLabel(action: null | string) {
  switch (action) {
    case 'make':
      return 'Make'
    case 'refund':
      return 'Refund'
    case 'take':
      return 'Take'
    default:
      return null
  }
}
