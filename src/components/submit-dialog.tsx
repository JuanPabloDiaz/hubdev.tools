'use client'

import { useState } from 'react'
import { SendIcon } from 'lucide-react'
import dynamic from 'next/dynamic'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { SubmitFormSkeleton } from '@/components/loading'
import type { SubmitTranslations } from '@/i18n/messages'
import { plusJakartaSans } from '@/fonts'

const SubmitResourceForm = dynamic(
  () => import('@/components/submit-resource-form').then((module) => module.SubmitResourceForm),
  { ssr: false, loading: () => <SubmitFormSkeleton /> }
)

export function SubmitDialog({
  translations,
  genericError
}: {
  translations: SubmitTranslations
  genericError: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button
          type='button'
          variant='ghost'
          className={`${plusJakartaSans.className} w-full h-auto justify-start font-normal gap-3 rounded-xl hover:bg-light-600/40 hover:text-foreground dark:hover:bg-purple-300/10 dark:hover:text-purple-300 dark:hover:border-purple-300/20`}
        >
          <SendIcon className='size-4' />
          <span>{translations.button}</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className='sm:max-w-[425px]'
        closeLabel={translations.close}
      >
        <DialogHeader>
          <DialogTitle>{translations.title}</DialogTitle>
          <DialogDescription>{translations.description}</DialogDescription>
        </DialogHeader>
        {open ? (
          <SubmitResourceForm
            setOpen={setOpen}
            translations={translations}
            genericError={genericError}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
