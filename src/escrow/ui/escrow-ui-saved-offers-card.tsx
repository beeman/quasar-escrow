import type { EscrowUiSavedOffersCardProps } from '@/escrow/data-access/escrow-feature-types'

import { Button } from '@/core/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/ui/card'
import { formatEscrowAddress, formatEscrowSavedOfferCreatedAt } from '@/escrow/util/escrow-format'
import { SolanaUiExplorerLink } from '@/solana/ui/solana-ui-explorer-link'

export function EscrowUiSavedOffersCard({
  clusterLabel,
  onClearSavedOffers,
  onCopyPayload,
  onLoadOffer,
  onRemoveOffer,
  savedOffers,
}: EscrowUiSavedOffersCardProps) {
  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle>Saved Offers</CardTitle>
        <CardDescription>
          Successful `make` transactions are saved in this browser so the maker address and escrow vault token account
          stay easy to reload during the demo.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {savedOffers.length ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs/relaxed text-muted-foreground">
              Showing {savedOffers.length} saved offer{savedOffers.length === 1 ? '' : 's'} for {clusterLabel}.
            </div>
            <Button onClick={onClearSavedOffers} type="button" variant="outline">
              Clear saved offers
            </Button>
          </div>
        ) : null}
        {savedOffers.length ? (
          <div className="space-y-3">
            {savedOffers.map((savedOffer) => (
              <div
                className="rounded-2xl border border-border/60 bg-background/40 p-5"
                key={`${savedOffer.clusterId}:${savedOffer.offerPayload.escrow}`}
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="text-sm font-medium">Saved offer</div>
                    <div className="text-xs/relaxed text-muted-foreground">
                      Saved {formatEscrowSavedOfferCreatedAt(savedOffer.createdAt)}
                    </div>
                  </div>
                  <SolanaUiExplorerLink
                    className="inline-flex gap-1 font-mono text-xs break-all"
                    label={formatEscrowAddress(savedOffer.offerPayload.escrow)}
                    path={`/address/${savedOffer.offerPayload.escrow}`}
                  />
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <SavedOfferField
                    label="Deposit side"
                    value={`${savedOffer.offerPayload.deposit} of ${savedOffer.offerPayload.mintA}`}
                  />
                  <SavedOfferField label="Escrow vault token account" value={savedOffer.offerPayload.vaultTaA} />
                  <SavedOfferField label="Maker address" value={savedOffer.offerPayload.maker} />
                  <SavedOfferField
                    label="Requested side"
                    value={`${savedOffer.offerPayload.receive} of ${savedOffer.offerPayload.mintB}`}
                  />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button onClick={() => onLoadOffer(savedOffer)} type="button">
                    Load into use flow
                  </Button>
                  <Button onClick={() => onCopyPayload(savedOffer)} type="button" variant="secondary">
                    Copy payload
                  </Button>
                  <Button onClick={() => onRemoveOffer(savedOffer)} type="button" variant="outline">
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border/60 bg-background/40 p-5 text-xs/relaxed text-muted-foreground">
            Successful `make` transactions will save their off-chain payload here so you can load the maker address and
            escrow vault token account again after switching wallets or refreshing the page.
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function SavedOfferField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1 text-xs">
      <div className="font-medium">{label}</div>
      <div className="font-mono break-all text-muted-foreground">{value}</div>
    </div>
  )
}
