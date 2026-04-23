'use client'

import { useWalletUiCluster } from '@wallet-ui/react'

import { Button } from '@/core/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/core/ui/dropdown-menu'
import { cn } from '@/core/util/utils'

export function SolanaUiClusterDropdown({ className }: { className?: string }) {
  const { cluster, clusters, setCluster } = useWalletUiCluster()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            className={cn('h-10 min-w-28 justify-between gap-2 rounded-xl bg-background/70 px-3 text-sm', className)}
            variant="outline"
          />
        }
      >
        <span className="truncate">{cluster.label}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {clusters.map((availableCluster) => (
          <DropdownMenuItem key={availableCluster.id} onClick={() => setCluster(availableCluster.id)}>
            {availableCluster.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
