import { useState } from 'react'

import type { SavedEscrowOffer } from '@/escrow/data-access/escrow-browser-storage'
import type {
  EscrowBadgeVariant,
  UseEscrowFeatureConnectedStateResult,
} from '@/escrow/data-access/escrow-feature-types'
import type { SolanaUiWalletGuardRenderProps } from '@/solana/ui/solana-ui-wallet-guard'

import {
  type EscrowTab,
  isEscrowTab,
  readEscrowActiveTab,
  readEscrowSavedOffers,
  writeEscrowActiveTab,
  writeEscrowSavedOffers,
} from '@/escrow/data-access/escrow-browser-storage'
import { useEscrowAccountQuery } from '@/escrow/data-access/use-escrow-account-query'
import { type EscrowOfferPayload, useEscrowProgramMutation } from '@/escrow/data-access/use-escrow-program-mutation'
import { getConnectedMintOptions, getMakeMintOptions } from '@/escrow/util/escrow-circle-demo'
import { formatEscrowOfferPayload, formatEscrowUnknownError } from '@/escrow/util/escrow-format'
import { useSolanaClient } from '@/solana/data-access/use-solana-client'
import { TOKEN_PROGRAM_ADDRESS } from '@/wallet/data-access/get-token-accounts-by-owner'
import { useWalletTokenAccountsQuery } from '@/wallet/data-access/use-wallet-token-accounts-query'

interface SavedOfferSelection {
  nonce: number
  savedOffer: SavedEscrowOffer
}

export function useEscrowFeatureConnectedState({
  account,
  cluster,
  wallet,
}: SolanaUiWalletGuardRenderProps): UseEscrowFeatureConnectedStateResult {
  const [activeTab, setActiveTab] = useState<EscrowTab>(() => readEscrowActiveTab())
  const [savedOffers, setSavedOffers] = useState<SavedEscrowOffer[]>(() => readEscrowSavedOffers())
  const [savedOfferSelection, setSavedOfferSelection] = useState<null | SavedOfferSelection>(null)
  const client = useSolanaClient()
  const currentEscrow = useEscrowAccountQuery({
    client,
    cluster: cluster.id,
    makerAddress: account.address,
  })
  const mutation = useEscrowProgramMutation({
    account,
    client,
  })
  const walletTokenAccounts = useWalletTokenAccountsQuery({
    account,
    client,
    cluster: cluster.id,
  })
  const connectedTokenAccounts =
    walletTokenAccounts.state.status === 'success' ? walletTokenAccounts.state.tokenAccounts : []
  const classicTokenAccounts = connectedTokenAccounts.filter(
    (tokenAccount) => tokenAccount.programId === TOKEN_PROGRAM_ADDRESS,
  )
  const connectedMintOptions = getConnectedMintOptions(classicTokenAccounts)
  const currentEscrowDecodeError =
    currentEscrow.programStatus === 'deployed' && !!currentEscrow.programMessage && !currentEscrow.escrow
  const currentStatusLabel = currentEscrow.isLoading
    ? 'Loading'
    : currentEscrow.programStatus !== 'deployed'
      ? 'Unavailable'
      : currentEscrowDecodeError
        ? 'Unreadable'
        : currentEscrow.escrow
          ? 'Open'
          : 'Ready'
  const currentStatusVariant: EscrowBadgeVariant = currentEscrow.isLoading
    ? 'secondary'
    : currentEscrow.programStatus !== 'deployed'
      ? 'destructive'
      : currentEscrowDecodeError
        ? 'destructive'
        : currentEscrow.escrow
          ? 'default'
          : 'outline'
  const currentEscrowErrorMessage = currentEscrow.isError ? formatEscrowUnknownError(currentEscrow.error) : null
  const formattedOfferPayload = mutation.details?.offerPayload
    ? formatEscrowOfferPayload(mutation.details.offerPayload)
    : null
  const isDevnet = cluster.id === 'solana:devnet'
  const makeMintOptions = getMakeMintOptions(connectedMintOptions, isDevnet)
  const savedOffersForCluster = savedOffers.filter((savedOffer) => savedOffer.clusterId === cluster.id)
  const token2022Accounts = connectedTokenAccounts.filter(
    (tokenAccount) => tokenAccount.programId !== TOKEN_PROGRAM_ADDRESS,
  )
  const canMake =
    currentEscrow.programStatus === 'deployed' &&
    currentEscrow.escrow === null &&
    !currentEscrowDecodeError &&
    !mutation.isLoading

  function handleLoadSavedOffer(savedOffer: SavedEscrowOffer) {
    setSavedOfferSelection((current) => ({
      nonce: (current?.nonce ?? 0) + 1,
      savedOffer,
    }))
    setAndPersistActiveTab('use')
  }

  function handleOfferCreated(offerPayload: EscrowOfferPayload) {
    const nextSavedOffer: SavedEscrowOffer = {
      clusterId: cluster.id,
      createdAt: new Date().toISOString(),
      offerPayload,
    }

    setAndPersistSavedOffers([
      nextSavedOffer,
      ...savedOffers.filter(
        (savedOffer) =>
          !(savedOffer.clusterId === cluster.id && savedOffer.offerPayload.escrow === offerPayload.escrow),
      ),
    ])
    setAndPersistActiveTab('saved')
  }

  function handleRemoveSavedOffer(savedOffer: SavedEscrowOffer) {
    setAndPersistSavedOffers(
      savedOffers.filter(
        (existingOffer) =>
          !(
            existingOffer.clusterId === savedOffer.clusterId &&
            existingOffer.offerPayload.escrow === savedOffer.offerPayload.escrow
          ),
      ),
    )
  }

  function handleClearSavedOffersForCluster() {
    setAndPersistSavedOffers(savedOffers.filter((savedOffer) => savedOffer.clusterId !== cluster.id))
  }

  function handleTabChange(nextTab: string) {
    if (!isEscrowTab(nextTab)) {
      return
    }

    setAndPersistActiveTab(nextTab)
  }

  async function handleCopyPayload(offerPayload: EscrowOfferPayload) {
    if (!navigator.clipboard) {
      return
    }

    try {
      await navigator.clipboard.writeText(formatEscrowOfferPayload(offerPayload))
    } catch {
      // Ignore clipboard failures in non-secure contexts.
    }
  }

  function setAndPersistActiveTab(nextTab: EscrowTab) {
    setActiveTab(nextTab)
    writeEscrowActiveTab(nextTab)
  }

  function setAndPersistSavedOffers(nextSavedOffers: SavedEscrowOffer[]) {
    setSavedOffers(nextSavedOffers)
    writeEscrowSavedOffers(nextSavedOffers)
  }

  return {
    activeTab,
    handleTabChange,
    latestResultCardProps: {
      errorMessage: mutation.errorMessage,
      generatedAccounts: mutation.details?.generatedAccounts ?? [],
      isLoading: mutation.isLoading,
      lastAction: mutation.lastAction,
      signature: mutation.signature,
    },
    makeOfferProps: {
      canMake,
      classicTokenAccounts,
      isDevnet,
      makeMintOptions,
      mutationIsLoading: mutation.isLoading,
      mutationLastAction: mutation.lastAction,
      onOfferCreated: handleOfferCreated,
      onSubmit: mutation.makeOffer,
      tokenAccountsState: walletTokenAccounts.state,
    },
    savedOffersCardProps: {
      clusterLabel: cluster.label,
      onClearSavedOffers: handleClearSavedOffersForCluster,
      onCopyPayload(savedOffer: SavedEscrowOffer) {
        void handleCopyPayload(savedOffer.offerPayload)
      },
      onLoadOffer: handleLoadSavedOffer,
      onRemoveOffer: handleRemoveSavedOffer,
      savedOffers: savedOffersForCluster,
    },
    savedOffersCount: savedOffersForCluster.length,
    sessionCardProps: {
      accountAddress: account.address,
      classicTokenAccountsCount: classicTokenAccounts.length,
      clusterLabel: cluster.label,
      currentEscrow: {
        escrow: currentEscrow.escrow,
        escrowAddress: currentEscrow.escrowAddress,
        isRefreshing: currentEscrow.isRefreshing,
        programAddress: currentEscrow.programAddress,
        programMessage: currentEscrow.programMessage,
      },
      currentEscrowDecodeError,
      currentEscrowErrorMessage,
      currentStatusLabel,
      currentStatusVariant,
      offerPayload: formattedOfferPayload,
      onCopyPayload() {
        if (mutation.details?.offerPayload) {
          void handleCopyPayload(mutation.details.offerPayload)
        }
      },
      savedOffersCount: savedOffersForCluster.length,
      token2022AccountsCount: token2022Accounts.length,
      wallet,
    },
    useOfferKey: savedOfferSelection?.nonce ?? 0,
    useOfferProps: {
      accountAddress: account.address,
      classicTokenAccounts,
      client,
      clusterId: cluster.id,
      isDevnet,
      mutationIsLoading: mutation.isLoading,
      mutationLastAction: mutation.lastAction,
      onRefundOffer: mutation.refundOffer,
      onTakeOffer: mutation.takeOffer,
      savedOffer: savedOfferSelection?.savedOffer ?? null,
      tokenAccountsState: walletTokenAccounts.state,
    },
  }
}
