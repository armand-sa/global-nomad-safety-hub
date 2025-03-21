import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Shield, MapPin, Bell, PenTool, CreditCard } from "lucide-react";
import UserLocation from "@/components/location/UserLocation";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300">
              Stay Safe Anywhere in the World
            </h1>
            <UserLocation />
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Get real-time safety insights for travelers and digital nomads. Explore safety scores, local tips, and 
              emergency information for 200+ countries and cities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="gap-2">
                <Link href="/map">
                  <MapPin size={18} />
                  Explore Safety Map
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="gap-2">
                <Link href="/pricing">
                  <CreditCard size={18} />
                  View Pricing
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Score Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container max-w-screen-xl mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Global Safety Scores
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Our proprietary algorithm analyzes multiple data sources to provide accurate safety ratings for destinations worldwide.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
              {[
                { title: "Bangkok, Thailand", score: "85/100", description: "Generally Safe" },
                { title: "Lisbon, Portugal", score: "92/100", description: "Very Safe" },
                { title: "Medellin, Colombia", score: "71/100", description: "Exercise Caution" },
              ].map((item) => (
                <Card key={item.title} className="flex flex-col items-center text-center">
                  <CardHeader>
                    <CardTitle>{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold">{item.score}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Link href="/map">
              <Button>View All Destinations</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive Map Placeholder */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container max-w-screen-xl mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Interactive Safety Map
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Explore the world with our interactive map highlighting safety scores, recent incidents, and travel advisories.
              </p>
            </div>
          </div>
          <div className="mx-auto max-w-5xl border rounded-lg overflow-hidden">
            <div className="aspect-[16/9] bg-muted flex items-center justify-center">
              <MapPin className="h-16 w-16 text-muted-foreground" />
              <span className="sr-only">Map placeholder</span>
            </div>
          </div>
          <div className="flex justify-center mt-6">
            <Link href="/map">
              <Button>Explore Full Map</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Preview Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container max-w-screen-xl mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Latest Safety Insights
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Stay informed with the latest travel safety tips, guides, and insights from our experts.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
            {[
              {
                title: "10 Essential Safety Tips for Solo Female Travelers",
                excerpt: "Expert advice on staying safe while traveling solo as a woman in 2025.",
                author: "Maria Chen",
                date: "June 15, 2025",
                slug: "solo-female-traveler-safety-tips"
              },
              {
                title: "Digital Security for Nomads: Protecting Your Data Abroad",
                excerpt: "Learn how to safeguard your digital life while working from foreign countries.",
                author: "Alex Johnson",
                date: "June 10, 2025",
                slug: "digital-security-nomads"
              },
              {
                title: "Understanding Travel Insurance: What Digital Nomads Need to Know",
                excerpt: "A comprehensive guide to selecting the right insurance coverage for long-term travelers.",
                author: "James Wilson",
                date: "June 5, 2025",
                slug: "travel-insurance-digital-nomads"
              }
            ].map((post) => (
              <Card key={post.title} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{post.title}</CardTitle>
                  <CardDescription>{post.date} • {post.author}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-muted-foreground">{post.excerpt}</p>
                </CardContent>
                <div className="p-6 pt-0">
                  <Link href={`/blog/${post.slug}`}>
                    <Button variant="outline" size="sm">Read More</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
          <div className="flex justify-center mt-8">
            <Link href="/blog">
              <Button>View All Articles</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Subscription CTA */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
        <div className="container max-w-screen-xl mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Stay Informed, Stay Safe
              </h2>
              <p className="mx-auto max-w-[700px] md:text-xl">
                Subscribe to receive real-time safety alerts, travel advisories, and exclusive safety guides.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
              <form className="flex space-x-2">
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Enter your email"
                  type="email"
                  required
                />
                <Button type="submit">Subscribe</Button>
              </form>
              <p className="text-xs text-primary-foreground/80">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container max-w-screen-xl mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Why Choose Our Platform
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Comprehensive safety tools designed specifically for the modern digital nomad lifestyle.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
              {[
                {
                  title: "Global Coverage",
                  description: "Safety data for over 190 countries and 10,000+ cities worldwide.",
                  icon: <Globe className="h-10 w-10" />
                },
                {
                  title: "Real-Time Alerts",
                  description: "Instant notifications about safety incidents in your area of interest.",
                  icon: <Bell className="h-10 w-10" />
                },
                {
                  title: "Expert Insights",
                  description: "Safety guides written by security professionals and experienced travelers.",
                  icon: <Shield className="h-10 w-10" />
                }
              ].map((feature) => (
                <Card key={feature.title} className="flex flex-col items-center text-center">
                  <CardHeader>
                    <div className="mb-4">{feature.icon}</div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}