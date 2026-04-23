import type { WalletTokenAccount } from '@/wallet/data-access/get-token-accounts-by-owner'

import { formatEscrowAddress } from '@/escrow/util/escrow-format'

const USD_PER_EUR_DENOMINATOR = 10n
const USD_PER_EUR_NUMERATOR = 12n

export interface EscrowMintOption {
  label: string
  mint: string
  source: 'preset' | 'wallet'
}

export const CIRCLE_DEVNET_EURC_MINT = 'HzwqbKZw8HxMN6bF2yFZNrht3c2iXXzpKcFu7uBEDKtr'
export const CIRCLE_DEVNET_USDC_MINT = '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'
export const CIRCLE_FAUCET_URL = 'https://faucet.circle.com'

export const CIRCLE_DEVNET_MINT_PRESETS = [
  {
    label: 'Circle Devnet EURC',
    mint: CIRCLE_DEVNET_EURC_MINT,
    symbol: 'EURC',
  },
  {
    label: 'Circle Devnet USDC',
    mint: CIRCLE_DEVNET_USDC_MINT,
    symbol: 'USDC',
  },
] as const

export function calculateCircleDemoReceiveAmount({
  depositAmount,
  depositMint,
  requestedMint,
}: {
  depositAmount: string
  depositMint: string
  requestedMint: string
}) {
  const trimmedDepositAmount = depositAmount.trim()

  if (!trimmedDepositAmount || !/^\d+$/.test(trimmedDepositAmount)) {
    return null
  }

  const amount = BigInt(trimmedDepositAmount)

  if (depositMint === CIRCLE_DEVNET_USDC_MINT && requestedMint === CIRCLE_DEVNET_EURC_MINT) {
    return ((amount * USD_PER_EUR_DENOMINATOR) / USD_PER_EUR_NUMERATOR).toString()
  }

  if (depositMint === CIRCLE_DEVNET_EURC_MINT && requestedMint === CIRCLE_DEVNET_USDC_MINT) {
    return ((amount * USD_PER_EUR_NUMERATOR) / USD_PER_EUR_DENOMINATOR).toString()
  }

  return null
}

export function getConnectedMintOptions(tokenAccounts: WalletTokenAccount[]): EscrowMintOption[] {
  return [...new Map(tokenAccounts.map((tokenAccount) => [tokenAccount.mint, tokenAccount])).values()]
    .map((tokenAccount) => ({
      label: `Connected wallet mint | ${formatEscrowAddress(tokenAccount.mint)}`,
      mint: tokenAccount.mint,
      source: 'wallet' as const,
    }))
    .sort((left, right) => left.mint.localeCompare(right.mint))
}

export function getMakeMintOptions(connectedMintOptions: EscrowMintOption[], isDevnet: boolean) {
  const presetMints = new Set<string>(CIRCLE_DEVNET_MINT_PRESETS.map((preset) => preset.mint))

  return [
    ...(isDevnet
      ? CIRCLE_DEVNET_MINT_PRESETS.map((preset) => ({
          label: `${preset.label} | ${formatEscrowAddress(preset.mint)}`,
          mint: preset.mint,
          source: 'preset' as const,
        }))
      : []),
    ...connectedMintOptions.filter((option) => !presetMints.has(option.mint)),
  ]
}
