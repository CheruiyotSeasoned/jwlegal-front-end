import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Bot, Shield, Clock, Play, X, MessageSquare, FileText, Gavel, Users, Sparkles, ChevronRight, Star, Zap } from "lucide-react";
import React, { useState, useEffect } from "react";
import ChatBg from "@/assets/hero.jpg"; // adjust file name & extension


export const Hero = () => {
  const [isLegalAIOpen, setIsLegalAIOpen] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [typewriterText, setTypewriterText] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);


  const legalQuestions = [
    "What are my rights as a tenant in Kenya?",
    "How do I register a business in Nairobi?",
    "What's the process for filing a divorce?",
    "How to handle employment disputes?",
    "What are the requirements for a will?"
  ];

  const features = [
    {
      icon: <Bot className="h-12 w-12" />,
      title: "AI-Powered Research",
      description: "Advanced AI trained on Kenya Law with instant case law analysis"
    },
    {
      icon: <Shield className="h-12 w-12" />,
      title: "Secure & Confidential",
      description: "Bank-level security with complete client confidentiality"
    },
    {
      icon: <Clock className="h-12 w-12" />,
      title: "24/7 Availability",
      description: "Round-the-clock legal assistance whenever you need it"
    }
  ];

  const testimonials = [
    { name: "John Doe.", role: "Business Owner", text: "Saved me thousands on legal fees!", rating: 5 },
    { name: "Jane Doe.", role: "Lawyer", text: "Best legal research tool I've used", rating: 5 },
    { name: "Mary W.", role: "Individual", text: "Made legal help accessible to me", rating: 5 }
  ];

  const stats = [
    { number: "1K+", label: "Legal Queries Resolved" },
    { number: "5+", label: "Lawyers Trust Us" },
    { number: "99.9%", label: "Uptime Guarantee" },
    { number: "24/7", label: "Support Available" }
  ];

  // Typewriter effect for legal questions
  useEffect(() => {
    const currentQuestion = legalQuestions[currentQuestionIndex];
    let currentIndex = 0;

    const typeInterval = setInterval(() => {
      if (currentIndex <= currentQuestion.length) {
        setTypewriterText(currentQuestion.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => {
          setCurrentQuestionIndex((prev) => (prev + 1) % legalQuestions.length);
        }, 2000);
      }
    }, 100);

    return () => clearInterval(typeInterval);
  }, [currentQuestionIndex]);

  // Feature carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);


  const handleDemoPlay = () => {
    setIsVideoPlaying(true);
    setTimeout(() => {
      setIsVideoPlaying(false);
      setIsVideoOpen(true);
    }, 600); // small loading effect
  };
  const handleQuickConsult = () => {
    setIsLegalAIOpen(true);
  };

  return (
    <>
      <section className="relative py-20 lg:py-28 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#003580]/5 via-[#FEA919]/5 to-white">
          <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
        </div>

        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#FEA919]/20 to-[#003580]/20 px-4 py-2 rounded-full text-sm font-medium text-[#003580] animate-fade-in">
                  <Sparkles className="h-4 w-4" />
                  <span>Kenya's #1 AI Legal Assistant</span>
                </div>

                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Your Trusted{" "}
                  <span className="bg-gradient-to-r from-[#003580] to-[#FEA919] bg-clip-text text-transparent animate-gradient">
                    Legal Advisor
                  </span>
                </h1>

                <p className="text-xl text-gray-600 leading-relaxed">
                  Get instant legal advice powered by Kenya Law APIs. From simple queries to complex corporate legal needs - your AI legal buddy is here 24/7.
                </p>

                {/* Typewriter Demo */}
                <div className="bg-white p-4 rounded-lg shadow-lg border-l-4 border-[#003580]">
                  <div className="flex items-center space-x-2 mb-2">
                    <MessageSquare className="h-4 w-4 text-[#003580]" />
                    <span className="text-sm font-medium text-gray-500">Try asking:</span>
                  </div>
                  <p className="text-gray-800 font-medium">
                    "{typewriterText}"
                    <span className="animate-pulse">|</span>
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer hover:scale-105">
                    <div className="text-2xl font-bold text-[#003580]">{stat.number}</div>
                    <div className="text-xs text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="/app">
                  <Button
                    className="group relative overflow-hidden bg-gradient-to-r from-[#003580] to-[#FEA919] hover:from-[#002a63] hover:to-[#e68c0c] text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <span className="relative z-10 flex items-center">
                      Ask Legal Buddy
                      <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                </a>


                <Button
                  onClick={handleDemoPlay}
                  variant="outline"
                  className="group border-2 border-gray-300 hover:border-[#003580] px-8 py-4 rounded-xl text-lg font-semibold hover:bg-[#003580]/5 transition-all duration-300"
                >
                  {isVideoPlaying ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-[#003580] border-t-transparent rounded-full animate-spin mr-2" />
                      Loading Demo...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Play className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                      Watch 2-Min Demo
                    </div>
                  )}
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4">
                {features.map((feature, index) => (
                  <Card
                    key={index}
                    className={`group cursor-pointer transition-all duration-500 hover:scale-105 ${currentFeature === index ? "ring-2 ring-[#003580] shadow-lg" : "hover:shadow-md"
                      }`}
                    onMouseEnter={() => setHoveredCard(index)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-[#003580] to-[#FEA919] p-2 text-white transition-transform group-hover:rotate-12">
                        {feature.icon}
                      </div>
                      <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                      <p className="text-xs text-gray-600 line-clamp-2">{feature.description}</p>
                      {hoveredCard === index && (
                        <ChevronRight className="h-4 w-4 mx-auto mt-2 text-[#003580] animate-bounce" />
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Right Content (Demo) */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-6 transform hover:scale-[1.02] transition-transform duration-300 bg-cover bg-center"
                style={{ backgroundImage: `url(${ChatBg})` }}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-[#003580] to-[#FEA919] rounded-full flex items-center justify-center">
                      <Bot className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Legal Buddy AI</h3>
                      <p className="text-sm text-green-500">● Online & Ready</p>
                    </div>
                  </div>
                </div>

                {/* Chat */}

                <div className="space-y-4 h-64 overflow-y-auto rounded-xl p-4 scrollbar-hide">
                  <div className="flex space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <Users className="h-4 w-4" />
                    </div>
                    <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                      <p className="text-sm">
                        I need help with a contract dispute. What are my options?
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-3 justify-end">
                    <div className="bg-gradient-to-r from-[#003580] to-[#FEA919] text-white rounded-lg p-3 max-w-xs">
                      <p className="text-sm">
                        Based on Kenya's Contract Act, you have several options. Let me analyze
                        your situation...
                      </p>
                      <div className="flex items-center mt-2 space-x-2">
                        <FileText className="h-3 w-3" />
                        <span className="text-xs opacity-90">Referencing Kenya Law</span>
                      </div>
                    </div>
                    <div className="w-8 h-8 bg-gradient-to-r from-[#003580] to-[#FEA919] rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  </div>

                  <div className="flex space-x-3 justify-end">
                    <div className="bg-gradient-to-r from-[#003580] to-[#FEA919] text-white rounded-lg p-3 max-w-xs">
                      <div className="flex items-center space-x-2 mb-2">
                        <Gavel className="h-4 w-4" />
                        <span className="text-xs font-medium">Legal Analysis Complete</span>
                      </div>
                      <p className="text-sm">
                        1. Mediation (recommended)
                        <br />
                        2. Arbitration
                        <br />
                        3. Court proceedings
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-2 text-xs border-white text-white hover:bg-white hover:text-[#003580]"
                      >
                        View Full Analysis
                      </Button>
                    </div>
                  </div>
                </div>



                {/* Input */}
                <div className="border-t pt-4 mt-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="text"
                      placeholder="Ask your legal question..."
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#003580] focus:border-transparent"
                    />
                    <Button size="sm" className="bg-gradient-to-r from-[#003580] to-[#FEA919] hover:from-[#002a63] hover:to-[#e68c0c]">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Floating Badges */}
              <div className="absolute -top-4 -right-4 bg-[#003580] text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg animate-pulse">
                <div className="flex items-center space-x-1">
                  <Zap className="h-3 w-3" />
                  <span>Kenya Law APIs</span>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-[#FEA919] text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg">
                <div className="flex items-center space-x-1">
                  <Star className="h-3 w-3" />
                  <span>AI-Powered Assistant</span>
                </div>
              </div>

              {/* Testimonials */}
              <div className="mt-8 bg-gradient-to-r from-[#003580]/5 to-[#FEA919]/5 rounded-xl p-4">
                <div className="text-center">
                  <div className="flex justify-center space-x-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-[#FEA919] text-[#FEA919]" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-700 italic mb-2">
                    "{testimonials[currentFeature].text}"
                  </p>
                  <p className="text-xs text-gray-500">
                    — {testimonials[currentFeature].name}, {testimonials[currentFeature].role}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Action Modal */}
      {isLegalAIOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 m-4 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Quick Legal Consultation</h3>
            <p className="text-gray-600 mb-4">This would open your legal consultation interface.</p>
            <Button onClick={() => setIsLegalAIOpen(false)}>Close</Button>
          </div>
        </div>
      )}
      {/* Video Modal */}
      {isVideoOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full relative">
            {/* Close Button */}
            <button
              onClick={() => setIsVideoOpen(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Video Player */}
            <div className="p-4">
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  className="w-full h-[500px] rounded-xl"
                  src="https://www.youtube.com/embed/TFs_JSMsnDc?autoplay=1"
                  title="AI Legal Assistant - Demo Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .bg-grid-slate-100 {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(203 213 225 / 0.5)'%3e%3cpath d='m0 .5h32m-32 32v-32'/%3e%3c/svg%3e");
        }
      `}</style>
    </>
  );
};