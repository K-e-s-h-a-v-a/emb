/* eslint-disable @next/next/no-img-element */
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function Home() {
  const [designs, setDesigns] = useState([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(6);
  const [total, setTotal] = useState(0);

  const totalPages = Math.ceil(total / pageSize);

  useEffect(() => {
    fetchDesigns();
  }, [page]);

  const fetchDesigns = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/get-all-design?page=${page}&pageSize=${pageSize}`);
      const data = await res.json();
      setDesigns(data.designs || []);
      setTotal(data.pagination?.total || 0);
    } catch (err) {
      console.error("Failed to fetch designs", err);
    }
    setLoading(false);
  };

  return (
    <section className="px-4 py-10 md:px-10 relative">
      <h2 className="text-center font-bold text-3xl md:text-4xl mb-10 font-sans text-gray-800">
        Embroidery Catalogue
      </h2>

      {loading ? (
        <p className="text-center text-gray-500 text-lg">Loading designs...</p>
      ) : designs.length > 0 ? (
        <>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {designs.map((design) => (
              <Card
                key={design.id}
                className="w-full max-w-[240px] bg-white border border-gray-300 shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl overflow-hidden"
              >
                <img
                  src={`/api/image-proxy?url=${encodeURIComponent(design.image_url)}`}
                  alt={`Design ${design.id}`}
                  onClick={() => setSelectedImage(design.image_url)}
                  className="w-full h-48 object-center cursor-pointer rounded-t-md -mt-7"
                />
                <CardContent className="p-4">
                  <p className="text-lg font-medium text-gray-800">₹{design.price}</p>
                  <p className="text-sm text-gray-500 mt-1">Category: {design.category}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center gap-4 mt-8 items-center">
            <Button
              variant="outline"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="text-gray-700 font-medium">Page {page} of {totalPages || 1}</span>
            <Button
              variant="outline"
              onClick={() => setPage((prev) => prev + 1)}
              disabled={page >= totalPages}
            >
              Next
            </Button>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-600 mt-10">No designs available.</p>
      )}

      {/* Modal for large image */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Large design preview"
            className="max-w-[90%] max-h-[90%] rounded-xl border-4 border-white shadow-lg"
          />
        </div>
      )}
    </section>
  );
}
