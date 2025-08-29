import { LucideLink, Star, Users, Trophy, Zap } from "lucide-react";
import React from "react";
import { FancyButton } from "../components/ui/FancyButton";

const Home: React.FC = () => {
  return (
    <div className="bg-shibutis-dark text-shibutis-text font-body mt-20 max-w-screen-xl mx-auto overflow-hidden">
      {/* Hero Section */}
      <section className="relative w-full">
        <div className="w-full max-w-6xl mx-auto px-4 py-8 lg:py-12">
          <div className="flex justify-center relative group">
            <img
              src="/images/hero-bg.webp"
              alt="Shiboshis Club Banner"
              className="w-full max-h-[320px] object-cover rounded-xl shadow-2xl transition-transform duration-300 group-hover:scale-[1.02]"
            />
            {/* Overlay gradient for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-shibutis-dark/60 via-transparent to-transparent rounded-xl"></div>
            
          
          </div>
        </div>
      </section>

      {/* Welcome Text + Avatar */}
      <section className="w-full max-w-6xl mx-auto px-4 lg:px-6 py-12 lg:py-16">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
          {/* Character */}
          <div className="flex-shrink-0 relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-shibutis-primary to-shibutis-orange rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
            <img
              src="/images/home-nft1.jpg"
              alt="Shiboshi Character"
              className="relative w-64 h-64 rounded-xl shadow-xl transition-transform duration-300 group-hover:scale-105 group-hover:rotate-1"
            />
            {/* Character badge */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-shibutis-orange text-shibutis-dark px-3 py-1 rounded-full text-xs font-pixel">
              OG MEMBER #001
            </div>
          </div>

          {/* Text Content */}
          <div className="text-center md:text-left flex-1">
            <div className="inline-block mb-3">
              <span className="bg-shibutis-primary/10 text-shibutis-primary px-3 py-1 rounded-full text-sm font-pixel border border-shibutis-primary/20">
                🚀 NOW LIVE
              </span>
            </div>
            
            <h1 className="font-pixel text-3xl lg:text-5xl xl:text-6xl text-shibutis-primary mb-6 leading-tight">
              WELCOME TO THE
              <span className="block text-shibutis-orange mt-2">
                SHIBUTIS SOCIAL CLUB
              </span>
            </h1>
            
            <p className="text-shibutis-subtitle max-w-2xl text-lg lg:text-xl leading-relaxed mb-6">
              Join an exclusive community of Shibutis owners and unlock premium benefits, early access to drops, 
              and direct communication with our development team. This isn't just ownership—it's membership 
              in something bigger.
            </p>

            {/* Key highlights */}
            <div className="flex flex-wrap gap-4 justify-center md:justify-start mb-8">
              <div className="flex items-center gap-2 bg-shibutis-panel/50 px-4 py-2 rounded-lg border border-shibutis-border/30">
                <Users size={16} className="text-shibutis-primary" />
                <span className="text-sm text-shibutis-text">500+ Members</span>
              </div>
              <div className="flex items-center gap-2 bg-shibutis-panel/50 px-4 py-2 rounded-lg border border-shibutis-border/30">
                <Star size={16} className="text-shibutis-orange" />
                <span className="text-sm text-shibutis-text">Exclusive Access</span>
              </div>
              <div className="flex items-center gap-2 bg-shibutis-panel/50 px-4 py-2 rounded-lg border border-shibutis-border/30">
                <Trophy size={16} className="text-shibutis-primary" />
                <span className="text-sm text-shibutis-text">Premium Perks</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Button */}
      <div className="flex justify-center py-8 px-5 md:w-[85%] mx-auto">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-shibutis-primary via-shibutis-orange to-shibutis-primary rounded-lg blur opacity-30 group-hover:opacity-60 transition duration-300 animate-pulse"></div>
          <FancyButton className="relative">
            <span className='flex w-full items-center justify-center gap-3 text-lg font-pixel'>
              JOIN THE CLUB WITH YOUR SHIBUTIS 
              <LucideLink className="animate-bounce" />
            </span>
          </FancyButton>
        </div>
      </div>

      {/* Enhanced Advantages Section */}
      <section className="w-full max-w-5xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-br from-shibutis-panel to-shibutis-panel/80 rounded-xl p-8 border border-shibutis-border/50 shadow-xl relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-shibutis-primary/5 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-shibutis-orange/5 rounded-full translate-y-12 -translate-x-12"></div>
          
          <div className="relative">
            <div className="text-center mb-10">
              <h2 className="font-pixel text-2xl lg:text-3xl text-shibutis-orange mb-3">
                Social Club Advantages
              </h2>
              <p className="text-shibutis-subtitle text-lg">
                Unlock exclusive benefits when you join our community
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="group bg-shibutis-dark/30 rounded-lg p-6 border border-shibutis-border/30 hover:border-shibutis-primary/30 transition-all duration-300 hover:transform hover:scale-[1.02]">
                <div className="flex items-start gap-4">
                  <div className="bg-shibutis-primary/10 p-3 rounded-lg group-hover:bg-shibutis-primary/20 transition-colors duration-300">
                    <Users className="text-shibutis-primary w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-pixel text-shibutis-primary mb-2 text-lg">Private Club Access</h3>
                    <p className="text-shibutis-text text-sm leading-relaxed">
                      Exclusive community for verified Shibutis owners with premium channels and member-only content.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group bg-shibutis-dark/30 rounded-lg p-6 border border-shibutis-border/30 hover:border-shibutis-orange/30 transition-all duration-300 hover:transform hover:scale-[1.02]">
                <div className="flex items-start gap-4">
                  <div className="bg-shibutis-orange/10 p-3 rounded-lg group-hover:bg-shibutis-orange/20 transition-colors duration-300">
                    <Zap className="text-shibutis-orange w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-pixel text-shibutis-orange mb-2 text-lg">Direct Dev Access</h3>
                    <p className="text-shibutis-text text-sm leading-relaxed">
                      Direct communication with developers, alphas, and team members for feedback and updates.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group bg-shibutis-dark/30 rounded-lg p-6 border border-shibutis-border/30 hover:border-shibutis-primary/30 transition-all duration-300 hover:transform hover:scale-[1.02]">
                <div className="flex items-start gap-4">
                  <div className="bg-shibutis-primary/10 p-3 rounded-lg group-hover:bg-shibutis-primary/20 transition-colors duration-300">
                    <Trophy className="text-shibutis-primary w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-pixel text-shibutis-primary mb-2 text-lg">Exclusive Perks & Events</h3>
                    <p className="text-shibutis-text text-sm leading-relaxed">
                      VIP gaming events, voting rights on community decisions, and exclusive merchandise access.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group bg-shibutis-dark/30 rounded-lg p-6 border border-shibutis-border/30 hover:border-shibutis-orange/30 transition-all duration-300 hover:transform hover:scale-[1.02]">
                <div className="flex items-start gap-4">
                  <div className="bg-shibutis-orange/10 p-3 rounded-lg group-hover:bg-shibutis-orange/20 transition-colors duration-300">
                    <Star className="text-shibutis-orange w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-pixel text-shibutis-orange mb-2 text-lg">Future Opportunities</h3>
                    <p className="text-shibutis-text text-sm leading-relaxed">
                      Early access to new drops, staking opportunities, and exclusive investment opportunities.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Stats Section */}
      <section className="w-full max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="font-pixel text-2xl lg:text-3xl text-shibutis-primary mb-3">
            Join Our Growing Community
          </h2>
          <p className="text-shibutis-subtitle text-lg">
            Be part of something special
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center bg-shibutis-panel/30 rounded-lg p-6 border border-shibutis-border/20 hover:border-shibutis-primary/30 transition-all duration-300 group">
            <div className="text-2xl lg:text-3xl font-pixel text-shibutis-primary mb-2 group-hover:scale-110 transition-transform duration-300">500+</div>
            <div className="text-shibutis-subtitle text-sm">Active Members</div>
          </div>
          
          <div className="text-center bg-shibutis-panel/30 rounded-lg p-6 border border-shibutis-border/20 hover:border-shibutis-orange/30 transition-all duration-300 group">
            <div className="text-2xl lg:text-3xl font-pixel text-shibutis-orange mb-2 group-hover:scale-110 transition-transform duration-300">50+</div>
            <div className="text-shibutis-subtitle text-sm">Events Hosted</div>
          </div>
          
          <div className="text-center bg-shibutis-panel/30 rounded-lg p-6 border border-shibutis-border/20 hover:border-shibutis-primary/30 transition-all duration-300 group">
            <div className="text-2xl lg:text-3xl font-pixel text-shibutis-primary mb-2 group-hover:scale-110 transition-transform duration-300">24/7</div>
            <div className="text-shibutis-subtitle text-sm">Community Support</div>
          </div>
          
          <div className="text-center bg-shibutis-panel/30 rounded-lg p-6 border border-shibutis-border/20 hover:border-shibutis-orange/30 transition-all duration-300 group">
            <div className="text-2xl lg:text-3xl font-pixel text-shibutis-orange mb-2 group-hover:scale-110 transition-transform duration-300">100%</div>
            <div className="text-shibutis-subtitle text-sm">Shibutis Verified</div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="w-full max-w-5xl mx-auto px-4 py-12 mb-8">
        <div className="bg-gradient-to-r from-shibutis-primary/10 via-shibutis-orange/10 to-shibutis-primary/10 rounded-xl p-8 border border-shibutis-primary/20 text-center relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-4 left-4 w-8 h-8 border-2 border-shibutis-primary rounded-full"></div>
            <div className="absolute top-8 right-8 w-4 h-4 bg-shibutis-orange rounded-full"></div>
            <div className="absolute bottom-6 left-8 w-6 h-6 border-2 border-shibutis-orange rounded-full"></div>
            <div className="absolute bottom-4 right-4 w-3 h-3 bg-shibutis-primary rounded-full"></div>
          </div>
          
          <div className="relative">
            <h3 className="font-pixel text-xl lg:text-2xl text-shibutis-primary mb-4">
              Ready to Level Up Your Shibutis Experience?
            </h3>
            <p className="text-shibutis-subtitle text-lg mb-6 max-w-2xl mx-auto">
              Connect your wallet, verify your Shibutis ownership, and unlock exclusive club benefits today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="bg-shibutis-dark/50 px-4 py-2 rounded-lg border border-shibutis-border/30">
                <span className="text-shibutis-text text-sm">✅ No fees • ✅ Instant access • ✅ Verified owners only</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;