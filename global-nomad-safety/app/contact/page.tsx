import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Mail, MapPin, Phone, MessageSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us - Global Digital Nomad Safety Hub",
  description: "Get in touch with our team for questions, feedback, or safety assistance. We're here to help digital nomads stay safe around the world.",
  keywords: "contact digital nomad safety, safety assistance, travel safety help, nomad security contact",
};

export default function ContactPage() {
  return (
    <div className="container max-w-screen-xl mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col space-y-6 md:space-y-10 max-w-screen-lg mx-auto">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Contact Us</h1>
          <p className="text-muted-foreground max-w-[700px] mx-auto">
            Have questions or need assistance? We're here to help you stay safe during your global adventures.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Get In Touch</h2>
              <p className="text-muted-foreground mb-6">
                Fill out the form and our team will get back to you within 24 hours.
              </p>
            </div>
            
            <form className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="first-name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    First name
                  </label>
                  <Input id="first-name" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="last-name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Last name
                  </label>
                  <Input id="last-name" placeholder="Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Email
                </label>
                <Input id="email" type="email" placeholder="john@example.com" />
              </div>
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Subject
                </label>
                <Input id="subject" placeholder="How can we help you?" />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Message
                </label>
                <Textarea
                  id="message"
                  placeholder="Please provide as much detail as possible..."
                  className="min-h-[120px]"
                />
              </div>
              <Button type="submit" className="w-full">Send Message</Button>
            </form>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  Reach out to us through any of these channels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-sm text-muted-foreground">support@globalnomadsafety.com</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div>
                    <h3 className="font-medium">Phone</h3>
                    <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                    <p className="text-xs text-muted-foreground">Mon-Fri 9am-5pm (GMT)</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MessageSquare className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div>
                    <h3 className="font-medium">Live Chat</h3>
                    <p className="text-sm text-muted-foreground">Available 24/7 for premium members</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div>
                    <h3 className="font-medium">Headquarters</h3>
                    <p className="text-sm text-muted-foreground">123 Safety Street, Digital City, Remote Country</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="w-full">
                {[
                  {
                    question: "How quickly will I receive a response?",
                    answer: "We aim to respond to all inquiries within 24 hours during business days. Premium members receive priority support with faster response times."
                  },
                  {
                    question: "I need immediate safety assistance. What should I do?",
                    answer: "If you're facing an emergency situation, please contact local emergency services immediately by dialing the appropriate emergency number for your location. Premium members can access our 24/7 emergency assistance hotline."
                  },
                  {
                    question: "How do I report inaccurate safety information?",
                    answer: "We value accuracy in our safety data. Please use this contact form and select 'Report Inaccuracy' as the subject. Include as much detail as possible, including the location and specific information that needs correction."
                  },
                  {
                    question: "Can I request safety information for a specific destination?",
                    answer: "Yes! If you're interested in a destination not yet covered in our database, please let us know. We prioritize destinations based on user requests and nomad popularity."
                  },
                  {
                    question: "How can I partner with your platform?",
                    answer: "We're open to partnerships with travel insurance providers, co-working spaces, accommodation services, and other organizations serving the digital nomad community. Please contact our partnerships team at partners@globalnomadsafety.com."
                  }
                ].map((faq, index) => (
                  <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>

        <div className="bg-muted p-6 rounded-lg mt-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-xl font-bold mb-4">Need Urgent Safety Assistance?</h2>
            <p className="mb-6">
              Premium members have access to our 24/7 emergency support line. 
              Upgrade your account for immediate assistance whenever you need it.
            </p>
            <Link href="/pricing">
              <Button>Upgrade to Premium</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}