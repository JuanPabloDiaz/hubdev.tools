import { GitHubIc } from '@/components/icons'
import { SubmitDialog } from '@/components/submit-dialog'
import { plusJakartaSans } from '@/fonts'
import type { SubmitTranslations } from '@/i18n/messages'

type SidebarFooterProps = {
  repositoryLabel: string
  submitTranslations: SubmitTranslations
  genericError: string
}

export function SidebarFooter({
  repositoryLabel,
  submitTranslations,
  genericError
}: SidebarFooterProps) {
  return (
    <div className='flex flex-col mt-2 pt-2 border-t border-light-700/60 dark:border-neutral-800'>
      <a
        href='https://github.com/xavimondev/hubdev.tools'
        target='_blank'
        rel='noreferrer noopener'
        className={`${plusJakartaSans.className} flex items-center gap-3 px-4 py-2 rounded-xl backdrop-filter text-sm whitespace-nowrap text-foreground backdrop-blur-sm hover:bg-light-600/40 dark:hover:bg-purple-300/10 dark:hover:text-purple-300 dark:hover:border-purple-300/20`}
      >
        <GitHubIc className='size-4 shrink-0' />
        <span>{repositoryLabel}</span>
      </a>
      <SubmitDialog
        translations={submitTranslations}
        genericError={genericError}
      />
    </div>
  )
}
