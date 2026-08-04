import Link from 'next/link'
import { HeartIcon } from 'lucide-react'

import { inter } from '@/fonts'

export function NoFavorites({
  title,
  description,
  exploreLabel,
  href
}: {
  title: string
  description: string
  exploreLabel: string
  href: string
}) {
  return (
    <div className='flex flex-col items-center justify-center max-w-md mx-auto text-center space-y-6 mt-[250px]'>
      <div className='relative'>
        <div className='size-24 rounded-full bg-muted flex items-center justify-center'>
          <HeartIcon
            className='size-12 text-muted-foreground'
            strokeWidth={1.5}
          />
        </div>
      </div>
      <div className='space-y-3'>
        <h1 className='text-2xl font-medium tracking-tight text-foreground'>{title}</h1>
        <p className='text-muted-foreground leading-relaxed text-balance text-sm'>{description}</p>
      </div>
      <Link
        href={href}
        className={`mt-2 inline-block bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md transition-colors duration-150 text-sm ${inter.className}`}
      >
        {exploreLabel}
      </Link>
    </div>
  )
}
