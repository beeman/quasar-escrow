import type { FormEvent } from 'react'

import { address } from '@solana/kit'
import { useState } from 'react'

import type { SavedEscrowOffer } from '@/escrow/data-access/escrow-browser-storage'
import type { EscrowBadgeVariant, EscrowFeatureUseOfferProps } from '@/escrow/data-access/escrow-feature-types'
import type { WalletTokenAccount } from '@/wallet/data-access/get-token-accounts-by-owner'

import { useEscrowAccountQuery } from '@/escrow/data-access/use-escrow-account-query'
import { CIRCLE_DEVNET_MINT_PRESETS } from '@/escrow/util/escrow-circle-demo'
import { formatEscrowUnknownError } from '@/escrow/util/escrow-format'
import { filterEscrowTokenAccountsByMint } from '@/escrow/util/escrow-token-accounts'

export function useEscrowFeatureUseOffer({
  accountAddress,
  classicTokenAccounts,
  client,
  clusterId,
  mutationIsLoading,
  onRefundOffer,
  onTakeOffer,
  savedOffer,
}: {
  accountAddress: EscrowFeatureUseOfferProps['accountAddress']
  classicTokenAccounts: EscrowFeatureUseOfferProps['classicTokenAccounts']
  client: EscrowFeatureUseOfferProps['client']
  clusterId: EscrowFeatureUseOfferProps['clusterId']
  mutationIsLoading: EscrowFeatureUseOfferProps['mutationIsLoading']
  onRefundOffer: EscrowFeatureUseOfferProps['onRefundOffer']
  onTakeOffer: EscrowFeatureUseOfferProps['onTakeOffer']
  savedOffer: EscrowFeatureUseOfferProps['savedOffer']
}) {
  const initialLookupState = getInitialLookupState(savedOffer)
  const [lookupError, setLookupError] = useState<null | string>(initialLookupState.lookupError)
  const [lookupMakerAddress, setLookupMakerAddress] = useState<null | string>(initialLookupState.lookupMakerAddress)
  const [lookupMakerInput, setLookupMakerInput] = useState(initialLookupState.lookupMakerInput)
  const [lookupVaultTaAInput, setLookupVaultTaAInput] = useState(initialLookupState.lookupVaultTaAInput)
  const [refundMakerTaAInput, setRefundMakerTaAInput] = useState('')
  const [takeTakerTaAInput, setTakeTakerTaAInput] = useState('')
  const [takeTakerTaBInput, setTakeTakerTaBInput] = useState('')
  const lookedUpEscrow = useEscrowAccountQuery({
    client,
    cluster: clusterId,
    enabled: !!lookupMakerAddress,
    makerAddress: lookupMakerAddress,
  })
  const lookedUpEscrowDecodeError =
    lookedUpEscrow.programStatus === 'deployed' && !!lookedUpEscrow.programMessage && !lookedUpEscrow.escrow
  const lookupStatusLabel = !lookupMakerAddress
    ? 'Idle'
    : lookedUpEscrow.isLoading
      ? 'Loading'
      : lookedUpEscrow.programStatus !== 'deployed'
        ? 'Unavailable'
        : lookedUpEscrowDecodeError
          ? 'Unreadable'
          : lookedUpEscrow.escrow
            ? 'Loaded'
            : 'Not found'
  const lookupStatusVariant: EscrowBadgeVariant = !lookupMakerAddress
    ? 'outline'
    : lookedUpEscrow.isLoading
      ? 'secondary'
      : lookedUpEscrow.programStatus !== 'deployed'
        ? 'destructive'
        : lookedUpEscrowDecodeError
          ? 'destructive'
          : lookedUpEscrow.escrow
            ? 'default'
            : 'outline'
  const refundTokenAccounts = filterEscrowTokenAccountsByMint(classicTokenAccounts, lookedUpEscrow.escrow?.mintA ?? '')
  const takePaymentTokenAccounts = filterEscrowTokenAccountsByMint(
    classicTokenAccounts,
    lookedUpEscrow.escrow?.mintB ?? '',
  )
  const takeReceiveTokenAccounts = filterEscrowTokenAccountsByMint(
    classicTokenAccounts,
    lookedUpEscrow.escrow?.mintA ?? '',
  )
  const lookedUpRequestedMint = lookedUpEscrow.escrow?.mintB ?? ''
  const requestedCirclePreset = lookedUpRequestedMint
    ? (CIRCLE_DEVNET_MINT_PRESETS.find((preset) => preset.mint === lookedUpRequestedMint) ?? null)
    : null
  const takePaymentAccountMissing =
    lookedUpEscrow.programStatus === 'deployed' && !!lookedUpEscrow.escrow && !takeTakerTaBInput.trim()
  const canRefund =
    lookedUpEscrow.programStatus === 'deployed' &&
    !!lookedUpEscrow.escrow &&
    !!lookupVaultTaAInput.trim() &&
    !!refundMakerTaAInput.trim() &&
    lookupMakerAddress === accountAddress &&
    !mutationIsLoading
  const canTake =
    lookedUpEscrow.programStatus === 'deployed' &&
    !!lookedUpEscrow.escrow &&
    !!lookupVaultTaAInput.trim() &&
    !!takeTakerTaBInput.trim() &&
    !mutationIsLoading

  function handleLookupSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLookupError(null)

    const trimmed = lookupMakerInput.trim()

    if (!trimmed) {
      setLookupError('Maker address is required to load an escrow offer.')
      return
    }

    try {
      setLookupMakerAddress(address(trimmed))
    } catch {
      setLookupError('Maker address must be a valid Solana address.')
    }
  }

  function handleRefundSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!lookupMakerAddress || !lookedUpEscrow.escrow) {
      return
    }

    void onRefundOffer({
      maker: lookupMakerAddress,
      makerTaA: refundMakerTaAInput,
      mintA: lookedUpEscrow.escrow.mintA,
      vaultTaA: lookupVaultTaAInput,
    })
  }

  function handleTakeSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!lookupMakerAddress || !lookedUpEscrow.escrow) {
      return
    }

    void onTakeOffer({
      maker: lookupMakerAddress,
      makerTaB: lookedUpEscrow.escrow.makerTaB,
      mintA: lookedUpEscrow.escrow.mintA,
      mintB: lookedUpEscrow.escrow.mintB,
      takerTaA: takeTakerTaAInput,
      takerTaB: takeTakerTaBInput,
      vaultTaA: lookupVaultTaAInput,
    })
  }

  function handleRefundTokenAccountSelect(tokenAccount: WalletTokenAccount) {
    setRefundMakerTaAInput(tokenAccount.address)
  }

  function handleTakePaymentTokenAccountSelect(tokenAccount: WalletTokenAccount) {
    setTakeTakerTaBInput(tokenAccount.address)
  }

  function handleTakeReceiveTokenAccountSelect(tokenAccount: WalletTokenAccount) {
    setTakeTakerTaAInput(tokenAccount.address)
  }

  return {
    canRefund,
    canTake,
    handleLookupSubmit,
    handleRefundSubmit,
    handleRefundTokenAccountSelect,
    handleTakePaymentTokenAccountSelect,
    handleTakeReceiveTokenAccountSelect,
    handleTakeSubmit,
    isMakerRefundBlocked: !!lookupMakerAddress && lookupMakerAddress !== accountAddress,
    lookedUpEscrow,
    lookedUpEscrowDecodeError,
    lookedUpEscrowErrorMessage: lookedUpEscrow.isError ? formatEscrowUnknownError(lookedUpEscrow.error) : null,
    lookupError,
    lookupMakerInput,
    lookupStatusLabel,
    lookupStatusVariant,
    lookupVaultTaAInput,
    refundMakerTaAInput,
    refundTokenAccounts,
    requestedCirclePreset,
    setLookupMakerInput,
    setLookupVaultTaAInput,
    setRefundMakerTaAInput,
    setTakeTakerTaAInput,
    setTakeTakerTaBInput,
    takePaymentAccountMissing,
    takePaymentTokenAccounts,
    takeReceiveTokenAccounts,
    takeTakerTaAInput,
    takeTakerTaBInput,
  }
}

function getInitialLookupState(savedOffer: null | SavedEscrowOffer) {
  if (!savedOffer) {
    return {
      lookupError: null,
      lookupMakerAddress: null,
      lookupMakerInput: '',
      lookupVaultTaAInput: '',
    }
  }

  try {
    return {
      lookupError: null,
      lookupMakerAddress: address(savedOffer.offerPayload.maker),
      lookupMakerInput: savedOffer.offerPayload.maker,
      lookupVaultTaAInput: savedOffer.offerPayload.vaultTaA,
    }
  } catch {
    return {
      lookupError: 'The saved offer contains an invalid maker address.',
      lookupMakerAddress: null,
      lookupMakerInput: savedOffer.offerPayload.maker,
      lookupVaultTaAInput: savedOffer.offerPayload.vaultTaA,
    }
  }
}
