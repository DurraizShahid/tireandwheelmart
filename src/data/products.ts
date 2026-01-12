export interface Product {
  id: string;
  name: string;
  price: string;
  imageSrc: string;
  category: string;
}

export const allProducts: Product[] = [
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
  // Additional All-Season Tires
  {
    id: "26",
    name: "Bridgestone Turanza QuietTrack",
    price: "$270",
    imageSrc: "/tires/Bridgestone Blizzak WS90/bs_blizzak_ws90_full.webp",
    category: "all-season",
  },
  {
    id: "27",
    name: "Firestone Destination LE3",
    price: "$190",
    imageSrc: "/tires/Continental ExtremeContact/conraj_ang_l.jpg",
    category: "all-season",
  },
  {
    id: "28",
    name: "Cooper CS5 Ultra Touring",
    price: "$210",
    imageSrc: "/tires/Goodyear Eagle F1/images.jpg",
    category: "all-season",
  },
  {
    id: "29",
    name: "Toyo Extensa A/S II",
    price: "$165",
    imageSrc: "/tires/Continental ExtremeContact/p3-conti.png",
    category: "all-season",
  },
  {
    id: "30",
    name: "Hankook Kinergy GT",
    price: "$175",
    imageSrc: "/tires/Michelin CrossClimate2/mi_crossclimate2_suv_full.webp",
    category: "all-season",
  },
  {
    id: "31",
    name: "General Altimax RT43",
    price: "$155",
    imageSrc: "/tires/Bridgestone Blizzak WS90/bs_blizzak_ws90_full.webp",
    category: "all-season",
  },
  // Additional Summer Tires
  {
    id: "32",
    name: "Bridgestone Potenza RE-71R",
    price: "$300",
    imageSrc: "/tires/Michelin Pilot Sport 4S/pss_fiche.webp",
    category: "summer",
  },
  {
    id: "33",
    name: "Toyo Proxes Sport A/S",
    price: "$260",
    imageSrc: "/tires/Pirelli P Zero/pzero.png",
    category: "summer",
  },
  {
    id: "34",
    name: "Hankook Ventus V12 evo2",
    price: "$225",
    imageSrc: "/tires/Goodyear Eagle F1/images.jpg",
    category: "summer",
  },
  {
    id: "35",
    name: "Firehawk Indy 500",
    price: "$195",
    imageSrc: "/tires/Continental ExtremeContact Sport/p3-conti.png",
    category: "summer",
  },
  {
    id: "36",
    name: "Kumho Ecsta PS31",
    price: "$180",
    imageSrc: "/tires/Pirelli P Zero/pzero.png",
    category: "summer",
  },
  // Additional Winter Tires
  {
    id: "37",
    name: "Bridgestone Blizzak DM-V2",
    price: "$240",
    imageSrc: "/tires/Bridgestone Blizzak WS90/bs_blizzak_ws90_full.webp",
    category: "winter",
  },
  {
    id: "38",
    name: "Goodyear Ultra Grip Ice WRT",
    price: "$210",
    imageSrc: "/tires/Michelin X-Ice Snow/500x_michelin_x-ice_snow.jpg",
    category: "winter",
  },
  {
    id: "39",
    name: "Pirelli Winter Sottozero 3",
    price: "$260",
    imageSrc: "/tires/Continental WinterContact SI/wintercontactsi_white_top.webp",
    category: "winter",
  },
  {
    id: "40",
    name: "Toyo Observe GSi-6",
    price: "$235",
    imageSrc: "/tires/Nokian Hakkapeliitta R3/1.jpg",
    category: "winter",
  },
  {
    id: "41",
    name: "Yokohama IceGuard IG53",
    price: "$200",
    imageSrc: "/tires/Michelin X-Ice Snow/500x_michelin_x-ice_snow.jpg",
    category: "winter",
  },
  {
    id: "42",
    name: "General Altimax Arctic 12",
    price: "$185",
    imageSrc: "/tires/Continental WinterContact SI/wintercontactsi_white_top.webp",
    category: "winter",
  },
  // Additional Performance Tires
  {
    id: "43",
    name: "Bridgestone Potenza S007A",
    price: "$310",
    imageSrc: "/tires/Pirelli P Zero Trofeo R/Trofeo R-02_i.webp",
    category: "performance",
  },
  {
    id: "44",
    name: "Goodyear Eagle F1 SuperSport",
    price: "$295",
    imageSrc: "/tires/Michelin Pilot Sport Cup 2/4w-368_3528703112235_tire_michelin_pilot-sport-cup-2-r_325-slash-30-zr21-108y-xl_n0_a_main_5-quarterzoom_nopad.webp",
    category: "performance",
  },
  {
    id: "45",
    name: "Continental SportContact 6",
    price: "$275",
    imageSrc: "/tires/Pirelli P Zero Trofeo R/Trofeo R-02_i.webp",
    category: "performance",
  },
  {
    id: "46",
    name: "Hankook Ventus R-S4",
    price: "$265",
    imageSrc: "/tires/Michelin Pilot Sport Cup 2/4w-368_3528703112235_tire_michelin_pilot-sport-cup-2-r_325-slash-30-zr21-108y-xl_n0_a_main_5-quarterzoom_nopad.webp",
    category: "performance",
  },
  // Additional Alloy Wheels
  {
    id: "47",
    name: "OZ Racing Superturismo GT",
    price: "$1800",
    imageSrc: "/tires/BBS CH-R Alloy Wheels/5.jpg",
    category: "alloy-wheels",
  },
  {
    id: "48",
    name: "Konig Oversteer Alloy Wheels",
    price: "$950",
    imageSrc: "/tires/Rotiform RSE Alloy Wheels/9.jpg",
    category: "alloy-wheels",
  },
  {
    id: "49",
    name: "Rays Gram Lights 57DR",
    price: "$1400",
    imageSrc: "/tires/Enkei RPF1 Alloy Wheels/ENKEI-RPF1-BK-131-WEB.jpg",
    category: "alloy-wheels",
  },
  {
    id: "50",
    name: "Motegi MR131 Racing Wheels",
    price: "$1100",
    imageSrc: "/tires/BBS CH-R Alloy Wheels/5.jpg",
    category: "alloy-wheels",
  },
  {
    id: "51",
    name: "Forgiato Maglia Wheels",
    price: "$3200",
    imageSrc: "/tires/Rotiform RSE Alloy Wheels/9.jpg",
    category: "alloy-wheels",
  },
  {
    id: "52",
    name: "TSW Nurburgring Wheels",
    price: "$1300",
    imageSrc: "/tires/Enkei RPF1 Alloy Wheels/ENKEI-RPF1-BK-131-WEB.jpg",
    category: "alloy-wheels",
  },
  {
    id: "53",
    name: "Work Emotion ZR10 Wheels",
    price: "$1600",
    imageSrc: "/tires/BBS CH-R Alloy Wheels/5.jpg",
    category: "alloy-wheels",
  },
  // Additional Steel Wheels
  {
    id: "54",
    name: "Steel Wheel Set (14 inch)",
    price: "$350",
    imageSrc: "/tires/steel Wheel Set (15 inch)/full_b6056fa1b2c4f87b93928efa9462e115_800x.webp",
    category: "steel-wheels",
  },
  {
    id: "55",
    name: "Steel Wheel Set (18 inch)",
    price: "$550",
    imageSrc: "/tires/Steel Wheel Set (16 inch)/TFGRW012_NEW-02.jpg",
    category: "steel-wheels",
  },
  {
    id: "56",
    name: "Steel Wheel Set (19 inch)",
    price: "$600",
    imageSrc: "/tires/Steel Wheel Set (17 inch)/steel-rim-x99139n-17-inch-5x1143-557505.webp",
    category: "steel-wheels",
  },
  {
    id: "57",
    name: "Steel Wheel Set (20 inch)",
    price: "$650",
    imageSrc: "/tires/steel Wheel Set (15 inch)/full_b6056fa1b2c4f87b93928efa9462e115_800x.webp",
    category: "steel-wheels",
  },
  // Additional Wheel Accessories
  {
    id: "58",
    name: "Wheel Lock Kit",
    price: "$65",
    imageSrc: "/tires/Wheel Lug Nuts Set/DirtyLifeLugNutSet_1024x.jpg",
    category: "wheel-accessories",
  },
  {
    id: "59",
    name: "Wheel Weights Set",
    price: "$30",
    imageSrc: "/tires/Wheel Center Caps/713GmHNUoHL.jpg",
    category: "wheel-accessories",
  },
  {
    id: "60",
    name: "Wheel Brush Cleaning Kit",
    price: "$25",
    imageSrc: "/tires/Wheel Spacers/71Gpkkwl0KL._AC_UF1000,1000_QL80_.jpg",
    category: "wheel-accessories",
  },
  {
    id: "61",
    name: "Wheel Bolts Set",
    price: "$45",
    imageSrc: "/tires/Wheel Lug Nuts Set/DirtyLifeLugNutSet_1024x.jpg",
    category: "wheel-accessories",
  },
  {
    id: "62",
    name: "Wheel Adapters",
    price: "$120",
    imageSrc: "/tires/Wheel Spacers/71Gpkkwl0KL._AC_UF1000,1000_QL80_.jpg",
    category: "wheel-accessories",
  },
  // Additional Tire Accessories
  {
    id: "63",
    name: "Tire Inflator Portable",
    price: "$75",
    imageSrc: "/tires/Tire Pressure Monitoring System/TPS10-4I.webp",
    category: "tire-accessories",
  },
  {
    id: "64",
    name: "Tire Gauge Digital",
    price: "$35",
    imageSrc: "/tires/Tire Valve Stems/61wx-R63pFL.jpg",
    category: "tire-accessories",
  },
  {
    id: "65",
    name: "Tire Chains Set",
    price: "$95",
    imageSrc: "/tires/Tire Repair Kit/tire-plug-repair-kit-on-tire-1024x682.jpg",
    category: "tire-accessories",
  },
  {
    id: "66",
    name: "Tire Covers Set",
    price: "$55",
    imageSrc: "/tires/Tire Repair Kit/tire-plug-repair-kit-on-tire-1024x682.jpg",
    category: "tire-accessories",
  },
  {
    id: "67",
    name: "Tire Shine Spray",
    price: "$18",
    imageSrc: "/tires/Tire Valve Stems/61wx-R63pFL.jpg",
    category: "tire-accessories",
  },
  {
    id: "68",
    name: "Tire Mounting Lubricant",
    price: "$15",
    imageSrc: "/tires/Tire Repair Kit/tire-plug-repair-kit-on-tire-1024x682.jpg",
    category: "tire-accessories",
  },
  {
    id: "69",
    name: "Tire Storage Rack",
    price: "$125",
    imageSrc: "/tires/Tire Pressure Monitoring System/TPS10-4I.webp",
    category: "tire-accessories",
  },
  {
    id: "70",
    name: "Tire Balance Beads",
    price: "$42",
    imageSrc: "/tires/Tire Valve Stems/61wx-R63pFL.jpg",
    category: "tire-accessories",
  },
];

export const searchProducts = (query: string): Product[] => {
  if (!query.trim()) return [];
  
  const lowerQuery = query.toLowerCase().trim();
  const normalizedQuery = lowerQuery.replace(/\s+/g, "-"); // Convert spaces to hyphens for category matching
  
  return allProducts.filter(
    (product) => {
      const nameMatch = product.name.toLowerCase().includes(lowerQuery);
      const categoryMatch = product.category.toLowerCase().includes(lowerQuery) || 
                           product.category.toLowerCase().includes(normalizedQuery);
      
      // Also handle reverse: if query has hyphens, check without them
      const queryWithoutHyphens = lowerQuery.replace(/-/g, " ");
      const categoryWithoutHyphens = product.category.replace(/-/g, " ");
      const categoryReverseMatch = categoryWithoutHyphens.includes(queryWithoutHyphens);
      
      return nameMatch || categoryMatch || categoryReverseMatch;
    }
  );
};
