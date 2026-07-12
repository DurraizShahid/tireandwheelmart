"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function NewReviewPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/admin/reviews");
  }, [router]);
  return null;
}
