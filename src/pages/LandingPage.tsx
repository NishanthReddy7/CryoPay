import Header from '../components/Header';
import Hero from '../components/Hero';
import SocialProof from '../components/SocialProof';
import Features from '../components/Features';
import Testimonial from '../components/Testimonial';
import CallToAction from '../components/CallToAction';
import Footer from '../components/Footer';

const LandingPage = () => {
  return (
    <div className="bg-white text-slate-800 antialiased">
      <Header />
      <main>
        <Hero />
        <SocialProof />
        <Features />
        <Testimonial />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
