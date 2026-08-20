import { Dispatch, SetStateAction, useMemo, useState } from 'react'
import { extractDomain } from '@/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { inter } from '@/fonts'

import { cn } from '@/utils/styles'
import { isDomainInvalid } from '@/utils/isDomainInvalid'
import { submitResource } from '@/actions/request'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import type { SubmitTranslations } from '@/i18n/messages'

type FormValues = {
  url: string
}

export function SubmitResourceForm({
  setOpen,
  translations,
  genericError
}: {
  setOpen: Dispatch<SetStateAction<boolean>>
  translations: SubmitTranslations
  genericError: string
}) {
  const formSchema = useMemo(
    () =>
      z.object({
        url: z.url({
          message: translations.invalidUrl
        })
      }),
    [translations.invalidUrl]
  )
  const [successMessage, setSuccessMessage] = useState<string>('')
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: ''
    }
  })

  const {
    formState: { isSubmitting, errors },
    setError
  } = form
  const hasErrors = Object.keys(errors).length > 0

  const onSubmit = async (values: FormValues) => {
    const domain = extractDomain(values.url)
    if (
      isDomainInvalid({
        url: domain
      })
    ) {
      setError('url', {
        type: 'manual',
        message: translations.invalidUrl
      })
      return
    }

    try {
      const formData = new FormData()
      formData.append('url', values.url)

      const { msg } = await submitResource({
        formData
      })
      if (msg !== 'ok') {
        setError('url', {
          type: 'manual',
          message: translations.duplicate
        })
        return
      }

      setSuccessMessage(translations.success)
      setTimeout(() => {
        setOpen(false)
      }, 2000)
    } catch (error) {
      if (error instanceof Error) {
        setError('root.api', {
          type: 'manual',
          message: genericError
        })
      }
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('space-y-4', inter.className)}
      >
        <FormField
          control={form.control}
          name='url'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{translations.websiteUrl}</FormLabel>
              <FormControl>
                <Input
                  placeholder='https://example.com'
                  {...field}
                  autoComplete='off'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {hasErrors && <p className='text-red-500 text-sm'>{errors?.root?.api?.message}</p>}
        {successMessage && (
          <p className='text-light-900 dark:text-green-500 text-sm font-semibold'>
            {successMessage}
          </p>
        )}
        <Button
          type='submit'
          className='w-full'
          disabled={isSubmitting || Boolean(errors?.root?.api)}
        >
          {!isSubmitting || hasErrors ? translations.button : translations.submitting}
        </Button>
      </form>
    </Form>
  )
}
