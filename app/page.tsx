/* eslint-disable @next/next/no-img-element */
"use client";
import Banner from "@/components/layouts/banner";
import { useState, useEffect } from "react";
import axios from "axios";
import Nav from "@/components/layouts/nav";
import PageButton from "@/components/layouts/pagebutton";
import Card from "@/components/layouts/card";
import Footer from "@/components/layouts/footer";

export default function Home() {
  // Consume API -----------------
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState<Result>();

  const localPage = () => {
    if (typeof window !== "undefined") {
      return Number(localStorage.getItem("currentPage")) || 1;
    }
    return 1;
  };

  const localPerPage = () => {
    if (typeof window !== "undefined") {
      return Number(localStorage.getItem("perPage")) || 10;
    }
    return 10;
  };

  const localSortBy = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sortBy") || "published_at";
    }
    return "published_at";
  };

  const [currentPage, setCurrentPage] = useState(localPage);
  const [perPage, setPerPage] = useState(localPerPage);
  const [sortBy, setSortBy] = useState(localSortBy);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const API = `https://suitmedia-backend.suitdev.com/api/ideas?page[number]=${currentPage}&page[size]=${perPage}&append[]=small_image&append[]=medium_image&sort=${sortBy}`;
        const result = await axios.get(`${API}`);
        setContent(result.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [currentPage, perPage, sortBy]);

  // Save state handler -----------------
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("currentPage", currentPage.toString());
    }
  }, [currentPage]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("perPage", perPage.toString());
    }
  }, [perPage]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("sortBy", sortBy);
    }
  }, [sortBy]);

  // Filter handler -----------------
  const handlePerPage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPerPage(Number(e.target.value));
  };

  const handleSortBy = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  return (
    <div>
      <Nav />
      <div className="mb-5">
        <Banner />
        {isLoading ? (
          <div className="flex min-h-screen items-center justify-center">
            <img src={"/loading.gif"} alt="Loading" />
          </div>
        ) : (
          <>
            {/* Filter dropdowns ----------------- */}
            <div className="flex flex-col sm:flex-row justify-between mb-4 px-10 mt-10">
              <div className="mb-4 sm:mb-0">
                <h2>
                  Showing {content?.meta.from} - {content?.meta.to} of{" "}
                  {content?.meta.total}
                </h2>
              </div>
              <div className="md:flex">
                <div className="mb-4 sm:mb-0">
                  <label className="mr-4">
                    Show per page:
                    <select
                      className="border-2 border-zinc-400 bg-zinc-100 ml-3 px-2 py-1 rounded-full"
                      value={perPage}
                      onChange={handlePerPage}
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                  </label>
                </div>
                <div>
                  <label>
                    Sort by:
                    <select
                      className="border-2 border-zinc-400 bg-zinc-100 ml-3 px-2 py-1 rounded-full"
                      value={sortBy}
                      onChange={handleSortBy}
                    >
                      <option value="published_at">↑ Published Date</option>
                      <option value="-published_at">↓ Published Date</option>
                    </select>
                  </label>
                </div>
              </div>
            </div>
            {/* API result ----------------- */}
            <Card data={content!!.data} meta={content!!.meta}></Card>
            {/* Pagination button ----------------- */}
            <PageButton
              currentPage={currentPage}
              totalPage={content!!.meta.last_page}
              setCurrentPage={setCurrentPage}
            />
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
