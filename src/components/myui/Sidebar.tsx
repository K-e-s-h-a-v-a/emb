"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Menu, X } from "lucide-react";
import Link from "next/link";

const categories = [
    { name: "3D Embossed", category: "3d-embossed" },
    { name: "3D Flower", category: "3d-flower" },
    { name: "All Over", category: "all-over" },
    { name: "Animals", category: "animals" },
    { name: "Belt", category: "belt" },
    { name: "Bird", category: "bird" },
    { name: "Blouse", category: "blouse" },
    { name: "Boat Neck", category: "boat-neck" },
    { name: "Bridal", category: "bridal" },
    { name: "Bunch", category: "bunch" },
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
    { name: "V-neck", category: "v-neck" },
];

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            if (isOpen && sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, [isOpen]);

    return (
        <>
            {/* Mobile Top Fixed Nav with Hamburger */}
            <div className="md:hidden fixed top-0 left-0 z-50 p-4 bg-transparent w-full flex justify-start">
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
                    <Menu className="h-6 w-6" />
                </Button>
            </div>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                ref={sidebarRef}
                className={`bg-gray-100 border-r border-gray-300 fixed md:static z-50 top-0 left-0 h-full w-64 pt-16 p-4 transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:block`}
            >
                {/* Header only in mobile when open */}
                <div className="flex justify-between items-center mb-4 md:hidden">
                    <h1 className="text-xl font-bold text-gray-800">Kaveri Tailors</h1>
                    <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Desktop Title */}
                <Link href="/">
                    <h1 className="text-xl font-bold text-center mb-6 text-gray-800 hidden md:block">
                        Kaveri Tailors
                    </h1>
                </Link>

                {/* Scrollable Category List */}
                <nav className="overflow-y-auto max-h-[calc(100vh-8rem)] md:max-h-full pr-1">
                    <div className="flex flex-col gap-3 items-start">
                        {categories.map((cat) => (
                            <Link key={cat.category} href={`/${cat.category}`}>
                                <Button
                                    className="w-full justify-start font-medium px-4 py-2 text-gray-700 cursor-pointer hover:bg-gray-200 transition"
                                    variant="ghost"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {cat.name}
                                </Button>
                            </Link>
                        ))}
                    </div>
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;
