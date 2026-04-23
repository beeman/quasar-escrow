import type { ReactNode } from 'react'

import type { EscrowUiSummaryEscrow } from '@/escrow/data-access/escrow-feature-types'

import { formatEscrowAddress } from '@/escrow/util/escrow-format'
import { SolanaUiExplorerLink } from '@/solana/ui/solana-ui-explorer-link'

export function EscrowUiSummary({
  escrow,
  escrowAddress,
}: {
  escrow: EscrowUiSummaryEscrow
  escrowAddress: null | string
}) {
  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-2">
      <EscrowUiSummaryItem
        label="Escrow PDA"
        value={
          escrowAddress ? (
            <SolanaUiExplorerLink
              className="inline-flex gap-1 font-mono text-xs break-all"
              label={formatEscrowAddress(escrowAddress)}
              path={`/address/${escrowAddress}`}
            />
          ) : (
            <div className="font-mono text-muted-foreground">Deriving...</div>
          )
        }
      />
      <EscrowUiSummaryItem
        label="Maker"
        value={<div className="font-mono break-all text-muted-foreground">{escrow.maker}</div>}
      />
      <EscrowUiSummaryItem
        label="Maker receive token account"
        value={<div className="font-mono break-all text-muted-foreground">{escrow.makerTaB}</div>}
      />
      <EscrowUiSummaryItem
        label="Deposit mint"
        value={<div className="font-mono break-all text-muted-foreground">{escrow.mintA}</div>}
      />
      <EscrowUiSummaryItem
        label="Requested mint"
        value={<div className="font-mono break-all text-muted-foreground">{escrow.mintB}</div>}
      />
      <EscrowUiSummaryItem
        label="Receive amount"
        value={<div className="font-mono text-muted-foreground">{escrow.receive.toString()}</div>}
      />
    </div>
  )
}

function EscrowUiSummaryItem({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-background/40 p-3">
      <div className="text-[0.625rem] font-medium tracking-[0.24em] text-muted-foreground uppercase">{label}</div>
      <div className="mt-2 text-xs/relaxed">{value}</div>
    </div>
  )
}
