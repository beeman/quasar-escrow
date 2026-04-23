import { type PropsWithChildren, Suspense } from 'react'
import { Outlet } from 'react-router'

import { ShellUiFooter } from '../ui/shell-ui-footer'
import { type HeaderLink, ShellUiHeader } from '../ui/shell-ui-header'

export default function ShellFeatureLayout({
  children = <Outlet />,
  links,
}: PropsWithChildren<{ links: HeaderLink[] }>) {
  return (
    <div className="relative flex h-full min-h-screen w-full flex-col">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top,var(--color-primary),transparent_65%)] opacity-10 blur-3xl" />
        <div className="absolute top-40 -right-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,var(--color-accent),transparent_70%)] opacity-20 blur-3xl" />
      </div>
      <ShellUiHeader links={links} />
      <main className="relative min-h-0 flex-1 overflow-auto">
        <Suspense>{children}</Suspense>
      </main>
      <ShellUiFooter />
    </div>
  )
}
