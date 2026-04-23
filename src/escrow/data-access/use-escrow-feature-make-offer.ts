import type { FormEvent } from 'react'

import { useState } from 'react'

import type { EscrowFeatureMakeOfferProps } from '@/escrow/data-access/escrow-feature-types'
import type { WalletTokenAccount } from '@/wallet/data-access/get-token-accounts-by-owner'

import { calculateCircleDemoReceiveAmount } from '@/escrow/util/escrow-circle-demo'
import { filterEscrowTokenAccountsByMint, findPreferredEscrowTokenAccount } from '@/escrow/util/escrow-token-accounts'

export function useEscrowFeatureMakeOffer({
  classicTokenAccounts,
  onOfferCreated,
  onSubmit,
}: {
  classicTokenAccounts: EscrowFeatureMakeOfferProps['classicTokenAccounts']
  onOfferCreated: EscrowFeatureMakeOfferProps['onOfferCreated']
  onSubmit: EscrowFeatureMakeOfferProps['onSubmit']
}) {
  const [makeDepositInput, setMakeDepositInput] = useState('1337')
  const [makeMakerTaAInput, setMakeMakerTaAInput] = useState('')
  const [makeMakerTaBInput, setMakeMakerTaBInput] = useState('')
  const [makeMintAInput, setMakeMintAInput] = useState('')
  const [makeMintBInput, setMakeMintBInput] = useState('')
  const [makeReceiveInput, setMakeReceiveInput] = useState('733')
  const [makeVaultTaAInput, setMakeVaultTaAInput] = useState('')
  const makeDepositTokenAccounts = filterEscrowTokenAccountsByMint(classicTokenAccounts, makeMintAInput)
  const makeReceiveTokenAccounts = filterEscrowTokenAccountsByMint(classicTokenAccounts, makeMintBInput)
  const selectedDepositTokenAccount =
    classicTokenAccounts.find((tokenAccount) => tokenAccount.address === makeMakerTaAInput) ?? null
  const selectedMakerReceiveTokenAccount =
    classicTokenAccounts.find((tokenAccount) => tokenAccount.address === makeMakerTaBInput) ?? null
  const receiveAmountDescription = calculateCircleDemoReceiveAmount({
    depositAmount: makeDepositInput,
    depositMint: makeMintAInput,
    requestedMint: makeMintBInput,
  })
    ? 'Auto-calculated with the Circle demo rate of 1 EUR = 1.2 USD. You can still edit this manually.'
    : 'Raw u64 amount of requested mint tokens the taker must send.'

  async function handleMakeSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const result = await onSubmit({
      deposit: makeDepositInput,
      makerTaA: makeMakerTaAInput,
      makerTaB: makeMakerTaBInput,
      mintA: makeMintAInput,
      mintB: makeMintBInput,
      receive: makeReceiveInput,
      vaultTaA: makeVaultTaAInput,
    })

    if (result?.details.offerPayload) {
      onOfferCreated(result.details.offerPayload)
    }
  }

  function applyCircleDemoPair({ depositMint, requestedMint }: { depositMint: string; requestedMint: string }) {
    const depositTokenAccount = findPreferredEscrowTokenAccount(classicTokenAccounts, depositMint)
    const makerReceiveTokenAccount = findPreferredEscrowTokenAccount(classicTokenAccounts, requestedMint)
    const nextDepositAmount = depositTokenAccount?.rawAmount ?? makeDepositInput
    const nextReceiveAmount = calculateCircleDemoReceiveAmount({
      depositAmount: nextDepositAmount,
      depositMint,
      requestedMint,
    })

    setMakeMakerTaAInput(depositTokenAccount?.address ?? '')
    setMakeMakerTaBInput(makerReceiveTokenAccount?.address ?? '')
    setMakeMintAInput(depositMint)
    setMakeMintBInput(requestedMint)

    if (depositTokenAccount) {
      setMakeDepositInput(depositTokenAccount.rawAmount)
    }

    if (nextReceiveAmount) {
      setMakeReceiveInput(nextReceiveAmount)
    }
  }

  function handleDepositAmountChange(value: string) {
    setMakeDepositInput(value)

    const nextReceiveAmount = calculateCircleDemoReceiveAmount({
      depositAmount: value,
      depositMint: makeMintAInput,
      requestedMint: makeMintBInput,
    })

    if (nextReceiveAmount) {
      setMakeReceiveInput(nextReceiveAmount)
    }
  }

  function handleDepositMintSelect(mint: string) {
    setMakeMintAInput(mint)

    if (selectedDepositTokenAccount && selectedDepositTokenAccount.mint !== mint) {
      setMakeMakerTaAInput('')
    }

    const nextReceiveAmount = calculateCircleDemoReceiveAmount({
      depositAmount: makeDepositInput,
      depositMint: mint,
      requestedMint: makeMintBInput,
    })

    if (nextReceiveAmount) {
      setMakeReceiveInput(nextReceiveAmount)
    }
  }

  function handleDepositTokenAccountSelect(tokenAccount: WalletTokenAccount) {
    setMakeMakerTaAInput(tokenAccount.address)
    setMakeMintAInput(tokenAccount.mint)
    setMakeDepositInput(tokenAccount.rawAmount)

    const nextReceiveAmount = calculateCircleDemoReceiveAmount({
      depositAmount: tokenAccount.rawAmount,
      depositMint: tokenAccount.mint,
      requestedMint: makeMintBInput,
    })

    if (nextReceiveAmount) {
      setMakeReceiveInput(nextReceiveAmount)
    }
  }

  function handleMakerReceiveTokenAccountSelect(tokenAccount: WalletTokenAccount) {
    setMakeMakerTaBInput(tokenAccount.address)
    setMakeMintBInput(tokenAccount.mint)
  }

  function handleRequestedMintSelect(mint: string) {
    setMakeMintBInput(mint)

    if (selectedMakerReceiveTokenAccount && selectedMakerReceiveTokenAccount.mint !== mint) {
      setMakeMakerTaBInput('')
    }

    const nextReceiveAmount = calculateCircleDemoReceiveAmount({
      depositAmount: makeDepositInput,
      depositMint: makeMintAInput,
      requestedMint: mint,
    })

    if (nextReceiveAmount) {
      setMakeReceiveInput(nextReceiveAmount)
    }
  }

  return {
    applyCircleDemoPair,
    depositAmountDescription: selectedDepositTokenAccount
      ? `Prefilled from the selected account balance: ${selectedDepositTokenAccount.uiAmountString} tokens, raw ${selectedDepositTokenAccount.rawAmount}. Edit this if you want to escrow less than the full balance.`
      : 'Raw u64 amount of deposit mint tokens to escrow. Choose a deposit account above to prefill this from its raw balance.',
    handleDepositAmountChange,
    handleDepositMintSelect,
    handleDepositTokenAccountSelect,
    handleMakerReceiveTokenAccountSelect,
    handleMakeSubmit,
    handleRequestedMintSelect,
    makeDepositInput,
    makeDepositTokenAccounts,
    makeMakerTaAInput,
    makeMakerTaBInput,
    makeMintAInput,
    makeMintBInput,
    makeReceiveInput,
    makeReceiveTokenAccounts,
    makeVaultTaAInput,
    receiveAmountDescription,
    setMakeMakerTaAInput,
    setMakeMakerTaBInput,
    setMakeMintAInput,
    setMakeMintBInput,
    setMakeReceiveInput,
    setMakeVaultTaAInput,
  }
}
