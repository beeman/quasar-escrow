import { WalletUiIcon } from '@wallet-ui/react'
import { ArrowRightLeft, ShieldCheck, WalletCards } from 'lucide-react'

import type { EscrowUiSessionCardProps } from '@/escrow/data-access/escrow-feature-types'

import { Alert, AlertDescription, AlertTitle } from '@/core/ui/alert'
import { Badge } from '@/core/ui/badge'
import { Button } from '@/core/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/ui/card'
import { Textarea } from '@/core/ui/textarea'
import { EscrowUiSummary } from '@/escrow/ui/escrow-ui-summary'
import { formatEscrowAddress } from '@/escrow/util/escrow-format'
import { SolanaUiExplorerLink } from '@/solana/ui/solana-ui-explorer-link'
import { TOKEN_PROGRAM_ADDRESS } from '@/wallet/data-access/get-token-accounts-by-owner'

export function EscrowUiSessionCard({
  accountAddress,
  classicTokenAccountsCount,
  clusterLabel,
  currentEscrow,
  currentEscrowDecodeError,
  currentEscrowErrorMessage,
  currentStatusLabel,
  currentStatusVariant,
  offerPayload,
  onCopyPayload,
  savedOffersCount,
  token2022AccountsCount,
  wallet,
}: EscrowUiSessionCardProps) {
  return (
    <Card className="border-border/70 bg-card/85">
      <CardHeader className="gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="border-primary/20 bg-primary/10 px-3 text-primary" variant="outline">
            Escrow workspace
          </Badge>
          <Badge variant={currentStatusVariant}>{currentStatusLabel}</Badge>
          <Badge variant="secondary">{clusterLabel}</Badge>
        </div>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <CardTitle className="flex items-center gap-3 text-2xl font-semibold tracking-tight sm:text-3xl">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/12 text-primary ring-1 ring-primary/20">
                <WalletUiIcon className="size-7" wallet={wallet} />
              </div>
              <div className="min-w-0">
                <div className="truncate">{wallet.name}</div>
                <div className="mt-1 text-xs font-medium tracking-[0.28em] text-muted-foreground uppercase">
                  Maker session
                </div>
              </div>
            </CardTitle>
            <CardDescription className="max-w-3xl text-sm/6">
              Connected as <span className="font-mono text-foreground">{accountAddress}</span>. The escrow forms can
              pull from the connected wallet&apos;s parsed token accounts, so selecting a token account can fill the
              address, mint, and amount for you.
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2 lg:max-w-sm lg:justify-end">
            <Badge variant="outline">{classicTokenAccountsCount} classic token accounts</Badge>
            <Badge variant="outline">{savedOffersCount} saved offers</Badge>
            {token2022AccountsCount ? (
              <Badge variant="outline">{token2022AccountsCount} Token-2022 filtered</Badge>
            ) : null}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertTitle>Classic SPL Token only</AlertTitle>
          <AlertDescription>
            This escrow example currently supports only classic SPL Token accounts and mints owned by{' '}
            <span className="font-mono">{TOKEN_PROGRAM_ADDRESS}</span>. Token-2022 inputs are filtered out of the
            dropdowns and pasted Token-2022 addresses will be rejected before submit.
          </AlertDescription>
        </Alert>
        {currentEscrow.programMessage ? (
          <Alert variant={currentEscrowDecodeError ? 'destructive' : 'default'}>
            <AlertTitle>
              {currentEscrowDecodeError
                ? 'Connected maker escrow is unreadable'
                : 'Program unavailable on this cluster'}
            </AlertTitle>
            <AlertDescription>{currentEscrow.programMessage}</AlertDescription>
          </Alert>
        ) : null}
        {token2022AccountsCount ? (
          <Alert>
            <AlertTitle>Token-2022 accounts detected</AlertTitle>
            <AlertDescription>
              {token2022AccountsCount} connected token account{token2022AccountsCount === 1 ? '' : 's'} use Token-2022
              and cannot be used with this escrow example.
            </AlertDescription>
          </Alert>
        ) : null}
        {currentEscrowErrorMessage ? (
          <Alert variant="destructive">
            <AlertTitle>Unable to load the connected maker state</AlertTitle>
            <AlertDescription>{currentEscrowErrorMessage}</AlertDescription>
          </Alert>
        ) : null}
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-border/60 bg-background/40 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[0.625rem] font-medium tracking-[0.28em] text-muted-foreground uppercase">
                  Program
                </div>
                <div className="mt-2 flex items-center gap-2 text-sm font-medium">
                  <ShieldCheck className="size-4 text-primary" />
                  Escrow deployment
                </div>
              </div>
              <Badge variant={currentStatusVariant}>{currentStatusLabel}</Badge>
            </div>
            <div className="mt-4 space-y-3 text-xs">
              <div className="font-medium">Cluster</div>
              <div className="font-mono text-muted-foreground">{clusterLabel}</div>
              <div className="font-medium">Program address</div>
              <SolanaUiExplorerLink
                className="inline-flex gap-1 font-mono text-xs break-all"
                label={formatEscrowAddress(currentEscrow.programAddress)}
                path={`/address/${currentEscrow.programAddress}`}
              />
              <div className="font-medium">Your escrow PDA</div>
              {currentEscrow.escrowAddress ? (
                <SolanaUiExplorerLink
                  className="inline-flex gap-1 font-mono text-xs break-all"
                  label={formatEscrowAddress(currentEscrow.escrowAddress)}
                  path={`/address/${currentEscrow.escrowAddress}`}
                />
              ) : (
                <div className="text-muted-foreground">Deriving escrow PDA...</div>
              )}
              <div className="text-xs/relaxed text-muted-foreground">
                {currentEscrow.isRefreshing
                  ? 'Refreshing on-chain state...'
                  : 'The connected maker can hold one open escrow PDA at a time.'}
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-border/60 bg-background/40 p-5">
            <div className="flex items-center gap-2 text-sm font-medium">
              <WalletCards className="size-4 text-primary" />
              Connected maker state
            </div>
            <div className="mt-1 text-xs/relaxed text-muted-foreground">
              {currentEscrow.escrow
                ? 'This wallet already has an open escrow offer. Refund or complete it before opening another one.'
                : 'No open escrow was found for the connected maker PDA on this cluster.'}
            </div>
            {currentEscrow.escrow ? (
              <EscrowUiSummary escrow={currentEscrow.escrow} escrowAddress={currentEscrow.escrowAddress} />
            ) : (
              <div className="mt-4 rounded-2xl border border-dashed border-border/60 bg-background/40 p-4 text-xs/relaxed text-muted-foreground">
                A successful `make` transaction will populate this card with the on-chain offer data and the derived
                escrow PDA.
              </div>
            )}
          </div>
          <div className="rounded-2xl border border-border/60 bg-background/40 p-5">
            <div className="flex items-center gap-2 text-sm font-medium">
              <ArrowRightLeft className="size-4 text-primary" />
              Offer payload
            </div>
            <div className="mt-1 text-xs/relaxed text-muted-foreground">
              The escrow vault token account is not recoverable from the on-chain escrow account, so the maker needs to
              share it alongside the escrow PDA and mint addresses. Successful `make` transactions are also saved in
              this browser for demo use.
            </div>
            {offerPayload ? (
              <div className="mt-4 space-y-3">
                <Textarea className="min-h-40 font-mono text-xs" readOnly value={offerPayload} />
                <Button className="w-full" onClick={onCopyPayload} type="button" variant="secondary">
                  Copy offer payload
                </Button>
              </div>
            ) : (
              <div className="mt-4 rounded-2xl border border-dashed border-border/60 bg-background/40 p-4 text-xs/relaxed text-muted-foreground">
                Submit a `make` transaction to generate the shareable payload for takers.
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
