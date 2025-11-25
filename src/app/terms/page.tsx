import React from "react";
import { FileText, AlertCircle, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <div className="flex flex-col items-center bg-white dark:bg-background text-foreground py-12 min-h-[calc(100vh-128px)]">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8 text-center">
          Terms of Service
        </h1>
        <p className="text-lg text-muted-foreground text-center mb-4">
          Last Updated: {new Date().toLocaleDateString()}
        </p>

        <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
          <section>
            <p className="text-muted-foreground leading-relaxed">
              Welcome to Tire&Wheel. These Terms of Service ("Terms") govern your access to and use of our website and
              services. By accessing or using our website, you agree to be bound by these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-foreground mb-4">Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing or using the Tire&Wheel website, you acknowledge that you have read, understood, and agree
              to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, please do not use
              our website.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-foreground mb-4">Products and Services</h2>
            <Card className="p-6 shadow-lg border-none bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
              <CardContent className="p-0">
                <FileText className="h-10 w-10 text-blue-600 dark:text-blue-400 mb-4" />
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Product Information</h3>
                    <p className="text-muted-foreground text-sm">
                      We strive to provide accurate product descriptions, images, and pricing. However, we do not warrant
                      that product descriptions or other content on our website is accurate, complete, reliable, current,
                      or error-free.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Pricing</h3>
                    <p className="text-muted-foreground text-sm">
                      All prices are subject to change without notice. We reserve the right to correct any pricing errors,
                      even after an order has been placed. If a pricing error is discovered, we will notify you and provide
                      the option to proceed at the correct price or cancel your order.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Availability</h3>
                    <p className="text-muted-foreground text-sm">
                      Product availability is subject to change. We reserve the right to limit quantities and to discontinue
                      products at any time. If a product becomes unavailable after you place an order, we will notify you
                      and provide alternatives or a full refund.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-foreground mb-4">Orders and Payment</h2>
            <div className="space-y-4">
              <Card className="p-4 border-l-4 border-blue-600">
                <CardContent className="p-0">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Order Acceptance</h3>
                      <p className="text-muted-foreground text-sm">
                        Your order is an offer to purchase products from us. We reserve the right to accept or reject your
                        order for any reason, including product availability, errors in pricing or product information, or
                        suspected fraud.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-4 border-l-4 border-green-600">
                <CardContent className="p-0">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Payment</h3>
                      <p className="text-muted-foreground text-sm">
                        Payment must be received before we process and ship your order. We accept major credit cards and
                        other payment methods as indicated on our website. All payments are processed securely through
                        our payment providers.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-foreground mb-4">Warranties and Disclaimers</h2>
            <Card className="p-6 shadow-lg border-none bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
              <CardContent className="p-0">
                <AlertCircle className="h-10 w-10 text-orange-600 dark:text-orange-400 mb-4" />
                <p className="text-muted-foreground leading-relaxed mb-4">
                  <strong>Product Warranties:</strong> All tires and wheels are covered by their respective manufacturer warranties.
                  We will assist you in processing warranty claims, but warranty terms are set by the manufacturers.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  <strong>Website Disclaimer:</strong> Our website and services are provided "as is" without warranties of any
                  kind, either express or implied. We do not warrant that our website will be uninterrupted, secure, or error-free.
                </p>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-foreground mb-4">Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              To the fullest extent permitted by law, Tire&Wheel shall not be liable for any indirect, incidental, special,
              consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly,
              or any loss of data, use, goodwill, or other intangible losses resulting from your use of our website or products.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-foreground mb-4">User Conduct</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              You agree to use our website only for lawful purposes and in accordance with these Terms. You agree not to:
            </p>
            <ul className="text-muted-foreground space-y-2 list-disc list-inside">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe upon the rights of others</li>
              <li>Transmit any harmful code or malware</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt our website or services</li>
              <li>Use our website for any fraudulent or illegal purpose</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-foreground mb-4">Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed">
              All content on our website, including text, graphics, logos, images, and software, is the property of Tire&Wheel
              or its content suppliers and is protected by copyright and other intellectual property laws. You may not reproduce,
              distribute, or create derivative works from our content without our express written permission.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-foreground mb-4">Modifications to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to modify these Terms at any time. We will notify you of any material changes by posting
              the updated Terms on this page and updating the "Last Updated" date. Your continued use of our website after
              such changes constitutes acceptance of the modified Terms.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-foreground mb-4">Governing Law</h2>
            <p className="text-muted-foreground leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of the state in which Tire&Wheel
              operates, without regard to its conflict of law provisions. Any disputes arising from these Terms or your use
              of our website shall be resolved in the appropriate courts of that jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-foreground mb-4">Contact Information</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If you have questions about these Terms of Service, please contact us:
            </p>
            <Card className="p-6 shadow-lg border-none bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
              <CardContent className="p-0">
                <p className="text-muted-foreground">
                  <strong>Email:</strong> legal@tireandwheel.com<br />
                  <strong>Phone:</strong> (555) 123-4567<br />
                  <strong>Address:</strong> 123 Tire Street, Wheel City, WC 12345
                </p>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}

