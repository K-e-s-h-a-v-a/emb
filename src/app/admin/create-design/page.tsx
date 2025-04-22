'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUserId } from '@nhost/nextjs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

export default function CreateDesignPage() {
    const router = useRouter()
    const userId = useUserId()

    const [imageUrl, setImageUrl] = useState('')
    const [price, setPrice] = useState('')
    const [category, setCategory] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch('/api/create-design', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    image_url: imageUrl,
                    price: parseFloat(price),
                    category,
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.message || 'Something went wrong')
            }

            alert('Design created successfully!')
            router.push('/admin')
        } catch (err) {
            alert(err.message)
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    if (!userId) {
        return (
            <div className="p-6">
                <p>You must be logged in to access this page.</p>
                <Button onClick={() => router.push('/login')}>Go to Login</Button>
            </div>
        )
    }

    return (
        <div className="max-w-xl mx-auto py-10">
            <h1 className="text-2xl font-bold mb-6">Create New Design</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label>Image URL</Label>
                    <Input
                        type="text"
                        value={imageUrl}
                        onChange={e => setImageUrl(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        required
                    />
                </div>

                <div>
                    <Label>Price</Label>
                    <Input
                        type="number"
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                        placeholder="199"
                        required
                    />
                </div>

                <div>
                    <Label>Category</Label>
                    <Input
                        type="text"
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        placeholder="Sarees / Dupattas / etc."
                        required
                    />
                </div>

                <Button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Create Design'}
                </Button>
            </form>
        </div>
    )
}
