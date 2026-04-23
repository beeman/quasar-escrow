import type { EscrowOfferPayload } from '@/escrow/data-access/use-escrow-program-mutation'

const ESCROW_ACTIVE_TAB_STORAGE_KEY = 'quasar-escrow:active-tab'
const ESCROW_SAVED_OFFERS_STORAGE_KEY = 'quasar-escrow:saved-offers'

export type EscrowTab = 'latest' | 'make' | 'saved' | 'use'

export interface SavedEscrowOffer {
  clusterId: string
  createdAt: string
  offerPayload: EscrowOfferPayload
}

export function isEscrowTab(value: string): value is EscrowTab {
  return value === 'latest' || value === 'make' || value === 'saved' || value === 'use'
}

export function readEscrowActiveTab(): EscrowTab {
  const localStorage = getLocalStorage()

  if (!localStorage) {
    return 'make'
  }

  try {
    const value = localStorage.getItem(ESCROW_ACTIVE_TAB_STORAGE_KEY)

    return value && isEscrowTab(value) ? value : 'make'
  } catch {
    return 'make'
  }
}

export function readEscrowSavedOffers(): SavedEscrowOffer[] {
  const localStorage = getLocalStorage()

  if (!localStorage) {
    return []
  }

  try {
    const value = localStorage.getItem(ESCROW_SAVED_OFFERS_STORAGE_KEY)

    if (!value) {
      return []
    }

    const parsed = JSON.parse(value)

    return Array.isArray(parsed)
      ? parsed.filter(isSavedEscrowOffer).sort((left, right) => right.createdAt.localeCompare(left.createdAt))
      : []
  } catch {
    return []
  }
}

export function writeEscrowActiveTab(value: EscrowTab) {
  const localStorage = getLocalStorage()

  if (!localStorage) {
    return
  }

  try {
    localStorage.setItem(ESCROW_ACTIVE_TAB_STORAGE_KEY, value)
  } catch {
    // Ignore storage write failures.
  }
}

export function writeEscrowSavedOffers(savedOffers: SavedEscrowOffer[]) {
  const localStorage = getLocalStorage()

  if (!localStorage) {
    return
  }

  try {
    localStorage.setItem(ESCROW_SAVED_OFFERS_STORAGE_KEY, JSON.stringify(savedOffers))
  } catch {
    // Ignore storage write failures.
  }
}

function getLocalStorage(): null | Storage {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    return window.localStorage
  } catch {
    return null
  }
}

function isEscrowOfferPayload(value: unknown): value is EscrowOfferPayload {
  if (!value || typeof value !== 'object') {
    return false
  }

  const payload = value as Record<string, unknown>

  return (
    typeof payload.deposit === 'string' &&
    typeof payload.escrow === 'string' &&
    typeof payload.maker === 'string' &&
    typeof payload.makerTaB === 'string' &&
    typeof payload.mintA === 'string' &&
    typeof payload.mintB === 'string' &&
    typeof payload.receive === 'string' &&
    typeof payload.vaultTaA === 'string'
  )
}

function isSavedEscrowOffer(value: unknown): value is SavedEscrowOffer {
  if (!value || typeof value !== 'object') {
    return false
  }

  const savedOffer = value as Record<string, unknown>

  return (
    typeof savedOffer.clusterId === 'string' &&
    typeof savedOffer.createdAt === 'string' &&
    isEscrowOfferPayload(savedOffer.offerPayload)
  )
}
