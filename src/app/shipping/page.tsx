import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Shipping Information",
  description: "Tire&Wheel Mart shipping policies, delivery times, and shipping rates for tires and wheels.",
};
import { Truck, Package, Clock, MapPin, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function ShippingPage() {
  return (
    <div className="flex flex-col items-center bg-white text-foreground py-12 min-h-[calc(100vh-128px)]">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8 text-center">
          Shipping Information
        </h1>

        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-4">Shipping Options</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 shadow-lg border-none bg-gradient-to-br from-blue-50 to-blue-100">
                <CardContent className="p-0">
                  <Truck className="h-10 w-10 text-blue-600 mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">Standard Shipping</h3>
                  <p className="text-muted-foreground mb-2">
                    <strong>Delivery Time:</strong> 5-7 business days
                  </p>
                  <p className="text-muted-foreground mb-2">
                    <strong>Cost:</strong> Calculated at checkout
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Standard ground shipping for most locations. Perfect for non-urgent orders.
                  </p>
                </CardContent>
              </Card>

              <Card className="p-6 shadow-lg border-none bg-gradient-to-br from-green-50 to-green-100">
                <CardContent className="p-0">
                  <Package className="h-10 w-10 text-green-600 mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">Express Shipping</h3>
                  <p className="text-muted-foreground mb-2">
                    <strong>Delivery Time:</strong> 2-3 business days
                  </p>
                  <p className="text-muted-foreground mb-2">
                    <strong>Cost:</strong> Additional fee applies
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Faster delivery for when you need your wheels or tires quickly.
                  </p>
                </CardContent>
              </Card>

              <Card className="p-6 shadow-lg border-none bg-gradient-to-br from-purple-50 to-purple-100">
                <CardContent className="p-0">
                  <Clock className="h-10 w-10 text-purple-600 mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">Overnight Shipping</h3>
                  <p className="text-muted-foreground mb-2">
                    <strong>Delivery Time:</strong> Next business day
                  </p>
                  <p className="text-muted-foreground mb-2">
                    <strong>Cost:</strong> Additional fee applies
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Priority overnight delivery for urgent orders. Order by 2 PM EST for next-day delivery.
                  </p>
                </CardContent>
              </Card>

              <Card className="p-6 shadow-lg border-none bg-gradient-to-br from-orange-50 to-orange-100">
                <CardContent className="p-0">
                  <MapPin className="h-10 w-10 text-orange-600 mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">Local Pickup</h3>
                  <p className="text-muted-foreground mb-2">
                    <strong>Available:</strong> At our store location
                  </p>
                  <p className="text-muted-foreground mb-2">
                    <strong>Cost:</strong> Free
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Pick up your order at our store. We&apos;ll notify you when your order is ready.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-foreground mb-4">Shipping Process</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold">
                    1
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Order Processing</h3>
                  <p className="text-muted-foreground">
                    Most orders are processed and shipped within 1-2 business days. You&apos;ll receive a confirmation email
                    with your order details and tracking information.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold">
                    2
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Packaging</h3>
                  <p className="text-muted-foreground">
                    Your wheels and tires are carefully packaged to ensure they arrive in perfect condition. We use
                    protective materials and secure packaging to prevent damage during transit.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold">
                    3
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Tracking</h3>
                  <p className="text-muted-foreground">
                    Once your order ships, you&apos;ll receive a tracking number via email. Use this to monitor your
                    shipment&apos;s progress and estimated delivery date.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold">
                    4
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Delivery</h3>
                  <p className="text-muted-foreground">
                    Your order will be delivered to the address you specified during checkout. Please ensure someone
                    is available to receive the shipment, as wheels and tires can be heavy and require proper handling.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-foreground mb-4">Shipping Locations</h2>
            <Card className="p-6 shadow-lg border-none bg-gradient-to-br from-gray-50 to-gray-100">
              <CardContent className="p-0">
                <p className="text-muted-foreground mb-4">
                  We currently ship to all 50 states within the United States. Shipping costs are calculated at checkout
                  based on your location and the weight of your order.
                </p>
                <p className="text-muted-foreground">
                  For international shipping inquiries, please contact our customer service team to discuss available
                  options and pricing.
                </p>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-foreground mb-4">Important Notes</h2>
            <div className="space-y-4">
              <Card className="p-4 border-l-4 border-blue-600">
                <CardContent className="p-0">
                  <div className="flex items-start gap-3">
                    <Shield className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Inspection Upon Delivery</h3>
                      <p className="text-muted-foreground text-sm">
                        Please inspect your shipment immediately upon delivery. If you notice any damage, contact us
                        within 48 hours. Take photos of any damage and keep all packaging materials.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-4 border-l-4 border-green-600">
                <CardContent className="p-0">
                  <div className="flex items-start gap-3">
                    <Package className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Heavy Items</h3>
                      <p className="text-muted-foreground text-sm">
                        Wheels and tires are heavy items. Please ensure you have assistance when moving them.
                        Consider having them delivered to a location where you can easily access them.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-4 border-l-4 border-orange-600">
                <CardContent className="p-0">
                  <div className="flex items-start gap-3">
                    <Clock className="h-6 w-6 text-orange-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Delivery Delays</h3>
                      <p className="text-muted-foreground text-sm">
                        While we strive for on-time delivery, weather conditions, carrier delays, or other factors
                        beyond our control may affect delivery times. We&apos;ll keep you informed of any significant delays.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-foreground mb-4">Questions?</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If you have any questions about shipping, delivery times, or need to make special arrangements,
              please contact our customer service team. We&apos;re here to help!
            </p>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
            >
              Contact Us
            </a>
          </section>
        </div>
      </div>
    </div>
  );
}

