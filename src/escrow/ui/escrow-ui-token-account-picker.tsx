import type { WalletTokenAccountsState } from '@/wallet/data-access/use-wallet-token-accounts-query'

import { formatEscrowAddress } from '@/escrow/util/escrow-format'
import { type WalletTokenAccount } from '@/wallet/data-access/get-token-accounts-by-owner'

export function EscrowUiTokenAccountPicker({
  accounts,
  defaultLabel,
  emptyLabel,
  label,
  onSelect,
  selectedAddress,
  state,
}: {
  accounts: WalletTokenAccount[]
  defaultLabel?: string
  emptyLabel?: string
  label: string
  onSelect(tokenAccount: WalletTokenAccount): void
  selectedAddress: string
  state: WalletTokenAccountsState
}) {
  const isSelectable = state.status === 'success' && accounts.length > 0
  const selectedValue =
    state.status === 'success' && accounts.some((tokenAccount) => tokenAccount.address === selectedAddress)
      ? selectedAddress
      : '__manual__'

  return (
    <select
      aria-label={`Choose ${label} from connected wallet`}
      className="h-9 w-full min-w-0 rounded-xl border border-input bg-background/70 px-3 py-1.5 text-xs/relaxed transition-colors outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30"
      disabled={!isSelectable}
      onChange={(event) => {
        if (event.target.value === '__manual__') {
          return
        }

        const tokenAccount = accounts.find((account) => account.address === event.target.value)

        if (tokenAccount) {
          onSelect(tokenAccount)
        }
      }}
      value={selectedValue}
    >
      <option value="__manual__">{getTokenAccountPickerLabel(accounts, defaultLabel, emptyLabel, state)}</option>
      {accounts.map((tokenAccount) => (
        <option key={tokenAccount.address} value={tokenAccount.address}>
          {formatTokenAccountOption(tokenAccount)}
        </option>
      ))}
    </select>
  )
}

function formatTokenAccountOption(tokenAccount: WalletTokenAccount) {
  return `${tokenAccount.uiAmountString} ${tokenAccount.programLabel} | mint ${formatEscrowAddress(tokenAccount.mint)} | acct ${formatEscrowAddress(tokenAccount.address)}`
}

function getTokenAccountPickerLabel(
  accounts: WalletTokenAccount[],
  defaultLabel: string | undefined,
  emptyLabel: string | undefined,
  state: WalletTokenAccountsState,
) {
  switch (state.status) {
    case 'error':
      return 'Unable to load connected token accounts'
    case 'loading':
      return 'Loading connected token accounts...'
    case 'success':
      return accounts.length > 0
        ? (defaultLabel ?? 'Choose classic SPL Token account (optional)')
        : (emptyLabel ?? 'No matching classic SPL Token accounts')
  }
}
