import { NextRequest, NextResponse } from 'next/server'
import { nhost } from '../../../../../lib/nhost'


export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const designId = params.id

  if (!designId) {
    return NextResponse.json(
      { message: 'Missing design ID' },
      { status: 400 }
    )
  }

  const query = `
    mutation DeleteDesign($id: uuid!) {
      delete_designs_by_pk(id: $id) {
        id
      }
    }
  `

  const variables = { id: designId }

  const { error, data } = await nhost.graphql.request(query, variables)

  if (error) {
    return NextResponse.json(
      { message: 'Failed to delete design', error },
      { status: 500 }
    )
  }

  return NextResponse.json(
    { message: 'Design deleted successfully', data },
    { status: 200 }
  )
}
