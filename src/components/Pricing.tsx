import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Zap, Crown } from "lucide-react";

const pricingPlans = [
  {
    id: "free",
    name: "Free Tier",
    description: "Perfect for occasional legal queries",
    price: "Free",
    period: "forever",
    icon: CheckCircle,
    features: [
      "5 searches per month",
      "Basic legal categories",
      "General legal information",
      "Mobile app access",
      "Community support"
    ],
    limitations: [
      "No AI assistance",
      "No document upload",
      "No priority support"
    ],
    cta: "Get Started Free",
    popular: false
  },
  {
    id: "bronze",
    name: "Bronze",
    description: "For regular legal research needs",
    price: "KES 2,500",
    period: "per month",
    icon: Clock,
    features: [
      "50 AI-assisted searches",
      "Document upload & OCR",
      "All legal categories",
      "Email support",
      "2-week response time",
      "Basic analytics"
    ],
    limitations: [
      "Standard response time",
      "Email support only"
    ],
    cta: "Start Bronze Plan",
    popular: false
  },
  {
    id: "gold",
    name: "Gold",
    description: "Most popular for legal professionals",
    price: "KES 5,000",
    period: "per month",
    icon: Zap,
    features: [
      "100 AI-assisted searches",
      "Priority 24-hour responses",
      "Advanced document analysis",
      "Phone & email support",
      "Case tracking dashboard",
      "Performance analytics",
      "Multi-user access (3 users)"
    ],
    limitations: [],
    cta: "Choose Gold",
    popular: true
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Custom solutions for law firms",
    price: "Custom",
    period: "pricing",
    icon: Crown,
    features: [
      "Unlimited searches",
      "1-hour emergency responses",
      "Custom integrations",
      "Dedicated account manager",
      "White-label options",
      "Advanced analytics",
      "Unlimited users",
      "Custom training"
    ],
    limitations: [],
    cta: "Contact Sales",
    popular: false
  }
];

const urgencyPricing = [
  {
    timeframe: "2 weeks",
    description: "Standard processing time",
    multiplier: "1x",
    additional: "No additional cost"
  },
  {
    timeframe: "1 week",
    description: "Faster turnaround",
    multiplier: "1.5x",
    additional: "+50% of base price"
  },
  {
    timeframe: "24 hours",
    description: "Priority processing",
    multiplier: "2x",
    additional: "+100% of base price"
  },
  {
    timeframe: "Emergency",
    description: "Same-day response",
    multiplier: "3x",
    additional: "+200% of base price"
  }
];

export const Pricing = () => {
  return (
    <section id="pricing" className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Main Pricing Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-legal-primary mb-4">
            Transparent Pricing for Every Need
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From free basic access to enterprise solutions. Choose the plan that fits your legal research requirements.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {pricingPlans.map((plan) => {
            const IconComponent = plan.icon;
            return (
              <Card 
                key={plan.id} 
                className={`relative shadow-card-legal hover:shadow-legal transition-all duration-300 ${
                  plan.popular ? 'border-legal-secondary scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-legal-secondary text-white">
                    Most Popular
                  </Badge>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-3 bg-legal-muted rounded-full w-16 h-16 flex items-center justify-center">
                    <IconComponent className="h-8 w-8 text-legal-primary" />
                  </div>
                  <CardTitle className="text-xl text-legal-primary">{plan.name}</CardTitle>
                  <CardDescription className="text-sm">{plan.description}</CardDescription>
                  <div className="pt-4">
                    <div className="text-3xl font-bold text-legal-primary">{plan.price}</div>
                    <div className="text-sm text-muted-foreground">{plan.period}</div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-legal-primary">Included:</h4>
                    <ul className="space-y-1">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start">
                          <CheckCircle className="h-4 w-4 text-legal-secondary mt-0.5 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-legal-secondary hover:bg-legal-secondary/90 text-white' 
                        : 'bg-legal-primary hover:bg-legal-primary/90 text-primary-foreground'
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Urgency-based Pricing */}
        <div className="bg-legal-muted/30 rounded-lg p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-legal-primary mb-2">
              Urgency-Based Pricing
            </h3>
            <p className="text-muted-foreground">
              Need faster responses? Choose your preferred turnaround time
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {urgencyPricing.map((option, index) => (
              <Card key={index} className="text-center shadow-card-legal">
                <CardContent className="p-6">
                  <div className="text-lg font-bold text-legal-primary mb-1">
                    {option.timeframe}
                  </div>
                  <div className="text-sm text-muted-foreground mb-3">
                    {option.description}
                  </div>
                  <div className="text-2xl font-bold text-legal-secondary mb-1">
                    {option.multiplier}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {option.additional}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground mb-4">
              Example: Gold plan with 24-hour response = KES 5,000 + KES 5,000 = KES 10,000
            </p>
            <Button variant="outline" className="border-legal-primary text-legal-primary hover:bg-legal-primary hover:text-primary-foreground">
              Calculate Your Price
            </Button>
          </div>
        </div>

        {/* Enterprise CTA */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-legal-primary mb-4">
            Need a Custom Solution?
          </h3>
          <p className="text-muted-foreground mb-6">
            Contact our sales team for custom enterprise pricing and features
          </p>
          <Button 
            size="lg" 
            className="bg-legal-primary hover:bg-legal-primary/90 text-primary-foreground"
          >
            Schedule a Demo
          </Button>
        </div>
      </div>
    </section>
  );
};