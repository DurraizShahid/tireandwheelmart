"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PackageSearch } from "lucide-react";
import { toast } from "sonner";

const TrackOrderScreen = () => {
  const [orderId, setOrderId] = React.useState("");

  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderId.trim()) {
      toast.info(`Tracking order: ${orderId}`);
      // In a real application, you would make an API call here
      // to fetch order status based on the orderId.
      console.log("Tracking order:", orderId);
    } else {
      toast.error("Please enter an Order ID.");
    }
  };

  return (
    <div className="flex flex-col items-center bg-white dark:bg-background text-foreground py-12 min-h-[calc(100vh-128px)]"> {/* Adjusted min-h to account for header/footer */}
      <div className="container max-w-md mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <PackageSearch className="h-16 w-16 text-blue-600 dark:text-blue-400 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-primary dark:text-primary-foreground mb-4">
          Track Your Order
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Enter your order ID to get the latest updates on your shipment.
        </p>

        <form onSubmit={handleTrackOrder} className="w-full space-y-6">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="orderId" className="text-left text-base font-medium">Order ID</Label>
            <Input
              type="text"
              id="orderId"
              placeholder="e.g., #123456789"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full py-3 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
            />
          </div>
          <Button
            type="submit"
            className="w-full py-3 text-lg font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-300 shadow-lg flex items-center justify-center gap-2"
          >
            Track Order
          </Button>
        </form>
      </div>
    </div>
  );
};

export default TrackOrderScreen;