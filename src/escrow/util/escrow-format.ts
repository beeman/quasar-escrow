import type { EscrowOfferPayload } from '@/escrow/data-access/use-escrow-program-mutation'

export function formatEscrowAddress(value: string) {
  return `${value.slice(0, 8)}...${value.slice(-8)}`
}

export function formatEscrowOfferPayload(offerPayload: EscrowOfferPayload) {
  return JSON.stringify(
    {
      depositAmount: offerPayload.deposit,
      depositMint: offerPayload.mintA,
      escrowPda: offerPayload.escrow,
      escrowVaultTokenAccount: offerPayload.vaultTaA,
      makerAddress: offerPayload.maker,
      makerReceiveTokenAccount: offerPayload.makerTaB,
      receiveAmount: offerPayload.receive,
      requestedMint: offerPayload.mintB,
    },
    null,
    2,
  )
}

export function formatEscrowSavedOfferCreatedAt(createdAt: string) {
  return createdAt.replace('T', ' ').replace(/\.\d{3}Z$/, ' UTC')
}

export function formatEscrowUnknownError(error: unknown) {
  return error instanceof Error ? error.message : 'Unknown error occurred'
}
