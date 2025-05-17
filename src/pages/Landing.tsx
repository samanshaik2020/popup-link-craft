import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="pt-12 pb-20 bg-gradient-to-b from-indigo-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mt-4 mb-12 bg-gradient-to-r from-indigo-600 to-violet-600 text-transparent bg-clip-text">
            Create Engaging Popup Links
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Generate short links with custom popup messages to boost engagement and conversions. Perfect for marketers, content creators, and businesses.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {user ? (
              <Link to="/dashboard">
                <Button size="lg" className="px-8 py-6 text-lg">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/auth">
                  <Button size="lg" className="px-8 py-6 text-lg">
                    Get Started
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button variant="outline" size="lg" className="px-8 py-6 text-lg">
                    Create a Link
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Powerful Features</h2>
          <div className="grid md:grid-cols-3 gap-10">
            <FeatureCard 
              icon="✨" 
              title="Custom Popups" 
              description="Create eye-catching popup messages that appear when users visit your links."
            />
            <FeatureCard 
              icon="🔗" 
              title="Short Links" 
              description="Generate compact, shareable links that redirect to your destination URLs."
            />
            <FeatureCard 
              icon="📊" 
              title="Analytics" 
              description="Track clicks, engagement, and conversion rates for all your popup links."
            />
            <FeatureCard 
              icon="⏱️" 
              title="Delay Control" 
              description="Set custom delays for when your popup should appear after page load."
            />
            <FeatureCard 
              icon="📱" 
              title="Mobile Friendly" 
              description="Popups are responsive and work great on all devices and screen sizes."
            />
            <FeatureCard 
              icon="🎨" 
              title="Customization" 
              description="Choose popup positions, styles, and call-to-action buttons."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <StepCard 
              number="1" 
              title="Create Your Link" 
              description="Enter your destination URL and customize your popup message and button."
            />
            <StepCard 
              number="2" 
              title="Share Your Link" 
              description="Copy your generated short link and share it across your platforms."
            />
            <StepCard 
              number="3" 
              title="Track Results" 
              description="Monitor engagement and optimize your popup links for better results."
            />
          </div>
          <div className="text-center mt-16">
            <Link to="/">
              <Button size="lg" className="px-8 py-6 text-lg">
                Create Your First Link
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">What Our Users Say</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard 
              quote="PopupLinkCraft has helped us increase our newsletter signups by 40%. The popup feature is a game-changer!" 
              author="Sarah J." 
              role="Marketing Director"
            />
            <TestimonialCard 
              quote="I love how easy it is to create and track my popup links. The analytics help me understand what's working." 
              author="Michael T." 
              role="Content Creator"
            />
            <TestimonialCard 
              quote="The customization options are fantastic. I can match the popups to my brand and create a seamless experience." 
              author="Elena R." 
              role="E-commerce Owner"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-violet-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Boost Your Engagement?</h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto">
            Start creating popup links today and see the difference in your conversion rates.
          </p>
          <Link to="/auth">
            <Button variant="secondary" size="lg" className="px-8 py-6 text-lg">
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

// Helper Components
const FeatureCard = ({ icon, title, description }: { icon: string; title: string; description: string }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const StepCard = ({ number, title, description }: { number: string; title: string; description: string }) => (
  <div className="text-center">
    <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
      {number}
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const TestimonialCard = ({ quote, author, role }: { quote: string; author: string; role: string }) => (
  <div className="bg-gray-50 p-6 rounded-lg">
    <p className="italic mb-4">"{quote}"</p>
    <div>
      <p className="font-semibold">{author}</p>
      <p className="text-gray-600 text-sm">{role}</p>
    </div>
  </div>
);
