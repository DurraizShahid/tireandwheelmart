import React from "react";
import { ShieldCheck, Users, Award, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="flex flex-col items-center bg-white text-foreground py-12 min-h-[calc(100vh-128px)]">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8 text-center">
          About Tire&Wheel
        </h1>

        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-xl text-muted-foreground text-center mb-8">
            Your trusted partner for premium wheels and tires since 2010
          </p>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Story</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Tire&Wheel was founded with a simple mission: to provide drivers with the highest quality wheels and tires
              at competitive prices, backed by exceptional customer service. What started as a small local tire shop has
              grown into a trusted online destination for wheel and tire enthusiasts across the country.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We understand that your vehicle's wheels and tires are more than just components—they're essential for your
              safety, performance, and style. That's why we partner with the world's leading manufacturers to bring you
              the best selection of tires and wheels for every need, from daily commuting to track performance.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-6">Why Choose Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 shadow-lg border-none bg-gradient-to-br from-gray-50 to-gray-100">
                <CardContent className="p-0 flex flex-col">
                  <ShieldCheck className="h-12 w-12 text-blue-600 mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">Quality Guaranteed</h3>
                  <p className="text-muted-foreground">
                    We source only the finest wheels and tires from trusted manufacturers, ensuring every product meets our
                    strict quality standards.
                  </p>
                </CardContent>
              </Card>

              <Card className="p-6 shadow-lg border-none bg-gradient-to-br from-gray-50 to-gray-100">
                <CardContent className="p-0 flex flex-col">
                  <Users className="h-12 w-12 text-green-600 mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">Expert Support</h3>
                  <p className="text-muted-foreground">
                    Our knowledgeable team is here to help you find the perfect wheels and tires for your vehicle,
                    whether you're upgrading for performance or replacing worn tires.
                  </p>
                </CardContent>
              </Card>

              <Card className="p-6 shadow-lg border-none bg-gradient-to-br from-gray-50 to-gray-100">
                <CardContent className="p-0 flex flex-col">
                  <Award className="h-12 w-12 text-purple-600 mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">Wide Selection</h3>
                  <p className="text-muted-foreground">
                    From all-season tires to performance wheels, we offer an extensive inventory to meet every driver's
                    needs and preferences.
                  </p>
                </CardContent>
              </Card>

              <Card className="p-6 shadow-lg border-none bg-gradient-to-br from-gray-50 to-gray-100">
                <CardContent className="p-0 flex flex-col">
                  <Heart className="h-12 w-12 text-red-600 mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">Customer First</h3>
                  <p className="text-muted-foreground">
                    Your satisfaction is our top priority. We're committed to providing exceptional service from selection
                    to delivery and beyond.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Commitment</h2>
            <p className="text-muted-foreground leading-relaxed">
              At Tire&Wheel, we're more than just a retailer—we're your partners in keeping your vehicle safe and performing
              at its best. We're committed to providing honest advice, quality products, and reliable service that you can
              count on. Whether you're a daily commuter, weekend enthusiast, or track-day regular, we have the wheels and
              tires you need to drive with confidence.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

