import type { SolanaUiWalletGuardRenderProps } from '@/solana/ui/solana-ui-wallet-guard'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/core/ui/tabs'
import { useEscrowFeatureConnectedState } from '@/escrow/data-access/use-escrow-feature-connected-state'
import { EscrowFeatureMakeOffer } from '@/escrow/feature/escrow-feature-make-offer'
import { EscrowFeatureUseOffer } from '@/escrow/feature/escrow-feature-use-offer'
import { EscrowUiLatestResultCard } from '@/escrow/ui/escrow-ui-latest-result-card'
import { EscrowUiSavedOffersCard } from '@/escrow/ui/escrow-ui-saved-offers-card'
import { EscrowUiSessionCard } from '@/escrow/ui/escrow-ui-session-card'

export function EscrowFeatureConnected({ account, cluster, wallet }: SolanaUiWalletGuardRenderProps) {
  const state = useEscrowFeatureConnectedState({ account, cluster, wallet })

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-4 sm:py-6">
      <EscrowUiSessionCard {...state.sessionCardProps} />

      <Tabs className="space-y-4" onValueChange={state.handleTabChange} value={state.activeTab}>
        <TabsList className="grid h-auto w-full max-w-full grid-cols-2 gap-1.5 rounded-[1.25rem] border border-border/60 bg-background/70 p-1.5 sm:inline-flex sm:w-fit sm:grid-cols-none sm:flex-nowrap">
          <TabsTrigger className="h-10 w-full rounded-xl px-4 text-sm sm:w-auto sm:min-w-[9rem]" value="make">
            Make offer
          </TabsTrigger>
          <TabsTrigger className="h-10 w-full rounded-xl px-4 text-sm sm:w-auto sm:min-w-[9rem]" value="use">
            Use offer
          </TabsTrigger>
          <TabsTrigger className="h-10 w-full rounded-xl px-4 text-sm sm:w-auto sm:min-w-[9rem]" value="saved">
            Saved offers
            {state.savedOffersCount ? ` (${state.savedOffersCount})` : ''}
          </TabsTrigger>
          <TabsTrigger className="h-10 w-full rounded-xl px-4 text-sm sm:w-auto sm:min-w-[9rem]" value="latest">
            Latest result
          </TabsTrigger>
        </TabsList>

        <TabsContent value="make">
          <EscrowFeatureMakeOffer {...state.makeOfferProps} />
        </TabsContent>

        <TabsContent value="use">
          <EscrowFeatureUseOffer key={state.useOfferKey} {...state.useOfferProps} />
        </TabsContent>

        <TabsContent value="saved">
          <EscrowUiSavedOffersCard {...state.savedOffersCardProps} />
        </TabsContent>

        <TabsContent value="latest">
          <EscrowUiLatestResultCard {...state.latestResultCardProps} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
