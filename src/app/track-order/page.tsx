import type { Metadata } from "next";
import TrackOrderScreen from "@/components/track-order-screen";

export const metadata: Metadata = {
  title: "Track Order",
  description: "Track your Tire&Wheel Mart order status in real time.",
};

export default function TrackOrderPage() {
  return <TrackOrderScreen />;
}