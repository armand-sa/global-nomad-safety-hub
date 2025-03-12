import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing - Global Digital Nomad Safety Hub",
  description: "Choose the perfect plan to keep you safe during your global travels. Compare our Free and Premium safety subscription plans.",
  keywords: "digital nomad subscription, travel safety plans, nomad safety pricing, traveler safety membership",
};

export default function PricingPage() {
  return (
    <div className="container max-w-screen-xl mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col items-center text-center space-y-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Simple, Transparent Pricing
        </h1>
        <p className="text-muted-foreground max-w-[700px]">
          Choose the perfect plan to stay safe during your global adventures.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Free Plan */}
        <Card className="border-border">
          <CardHeader className="pb-8">
            <CardTitle className="text-2xl">Free Plan</CardTitle>
            <div className="mt-4">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-muted-foreground ml-2">forever</span>
            </div>
            <CardDescription className="mt-2">
              Essential safety features for occasional travelers.
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-8">
            <ul className="space-y-3">
              {[
                "Basic safety scores for 50+ popular destinations",
                "Limited map access with basic safety overlays",
                "Weekly safety digest newsletter",
                "Standard emergency contact resources",
                "Community forum access",
              ].map((feature) => (
                <li key={feature} className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
              {[
                "Real-time safety alerts",
                "Custom location monitoring",
                "Detailed safety reports",
                "Emergency assistance hotline",
                "Offline safety maps",
              ].map((feature) => (
                <li key={feature} className="flex items-start text-muted-foreground">
                  <XCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Link href="/login?signup=true" className="w-full">
              <Button variant="outline" className="w-full">Sign Up Free</Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Premium Plan */}
        <Card className="border-primary relative">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-bold">
            RECOMMENDED
          </div>
          <CardHeader className="pb-8">
            <CardTitle className="text-2xl">Premium Plan</CardTitle>
            <div className="mt-4">
              <span className="text-4xl font-bold">$9.99</span>
              <span className="text-muted-foreground ml-2">per month</span>
            </div>
            <CardDescription className="mt-2">
              Comprehensive safety features for digital nomads.
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-8">
            <ul className="space-y-3">
              {[
                "Detailed safety scores for 190+ countries and 10,000+ cities",
                "Full interactive safety map with all data layers",
                "Real-time safety alerts for saved locations",
                "Custom location monitoring (up to 20 locations)",
                "Detailed safety reports and city guides",
                "24/7 emergency assistance hotline",
                "Offline safety maps for travel without connectivity",
                "Priority support via email and chat",
                "Early access to new safety features",
                "No advertisements"
              ].map((feature) => (
                <li key={feature} className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Link href="/login?signup=true&plan=premium" className="w-full">
              <Button className="w-full">Get Premium</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-12 text-center space-y-4">
        <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto space-y-6 text-left mt-6">
          {[
            {
              question: "Can I cancel my subscription at any time?",
              answer: "Yes, you can cancel your Premium subscription at any time. Your benefits will continue until the end of your billing period, after which you'll revert to the Free plan."
            },
            {
              question: "Is there an annual payment option?",
              answer: "Yes, we offer an annual plan at $99.99 per year, which saves you approximately 17% compared to the monthly plan."
            },
            {
              question: "How often is safety data updated?",
              answer: "Safety scores are updated weekly. Real-time alerts are processed and sent immediately as they occur."
            },
            {
              question: "Can I use the app offline while traveling?",
              answer: "Premium users can download safety maps and information for offline use. Free users need an internet connection to access our services."
            },
            {
              question: "Do you offer discounts for groups or companies?",
              answer: "Yes, we offer special rates for teams and companies. Please contact our sales team for more information."
            }
          ].map((faq, index) => (
            <div key={index} className="border-b border-border pb-4">
              <h3 className="font-medium mb-2">{faq.question}</h3>
              <p className="text-sm text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 text-center bg-muted p-8 rounded-lg max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Need a Custom Solution?</h2>
        <p className="mb-6">
          We offer custom plans for businesses, travel agencies, universities, and organizations
          with specific safety requirements.
        </p>
        <Link href="/contact">
          <Button>Contact Us</Button>
        </Link>
      </div>
    </div>
  );
}