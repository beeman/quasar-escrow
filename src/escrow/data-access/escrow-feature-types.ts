import type { SolanaClusterId, UiWallet } from '@wallet-ui/react'
import type { VariantProps } from 'class-variance-authority'

import type { EscrowTab, SavedEscrowOffer } from '@/escrow/data-access/escrow-browser-storage'
import type { EscrowOfferPayload } from '@/escrow/data-access/use-escrow-program-mutation'
import type { EscrowMintOption } from '@/escrow/util/escrow-circle-demo'
import type { SolanaClient } from '@/solana/data-access/solana-client'
import type { WalletTokenAccount } from '@/wallet/data-access/get-token-accounts-by-owner'
import type { WalletTokenAccountsState } from '@/wallet/data-access/use-wallet-token-accounts-query'

import { type badgeVariants } from '@/core/ui/badge'

export type EscrowBadgeVariant = VariantProps<typeof badgeVariants>['variant']

export interface EscrowFeatureMakeOfferProps {
  canMake: boolean
  classicTokenAccounts: WalletTokenAccount[]
  isDevnet: boolean
  makeMintOptions: EscrowMintOption[]
  mutationIsLoading: boolean
  mutationLastAction: null | string
  onOfferCreated(offerPayload: EscrowOfferPayload): void
  onSubmit(
    input: EscrowFeatureMakeOfferSubmitInput,
  ): Promise<{ details: { offerPayload: EscrowOfferPayload | null } } | null>
  tokenAccountsState: WalletTokenAccountsState
}

export interface EscrowFeatureMakeOfferSubmitInput {
  deposit: string
  makerTaA: string
  makerTaB: string
  mintA: string
  mintB: string
  receive: string
  vaultTaA: string
}

export interface EscrowFeatureUseOfferProps {
  accountAddress: string
  classicTokenAccounts: WalletTokenAccount[]
  client: SolanaClient
  clusterId: SolanaClusterId
  isDevnet: boolean
  mutationIsLoading: boolean
  mutationLastAction: null | string
  onRefundOffer(input: EscrowFeatureUseOfferRefundInput): Promise<unknown>
  onTakeOffer(input: EscrowFeatureUseOfferTakeInput): Promise<unknown>
  savedOffer: null | SavedEscrowOffer
  tokenAccountsState: WalletTokenAccountsState
}

export interface EscrowFeatureUseOfferRefundInput {
  maker: string
  makerTaA: string
  mintA: string
  vaultTaA: string
}

export interface EscrowFeatureUseOfferTakeInput {
  maker: string
  makerTaB: string
  mintA: string
  mintB: string
  takerTaA: string
  takerTaB: string
  vaultTaA: string
}

export interface EscrowGeneratedAccountView {
  address: string
  label: string
}

export interface EscrowUiLatestResultCardProps {
  errorMessage: null | string
  generatedAccounts: EscrowGeneratedAccountView[]
  isLoading: boolean
  lastAction: null | string
  signature: null | string
}

export interface EscrowUiSavedOffersCardProps {
  clusterLabel: string
  onClearSavedOffers(): void
  onCopyPayload(savedOffer: SavedEscrowOffer): void
  onLoadOffer(savedOffer: SavedEscrowOffer): void
  onRemoveOffer(savedOffer: SavedEscrowOffer): void
  savedOffers: SavedEscrowOffer[]
}

export interface EscrowUiSessionCardProps {
  accountAddress: string
  classicTokenAccountsCount: number
  clusterLabel: string
  currentEscrow: EscrowUiSessionCurrentEscrow
  currentEscrowDecodeError: boolean
  currentEscrowErrorMessage: null | string
  currentStatusLabel: string
  currentStatusVariant: EscrowBadgeVariant
  offerPayload: null | string
  onCopyPayload(): void
  savedOffersCount: number
  token2022AccountsCount: number
  wallet: UiWallet
}

export interface EscrowUiSessionCurrentEscrow {
  escrow: EscrowUiSummaryEscrow | null
  escrowAddress: null | string
  isRefreshing: boolean
  programAddress: string
  programMessage: null | string
}

export interface EscrowUiSummaryEscrow {
  maker: string
  makerTaB: string
  mintA: string
  mintB: string
  receive: bigint
}

export interface UseEscrowFeatureConnectedStateResult {
  activeTab: EscrowTab
  handleTabChange(nextTab: string): void
  latestResultCardProps: EscrowUiLatestResultCardProps
  makeOfferProps: EscrowFeatureMakeOfferProps
  savedOffersCardProps: EscrowUiSavedOffersCardProps
  savedOffersCount: number
  sessionCardProps: EscrowUiSessionCardProps
  useOfferKey: number
  useOfferProps: EscrowFeatureUseOfferProps
}
