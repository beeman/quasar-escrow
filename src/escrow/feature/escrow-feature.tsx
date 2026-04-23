import { EscrowFeatureConnected } from '@/escrow/feature/escrow-feature-connected'
import { SolanaUiWalletGuard } from '@/solana/ui/solana-ui-wallet-guard'

export function EscrowFeature() {
  return <SolanaUiWalletGuard render={EscrowFeatureConnected} />
}

export { EscrowFeature as Component }
