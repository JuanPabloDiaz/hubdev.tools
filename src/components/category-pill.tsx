'use client'

import {
  Sparkles,
  FileText,
  BookOpen,
  Database,
  ChartNoAxesCombined,
  HardDrive,
  Mail,
  Server,
  Shapes,
  Palette,
  FlaskConical,
  CheckSquare,
  Code2,
  Search,
  Heart
} from 'lucide-react'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/utils/styles'

import { plusJakartaSans } from '@/fonts'

const categories = [
  { id: 'ai', icon: Sparkles },
  { id: 'development', icon: Code2 },
  { id: 'database', icon: Database },
  { id: 'analytics', icon: ChartNoAxesCombined },
  { id: 'storage', icon: HardDrive },
  { id: 'email', icon: Mail },
  { id: 'ui-design', icon: Palette },
  { id: 'testing', icon: FlaskConical },
  { id: 'infrastructure', icon: Server },
  { id: 'documentation', icon: FileText },
  { id: 'learning', icon: BookOpen },
  { id: 'productivity', icon: CheckSquare },
  { id: 'discover', icon: Search },
  { id: 'favorites', icon: Heart }
]

function getIconBySlug({ slug }: { slug: string }) {
  return categories.find((cat) => cat.id === slug)?.icon ?? Shapes
}

type CategoryProps = {
  name: string
  slug: string
  href: string
  resourceCount?: number
}

export function CategoryPill({ name, slug, href, resourceCount }: CategoryProps) {
  const pathname = usePathname()
  const isActive =
    pathname === href || pathname.startsWith(`${href}/`)
  const Icon = getIconBySlug({ slug })

  return (
    <Link
      href={href}
      className={cn(
        plusJakartaSans.className,
        'flex items-center gap-3 px-4 py-2 rounded-xl backdrop-filter text-sm whitespace-nowrap text-foreground backdrop-blur-sm',
        isActive
          ? 'bg-light-700/50 dark:bg-white/5 text-light-900 border-light-600 dark:text-purple-300 border dark:border-purple-300/20'
          : 'hover:bg-light-600/40 dark:hover:bg-purple-300/10 dark:hover:text-purple-300 dark:hover:border-purple-300/20'
      )}
    >
      <Icon className='size-4 shrink-0' />
      <span>{name}</span>
      {resourceCount ? (
        <small
          className='ml-auto pl-3 tabular-nums text-muted-foreground'
          aria-label={`${resourceCount} resources`}
        >
          {resourceCount}
        </small>
      ) : null}
    </Link>
  )
}
