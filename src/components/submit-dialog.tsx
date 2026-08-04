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
import type { SubmitTranslations } from '@/i18n/messages'

const SubmitResourceForm = dynamic(
  () => import('@/components/submit-resource-form').then((module) => module.SubmitResourceForm),
  { ssr: false }
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
        <Button variant='outline'>
          <SendIcon className='size-4 mr-2' />
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
