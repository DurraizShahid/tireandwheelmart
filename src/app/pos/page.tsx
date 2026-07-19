"use client"

import dynamic from "next/dynamic"

const POSPage = dynamic(() => import("./pos-page"), { ssr: false })

export default function POSPageWrapper() {
  return <POSPage />
}
