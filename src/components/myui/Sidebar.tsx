"use client"
import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'

const categories = [{ name: "3D Embossed", category: "3d-embossed" },
{ name: "3D Flower", category: "3d-flower" },
{ name: "All Over", category: "all-over" },
{ name: "Animals", category: "animals" },
{ name: "Belt", category: "belt" },
{ name: "Bird", category: "bird" },
{ name: "Blouse", category: "blouse" },
{ name: "Boat Neck", category: "boat-neck" },
{ name: "Bridal", category: "bridal" },
{ name: "Bunch", category: "bunch" },
{ name: "Bird", category: "bird" },
{ name: "Butterfly", category: "butterfly" },
{ name: "Cartoon", category: "cartoon" },
{ name: "Collar", category: "collar" },
{ name: "Cut Work", category: "cut-work" },
{ name: "Dress", category: "dress" },
{ name: "Flower", category: "flower" },
{ name: "Kutch Work", category: "kutch-work" },
{ name: "Leaves", category: "leaves" },
{ name: "Lotus", category: "lotus" },
{ name: "Mango", category: "mango" },
{ name: "Mirror", category: "mirror" },
{ name: "Net Designs", category: "net-designs" },
{ name: "One Side", category: "one-side" },
{ name: "Parrot", category: "parrot" },
{ name: "Pot Neck", category: "pot-neck" },
{ name: "Rose", category: "rose" },
{ name: "Simple", category: "simple" },
{ name: "V-neck", category: "v-neck" },]

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            {/* Mobile Toggle Button */}
            <div className="md:hidden p-4 flex items-center justify-between bg-gray-200">
                <h1 className="text-lg font-bold text-gray-800">Kaveri Tailors</h1>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
            </div>

            {/* Sidebar */}
            <aside className={`bg-gray-100 border-r border-gray-300 fixed md:static z-50 top-0 left-0 h-full w-64 p-4 transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:block`}>
                <nav>
                    <Link href='/'><h1 className="text-xl font-bold text-center mb-6 text-gray-800 hidden md:block" >Kaveri Tailors</h1></Link>
                    <div className="flex flex-col gap-3  items-center">
                        {categories.map((cat) => (
                            <Link key={cat.category} href={`/${cat.category}`}>
                                <Button
                                    key={Math.random() * 1000}
                                    className="font-medium text-center px-4 py-2 text-gray-700 cursor-pointer hover:bg-gray-200 transition"
                                    variant="ghost"

                                >
                                    {cat.name}
                                </Button>
                            </Link>
                        ))}
                    </div>
                </nav>
            </aside>
        </>
    )
}

export default Sidebar
