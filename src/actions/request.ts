'use server'

import { headers } from 'next/headers'

import { uptash } from '@/ratelimit'
import { createSupabaseServerClient } from '@/utils/supabase-server'

const ratelimit =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN ? uptash : false

type RequestResource = {
  website: string
}

async function addRequest({ request }: { request: RequestResource }) {
  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.from('requests').insert(request)

  if (error) throw error

  return 'ok'
}

// First off, let's check if the resource is already added on resources table,
// Otherwise, we'll check whether it's submitted or not on the requests table
async function isAlreadySubmittedOrAdded({ url }: { url: string }) {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase.from('resources').select('id').eq('url', url)

  if (error) throw error

  if (data.length === 1) return true

  const { data: requestData, error: requestError } = await supabase
    .from('requests')
    .select('id')
    .eq('website', url)
    .eq('isAdded', false)

  if (requestError) throw requestError

  return requestData.length === 1
}

export async function submitResource({ formData }: { formData: FormData }) {
  const request = {
    website: formData.get('url') as string
  }

  if (process.env.NODE_ENV === 'production' && ratelimit) {
    const ip = (await headers()).get('x-forwarded-for') ?? 'local'
    const { success } = await ratelimit.limit(ip)
    if (!success) {
      return {
        msg: 'rate-limited'
      }
    }
  }

  try {
    const isAdded = await isAlreadySubmittedOrAdded({
      url: request.website
    })
    if (!isAdded) {
      const response = await addRequest({
        request
      })
      return {
        msg: response
      }
    }

    return {
      msg: 'duplicate'
    }
  } catch (error) {
    // @ts-ignore
    const isAlreadyAdded = error.message.includes('duplicate key')
    return {
      msg: isAlreadyAdded ? 'duplicate' : 'error'
    }
  }
}
