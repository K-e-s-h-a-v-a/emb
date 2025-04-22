import { NextRequest, NextResponse } from 'next/server'
import { nhost } from '../../../../lib/nhost'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { image_url, price, category } = body

  if (!image_url || !price || !category) {
    return NextResponse.json({ message: 'Missing fields' }, { status: 400 })
  }

  try {
    const { error, data } = await nhost.graphql.request(
      `
      mutation InsertDesign($image_url: String!, $price: numeric!, $category: String!) {
        insert_designs(objects: {
          image_url: $image_url,
          price: $price,
          category: $category
        }) {
          returning {
            id
            image_url
            price
            category
          }
        }
      }
      `,
      { image_url, price, category }
    )

    if (error) {
      return NextResponse.json({ message: 'Insert failed', error }, { status: 500 })
    }

    return NextResponse.json({ message: 'Success', design: data.insert_designs.returning[0] }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ message: 'Unexpected error', error: err }, { status: 500 })
  }
}
