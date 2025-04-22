import { NextRequest, NextResponse } from 'next/server'
import { nhost } from '../../../../lib/nhost'

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const page = parseInt(url.searchParams.get('page') || '1', 10)
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10', 10)
    const category = url.searchParams.get('category') || undefined

    const offset = (page - 1) * pageSize

    // Build dynamic "where" filter
    const where = { _and: [] }
    if (category) where._and.push({ category: { _eq: category } })
    if (where._and.length === 0) delete where._and

    const query = `
    query Designs($limit: Int!, $offset: Int!, $where: designs_bool_exp) {
      designs(where: $where, limit: $limit, offset: $offset) {
        id
        image_url
        price
        category
      }
    }
  `
  

    const variables = { limit: pageSize, offset, where }
    const { error, data } = await nhost.graphql.request(query, variables)

    if (error) {
      return NextResponse.json(
        { message: 'Failed to fetch designs', error },
        { status: 500 }
      )
    }

    const designs = data.designs;

    const total = designs.length


    return NextResponse.json(
        { designs, pagination: { page, pageSize, total } },
        { status: 200 }
      )
      
  } catch (err) {
    return NextResponse.json(
      { message: 'Unexpected error', error: err },
      { status: 500 }
    )
  }
}
