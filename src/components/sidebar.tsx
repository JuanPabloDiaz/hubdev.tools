import { SidebarOptions } from '@/components/sidebar-options'
import { SidebarFooter } from '@/components/sidebar-footer'
import type { Locale } from '@/i18n/config'
import type { SubmitTranslations } from '@/i18n/messages'

type SidebarProps = {
  locale: Locale
  repositoryLabel: string
  submitTranslations: SubmitTranslations
  genericError: string
}

export async function Sidebar({
  locale,
  repositoryLabel,
  submitTranslations,
  genericError
}: SidebarProps) {
  return (
    <aside className='w-full md:fixed md:h-full md:w-56 mb-4 md:mb-0 flex flex-col'>
      <nav className='md:pb-2'>
        <SidebarOptions locale={locale} />
        <SidebarFooter
          repositoryLabel={repositoryLabel}
          submitTranslations={submitTranslations}
          genericError={genericError}
        />
      </nav>
    </aside>
  )
}
