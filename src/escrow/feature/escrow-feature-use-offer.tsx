import type { EscrowFeatureUseOfferProps } from '@/escrow/data-access/escrow-feature-types'

import { Alert, AlertDescription, AlertTitle } from '@/core/ui/alert'
import { Badge } from '@/core/ui/badge'
import { Button } from '@/core/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/ui/card'
import { FieldGroup } from '@/core/ui/field'
import { Spinner } from '@/core/ui/spinner'
import { useEscrowFeatureUseOffer } from '@/escrow/data-access/use-escrow-feature-use-offer'
import { EscrowUiAddressField } from '@/escrow/ui/escrow-ui-address-field'
import { EscrowUiFormStep } from '@/escrow/ui/escrow-ui-form-step'
import { EscrowUiSummary } from '@/escrow/ui/escrow-ui-summary'
import { EscrowUiTokenAccountPicker } from '@/escrow/ui/escrow-ui-token-account-picker'
import { CIRCLE_FAUCET_URL } from '@/escrow/util/escrow-circle-demo'

export function EscrowFeatureUseOffer({
  accountAddress,
  classicTokenAccounts,
  client,
  clusterId,
  isDevnet,
  mutationIsLoading,
  mutationLastAction,
  onRefundOffer,
  onTakeOffer,
  savedOffer,
  tokenAccountsState,
}: EscrowFeatureUseOfferProps) {
  const state = useEscrowFeatureUseOffer({
    accountAddress,
    classicTokenAccounts,
    client,
    clusterId,
    mutationIsLoading,
    onRefundOffer,
    onTakeOffer,
    savedOffer,
  })

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle>Lookup, Take, or Refund</CardTitle>
        <CardDescription>
          Load the maker PDA first, then supply the escrow vault token account from the shared offer so the taker or
          maker can complete the flow.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form className="space-y-4" onSubmit={state.handleLookupSubmit}>
          <EscrowUiFormStep
            description="Start with the maker wallet and the escrow vault token account from the shared offer payload."
            step="Step 1"
            title="Load the existing offer"
          />
          <FieldGroup>
            <EscrowUiAddressField
              description="Maker wallet address used to derive the escrow PDA."
              label="Maker address"
              onChange={state.setLookupMakerInput}
              placeholder="Maker wallet address"
              value={state.lookupMakerInput}
            />
            <EscrowUiAddressField
              description="Required off-chain because the escrow state does not store the vault token account."
              label="Escrow vault token account"
              onChange={state.setLookupVaultTaAInput}
              placeholder="Escrow vault token account from the offer payload"
              value={state.lookupVaultTaAInput}
            />
          </FieldGroup>
          <Button className="w-full" type="submit" variant="outline">
            Load offer
          </Button>
        </form>

        {state.lookupError ? (
          <Alert variant="destructive">
            <AlertTitle>Lookup error</AlertTitle>
            <AlertDescription>{state.lookupError}</AlertDescription>
          </Alert>
        ) : null}
        {state.lookedUpEscrowErrorMessage ? (
          <Alert variant="destructive">
            <AlertTitle>Unable to load the requested escrow</AlertTitle>
            <AlertDescription>{state.lookedUpEscrowErrorMessage}</AlertDescription>
          </Alert>
        ) : null}
        {state.lookedUpEscrow.programMessage ? (
          <Alert variant={state.lookedUpEscrowDecodeError ? 'destructive' : 'default'}>
            <AlertTitle>
              {state.lookedUpEscrowDecodeError ? 'Loaded escrow is unreadable' : 'Program unavailable on this cluster'}
            </AlertTitle>
            <AlertDescription>{state.lookedUpEscrow.programMessage}</AlertDescription>
          </Alert>
        ) : null}

        <div className="rounded-2xl border border-border/60 bg-background/40 p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-medium">Loaded offer</div>
            <Badge variant={state.lookupStatusVariant}>{state.lookupStatusLabel}</Badge>
          </div>
          <div className="mt-1 text-xs/relaxed text-muted-foreground">
            {state.lookedUpEscrow.escrow
              ? 'Maker, mint, and receive fields come from the decoded escrow account. Only taker-side accounts remain editable.'
              : 'Enter a maker address to derive the PDA and inspect whether an escrow is currently open.'}
          </div>
          {state.lookedUpEscrow.escrow ? (
            <EscrowUiSummary escrow={state.lookedUpEscrow.escrow} escrowAddress={state.lookedUpEscrow.escrowAddress} />
          ) : null}
        </div>

        <form
          className="space-y-4 rounded-2xl border border-border/60 bg-background/40 p-5"
          onSubmit={state.handleTakeSubmit}
        >
          <EscrowUiFormStep
            description="Pick the connected wallet accounts that will pay the requested mint and receive the deposited mint."
            step="Step 2"
            title="Take the offer"
          />
          {state.takePaymentAccountMissing ? (
            <Alert>
              <AlertTitle>Payment account required</AlertTitle>
              <AlertDescription>
                The connected taker wallet needs a classic SPL Token payment account for the requested mint before this
                offer can be taken.
                {isDevnet && state.requestedCirclePreset ? (
                  <>
                    {' '}
                    Get devnet {state.requestedCirclePreset.symbol} from{' '}
                    <a
                      className="underline underline-offset-4 hover:text-foreground"
                      href={CIRCLE_FAUCET_URL}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Circle&apos;s Testnet Faucet
                    </a>{' '}
                    and then select the funded account here.
                  </>
                ) : null}
              </AlertDescription>
            </Alert>
          ) : null}
          <FieldGroup>
            <EscrowUiAddressField
              description="Optional. Pick an existing receive account from the connected wallet or leave this blank to generate a fresh taker-side receive account."
              label="Taker receive token account"
              onChange={state.setTakeTakerTaAInput}
              picker={
                <EscrowUiTokenAccountPicker
                  accounts={state.takeReceiveTokenAccounts}
                  defaultLabel="Choose classic SPL Token account (optional)"
                  emptyLabel="No matching classic SPL Token accounts"
                  label="taker receive token account"
                  onSelect={state.handleTakeReceiveTokenAccountSelect}
                  selectedAddress={state.takeTakerTaAInput}
                  state={tokenAccountsState}
                />
              }
              placeholder="Optional existing taker receive token account"
              value={state.takeTakerTaAInput}
            />
            <EscrowUiAddressField
              description="Existing payment account in the connected wallet that holds the requested mint."
              label="Taker payment token account"
              onChange={state.setTakeTakerTaBInput}
              picker={
                <EscrowUiTokenAccountPicker
                  accounts={state.takePaymentTokenAccounts}
                  defaultLabel="Choose classic SPL Token account (required)"
                  emptyLabel="No matching classic SPL Token accounts for requested mint"
                  label="taker payment token account"
                  onSelect={state.handleTakePaymentTokenAccountSelect}
                  selectedAddress={state.takeTakerTaBInput}
                  state={tokenAccountsState}
                />
              }
              placeholder="Existing taker payment token account"
              value={state.takeTakerTaBInput}
            />
          </FieldGroup>
          <Button className="w-full" disabled={!state.canTake} type="submit">
            {mutationIsLoading && mutationLastAction === 'take' ? <Spinner /> : null}
            {mutationIsLoading && mutationLastAction === 'take' ? 'Sending take...' : 'Take escrow offer'}
          </Button>
        </form>

        <form
          className="space-y-4 rounded-2xl border border-border/60 bg-background/40 p-5"
          onSubmit={state.handleRefundSubmit}
        >
          <EscrowUiFormStep
            description="If you are the maker, choose where the deposited tokens should go back when you refund the escrow."
            step="Step 3"
            title="Refund the offer"
          />
          {state.isMakerRefundBlocked ? (
            <Alert>
              <AlertTitle>Maker-only action</AlertTitle>
              <AlertDescription>
                The connected wallet must match the loaded maker address to refund this escrow.
              </AlertDescription>
            </Alert>
          ) : null}
          <FieldGroup>
            <EscrowUiAddressField
              description="Existing deposit-mint token account in the connected wallet that should receive the refunded balance."
              label="Refund destination token account"
              onChange={state.setRefundMakerTaAInput}
              picker={
                <EscrowUiTokenAccountPicker
                  accounts={state.refundTokenAccounts}
                  label="refund destination token account"
                  onSelect={state.handleRefundTokenAccountSelect}
                  selectedAddress={state.refundMakerTaAInput}
                  state={tokenAccountsState}
                />
              }
              placeholder="Refund destination token account"
              value={state.refundMakerTaAInput}
            />
          </FieldGroup>
          <Button className="w-full" disabled={!state.canRefund} type="submit" variant="destructive">
            {mutationIsLoading && mutationLastAction === 'refund' ? <Spinner /> : null}
            {mutationIsLoading && mutationLastAction === 'refund' ? 'Sending refund...' : 'Refund escrow offer'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
