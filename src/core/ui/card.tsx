import * as React from 'react'

import { cn } from '@/core/util/utils'

function Card({ className, size = 'default', ...props }: { size?: 'default' | 'sm' } & React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'group/card flex flex-col gap-4 overflow-hidden rounded-[1.5rem] border border-border/70 bg-card py-4 text-xs/relaxed text-card-foreground shadow-[0_24px_80px_-56px_rgb(15_23_42/0.85)] ring-1 ring-white/5 backdrop-blur-sm has-[>img:first-child]:pt-0 data-[size=sm]:gap-3 data-[size=sm]:py-3 *:[img:first-child]:rounded-t-[1.5rem] *:[img:last-child]:rounded-b-[1.5rem]',
        className,
      )}
      data-size={size}
      data-slot="card"
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className)}
      data-slot="card-action"
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('px-5 group-data-[size=sm]/card:px-4', className)} data-slot="card-content" {...props} />
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('text-xs/relaxed text-muted-foreground', className)} data-slot="card-description" {...props} />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex items-center rounded-b-[1.5rem] px-5 group-data-[size=sm]/card:px-4 [.border-t]:pt-4 group-data-[size=sm]/card:[.border-t]:pt-3',
        className,
      )}
      data-slot="card-footer"
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-[1.5rem] px-5 group-data-[size=sm]/card:px-4 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-4 group-data-[size=sm]/card:[.border-b]:pb-3',
        className,
      )}
      data-slot="card-header"
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('font-heading text-sm font-medium tracking-tight', className)}
      data-slot="card-title"
      {...props}
    />
  )
}

export { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle }
