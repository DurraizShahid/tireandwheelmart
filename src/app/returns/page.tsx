import React from "react";
import { Package, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function ReturnsPage() {
  return (
    <div className="flex flex-col items-center bg-white text-foreground py-12 min-h-[calc(100vh-128px)]">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8 text-center">
          Returns & Refunds
        </h1>

        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-4">Return Policy</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              At Tire&Wheel, we want you to be completely satisfied with your purchase. We offer a 30-day return policy
              on unused tires and wheels that are in their original packaging and condition.
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
            <Card className="p-6 shadow-lg border-none bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="p-0">
                <CheckCircle className="h-10 w-10 text-green-600 mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Eligible for Return</h3>
                <ul className="text-muted-foreground space-y-2 text-sm">
                  <li>• Unused tires in original packaging</li>
                  <li>• Unused wheels in original packaging</li>
                  <li>• Items within 30 days of purchase</li>
                  <li>• Items with original receipt or order number</li>
                  <li>• Items that haven't been mounted or installed</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="p-6 shadow-lg border-none bg-gradient-to-br from-red-50 to-red-100">
              <CardContent className="p-0">
                <AlertCircle className="h-10 w-10 text-red-600 mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Not Eligible for Return</h3>
                <ul className="text-muted-foreground space-y-2 text-sm">
                  <li>• Tires or wheels that have been mounted</li>
                  <li>• Items showing signs of use or wear</li>
                  <li>• Items without original packaging</li>
                  <li>• Items purchased more than 30 days ago</li>
                  <li>• Custom or special order items (unless defective)</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <section>
            <h2 className="text-3xl font-bold text-foreground mb-4">How to Return</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold">
                    1
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Contact Us</h3>
                  <p className="text-muted-foreground">
                    Reach out to our customer service team via phone, email, or our contact form to initiate a return.
                    Please have your order number ready.
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
                  <h3 className="font-semibold text-foreground mb-1">Package Items</h3>
                  <p className="text-muted-foreground">
                    Securely package the items in their original packaging. Include all original accessories,
                    documentation, and the original receipt or packing slip.
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
                  <h3 className="font-semibold text-foreground mb-1">Ship Back</h3>
                  <p className="text-muted-foreground">
                    We'll provide you with a return shipping label and instructions. Ship the items back to us
                    using the provided label within 7 days of receiving return authorization.
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
                  <h3 className="font-semibold text-foreground mb-1">Receive Refund</h3>
                  <p className="text-muted-foreground">
                    Once we receive and inspect your return, we'll process your refund to the original payment method.
                    Refunds typically appear within 5-10 business days.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-foreground mb-4">Refund Information</h2>
            <Card className="p-6 shadow-lg border-none bg-gradient-to-br from-gray-50 to-gray-100">
              <CardContent className="p-0 space-y-4">
                <div className="flex items-start gap-4">
                  <Clock className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Processing Time</h3>
                    <p className="text-muted-foreground">
                      Refunds are processed within 5-10 business days after we receive and inspect your returned items.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Package className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Shipping Costs</h3>
                    <p className="text-muted-foreground">
                      Original shipping costs are non-refundable. Return shipping costs are the responsibility of the
                      customer unless the item was defective or we made an error.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-foreground mb-4">Defective Items</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you receive a defective tire or wheel, please contact us immediately. We'll arrange for a replacement
              or full refund, including return shipping costs. Defective items are covered under manufacturer warranties,
              and we'll work with you to resolve the issue quickly.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-foreground mb-4">Questions?</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If you have any questions about our return policy or need assistance with a return, please don't hesitate
              to contact our customer service team. We're here to help!
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

