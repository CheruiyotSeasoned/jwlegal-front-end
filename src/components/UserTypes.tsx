import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Briefcase, Building, Gavel, ArrowRight } from "lucide-react";

const userTypes = [
  {
    id: "general-public",
    title: "General Public",
    description: "Easy access to legal information and basic consultation services",
    icon: Users,
    features: [
      "Mobile-first interface",
      "Legal category guidance",
      "Plain language explanations",
      "Basic case assessment",
      "County-specific information"
    ],
    pricing: "Free tier available",
    interface: "Mobile App",
    popular: false
  },
  {
    id: "lawyers",
    title: "Individual Lawyers",
    description: "Professional research tools with advanced AI assistance",
    icon: Briefcase,
    features: [
      "Advanced search capabilities",
      "Case law analysis",
      "Document drafting assistance",
      "Client management integration",
      "Performance tracking"
    ],
    pricing: "From KES 5,000/month",
    interface: "Web Dashboard",
    popular: true
  },
  {
    id: "law-firms",
    title: "Law Firms",
    description: "Enterprise solutions with multi-user access and firm management",
    icon: Building,
    features: [
      "Multi-user accounts",
      "Firm-wide analytics",
      "Client portal integration",
      "Custom branding",
      "Priority support"
    ],
    pricing: "Custom enterprise pricing",
    interface: "Advanced Dashboard",
    popular: false
  },
  {
    id: "judicial-officers",
    title: "Judicial Officers",
    description: "Specialized tools for magistrates and judges in legal research",
    icon: Gavel,
    features: [
      "Precedent research",
      "Case preparation tools",
      "Legal database access",
      "Judgment writing assistance",
      "Secure environment"
    ],
    pricing: "Government partnership",
    interface: "Judicial Dashboard",
    popular: false
  }
];

export const UserTypes = () => {
  return (
    <section id="user-types" className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-legal-primary mb-4">
            Tailored for Every Legal Professional
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From general public seeking legal guidance to judicial officers conducting research, 
            our platform adapts to your specific needs and expertise level.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {userTypes.map((userType) => {
            const IconComponent = userType.icon;
            return (
              <Card 
                key={userType.id} 
                className={`relative shadow-card-legal hover:shadow-legal transition-all duration-300 group cursor-pointer ${
                  userType.popular ? 'border-legal-secondary' : ''
                }`}
              >
                {userType.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-legal-secondary text-white">
                    Most Popular
                  </Badge>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-3 bg-legal-muted rounded-full w-16 h-16 flex items-center justify-center group-hover:bg-legal-primary transition-colors">
                    <IconComponent className="h-8 w-8 text-legal-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <CardTitle className="text-xl text-legal-primary">{userType.title}</CardTitle>
                  <CardDescription className="text-sm">{userType.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-legal-primary">Key Features:</h4>
                    <ul className="space-y-1">
                      {userType.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start">
                          <span className="w-1.5 h-1.5 bg-legal-secondary rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {feature}
                        </li>
                      ))}
                      {userType.features.length > 3 && (
                        <li className="text-sm text-legal-primary font-medium">
                          +{userType.features.length - 3} more features
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-legal-muted">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium text-legal-primary">Interface:</span>
                      <Badge variant="secondary" className="text-xs">{userType.interface}</Badge>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm font-medium text-legal-primary">Pricing:</span>
                      <span className="text-sm text-muted-foreground">{userType.pricing}</span>
                    </div>
                    
                    <Button 
                      className="w-full bg-legal-primary hover:bg-legal-primary/90 text-primary-foreground group"
                      variant={userType.popular ? "default" : "outline"}
                    >
                      {userType.popular ? "Get Started" : "Learn More"}
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Not sure which plan is right for you?
          </p>
          <Button variant="outline" className="border-legal-primary text-legal-primary hover:bg-legal-primary hover:text-primary-foreground">
            Compare All Features
          </Button>
        </div>
      </div>
    </section>
  );
};