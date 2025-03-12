import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

export const metadata: Metadata = {
  title: "Safety Blog - Global Digital Nomad Safety Hub",
  description: "Read expert safety tips, guides, and insights for digital nomads traveling around the world.",
  keywords: "digital nomad blog, travel safety blog, nomad safety tips, global travel advice",
  openGraph: {
    title: "Safety Blog - Global Digital Nomad Safety Hub",
    description: "Read expert safety tips, guides, and insights for digital nomads traveling around the world.",
    type: "website",
  }
};

export default function BlogPage() {
  return (
    <div className="container max-w-screen-xl mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col space-y-6 max-w-screen-lg mx-auto">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Safety Blog</h1>
          <p className="text-muted-foreground max-w-[700px]">
            Expert safety tips, guides, and insights for digital nomads traveling the world.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search articles..." className="pl-9" />
          </div>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="safety-tips">Safety Tips</TabsTrigger>
              <TabsTrigger value="destination-guides">Destination Guides</TabsTrigger>
              <TabsTrigger value="tech-security">Tech Security</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "10 Essential Safety Tips for Solo Female Travelers",
              excerpt: "Expert advice on staying safe while traveling solo as a woman in 2025, covering both physical safety and digital security concerns abroad.",
              author: "Maria Chen",
              date: "June 15, 2025",
              category: "Safety Tips",
              readTime: "8 min read",
              slug: "solo-female-traveler-safety-tips"
            },
            {
              title: "Digital Security for Nomads: Protecting Your Data Abroad",
              excerpt: "Learn how to safeguard your digital life while working from foreign countries, including VPN usage, secure Wi-Fi practices, and encryption tips.",
              author: "Alex Johnson",
              date: "June 10, 2025",
              category: "Tech Security",
              readTime: "10 min read",
              slug: "digital-security-nomads"
            },
            {
              title: "Understanding Travel Insurance: What Digital Nomads Need to Know",
              excerpt: "A comprehensive guide to selecting the right insurance coverage for long-term travelers, including medical evacuation and equipment protection.",
              author: "James Wilson",
              date: "June 5, 2025",
              category: "Safety Tips",
              readTime: "12 min read",
              slug: "travel-insurance-digital-nomads"
            },
            {
              title: "Medellin Safety Guide: Neighborhoods to Embrace and Avoid",
              excerpt: "An up-to-date safety assessment of Colombia's digital nomad hotspot, with detailed neighborhood breakdowns and practical safety advice.",
              author: "Carlos Rodriguez",
              date: "May 28, 2025",
              category: "Destination Guides",
              readTime: "15 min read",
              slug: "medellin-safety-guide"
            },
            {
              title: "How to Secure Your Apartment When Renting Abroad",
              excerpt: "Practical tips for assessing apartment safety and implementing additional security measures when renting accommodations in foreign countries.",
              author: "Sophie Martin",
              date: "May 22, 2025",
              category: "Safety Tips",
              readTime: "7 min read",
              slug: "apartment-security-abroad"
            },
            {
              title: "Southeast Asia's Safest Destinations for Digital Nomads in 2025",
              excerpt: "Discover the most secure cities for remote workers in Southeast Asia, with detailed safety analyses and community insights.",
              author: "Li Wei",
              date: "May 18, 2025",
              category: "Destination Guides",
              readTime: "14 min read",
              slug: "southeast-asia-safest-destinations"
            }
          ].map((post) => (
            <Card key={post.slug} className="flex flex-col">
              <CardHeader className="pb-0">
                <div className="flex justify-between items-start">
                  <Badge variant="outline">{post.category}</Badge>
                  <span className="text-xs text-muted-foreground">{post.readTime}</span>
                </div>
                <CardTitle className="mt-2 hover:text-primary transition-colors">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </CardTitle>
                <CardDescription className="pt-1">{post.date} • By {post.author}</CardDescription>
              </CardHeader>
              <CardContent className="py-4 flex-1">
                <p className="text-muted-foreground">{post.excerpt}</p>
              </CardContent>
              <CardFooter>
                <Link href={`/blog/${post.slug}`} className="w-full">
                  <Button variant="outline" className="w-full">Read Article</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="flex justify-center mt-6">
          <Button variant="outline">Load More Articles</Button>
        </div>

        <div className="bg-muted p-8 rounded-lg mt-8">
          <div className="text-center max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h2>
            <p className="text-muted-foreground mb-6">
              Get the latest safety tips and travel insights delivered directly to your inbox.
            </p>
            <form className="flex gap-2">
              <Input type="email" placeholder="Your email address" required />
              <Button type="submit">Subscribe</Button>
            </form>
            <p className="text-xs text-muted-foreground mt-2">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}