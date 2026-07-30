import { History } from 'lucide-react'

type SearchSuggestionsProps = {
  history: string[]
  onSelect: (value: string) => void
}

export function SearchSuggestions({ history, onSelect }: SearchSuggestionsProps) {
  const recent = history.slice(0, 5)

  if (recent.length === 0) return null

  return (
    <div className='absolute left-0 right-0 top-[calc(100%+8px)] max-h-[min(420px,calc(100vh-90px))] overflow-y-auto rounded-xl border border-light-700/70 bg-stone-50/98 p-2 shadow-2xl shadow-black/10 backdrop-blur-xl dark:border-neutral-800 dark:bg-[#151515]/98 dark:shadow-black/40'>
      <div className='py-1'>
        <div className='flex items-center gap-1.5 px-2 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500'>
          <History className='size-3.5' />
          <span>Recent searches</span>
        </div>
        <div className='space-y-0.5'>
          {recent.map((suggestion) => (
            <button
              type='button'
              key={suggestion}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => onSelect(suggestion)}
              className='flex min-h-11 w-full items-center rounded-lg px-3 text-left text-sm text-light-950 transition-colors hover:bg-light-600/40 dark:text-neutral-200 dark:hover:bg-neutral-800/70'
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
