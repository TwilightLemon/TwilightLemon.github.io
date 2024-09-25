const host = 'https://api.twlmgatito.cn'
export const statics_counter_view_js = `${host}/static/counter_view.js`

export async function getCounter(articleId: string): Promise<number> {
  const url = `${host}/counter/${articleId}`
  const res = await fetch(url)
  const count = (await res.json()).count
  console.log(count)
  return count
}
