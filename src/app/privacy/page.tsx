import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Tire&Wheel Mart privacy policy. Learn how we collect, use, and protect your personal information.",
};
import { Shield, Lock, Eye, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <div className="flex flex-col items-center bg-white text-foreground py-12 min-h-[calc(100vh-128px)]">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8 text-center">
          Privacy Policy
        </h1>
        <p className="text-lg text-muted-foreground text-center mb-4">
          Last Updated: {new Date().toLocaleDateString()}
        </p>

        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <p className="text-muted-foreground leading-relaxed">
              At Tire&Wheel, we are committed to protecting your privacy. This Privacy Policy explains how we collect,
              use, disclose, and safeguard your information when you visit our website and make purchases.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-foreground mb-4">Information We Collect</h2>
            <div className="space-y-4">
              <Card className="p-4 border-l-4 border-blue-600">
                <CardContent className="p-0">
                  <div className="flex items-start gap-3">
                    <FileText className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Personal Information</h3>
                      <p className="text-muted-foreground text-sm">
                        We collect information that you provide directly to us, including:
                      </p>
                      <ul className="text-muted-foreground text-sm list-disc list-inside mt-2 space-y-1">
                        <li>Name and contact information (email, phone, address)</li>
                        <li>Payment information (processed securely through our payment providers)</li>
                        <li>Order history and preferences</li>
                        <li>Account credentials if you create an account</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-4 border-l-4 border-green-600">
                <CardContent className="p-0">
                  <div className="flex items-start gap-3">
                    <Eye className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Automatically Collected Information</h3>
                      <p className="text-muted-foreground text-sm">
                        When you visit our website, we automatically collect certain information:
                      </p>
                      <ul className="text-muted-foreground text-sm list-disc list-inside mt-2 space-y-1">
                        <li>Device information and browser type</li>
                        <li>IP address and location data</li>
                        <li>Pages visited and time spent on site</li>
                        <li>Referring website addresses</li>
                        <li>Cookies and similar tracking technologies</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-foreground mb-4">How We Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We use the information we collect for various purposes, including:
            </p>
            <ul className="text-muted-foreground space-y-2 list-disc list-inside">
              <li>Processing and fulfilling your orders for wheels and tires</li>
              <li>Communicating with you about your orders, products, and services</li>
              <li>Providing customer support and responding to inquiries</li>
              <li>Sending promotional emails and marketing communications (with your consent)</li>
              <li>Improving our website, products, and services</li>
              <li>Detecting and preventing fraud or unauthorized access</li>
              <li>Complying with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-foreground mb-4">Information Sharing</h2>
            <Card className="p-6 shadow-lg border-none bg-gradient-to-br from-gray-50 to-gray-100">
              <CardContent className="p-0">
                <Lock className="h-10 w-10 text-blue-600 mb-4" />
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We do not sell your personal information. We may share your information only in the following circumstances:
                </p>
                <ul className="text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>Service Providers:</strong> With trusted third-party service providers who assist in operating our website, processing payments, and delivering products</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                  <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                  <li><strong>With Your Consent:</strong> When you explicitly authorize us to share your information</li>
                </ul>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-foreground mb-4">Data Security</h2>
            <Card className="p-6 shadow-lg border-none bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="p-0">
                <Shield className="h-10 w-10 text-green-600 mb-4" />
                <p className="text-muted-foreground leading-relaxed">
                  We implement appropriate technical and organizational security measures to protect your personal information
                  against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over
                  the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
                </p>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-foreground mb-4">Cookies and Tracking</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We use cookies and similar tracking technologies to enhance your browsing experience, analyze website traffic,
              and personalize content. You can control cookie preferences through your browser settings, though this may
              affect website functionality.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-foreground mb-4">Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Depending on your location, you may have certain rights regarding your personal information, including:
            </p>
            <ul className="text-muted-foreground space-y-2 list-disc list-inside">
              <li>The right to access your personal information</li>
              <li>The right to correct inaccurate information</li>
              <li>The right to delete your personal information</li>
              <li>The right to opt-out of marketing communications</li>
              <li>The right to data portability</li>
              <li>The right to object to certain processing activities</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              To exercise these rights, please contact us using the information provided in the Contact section below.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-foreground mb-4">Children's Privacy</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our website is not intended for children under the age of 18. We do not knowingly collect personal information
              from children. If you believe we have collected information from a child, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-foreground mb-4">Changes to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the
              new Privacy Policy on this page and updating the "Last Updated" date. We encourage you to review this policy
              periodically.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-foreground mb-4">Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If you have questions or concerns about this Privacy Policy or our data practices, please contact us:
            </p>
            <Card className="p-6 shadow-lg border-none bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-0">
                <p className="text-muted-foreground">
                  <strong>Email:</strong> privacy@tireandwheel.com<br />
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

