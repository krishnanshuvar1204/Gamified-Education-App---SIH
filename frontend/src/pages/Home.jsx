import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="landing-page">
      {/* Header with Login */}
      <header className="landing-header">
        <div className="header-container">
          <Link to="/" className="logo">
            <h2>🌱 Nexora</h2>
          </Link>
          <div className="header-actions">
            <Link to="/dashboard" className="dashboard-btn">
              Dashboard
            </Link>
            <Link to="/login" className="login-btn">
              Login
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background">
          <div className="floating-elements">
            <div className="floating-element">🌱</div>
            <div className="floating-element">🌍</div>
            <div className="floating-element">♻️</div>
            <div className="floating-element">🌿</div>
            <div className="floating-element">💚</div>
            <div className="floating-element">🌳</div>
          </div>
        </div>
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-text">🚀 Revolutionizing Education</span>
          </div>
          <h1 className="hero-title">
            Transform Environmental Education Through 
            <span className="gradient-text">Gamification</span>
          </h1>
          <p className="hero-subtitle">
            Nexora is an innovative platform that makes environmental learning engaging, 
            interactive, and rewarding for students and educators worldwide.
          </p>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">10K+</div>
              <div className="stat-label">Active Students</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Schools</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50K+</div>
              <div className="stat-label">Tasks Completed</div>
            </div>
          </div>
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary btn-lg pulse-animation">
              <span>🎯 Get Started Free</span>
            </Link>
            <a href="#about" className="btn btn-outline btn-lg">
              <span>📖 Learn More</span>
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">🌟 About Nexora</div>
            <h2 className="section-title">Empowering the Next Generation of Environmental Leaders</h2>
          </div>
          <div className="about-content">
            <div className="about-text">
              <div className="about-card">
                <div className="card-icon">🌱</div>
                <h3>Our Mission</h3>
                <p className="about-description">
                  Nexora is a cutting-edge gamified environmental education platform designed to 
                  revolutionize how students learn about sustainability and environmental conservation. 
                  Our mission is to create environmentally conscious global citizens through engaging, 
                  interactive, and rewarding educational experiences.
                </p>
              </div>
              
              <div className="about-features">
                <div className="about-feature slide-in-left">
                  <div className="feature-icon-wrapper">
                    <div className="feature-icon">🎮</div>
                  </div>
                  <div className="feature-content">
                    <h4>Gamified Learning</h4>
                    <p>Points, badges, and leaderboards make environmental education fun and competitive.</p>
                  </div>
                </div>
                
                <div className="about-feature slide-in-left">
                  <div className="feature-icon-wrapper">
                    <div className="feature-icon">📊</div>
                  </div>
                  <div className="feature-content">
                    <h4>Progress Tracking</h4>
                    <p>Comprehensive analytics help teachers monitor student engagement and learning outcomes.</p>
                  </div>
                </div>
                
                <div className="about-feature slide-in-left">
                  <div className="feature-icon-wrapper">
                    <div className="feature-icon">🌍</div>
                  </div>
                  <div className="feature-content">
                    <h4>Real Impact</h4>
                    <p>Students complete real-world environmental tasks that create positive change in their communities.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="about-visual">
              <div className="impact-showcase">
                <div className="impact-item">
                  <div className="impact-icon">🌳</div>
                  <div className="impact-text">
                    <div className="impact-number">2.5M+</div>
                    <div className="impact-label">Trees Planted</div>
                  </div>
                </div>
                <div className="impact-item">
                  <div className="impact-icon">♻️</div>
                  <div className="impact-text">
                    <div className="impact-number">1.2M</div>
                    <div className="impact-label">Kg Recycled</div>
                  </div>
                </div>
                <div className="impact-item">
                  <div className="impact-icon">💧</div>
                  <div className="impact-text">
                    <div className="impact-number">500K</div>
                    <div className="impact-label">Liters Saved</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Platform Features</h2>
            <p className="section-description">
              Everything you need to deliver engaging environmental education
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card hover-lift">
              <div className="feature-icon-bg">
                <div className="feature-icon">📚</div>
              </div>
              <h3 className="feature-title">Interactive Resources</h3>
              <p className="feature-description">
                Curated educational content with mandatory quizzes to ensure comprehension 
                and knowledge retention.
              </p>
              <div className="feature-arrow">→</div>
            </div>

            <div className="feature-card hover-lift">
              <div className="feature-icon-bg">
                <div className="feature-icon">✅</div>
              </div>
              <h3 className="feature-title">Environmental Tasks</h3>
              <p className="feature-description">
                Real-world challenges that students complete to earn points and make 
                actual environmental impact.
              </p>
              <div className="feature-arrow">→</div>
            </div>

            <div className="feature-card hover-lift">
              <div className="feature-icon-bg">
                <div className="feature-icon">🧠</div>
              </div>
              <h3 className="feature-title">Knowledge Quizzes</h3>
              <p className="feature-description">
                Interactive assessments that test understanding and provide immediate 
                feedback to reinforce learning.
              </p>
              <div className="feature-arrow">→</div>
            </div>

            <div className="feature-card hover-lift">
              <div className="feature-icon-bg">
                <div className="feature-icon">🏆</div>
              </div>
              <h3 className="feature-title">Leaderboards</h3>
              <p className="feature-description">
                Competitive rankings that motivate students and create a sense of 
                achievement and community.
              </p>
              <div className="feature-arrow">→</div>
            </div>

            <div className="feature-card hover-lift">
              <div className="feature-icon-bg">
                <div className="feature-icon">📈</div>
              </div>
              <h3 className="feature-title">Performance Analytics</h3>
              <p className="feature-description">
                Detailed insights for teachers to track student progress and 
                optimize learning outcomes.
              </p>
              <div className="feature-arrow">→</div>
            </div>

            <div className="feature-card hover-lift">
              <div className="feature-icon-bg">
                <div className="feature-icon">👥</div>
              </div>
              <h3 className="feature-title">Multi-Role Support</h3>
              <p className="feature-description">
                Separate interfaces for students, teachers, and administrators 
                with role-specific features.
              </p>
              <div className="feature-arrow">→</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="cta-background">
          <div className="cta-pattern"></div>
        </div>
        <div className="container">
          <div className="cta-content">
            <div className="cta-icon-group">
              <div className="cta-icon bounce">🌍</div>
              <div className="cta-icon bounce" style={{animationDelay: '0.2s'}}>🎓</div>
              <div className="cta-icon bounce" style={{animationDelay: '0.4s'}}>🚀</div>
            </div>
            <h2 className="cta-title">
              Ready to Transform Environmental Education?
            </h2>
            <p className="cta-description">
              Join thousands of educators and students who are already making a difference 
              with Nexora's gamified learning platform.
            </p>
            <div className="cta-features">
              <div className="cta-feature">
                <span className="checkmark">✓</span>
                <span>Free 30-day trial</span>
              </div>
              <div className="cta-feature">
                <span className="checkmark">✓</span>
                <span>No credit card required</span>
              </div>
              <div className="cta-feature">
                <span className="checkmark">✓</span>
                <span>Setup in under 5 minutes</span>
              </div>
            </div>
            <div className="cta-buttons">
              <Link to="/register" className="btn btn-primary btn-lg glow-effect">
                <span>🎯 Start Free Trial</span>
              </Link>
              <Link to="/login" className="btn btn-outline btn-lg">
                <span>👋 Sign In</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .landing-page {
          min-height: 100vh;
        }

        .landing-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          z-index: 1000;
          padding: 1rem 0;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }

        .header-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          text-decoration: none;
          color: inherit;
        }

        .logo h2 {
          margin: 0;
          font-size: 1.75rem;
          font-weight: 700;
          color: #1e40af;
          letter-spacing: -0.025em;
          transition: color 0.3s ease;
        }

        .logo:hover h2 {
          color: #3b82f6;
        }

        .header-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .dashboard-btn {
          background: transparent;
          color: #1e40af;
          padding: 0.75rem 1.5rem;
          border: 2px solid #bfdbfe;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .dashboard-btn:hover {
          background: #bfdbfe;
          color: #1e40af;
          transform: translateY(-2px);
        }

        .login-btn {
          background: #bfdbfe;
          color: #1e40af;
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
          letter-spacing: 0.025em;
        }

        .login-btn:hover {
          background: #93c5fd;
          transform: translateY(-2px);
        }

        .hero {
          background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 50%, #e0f2fe 100%);
          color: #1e293b;
          padding: 140px 20px 80px;
          text-align: center;
          min-height: 90vh;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 80px;
          position: relative;
          overflow: hidden;
        }

        .hero-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1;
        }

        .floating-elements {
          position: absolute;
          width: 100%;
          height: 100%;
        }

        .floating-element {
          position: absolute;
          font-size: 2rem;
          opacity: 0.3;
          animation: float 6s ease-in-out infinite;
        }

        .floating-element:nth-child(1) {
          top: 20%;
          left: 10%;
          animation-delay: 0s;
        }

        .floating-element:nth-child(2) {
          top: 60%;
          left: 80%;
          animation-delay: 1s;
        }

        .floating-element:nth-child(3) {
          top: 30%;
          left: 70%;
          animation-delay: 2s;
        }

        .floating-element:nth-child(4) {
          top: 70%;
          left: 20%;
          animation-delay: 3s;
        }

        .floating-element:nth-child(5) {
          top: 40%;
          left: 90%;
          animation-delay: 4s;
        }

        .floating-element:nth-child(6) {
          top: 80%;
          left: 60%;
          animation-delay: 5s;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }

        .hero-content {
          position: relative;
          z-index: 2;
        }

        .hero-badge {
          display: inline-block;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(147, 197, 253, 0.5);
          padding: 0.75rem 1.5rem;
          border-radius: 50px;
          margin-bottom: 2rem;
          animation: slideInDown 1s ease-out;
          color: #1e40af;
          letter-spacing: 0.025em;
        }

        .badge-text {
          font-weight: 600;
          font-size: 0.9rem;
        }

        .gradient-text {
          background: linear-gradient(45deg, #3b82f6, #1d4ed8, #1e40af);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 2s ease-in-out infinite alternate;
        }

        @keyframes shimmer {
          0% { filter: hue-rotate(0deg); }
          100% { filter: hue-rotate(20deg); }
        }

        .hero-stats {
          display: flex;
          justify-content: center;
          gap: 3rem;
          margin: 2rem 0;
          flex-wrap: wrap;
        }

        .stat-item {
          text-align: center;
          animation: fadeInUp 1s ease-out;
        }

        .stat-item:nth-child(1) { animation-delay: 0.2s; }
        .stat-item:nth-child(2) { animation-delay: 0.4s; }
        .stat-item:nth-child(3) { animation-delay: 0.6s; }

        .stat-number {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: #2563eb;
          letter-spacing: -0.025em;
        }

        .stat-label {
          font-size: 0.875rem;
          opacity: 0.8;
          font-weight: 500;
          letter-spacing: 0.025em;
        }

        .pulse-animation {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(255, 255, 255, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
        }

        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero-content {
          max-width: 800px;
          margin: 0 auto;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          margin-bottom: 2rem;
          line-height: 1.1;
          letter-spacing: -0.025em;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          margin-bottom: 3rem;
          opacity: 0.8;
          line-height: 1.7;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
          letter-spacing: 0.015em;
        }

        .hero-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .about {
          padding: 120px 20px;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          position: relative;
        }

        .section-badge {
          display: inline-block;
          background: linear-gradient(135deg, #bfdbfe, #93c5fd);
          color: #1e40af;
          padding: 0.5rem 1.5rem;
          border-radius: 50px;
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          box-shadow: 0 4px 15px rgba(147, 197, 253, 0.3);
          letter-spacing: 0.025em;
        }

        .about-card {
          background: white;
          padding: 2.5rem;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
          border: 1px solid rgba(34, 211, 238, 0.1);
          position: relative;
          overflow: hidden;
        }

        .about-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #3b82f6, #60a5fa, #93c5fd);
        }

        .card-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          display: block;
        }

        .about-card h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1.25rem;
          color: #0f172a;
          letter-spacing: -0.015em;
        }

        .about-feature {
          display: flex;
          gap: 1.5rem;
          align-items: flex-start;
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: white;
          border-radius: 15px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          border-left: 4px solid transparent;
        }

        .about-feature:hover {
          transform: translateX(10px);
          border-left-color: #60a5fa;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .feature-icon-wrapper {
          background: linear-gradient(135deg, #60a5fa, #3b82f6);
          padding: 1rem;
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 60px;
          height: 60px;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
        }

        .feature-icon-wrapper .feature-icon {
          font-size: 1.5rem;
          margin: 0;
        }

        .feature-content h4 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          color: #0f172a;
          letter-spacing: -0.015em;
        }

        .feature-content p {
          color: #475569;
          line-height: 1.7;
          margin: 0;
          letter-spacing: 0.01em;
        }

        .slide-in-left {
          animation: slideInLeft 0.8s ease-out forwards;
          opacity: 0;
        }

        .slide-in-left:nth-child(1) { animation-delay: 0.2s; }
        .slide-in-left:nth-child(2) { animation-delay: 0.4s; }
        .slide-in-left:nth-child(3) { animation-delay: 0.6s; }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .about-visual {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .impact-showcase {
          background: white;
          padding: 2rem;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .impact-item {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 1.75rem;
          margin-bottom: 1.25rem;
          background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
          border-radius: 15px;
          transition: all 0.3s ease;
        }

        .impact-item:hover {
          transform: scale(1.05);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.2);
        }

        .impact-icon {
          font-size: 2.5rem;
          background: linear-gradient(135deg, #60a5fa, #3b82f6);
          padding: 1rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 70px;
          height: 70px;
        }

        .impact-number {
          font-size: 2rem;
          font-weight: 700;
          color: #2563eb;
          margin-bottom: 0.5rem;
          letter-spacing: -0.025em;
        }

        .impact-label {
          color: #475569;
          font-weight: 500;
          font-size: 0.875rem;
          letter-spacing: 0.025em;
        }

        .about-content {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 4rem;
          align-items: start;
        }

        .features {
          padding: 120px 20px;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          position: relative;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .section-title {
          font-size: 2.75rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: #0f172a;
          line-height: 1.2;
          letter-spacing: -0.025em;
        }

        .section-description {
          font-size: 1.125rem;
          color: #475569;
          max-width: 650px;
          margin: 0 auto;
          line-height: 1.7;
          letter-spacing: 0.015em;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
        }

        .feature-card {
          background: white;
          padding: 3rem;
          border-radius: 24px;
          text-align: center;
          transition: all 0.4s ease;
          border: 1px solid rgba(147, 197, 253, 0.2);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
          position: relative;
          overflow: hidden;
        }

        .hover-lift:hover {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 20px 40px rgba(59, 130, 246, 0.2);
        }

        .feature-icon-bg {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          width: 80px;
          height: 80px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 2rem;
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
        }

        .feature-icon {
          font-size: 2rem;
          color: white;
          margin: 0;
        }

        .feature-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1.25rem;
          color: #0f172a;
          letter-spacing: -0.015em;
        }

        .feature-description {
          color: #475569;
          line-height: 1.7;
          margin-bottom: 2rem;
          letter-spacing: 0.01em;
        }

        .feature-arrow {
          position: absolute;
          bottom: 1.5rem;
          right: 1.5rem;
          font-size: 1.5rem;
          color: #3b82f6;
          opacity: 0;
          transition: all 0.3s ease;
        }

        .feature-card:hover .feature-arrow {
          opacity: 1;
          transform: translateX(5px);
        }

        .cta {
          padding: 120px 20px;
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%);
          color: white;
          position: relative;
          overflow: hidden;
        }

        .cta-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1;
        }

        .cta-pattern {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: radial-gradient(circle at 25% 25%, rgba(147, 197, 253, 0.1) 0%, transparent 50%),
                            radial-gradient(circle at 75% 75%, rgba(219, 234, 254, 0.1) 0%, transparent 50%);
        }

        .cta-content {
          text-align: center;
          max-width: 800px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        .cta-icon-group {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .cta-icon {
          font-size: 3rem;
          animation: bounce 2s infinite;
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }

        .cta-title {
          font-size: 2.75rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: white;
          line-height: 1.2;
          letter-spacing: -0.025em;
        }

        .cta-description {
          font-size: 1.125rem;
          margin-bottom: 2.5rem;
          opacity: 0.9;
          line-height: 1.7;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
          letter-spacing: 0.015em;
        }

        .cta-features {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .cta-feature {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
        }

        .checkmark {
          background: #bfdbfe;
          color: #1e40af;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .cta-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn {
          display: inline-block;
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .btn-lg {
          padding: 1rem 2rem;
          font-size: 1.125rem;
        }

        .btn-primary {
          background: linear-gradient(135deg, #bfdbfe, #93c5fd);
          color: #1e40af;
          box-shadow: 0 4px 15px rgba(147, 197, 253, 0.4);
          font-weight: 600;
          letter-spacing: 0.025em;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(147, 197, 253, 0.6);
        }

        .glow-effect {
          animation: glow 2s ease-in-out infinite alternate;
        }

        @keyframes glow {
          from { box-shadow: 0 4px 15px rgba(147, 197, 253, 0.4); }
          to { box-shadow: 0 4px 25px rgba(147, 197, 253, 0.8); }
        }

        .btn-outline {
          background: transparent;
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.3);
          font-weight: 600;
          letter-spacing: 0.025em;
        }

        .btn-outline:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.5);
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }

          .about-content {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .about-stats {
            flex-direction: row;
            overflow-x: auto;
          }

          .stat-card {
            min-width: 200px;
          }

          .section-title {
            font-size: 2rem;
          }

          .cta-title {
            font-size: 2rem;
          }

          .cta-buttons {
            flex-direction: column;
            align-items: center;
          }

          .btn {
            width: 200px;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
