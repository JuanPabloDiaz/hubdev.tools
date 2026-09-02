import { supabase } from './client'

export async function updateClicks({ url }: { url: string }) {
  const { success, data, message, code } = await verifyUrl({
    url
  })

  if (!success || !data) {
    return {
      success: false,
      message,
      code
    }
  }

  const { id } = data
  return await incrementClicks({
    id
  })
}

async function verifyUrl({ url }: { url: string }) {
  const { data, error } = await supabase
    .from('new_resources')
    .select('id')
    .eq('url', url)
    .maybeSingle()

  if (error) {
    console.error(error)
    return {
      success: false,
      code: 500,
      message: 'Something went wrong'
    }
  }

  if (!data) {
    return {
      success: false,
      code: 404,
      message: 'Resource Not Found'
    }
  }

  return {
    success: true,
    data,
    code: 200
  }
}

async function incrementClicks({ id }: { id: string }) {
  const { error } = await supabase.rpc('increment_clicks', {
    resource_id: id
  })
  if (error) {
    console.error(error)
    return {
      success: false,
      code: 500,
      message: 'Something went wrong'
    }
  }

  return {
    success: true,
    code: 200
  }
}
