import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Calendar, Clock, UserCircle, Share2, Bookmark } from "lucide-react";

// Hey! This is where we store our blog articles. Think of it like a filing cabinet!
const articles = [
  {
    slug: "solo-female-traveler-safety-tips",
    title: "10 Essential Safety Tips for Solo Female Travelers",
    description: "Expert advice on staying safe while traveling solo as a woman in 2025, covering both physical safety and digital security concerns abroad.",
    content: `
      <p>Solo female travel continues to grow in popularity, but safety remains a top concern. This comprehensive guide provides practical safety advice specifically for women exploring the world alone in 2025.</p>
      
      <h2>Before You Leave</h2>
      <p>Research your destination thoroughly. Understanding local customs, dress codes, and areas to avoid is essential. Share your itinerary with trusted friends or family and set up regular check-in times.</p>
      
      <h2>Accommodation Safety</h2>
      <p>Choose accommodations with good security reviews. Prefer rooms between the 2nd and 6th floors—high enough to prevent easy break-ins but low enough for fire safety. Always use all locks and never open your door without confirming who's there.</p>
      
      <h2>Digital Security</h2>
      <p>Use a VPN when connecting to public Wi-Fi. Enable two-factor authentication on all accounts and consider using a secondary phone number for local contacts. Regularly back up your photos and documents to secure cloud storage.</p>
      
      <h2>Transportation Safety</h2>
      <p>Use reputable transportation services, ideally those that can be booked through apps with tracking features. When taking taxis, sit in the back seat and share your live location with a friend.</p>
      
      <h2>Trust Your Instincts</h2>
      <p>If a situation doesn't feel right, don't worry about seeming rude—remove yourself immediately. Your safety is more important than social politeness.</p>
    `,
    author: "Maria Chen",
    authorBio: "Maria has traveled solo to over 50 countries and specializes in women's travel safety.",
    date: "June 15, 2025",
    category: "Safety Tips",
    readTime: "8 min read",
    relatedArticles: ["digital-security-nomads", "apartment-security-abroad"]
  },
  {
    slug: "digital-security-nomads",
    title: "Digital Security for Nomads: Protecting Your Data Abroad",
    description: "Learn how to safeguard your digital life while working from foreign countries, including VPN usage, secure Wi-Fi practices, and encryption tips.",
    content: `
      <p>Working remotely from anywhere in the world offers incredible freedom, but it also presents unique digital security challenges. This guide covers essential practices to keep your data safe while working abroad.</p>
      
      <h2>Secure Your Devices</h2>
      <p>Use strong, unique passwords for all accounts and a password manager to keep track of them. Enable full-disk encryption on all devices and set up remote wipe capabilities in case of theft.</p>
      
      <h2>Public Wi-Fi Safety</h2>
      <p>Never connect to public Wi-Fi without a VPN. Even networks that appear legitimate can be compromised or spoofed. Consider using a personal hotspot from a local SIM card instead when handling sensitive information.</p>
      
      <h2>Two-Factor Everything</h2>
      <p>Enable two-factor authentication for all important accounts, especially email, banking, and cloud storage. Use authentication apps rather than SMS when possible, as SIM swapping attacks are increasingly common.</p>
      
      <h2>Regular Backups</h2>
      <p>Maintain the 3-2-1 backup rule: three copies of your data, on two different media types, with one copy stored offsite. Automate your backup process to ensure consistency.</p>
      
      <h2>Border Security</h2>
      <p>Be aware that some countries may inspect electronic devices at border crossings. Consider traveling with a "clean" device containing minimal personal data when entering countries known for invasive digital searches.</p>
    `,
    author: "Alex Johnson",
    authorBio: "Alex is a cybersecurity specialist who has been working remotely from around the world for over a decade.",
    date: "June 10, 2025",
    category: "Tech Security",
    readTime: "10 min read",
    relatedArticles: ["solo-female-traveler-safety-tips", "travel-insurance-digital-nomads"]
  },
  {
    slug: "travel-insurance-digital-nomads",
    title: "Understanding Travel Insurance: What Digital Nomads Need to Know",
    description: "A comprehensive guide to selecting the right insurance coverage for long-term travelers, including medical evacuation and equipment protection.",
    content: `
      <p>Having the right travel insurance is essential for digital nomads. This guide helps you understand your options and choose coverage that meets your specific needs.</p>
      
      <h2>Types of Insurance Coverage</h2>
      <p>Digital nomads should consider several types of coverage: health insurance, travel insurance, equipment insurance, and liability insurance. Each serves a different purpose and together they provide comprehensive protection.</p>
      
      <h2>Medical Coverage</h2>
      <p>Look for plans with high coverage limits and low deductibles. Ensure they cover emergency medical evacuation and repatriation. Consider how pre-existing conditions are handled and whether preventive care is included.</p>
      
      <h2>Equipment Protection</h2>
      <p>Your work equipment is your livelihood. Choose insurance that specifically covers electronics with adequate replacement values. Be aware of deductibles and exclusions for theft without force.</p>
      
      <h2>Long-term vs. Short-term Plans</h2>
      <p>Many standard travel insurance policies only cover trips up to 90 days. As a digital nomad, you'll need specialized long-term coverage or renewable policies that accommodate your lifestyle.</p>
      
      <h2>Regional Considerations</h2>
      <p>Insurance costs and coverage vary significantly by region. Some areas with higher medical costs or security risks may require supplemental coverage. Research destination-specific requirements before arrival.</p>
    `,
    author: "James Wilson",
    date: "June 5, 2025",
    authorBio: "James has been a digital nomad for 8 years and specializes in financial planning for location-independent professionals.",
    category: "Safety Tips",
    readTime: "12 min read",
    relatedArticles: ["digital-security-nomads", "southeast-asia-safest-destinations"]
  },
  {
    slug: "medellin-safety-guide",
    title: "Medellin Safety Guide: Neighborhoods to Embrace and Avoid",
    description: "An up-to-date safety assessment of Colombia's digital nomad hotspot, with detailed neighborhood breakdowns and practical safety advice.",
    content: `
      <p>Medellin has transformed from one of the world's most dangerous cities to a thriving digital nomad hub. However, safety considerations still vary significantly by neighborhood.</p>
      
      <h2>Safe Neighborhoods</h2>
      <p>El Poblado remains the safest and most popular area for expats and digital nomads, with excellent infrastructure and security. Laureles-Estadio and Envigado are also good options with more local character and strong safety records.</p>
      
      <h2>Use Caution Areas</h2>
      <p>Neighborhoods like Belén and Sabaneta are generally safe during the day but require increased awareness at night. Follow local recommendations and use ride-sharing services after dark.</p>
      
      <h2>Areas to Avoid</h2>
      <p>The downtown area (Centro) should be visited with caution during the day and avoided at night. Neighborhoods in the northeastern comunas should generally be avoided unless you're with a local guide.</p>
      
      <h2>Transportation Safety</h2>
      <p>Use regulated taxi services or ride-sharing apps rather than hailing taxis on the street. The Metro system is safe, efficient, and well-patrolled, making it an excellent option during operating hours.</p>
      
      <h2>Local Safety Tips</h2>
      <p>Practice "no dar papaya" (don't show off valuables). Keep phone usage minimal in public, avoid wearing flashy jewelry, and be discreet when accessing money. Learning basic Spanish phrases significantly improves your safety and experience.</p>
    `,
    author: "Carlos Rodriguez",
    authorBio: "Carlos is a Medellin native and safety consultant who specializes in helping digital nomads navigate Colombian cities.",
    date: "May 28, 2025",
    category: "Destination Guides",
    readTime: "15 min read",
    relatedArticles: ["solo-female-traveler-safety-tips", "southeast-asia-safest-destinations"]
  },
  {
    slug: "apartment-security-abroad",
    title: "How to Secure Your Apartment When Renting Abroad",
    description: "Practical tips for assessing apartment safety and implementing additional security measures when renting accommodations in foreign countries.",
    content: `
      <p>Your temporary home abroad should be a safe sanctuary. This guide shows you how to evaluate rental security and implement additional measures to protect yourself and your belongings.</p>
      
      <h2>Evaluating Property Security</h2>
      <p>Before signing a lease, assess door and window locks, building entrance security, and neighborhood safety. Check for working smoke detectors and fire escapes. Research local crime patterns and speak with current residents if possible.</p>
      
      <h2>Reinforcing Entry Points</h2>
      <p>Even in secure buildings, consider adding portable door locks or door wedges for additional protection. Window locks or jam bars can secure sliding doors and windows. These temporary solutions don't damage the property but significantly enhance security.</p>
      
      <h2>Managing Keys and Access</h2>
      <p>Clarify who has keys to your rental and when landlords are permitted to enter. Consider a portable door alarm that activates when someone attempts entry. Never hide spare keys outside your apartment.</p>
      
      <h2>Valuable Protection</h2>
      <p>Use a portable travel safe or hidden compartment for important documents and valuables. Consider a laptop lock for when you need to step away briefly. Document all valuable items with photos and serial numbers.</p>
      
      <h2>Security Habits</h2>
      <p>Develop consistent security routines such as checking all locks before leaving and at bedtime. Keep your routine unpredictable to potential observers. Build relationships with neighbors who can alert you to suspicious activity.</p>
    `,
    author: "Sophie Martin",
    authorBio: "Sophie is a security consultant specializing in expatriate and traveler safety with over 15 years of international experience.",
    date: "May 22, 2025",
    category: "Safety Tips",
    readTime: "7 min read",
    relatedArticles: ["solo-female-traveler-safety-tips", "digital-security-nomads"]
  },
  {
    slug: "southeast-asia-safest-destinations",
    title: "Southeast Asia's Safest Destinations for Digital Nomads in 2025",
    description: "Discover the most secure cities for remote workers in Southeast Asia, with detailed safety analyses and community insights.",
    content: `
      <p>Southeast Asia remains one of the most popular regions for digital nomads. This guide identifies the safest destinations based on crime statistics, healthcare quality, political stability, and nomad community reports.</p>
      
      <h2>Singapore</h2>
      <p>With extremely low crime rates and excellent infrastructure, Singapore ranks as Southeast Asia's safest destination. While more expensive than other options in the region, the security, cleanliness, and efficiency make it worth considering, especially for higher-earning remote workers.</p>
      
      <h2>Chiang Mai, Thailand</h2>
      <p>This digital nomad haven combines safety with affordability. The established expatriate community provides an additional safety network. Violent crime against foreigners is rare, though scams and petty theft can occur in tourist areas.</p>
      
      <h2>Kuala Lumpur, Malaysia</h2>
      <p>Malaysia's capital offers a good balance of safety, modern amenities, and cultural experiences. The diverse population means foreigners blend in more easily, reducing targeted crimes. Healthcare standards are high and affordable.</p>
      
      <h2>Da Nang, Vietnam</h2>
      <p>Less crowded than Ho Chi Minh City or Hanoi, Da Nang offers a safer, more relaxed environment with beaches, modern infrastructure, and growing digital nomad communities. The central location makes it ideal for exploring Vietnam.</p>
      
      <h2>Bali (Canggu and Ubud), Indonesia</h2>
      <p>While petty theft can be an issue in some areas, the established nomad communities in Canggu and Ubud create relatively safe environments. Avoid motorbike travel at night and be cautious of traffic safety, which poses the greatest risk.</p>
    `,
    author: "Li Wei",
    authorBio: "Li is a travel safety researcher who has lived in over 15 Asian countries and specializes in risk assessment for remote workers.",
    date: "May 18, 2025",
    category: "Destination Guides",
    readTime: "14 min read",
    relatedArticles: ["medellin-safety-guide", "travel-insurance-digital-nomads"]
  }
];

// This function tells Next.js which blog posts to create pages for
export async function generateStaticParams() {
  // Return a simple array of slug objects
  return [
    { slug: "solo-female-traveler-safety-tips" },
    { slug: "digital-security-nomads" },
    { slug: "travel-insurance-digital-nomads" },
    { slug: "medellin-safety-guide" },
    { slug: "apartment-security-abroad" },
    { slug: "southeast-asia-safest-destinations" }
  ];
}

// This function creates the metadata for each blog post (like title and description)
export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const article = articles.find((article) => article.slug === params.slug);
  
  if (!article) {
    return {
      title: "Article Not Found",
      description: "The requested article could not be found."
    };
  }
  
  return {
    title: `${article.title} - Global Digital Nomad Safety Hub`,
    description: article.description,
    keywords: [article.category, "digital nomad", "travel safety", "nomad safety", ...article.title.toLowerCase().split(" ")],
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      publishedTime: article.date,
      authors: [article.author],
      tags: [article.category, "digital nomad", "travel safety"]
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description
    }
  };
}

// This is the main function that creates each blog post page
export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const article = articles.find((article) => article.slug === params.slug);
  
  if (!article) {
    return notFound();
  }
  
  // Find related articles
  const relatedArticleData = article.relatedArticles.map(
    slug => articles.find(a => a.slug === slug)
  ).filter(Boolean);
  
  return (
    <div className="container max-w-screen-xl mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col space-y-6 max-w-3xl mx-auto">
        <div>
          <Link href="/blog">
            <Button variant="ghost" className="pl-0 mb-4 hover:bg-transparent">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to all articles
            </Button>
          </Link>
          
          <div className="space-y-2">
            <Badge variant="outline">{article.category}</Badge>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              {article.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <UserCircle className="mr-1 h-4 w-4" />
                {article.author}
              </div>
              <div className="flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                {article.date}
              </div>
              <div className="flex items-center">
                <Clock className="mr-1 h-4 w-4" />
                {article.readTime}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-muted h-80 rounded-lg flex items-center justify-center">
          <p className="text-muted-foreground">Featured image placeholder</p>
        </div>
        
        <div className="flex justify-between">
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Bookmark className="mr-2 h-4 w-4" />
              Save
            </Button>
          </div>
        </div>
        
        <article className="prose prose-neutral dark:prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </article>
        
        <div className="border-t pt-6 mt-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <UserCircle className="h-8 w-8" />
            </div>
            <div>
              <p className="font-semibold">{article.author}</p>
              <p className="text-sm text-muted-foreground">{article.authorBio}</p>
            </div>
          </div>
        </div>
        
        {relatedArticleData.length > 0 && (
          <div className="border-t pt-6 mt-6">
            <h2 className="text-2xl font-bold mb-4">Related Articles</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {relatedArticleData.map((related) => related && (
                <Card key={related.slug}>
                  <CardContent className="p-4">
                    <Badge variant="outline" className="mb-2">
                      {related.category}
                    </Badge>
                    <h3 className="font-semibold mb-1 leading-tight">
                      <Link href={`/blog/${related.slug}`} className="hover:text-primary">
                        {related.title}
                      </Link>
                    </h3>
                    <p className="text-xs text-muted-foreground mb-2">
                      {related.date} • {related.readTime}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
        
        <div className="bg-muted p-6 rounded-lg mt-8">
          <div className="text-center">
            <h2 className="text-xl font-bold mb-2">Subscribe to Our Newsletter</h2>
            <p className="text-muted-foreground mb-4">
              Get the latest safety tips and travel insights delivered directly to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              />
              <Button type="submit" className="sm:w-auto">Subscribe</Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}