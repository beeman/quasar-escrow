export function ShellUiFooter() {
  return (
    <footer className="px-4 pt-2 pb-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 rounded-[1.5rem] border border-border/60 bg-background/70 px-4 py-3 text-xs text-muted-foreground backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <div>Wallet-driven playground for maker, taker, and refund escrow flows on Solana.</div>
        <div>
          Built with{' '}
          <a
            className="font-medium text-foreground hover:text-primary"
            href="https://github.com/create-seed/create-seed"
            rel="noreferrer"
            target="_blank"
          >
            create-seed
          </a>
        </div>
      </div>
    </footer>
  )
}
