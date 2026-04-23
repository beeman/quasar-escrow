import type { ReactNode } from 'react'

import { type SolanaCluster, type UiWallet, type UiWalletAccount, useWalletUi } from '@wallet-ui/react'

import { Badge } from '@/core/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/ui/card'
import { SolanaUiWalletDialog } from '@/solana/ui/solana-ui-wallet-dialog'

export interface SolanaUiWalletGuardRenderProps {
  account: UiWalletAccount
  cluster: SolanaCluster
  wallet: UiWallet
}

export function SolanaUiWalletGuard({ render }: { render: (props: SolanaUiWalletGuardRenderProps) => ReactNode }) {
  const { account, cluster, wallet } = useWalletUi()

  if (account && wallet) {
    return render({ account, cluster, wallet })
  }

  return (
    <div className="mx-auto flex h-full w-full max-w-6xl items-center px-4 py-8 sm:py-12">
      <Card className="w-full border-border/70 bg-card/85">
        <CardHeader className="gap-3">
          <Badge className="border-primary/20 bg-primary/10 px-3 text-primary" variant="outline">
            Wallet required
          </Badge>
          <CardTitle className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
            Connect a Solana wallet to start an escrow flow
          </CardTitle>
          <CardDescription className="max-w-3xl text-sm/6">
            This playground uses the connected wallet to resolve token accounts, derive the maker PDA, and execute make,
            take, and refund actions on the selected cluster.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)]">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
              <div className="text-sm font-medium">Prefill token accounts</div>
              <div className="mt-2 text-xs/relaxed text-muted-foreground">
                Connected classic SPL Token accounts show up in the escrow forms and can populate mint and amount fields
                automatically.
              </div>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
              <div className="text-sm font-medium">Inspect on-chain state</div>
              <div className="mt-2 text-xs/relaxed text-muted-foreground">
                The app derives the maker PDA, checks program availability, and surfaces the current escrow status for
                the active cluster.
              </div>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
              <div className="text-sm font-medium">Run wallet actions</div>
              <div className="mt-2 text-xs/relaxed text-muted-foreground">
                Sign messages, inspect balances, and submit escrow instructions from the same connected wallet session.
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-border/60 bg-background/40 p-5">
            <Badge variant="secondary">Quick start</Badge>
            <div className="mt-3 text-sm font-medium">Choose a wallet and continue into the escrow workspace.</div>
            <div className="mt-2 text-xs/relaxed text-muted-foreground">
              Once connected, the cluster switcher, wallet tools, and escrow flows unlock automatically.
            </div>
            <SolanaUiWalletDialog className="mt-5 h-11 w-full justify-center rounded-xl px-4 text-sm" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
