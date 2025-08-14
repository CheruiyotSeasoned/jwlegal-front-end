import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, Home, Scale, ArrowRight, ChevronDown, Users, Building2, FileText, Heart, Briefcase, Car, Landmark, DollarSign, Copyright, Gavel, UserCheck, Building, Globe, Zap } from "lucide-react";
import { useState } from "react";
import CaseDialog  from "./CaseDialog";

const criminalLawCategories = [
  "Murder",
  "Robbery with Violence",
  "Robbery",
  "Abortion, infanticide, concealing birth, killing unborn child",
  "Alarming publications",
  "Arson, setting fire to crops and offences allied to arson",
  "Attempted murder, threatening to kill, attempted suicide",
  "Attempted robbery",
  "Attempted robbery with violence",
  "Banking fraud and money laundering",
  "Being a member of an organized criminal group/unlawful oaths",
  "Burglary, housebreaking, entering dwelling house with intent to commit felony and similar offences",
  "Children in need of care and protection, including orphaned and vulnerable children, children subjected to harmful cultural practices (early marriages)",
  "Child stealing",
  "Counterfeiting trademarks",
  "Creating Disturbance, affray, unlawful assembly and riots, and other offences against public tranquility",
  "Covid-19 related offences",
  "Criminal negligence, recklessness, nuisance, child negligence",
  "Criminal trespass",
  "Cyber Crime and Software Related Offences",
  "Defamation",
  "Detention of female for immoral purposes/eloping",
  "Disobeying orders",
  "Engaging in unauthorized Mining",
  "Escape from custody, resisting arrest and miscellaneous offences against the administration of justice and public authority",
  "Forcible entry",
  "Forestry offenses",
  "Forgery including coining",
  "Fraud/ conspiracy to defraud",
  "Frauds by trustees and persons in a position of trust and false accounting",
  "Giving false information",
  "Grievous harm, maim, assault causing actual bodily harm, common assault",
  "Immigration, human trafficking and offenses under Immigration Act",
  "Impersonation, Treachery",
  "Income Tax related Offenses",
  "Kidnapping and abduction",
  "Malicious damage, injury to property, goods etc",
  "Manslaughter",
  "Obstruction of justice: perjury, conspiracy to defeat justice",
  "Offenses against energy Act",
  "Offences against labour laws (failing to pay NSSF, NHIF etc)",
  "Offences against morality",
  "Offences related to breach Examination Council Rules",
  "Offences related to Copyright Act",
  "Offences related to NEMA, trade in scrap metals, alcoholic drinks control and licensing Act",
  "Offences related to Weights and Measures Act; Offences under Betting, lotteries and Gaming Act",
  "Offences under; Civil Aviation Act, Customs & Excise Act, the Kenya Information and Telecoms Act",
  "Offences against pharmacy and poisons Act",
  "Offences under false pretenses, National Police Act, Public Health Act",
  "Possession of firearms, explosives and related offenses",
  "Possession of narcotic drugs and psychotropic substances",
  "Preparations/Conspiracy to commit felony, neglect to prevent a felony",
  "Prohibition of FGM",
  "Residing in places outside designated areas",
  "Stealing, stealing by servant and related offences",
  "Stock theft, and injuring, killing or maiming of a domestic animal with intent to steal, stealing stock",
  "Subjecting a child into labour",
  "Terrorism, radicalization and related offences",
  "Theft, handling stolen or suspected stolen property/goods, possession of government/public stores and related offences",
  "Unlawfully obstructing the working at a train which endangers",
  "VAT related offences",
  "Wildlife/Fisheries Offences",
  "Sexual Offences",
  "Attempted Defilement",
  "Attempted Rape",
  "Defilement",
  "Incest",
  "Rape",
  "Sexual assault/harassment"
];

const civilLawCategories = [
  {
    title: "EMPLOYMENT AND LABOUR RELATIONS",
    services: {
      employer: [
        "Contract and policy Reviews",
        "Compliance Training",
        "Legal Risk Audits",
        "Litigation Defence",
        "Work Injury Benefits-Initiation Procedure"
      ],
      employee: [
        "Unfair Termination, unpaid salaries/overtime dues/allowances",
        "Unlawfully deducted/withheld salaries",
        "Workplace discrimination/harassment",
        "Redundancy/Retrenchment Disputes",
        "Unsafe/unhealthy work conditions",
        "Constructive Dismissal due to hostile work Environment",
        "Work Injury Benefits"
      ]
    }
  },
  {
    title: "FAMILY LAW",
    services: [
      "Divorce",
      "Child Custody and maintenance",
      "Inheritance/Succession",
      "Wills Drafting",
      "Private Trusts",
      "Estate Management",
      "Intestate succession"
    ]
  },
  {
    title: "CONSUMER PROTECTION LAW",
    services: [
      "Product liability",
      "Unfair trade practices",
      "Misrepresentation",
      "Services Disputes"
    ]
  },
  {
    title: "INSURANCE LAW",
    services: [
      "Disputes over insurance claims",
      "Policy interpretation and review",
      "Subrogation claim and other related services"
    ]
  },
  {
    title: "TORT LAW",
    services: [
      "Nuisance",
      "Negligence- Medical Negligence, Personal injury (running down/Workmen Compensation)",
      "Defamation-Slander (said by word of mouth), Libel (written)",
      "Trespass",
      "Conversion"
    ]
  },
  {
    title: "CORPORATE & COMMERCIAL LAW",
    services: [
      "Debt restructuring, security Take-Overs, Asset Finance",
      "Preparation and Perfection of securities",
      "Template Security Documents",
      "Company secretarial services including compliance and governance matters i.e. maintaining statutory records, preparing and filing annual returns and ensuring compliance with corporate laws and regulations",
      "Intellectual property-registration, protection, enforcement of trademarks, copyrights, patents and other intellectual property rights",
      "Advice in safeguarding intellectual property assets and licensing and infringement issues",
      "Contracts and Risk Management-Drafting, negotiation, review and identifying potential legal risks in commercial transactions and mitigation strategies",
      "Legal Audit Compliance",
      "Information and Communication Technology law and Data Protection"
    ]
  },
  {
    title: "INTELLECTUAL PROPERTY",
    services: [
      "Trademarks, Patents, Copyrights and related legal issues"
    ]
  },
  {
    title: "TAX LAW",
    services: [
      "Liabilities as to taxation"
    ]
  },
  {
    title: "BANKING AND FINANCE",
    services: [
      "Financial Transactions",
      "Lending",
      "Capital markets",
      "Regulatory aspects of the financial sector"
    ]
  },
  {
    title: "REAL ESTATE & CONVEYANCING",
    services: [
      "Property transactions, buying, selling and land development",
      "Land ownership and title disputes",
      "Leases and Tenancy matters",
      "Boundary disputes",
      "Eviction and land use issues"
    ]
  },
  {
    title: "MALICIOUS PROSECUTION",
    services: [
      "Malicious Prosecution cases and related legal matters"
    ]
  }
];

const legalCategories = [
  {
    id: "criminal",
    title: "CRIMINAL LAW",
    description: "Comprehensive criminal defense and prosecution matters under Kenyan law",
    icon: Shield,
    color: "bg-red-100 text-red-700",
    borderColor: "border-red-200",
    content: criminalLawCategories
  },
  {
    id: "civil",
    title: "CIVIL LAW",
    description: "Employment, family, commercial, and property disputes",
    icon: Scale,
    color: "bg-blue-100 text-blue-700",
    borderColor: "border-blue-200",
    content: civilLawCategories
  }
];

export const LegalCategories = () => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [selectedCase, setSelectedCase] = useState<{
    caseType: string;
    caseTitle: string;
    category: 'criminal' | 'civil';
  } | null>(null);

  const handleCaseClick = (caseType: string, caseTitle: string, category: 'criminal' | 'civil') => {
    setSelectedCase({ caseType, caseTitle, category });
  };

  return (
    <section id="features" className="py-20 bg-legal-muted/30">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-legal-primary mb-4">
            Comprehensive Kenyan Legal Coverage
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Navigate Kenya's complete legal landscape with our comprehensive categorization system. 
            From criminal defense to corporate law, find expert legal assistance for every aspect of Kenyan law.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {legalCategories.map((category) => {
            const IconComponent = category.icon;
            const isExpanded = expandedCategory === category.id;
            
            return (
              <Card 
                key={category.id} 
                className={`shadow-card-legal hover:shadow-legal transition-all duration-300 cursor-pointer border-2 ${category.borderColor}`}
                onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-lg ${category.color}`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-legal-primary font-bold">{category.title}</CardTitle>
                        <CardDescription className="text-sm mt-1">{category.description}</CardDescription>
                      </div>
                    </div>
                    <ChevronDown 
                      className={`h-5 w-5 text-legal-primary transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`} 
                    />
                  </div>
                </CardHeader>

                {isExpanded && (
                  <CardContent className="space-y-4">
                    {category.id === "criminal" ? (
                      <div>
                        <h4 className="font-semibold text-legal-primary mb-3 text-lg">Criminal Offences:</h4>
                        <ScrollArea className="h-96 w-full rounded-md border p-4">
                          <div className="space-y-2">
                            {category.content.map((offence, index) => (
                              <div 
                                key={index} 
                                className="flex items-start space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCaseClick(offence, offence, 'criminal');
                                }}
                              >
                                <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                                <span className="text-sm text-gray-700 flex-1">{offence}</span>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCaseClick(offence, offence, 'criminal');
                                  }}
                                >
                                  <ArrowRight className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    ) : (
                      <div>
                        <h4 className="font-semibold text-legal-primary mb-3 text-lg">Civil Law Categories:</h4>
                        <ScrollArea className="h-96 w-full rounded-md border p-4">
                          <div className="space-y-4">
                            {category.content.map((civilCategory, index) => (
                              <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                                <h5 className="font-semibold text-legal-primary mb-2">{civilCategory.title}</h5>
                                {civilCategory.services ? (
                                  Array.isArray(civilCategory.services) ? (
                                    <ul className="space-y-1 ml-4">
                                      {civilCategory.services.map((service, serviceIndex) => (
                                        <li 
                                          key={serviceIndex} 
                                          className="text-sm text-gray-700 flex items-start hover:bg-gray-50 p-1 rounded cursor-pointer transition-colors"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleCaseClick(service, `${civilCategory.title} - ${service}`, 'civil');
                                          }}
                                        >
                                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                          <span className="flex-1">{service}</span>
                                          <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleCaseClick(service, `${civilCategory.title} - ${service}`, 'civil');
                                            }}
                                          >
                                            <ArrowRight className="h-3 w-3" />
                                          </Button>
                                        </li>
                                      ))}
                                    </ul>
                                  ) : (
                                    <div className="space-y-3">
                                      <div>
                                        <h6 className="font-medium text-sm text-gray-600 mb-1">Employer Services:</h6>
                                        <ul className="space-y-1 ml-4">
                                          {civilCategory.services.employer.map((service, serviceIndex) => (
                                            <li 
                                              key={serviceIndex} 
                                              className="text-sm text-gray-700 flex items-start hover:bg-gray-50 p-1 rounded cursor-pointer transition-colors"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleCaseClick(service, `${civilCategory.title} - ${service}`, 'civil');
                                              }}
                                            >
                                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                              <span className="flex-1">{service}</span>
                                              <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleCaseClick(service, `${civilCategory.title} - ${service}`, 'civil');
                                                }}
                                              >
                                                <ArrowRight className="h-3 w-3" />
                                              </Button>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                      <div>
                                        <h6 className="font-medium text-sm text-gray-600 mb-1">Employee Services:</h6>
                                        <ul className="space-y-1 ml-4">
                                          {civilCategory.services.employee.map((service, serviceIndex) => (
                                            <li 
                                              key={serviceIndex} 
                                              className="text-sm text-gray-700 flex items-start hover:bg-gray-50 p-1 rounded cursor-pointer transition-colors"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleCaseClick(service, `${civilCategory.title} - ${service}`, 'civil');
                                              }}
                                            >
                                              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                              <span className="flex-1">{service}</span>
                                              <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleCaseClick(service, `${civilCategory.title} - ${service}`, 'civil');
                                                }}
                                              >
                                                <ArrowRight className="h-3 w-3" />
                                              </Button>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    </div>
                                  )
                                ) : null}
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    )}

                    <Button 
                      className="w-full bg-legal-primary hover:bg-legal-primary/90 text-primary-foreground group"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle category selection
                      }}
                    >
                      Start Research in {category.title}
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>

        {/* Quick Access */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-legal-primary mb-4">
            Need Help Choosing?
          </h3>
          <p className="text-muted-foreground mb-6">
            Our AI assistant can help you identify the right legal category for your case based on Kenyan law
          </p>
          <Button 
            size="lg" 
            className="bg-legal-secondary hover:bg-legal-secondary/90 text-white"
          >
            Get AI Category Assistance
          </Button>
        </div>
      </div>

      {/* Case Dialog */}
      {selectedCase && (
        <CaseDialog
          open={!!selectedCase}
          onOpenChange={(open) => !open && setSelectedCase(null)}
          caseType={selectedCase.caseType}
          caseTitle={selectedCase.caseTitle}
          category={selectedCase.category}
        />
      )}
    </section>
  );
};