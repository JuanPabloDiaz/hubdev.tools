import { Bookmark, BookOpen, Code2, FlaskConical, Layers3, Sparkles } from 'lucide-react'

import type { CollectionColorKey, CollectionIconKey } from '@/types/collection'
import { cn } from '@/utils/styles'

const icons = {
  layers: Layers3,
  code: Code2,
  sparkles: Sparkles,
  book: BookOpen,
  flask: FlaskConical,
  bookmark: Bookmark
} satisfies Record<CollectionIconKey, typeof Layers3>

const colors = {
  violet: 'bg-violet-600 text-white dark:bg-violet-600 dark:text-white',
  emerald: 'bg-emerald-600 text-white dark:bg-emerald-600 dark:text-white',
  blue: 'bg-blue-600 text-white dark:bg-blue-600 dark:text-white',
  amber: 'bg-amber-500 text-amber-950 dark:bg-amber-500 dark:text-amber-950',
  rose: 'bg-rose-600 text-white dark:bg-rose-600 dark:text-white',
  cyan: 'bg-cyan-500 text-cyan-950 dark:bg-cyan-500 dark:text-cyan-950'
} satisfies Record<CollectionColorKey, string>

export function CollectionAppearance({
  icon,
  color,
  className
}: {
  icon: CollectionIconKey
  color: CollectionColorKey
  className?: string
}) {
  const Icon = icons[icon]

  return (
    <span
      className={cn(
        'grid size-11 shrink-0 place-items-center rounded-xl shadow-sm',
        colors[color],
        className
      )}
    >
      <Icon className='size-5' />
    </span>
  )
}
