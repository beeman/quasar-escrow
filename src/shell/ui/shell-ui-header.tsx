import { Link, NavLink } from 'react-router'

import { ThemeToggle } from '@/core/ui/theme-toggle'
import { cn } from '@/core/util/utils'
import { SolanaUiClusterDropdown } from '@/solana/ui/solana-ui-cluster-dropdown'
import { SolanaUiWalletDialog } from '@/solana/ui/solana-ui-wallet-dialog'

export interface HeaderLink {
  label: string
  to: string
}
export function ShellUiHeader({ links }: { links: HeaderLink[] }) {
  return (
    <header className="sticky top-0 z-40 px-4 pt-4">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 rounded-[1.75rem] border border-border/70 bg-background/80 px-4 py-4 shadow-[0_24px_80px_-56px_rgb(15_23_42/0.85)] backdrop-blur-xl sm:px-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <Link className="flex min-w-0 items-center gap-3" to="/">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary/12 text-sm font-semibold text-primary ring-1 ring-primary/20">
              QE
            </span>
            <span className="min-w-0">
              <span className="block text-[0.625rem] font-medium tracking-[0.32em] text-muted-foreground uppercase">
                Solana escrow
              </span>
              <span className="block truncate text-lg font-semibold tracking-tight">Quasar Escrow</span>
            </span>
          </Link>
          <nav aria-label="Primary" className="flex flex-wrap items-center gap-2">
            {links.map((link) => (
              <NavLink
                className={({ isActive }) =>
                  cn(
                    'rounded-full px-3 py-2 text-sm font-medium transition-all',
                    isActive
                      ? 'bg-foreground text-background shadow-sm'
                      : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground',
                  )
                }
                key={link.to}
                to={link.to}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
          <SolanaUiClusterDropdown />
          <SolanaUiWalletDialog />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
