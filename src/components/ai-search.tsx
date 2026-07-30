import { getHistory } from '@/services/history'
import { Toolbar } from '@/components/toolbar'

export async function AISearch() {
  const history = await getHistory()

  return <Toolbar searchHistory={history} />
}
