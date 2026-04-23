import { Sparkles } from 'lucide-react'

import type { EscrowFeatureMakeOfferProps } from '@/escrow/data-access/escrow-feature-types'

import { Badge } from '@/core/ui/badge'
import { Button } from '@/core/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/ui/card'
import { FieldGroup } from '@/core/ui/field'
import { Spinner } from '@/core/ui/spinner'
import { useEscrowFeatureMakeOffer } from '@/escrow/data-access/use-escrow-feature-make-offer'
import { EscrowUiAddressField } from '@/escrow/ui/escrow-ui-address-field'
import { EscrowUiAmountField } from '@/escrow/ui/escrow-ui-amount-field'
import { EscrowUiFormStep } from '@/escrow/ui/escrow-ui-form-step'
import { EscrowUiMintPicker } from '@/escrow/ui/escrow-ui-mint-picker'
import { EscrowUiTokenAccountPicker } from '@/escrow/ui/escrow-ui-token-account-picker'
import { CIRCLE_DEVNET_EURC_MINT, CIRCLE_DEVNET_USDC_MINT, CIRCLE_FAUCET_URL } from '@/escrow/util/escrow-circle-demo'
import { SolanaUiExplorerLink } from '@/solana/ui/solana-ui-explorer-link'

export function EscrowFeatureMakeOffer({
  canMake,
  classicTokenAccounts,
  isDevnet,
  makeMintOptions,
  mutationIsLoading,
  mutationLastAction,
  onOfferCreated,
  onSubmit,
  tokenAccountsState,
}: EscrowFeatureMakeOfferProps) {
  const state = useEscrowFeatureMakeOffer({
    classicTokenAccounts,
    onOfferCreated,
    onSubmit,
  })

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle>Make Offer</CardTitle>
        <CardDescription>
          Choose existing token accounts from the connected wallet dropdowns or paste addresses manually. Leave the
          maker receive token account or escrow vault token account blank to generate a fresh signer-backed account in
          the browser.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={state.handleMakeSubmit}>
          {isDevnet ? (
            <div className="rounded-2xl border border-border/60 bg-background/40 p-5">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Demo</Badge>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Sparkles className="size-4 text-primary" />
                  Circle Devnet presets
                </div>
              </div>
              <div className="mt-1 text-xs/relaxed text-muted-foreground">
                Get devnet USDC or EURC from{' '}
                <a
                  className="underline underline-offset-4 hover:text-foreground"
                  href={CIRCLE_FAUCET_URL}
                  rel="noreferrer"
                  target="_blank"
                >
                  Circle&apos;s Testnet Faucet
                </a>{' '}
                and use the preset pairs below for a faster demo. The default demo rate is 1 EUR = 1.2 USD.
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  onClick={() =>
                    state.applyCircleDemoPair({
                      depositMint: CIRCLE_DEVNET_USDC_MINT,
                      requestedMint: CIRCLE_DEVNET_EURC_MINT,
                    })
                  }
                  type="button"
                  variant="outline"
                >
                  Use USDC → EURC
                </Button>
                <Button
                  onClick={() =>
                    state.applyCircleDemoPair({
                      depositMint: CIRCLE_DEVNET_EURC_MINT,
                      requestedMint: CIRCLE_DEVNET_USDC_MINT,
                    })
                  }
                  type="button"
                  variant="outline"
                >
                  Use EURC → USDC
                </Button>
              </div>
              <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                <SolanaUiExplorerLink
                  className="inline-flex gap-1 break-all"
                  label="Devnet EURC mint"
                  path={`/address/${CIRCLE_DEVNET_EURC_MINT}`}
                />
                <SolanaUiExplorerLink
                  className="inline-flex gap-1 break-all"
                  label="Devnet USDC mint"
                  path={`/address/${CIRCLE_DEVNET_USDC_MINT}`}
                />
              </div>
            </div>
          ) : null}
          <EscrowUiFormStep
            description="Pick the token account that already holds the deposit. Choosing from the connected wallet also fills the deposit mint and the full raw balance."
            step="Step 1"
            title="Choose what to deposit"
          />
          <FieldGroup>
            <EscrowUiAddressField
              description="Choose a deposit account from the connected wallet or paste one manually. Picking from the list also fills the deposit mint and raw deposit amount."
              label="Deposit token account"
              onChange={state.setMakeMakerTaAInput}
              picker={
                <EscrowUiTokenAccountPicker
                  accounts={state.makeDepositTokenAccounts}
                  label="deposit token account"
                  onSelect={state.handleDepositTokenAccountSelect}
                  selectedAddress={state.makeMakerTaAInput}
                  state={tokenAccountsState}
                />
              }
              placeholder="Existing deposit token account"
              value={state.makeMakerTaAInput}
            />
            <EscrowUiAddressField
              description="Mint the maker is depositing into the escrow vault. This fills automatically when you pick a deposit token account."
              label="Deposit mint"
              onChange={state.setMakeMintAInput}
              picker={
                <EscrowUiMintPicker
                  label="deposit mint"
                  onSelect={state.handleDepositMintSelect}
                  options={makeMintOptions}
                  selectedMint={state.makeMintAInput}
                />
              }
              placeholder="Deposit mint"
              value={state.makeMintAInput}
            />
            <EscrowUiAmountField
              description={state.depositAmountDescription}
              label="Deposit amount"
              onChange={state.handleDepositAmountChange}
              placeholder="1337"
              value={state.makeDepositInput}
            />
          </FieldGroup>
          <EscrowUiFormStep
            description="Define what the maker wants back when the taker completes the escrow."
            step="Step 2"
            title="Choose what you want in return"
          />
          <FieldGroup>
            <EscrowUiAddressField
              description="Mint the maker expects to receive from the taker. This fills automatically when you pick a maker receive token account."
              label="Requested mint"
              onChange={state.setMakeMintBInput}
              picker={
                <EscrowUiMintPicker
                  label="requested mint"
                  onSelect={state.handleRequestedMintSelect}
                  options={makeMintOptions}
                  selectedMint={state.makeMintBInput}
                />
              }
              placeholder="Requested mint"
              value={state.makeMintBInput}
            />
            <EscrowUiAmountField
              description={state.receiveAmountDescription}
              label="Receive amount"
              onChange={state.setMakeReceiveInput}
              placeholder="733"
              value={state.makeReceiveInput}
            />
          </FieldGroup>
          <EscrowUiFormStep
            description="Use existing destination accounts if you have them, or let the browser generate fresh signer-backed accounts for the maker receive account and escrow vault."
            step="Step 3"
            title="Choose destination accounts"
          />
          <FieldGroup>
            <EscrowUiAddressField
              description="Optional. Pick an existing receive account from the connected wallet or leave this blank to create a fresh maker-side receive account."
              label="Maker receive token account"
              onChange={state.setMakeMakerTaBInput}
              picker={
                <EscrowUiTokenAccountPicker
                  accounts={state.makeReceiveTokenAccounts}
                  label="maker receive token account"
                  onSelect={state.handleMakerReceiveTokenAccountSelect}
                  selectedAddress={state.makeMakerTaBInput}
                  state={tokenAccountsState}
                />
              }
              placeholder="Optional existing maker receive token account"
              value={state.makeMakerTaBInput}
            />
            <EscrowUiAddressField
              description="Optional. Leave blank to create a fresh vault token account signer."
              label="Escrow vault token account"
              onChange={state.setMakeVaultTaAInput}
              placeholder="Optional existing escrow vault token account"
              value={state.makeVaultTaAInput}
            />
          </FieldGroup>
          <EscrowUiFormStep
            description="Submit the make transaction. Once it confirms, the payload card will show the shareable offer details for takers and save them in this browser."
            step="Step 4"
            title="Create the offer"
          />
          <Button className="w-full" disabled={!canMake} type="submit">
            {mutationIsLoading && mutationLastAction === 'make' ? <Spinner /> : null}
            {mutationIsLoading && mutationLastAction === 'make' ? 'Sending make...' : 'Create escrow offer'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
