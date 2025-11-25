"use client";

import React, { useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductItem from "@/components/product-item";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const SearchContent = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  // All products from product-detail-screen
  const allProducts = [
    {
      id: "1",
      name: "Michelin CrossClimate2",
      price: "$250",
      imageSrc: "/tires/Michelin CrossClimate2/mi_crossclimate2_suv_full.webp",
      category: "all-season",
    },
    {
      id: "2",
      name: "Continental ExtremeContact",
      price: "$180",
      imageSrc: "/tires/Continental ExtremeContact/conraj_ang_l.jpg",
      category: "all-season",
    },
    {
      id: "3",
      name: "Goodyear Assurance WeatherReady",
      price: "$200",
      imageSrc: "/tires/Goodyear Eagle F1/images.jpg",
      category: "all-season",
    },
    {
      id: "4",
      name: "Bridgestone Blizzak WS90",
      price: "$230",
      imageSrc: "/tires/Bridgestone Blizzak WS90/bs_blizzak_ws90_full.webp",
      category: "all-season",
    },
    {
      id: "5",
      name: "Michelin Pilot Sport 4S",
      price: "$290",
      imageSrc: "/tires/Michelin Pilot Sport 4S/pss_fiche.webp",
      category: "summer",
    },
    {
      id: "6",
      name: "Goodyear Eagle F1",
      price: "$240",
      imageSrc: "/tires/Goodyear Eagle F1/images.jpg",
      category: "summer",
    },
    {
      id: "7",
      name: "Pirelli P Zero",
      price: "$280",
      imageSrc: "/tires/Pirelli P Zero/pzero.png",
      category: "summer",
    },
    {
      id: "8",
      name: "Continental ExtremeContact Sport",
      price: "$250",
      imageSrc: "/tires/Continental ExtremeContact/p3-conti.png",
      category: "summer",
    },
    {
      id: "9",
      name: "Michelin X-Ice Snow",
      price: "$220",
      imageSrc: "/tires/Michelin X-Ice Snow/500x_michelin_x-ice_snow.jpg",
      category: "winter",
    },
    {
      id: "10",
      name: "Continental WinterContact SI",
      price: "$190",
      imageSrc: "/tires/Continental WinterContact SI/wintercontactsi_white_top.webp",
      category: "winter",
    },
    {
      id: "11",
      name: "Nokian Hakkapeliitta R3",
      price: "$250",
      imageSrc: "/tires/Nokian Hakkapeliitta R3/1.jpg",
      category: "winter",
    },
    {
      id: "12",
      name: "BBS CH-R Alloy Wheels",
      price: "$2000",
      imageSrc: "/tires/BBS CH-R Alloy Wheels/5.jpg",
      category: "alloy-wheels",
    },
    {
      id: "13",
      name: "Rotiform RSE Alloy Wheels",
      price: "$1500",
      imageSrc: "/tires/Rotiform RSE Alloy Wheels/9.jpg",
      category: "alloy-wheels",
    },
    {
      id: "14",
      name: "Enkei RPF1 Alloy Wheels",
      price: "$1200",
      imageSrc: "/tires/Enkei RPF1 Alloy Wheels/ENKEI-RPF1-BK-131-WEB.jpg",
      category: "alloy-wheels",
    },
    {
      id: "15",
      name: "Pirelli P Zero Trofeo R",
      price: "$320",
      imageSrc: "/tires/Pirelli P Zero Trofeo R/Trofeo R-02_i.webp",
      category: "performance",
    },
    {
      id: "16",
      name: "Michelin Pilot Sport Cup 2",
      price: "$280",
      imageSrc: "/tires/Michelin Pilot Sport Cup 2/4w-368_3528703112235_tire_michelin_pilot-sport-cup-2-r_325-slash-30-zr21-108y-xl_n0_a_main_5-quarterzoom_nopad.webp",
      category: "performance",
    },
    {
      id: "17",
      name: "Steel Wheel Set (15 inch)",
      price: "$400",
      imageSrc: "/tires/steel Wheel Set (15 inch)/full_b6056fa1b2c4f87b93928efa9462e115_800x.webp",
      category: "steel-wheels",
    },
    {
      id: "18",
      name: "Steel Wheel Set (16 inch)",
      price: "$450",
      imageSrc: "/tires/Steel Wheel Set (16 inch)/TFGRW012_NEW-02.jpg",
      category: "steel-wheels",
    },
    {
      id: "19",
      name: "Steel Wheel Set (17 inch)",
      price: "$500",
      imageSrc: "/tires/Steel Wheel Set (17 inch)/steel-rim-x99139n-17-inch-5x1143-557505.webp",
      category: "steel-wheels",
    },
    {
      id: "20",
      name: "Wheel Spacers",
      price: "$80",
      imageSrc: "/tires/Wheel Spacers/71Gpkkwl0KL._AC_UF1000,1000_QL80_.jpg",
      category: "wheel-accessories",
    },
    {
      id: "21",
      name: "Wheel Lug Nuts Set",
      price: "$50",
      imageSrc: "/tires/Wheel Lug Nuts Set/DirtyLifeLugNutSet_1024x.jpg",
      category: "wheel-accessories",
    },
    {
      id: "22",
      name: "Wheel Center Caps",
      price: "$35",
      imageSrc: "/tires/Wheel Center Caps/713GmHNUoHL.jpg",
      category: "wheel-accessories",
    },
    {
      id: "23",
      name: "Tire Pressure Monitoring System",
      price: "$150",
      imageSrc: "/tires/Tire Pressure Monitoring System/TPS10-4I.webp",
      category: "tire-accessories",
    },
    {
      id: "24",
      name: "Tire Valve Stems",
      price: "$25",
      imageSrc: "/tires/Tire Valve Stems/61wx-R63pFL.jpg",
      category: "tire-accessories",
    },
    {
      id: "25",
      name: "Tire Repair Kit",
      price: "$40",
      imageSrc: "/tires/Tire Repair Kit/tire-plug-repair-kit-on-tire-1024x682.jpg",
      category: "tire-accessories",
    },
  ];

  const searchResults = useMemo(() => {
    if (!query.trim()) return allProducts;

    const lowerQuery = query.toLowerCase();
    return allProducts.filter((product) =>
      product.name.toLowerCase().includes(lowerQuery) ||
      product.category.toLowerCase().includes(lowerQuery)
    );
  }, [query]);

  return (
    <div className="flex flex-col items-center bg-white dark:bg-background text-foreground py-8">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-6 text-center">
            Search Results
          </h1>

          <div className="mb-8 max-w-md mx-auto">
            <Input
              type="text"
              placeholder="Search products..."
              defaultValue={query}
              className="w-full"
            />
          </div>

          {query && (
            <p className="text-center text-lg text-muted-foreground mb-8">
              Found <span className="font-semibold text-foreground">{searchResults.length}</span> result{searchResults.length !== 1 ? "s" : ""} for "<span className="font-semibold">{query}</span>"
            </p>
          )}

          {searchResults.length > 0 ? (
            <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {searchResults.map((product) => (
                <ProductItem
                  key={product.id}
                  name={product.name}
                  price={product.price}
                  imageSrc={product.imageSrc}
                  href={`/product/${product.id}`}
                  specs={{}}
                  rating={4.5}
                  reviews={0}
                />
              ))}
            </section>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground mb-6">
                No products found matching your search.
              </p>
              <Link href="/">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Back to Home
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SearchPage = () => {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center bg-white text-foreground py-8">
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
};

export default SearchPage;
