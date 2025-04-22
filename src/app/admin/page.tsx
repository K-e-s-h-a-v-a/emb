/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { nhost } from '../../../lib/nhost'
import { toast } from 'sonner'
import bcrypt from 'bcryptjs'
import { useAuthenticationStatus } from '@nhost/nextjs'

export default function AdminPanel() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [authenticating, setAuthenticating] = useState(true)
    const [authenticated, setAuthenticated] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [designs, setDesigns] = useState([])
    const { isLoading, isAuthenticated } = useAuthenticationStatus()
    const user = nhost.auth.getUser()

    useEffect(() => {
        const checkAuth = async () => {
            const session = await nhost.auth.getSession()
            const user = session?.user

            if (!user) {
                setAuthenticating(false)
                return
            }

            fetchDesigns()
            setAuthenticated(true)
            setAuthenticating(false)
        }

        checkAuth()
    }, [])
    const handleLogin = async () => {
        const { session, error } = await nhost.auth.signIn({ email, password });

        if (error) {
            console.error('Login error:', error);
            toast.error(error.message || 'Login failed');
            return;
        }

        const user = session?.user;

        if (!user) {
            toast.error('No user returned');
            return;
        }

        if (user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
            toast.error('Unauthorized');
            return;
        }

        setAuthenticated(true);
        fetchDesigns();
    }


    const fetchDesigns = async () => {
        try {
            const res = await fetch('/api/get-all-design')
            const data = await res.json()
            setDesigns(data.designs || [])
            setLoading(false)
        } catch (err) {
            toast.error('Failed to fetch designs')
        }
    }

    const deleteDesign = async (id: string) => {
        const res = await fetch(`/api/design/${id}`, { method: 'DELETE' })
        if (res.ok) {
            toast.success('Deleted successfully')
            setDesigns(prev => prev.filter(d => d.id !== id))
        } else {
            toast.error('Delete failed')
        }
    }

    const updateDesign = async (id: string, price: number, category: string) => {
        const res = await fetch(`/api/update-design/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ price, category })
        })
        if (res.ok) {
            toast.success('Updated successfully')
            fetchDesigns()
        } else {
            toast.error('Update failed')
        }
    }

    if (authenticating) return <div className="p-4">Checking authentication...</div>


    if (!isAuthenticated || user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        return (
            <div className="p-6 max-w-md mx-auto bg-white content-center border border-black mt-7 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Admin Login</h2>
                <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="mb-3"
                />
                <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="mb-3"
                />
                <Button onClick={handleLogin}>Login</Button>
            </div>
        )
    }

    if (isLoading) {
        return <div className="p-4">Checking authentication...</div>
    }

    if (loading) {
        fetchDesigns()
        return <div className="p-4">Loading designs...</div>
    }

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">Admin Panel</h1>
                <Link href="/create-design">
                    <Button>Add Design</Button>
                </Link>
            </div>

            <div className="grid gap-4">
                {designs.map(design => (
                    <Card key={design.id}>
                        <CardContent className="p-4">
                            <img src={design.image_url} alt="Design" className="w-40 h-40 object-cover rounded" />
                            <div className="mt-2">Category: {design.category}</div>
                            <div>Price: ₹{design.price}</div>
                            <div className="flex gap-2 mt-3">
                                <Input
                                    placeholder="New Price"
                                    type="number"
                                    defaultValue={design.price}
                                    onBlur={e => updateDesign(design.id, parseFloat(e.target.value), design.category)}
                                />
                                <Input
                                    placeholder="New Category"
                                    defaultValue={design.category}
                                    onBlur={e => updateDesign(design.id, design.price, e.target.value)}
                                />
                                <Button variant="destructive" onClick={() => deleteDesign(design.id)}>
                                    Delete
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}