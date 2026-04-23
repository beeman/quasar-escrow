import type { WalletTokenAccount } from '@/wallet/data-access/get-token-accounts-by-owner'

export function filterEscrowTokenAccountsByMint(tokenAccounts: WalletTokenAccount[], mint: string) {
  const trimmedMint = mint.trim()

  if (!trimmedMint) {
    return tokenAccounts
  }

  return tokenAccounts.filter((tokenAccount) => tokenAccount.mint === trimmedMint)
}

export function findPreferredEscrowTokenAccount(tokenAccounts: WalletTokenAccount[], mint: string) {
  return [...tokenAccounts]
    .filter((tokenAccount) => tokenAccount.mint === mint)
    .sort((left, right) => {
      const leftAmount = BigInt(left.rawAmount)
      const rightAmount = BigInt(right.rawAmount)

      if (leftAmount === rightAmount) {
        return left.address.localeCompare(right.address)
      }

      return rightAmount > leftAmount ? 1 : -1
    })[0]
}
