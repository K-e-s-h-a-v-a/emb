import { NextRequest, NextResponse } from 'next/server'
import { nhost } from '../../../../../lib/nhost'

interface Updatefeilds {
    price?: number
    category?: string
}



export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const designId =  params.id

  if (!designId) {
    return NextResponse.json({ message: 'Missing design ID' }, { status: 400 })
  }

  const query = `
    mutation DeleteDesign($id: uuid!) {
      delete_designs_by_pk(id: $id) {
        id
      }
    }
  `

  const { error, data } = await nhost.graphql.request(query, { id: designId })

  if (error) {
    return NextResponse.json({ message: 'Failed to delete design', error }, { status: 500 })
  }

  return NextResponse.json({ message: 'Design deleted successfully', data }, { status: 200 })
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const designId = params.id
  const body = await req.json()
  const { price, category } = body

  if (!designId || (!price && !category)) {
    return NextResponse.json({ message: 'Missing data' }, { status: 400 })
  }

  const updateFields: Updatefeilds = {}
  if (price !== undefined) updateFields.price = price
  if (category !== undefined) updateFields.category = category

  const query = `
    mutation UpdateDesign($id: uuid!, $changes: designs_set_input!) {
      update_designs_by_pk(pk_columns: { id: $id }, _set: $changes) {
        id
        price
        category
      }
    }
  `

  const variables = {
    id: designId,
    changes: updateFields
  }

  const { error, data } = await nhost.graphql.request(query, variables)

  if (error) {
    return NextResponse.json({ message: 'Failed to update design', error }, { status: 500 })
  }

  return NextResponse.json({ message: 'Design updated successfully', data }, { status: 200 })
}
