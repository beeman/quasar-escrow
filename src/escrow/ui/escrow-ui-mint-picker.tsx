import type { EscrowMintOption } from '@/escrow/util/escrow-circle-demo'

export function EscrowUiMintPicker({
  label,
  onSelect,
  options,
  selectedMint,
}: {
  label: string
  onSelect(mint: string): void
  options: EscrowMintOption[]
  selectedMint: string
}) {
  const presetOptions = options.filter((option) => option.source === 'preset')
  const selectedValue = options.some((option) => option.mint === selectedMint) ? selectedMint : '__manual__'
  const walletOptions = options.filter((option) => option.source === 'wallet')

  return (
    <select
      aria-label={`Choose ${label}`}
      className="h-9 w-full min-w-0 rounded-xl border border-input bg-background/70 px-3 py-1.5 text-xs/relaxed transition-colors outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30"
      onChange={(event) => {
        if (event.target.value === '__manual__') {
          return
        }

        onSelect(event.target.value)
      }}
      value={selectedValue}
    >
      <option value="__manual__">Choose preset or connected wallet mint (optional)</option>
      {presetOptions.length ? (
        <optgroup label="Circle Devnet presets">
          {presetOptions.map((option) => (
            <option key={`preset:${option.mint}`} value={option.mint}>
              {option.label}
            </option>
          ))}
        </optgroup>
      ) : null}
      {walletOptions.length ? (
        <optgroup label="Connected wallet mints">
          {walletOptions.map((option) => (
            <option key={`wallet:${option.mint}`} value={option.mint}>
              {option.label}
            </option>
          ))}
        </optgroup>
      ) : null}
    </select>
  )
}
