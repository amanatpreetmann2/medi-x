import React, { useState } from 'react';
import MedixLogo from '../components/MedixLogo';
import FloatingCard from '../components/FloatingCard';
import LoginForm from '../components/LoginForm';
import ForgotPasswordModal from '../components/ForgotPasswordModal';
import medicalHeroImg from '../assets/medical_hero.png';
import { Activity, ShieldCheck, Calendar, Lock } from 'lucide-react';

export default function Login({ onLogin, onLoginSuccess }) {
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  const handleSuccessfulLogin = (userData) => {
    if (onLogin) onLogin(userData);
    if (onLoginSuccess) onLoginSuccess(userData);
  };

  return (
    <div className="medix-login-container">
      {/* LEFT SIDE: Hero Visual & Animated Floating Badges */}
      <section className="medix-hero-section">
        {medicalHeroImg && (
          <img
            src={medicalHeroImg}
            alt="Medix Healthcare Portal"
            className="hero-bg-image"
          />
        )}
        <div className="hero-glow-1" />
        <div className="hero-glow-2" />

        <div className="hero-header">
          <MedixLogo darkTheme={true} size="medium" />
        </div>

        <div className="hero-body">
          <div className="hero-slogan-badge">
            <Activity size={14} /> Patient Centric Portal
          </div>
          <h1 className="hero-title">
            Your Health, <span>Simplified.</span>
          </h1>
          <p className="hero-subtitle">
            Securely access your appointments, health records, medications, and doctors — all in one place.
          </p>

          <div className="floating-cards-container">
            <FloatingCard
              icon={Activity}
              title="24/7 Health Access"
              description="Real-time vital tracking & telehealth"
              animationClass="anim-float-1"
              iconColor="teal"
            />
            <FloatingCard
              icon={ShieldCheck}
              title="Secure Medical Records"
              description="HIPAA compliant 256-bit encryption"
              animationClass="anim-float-2"
              iconColor="blue"
            />
            <FloatingCard
              icon={Calendar}
              title="Easy Appointment Booking"
              description="Schedule visits with care team in seconds"
              animationClass="anim-float-3"
              iconColor="teal"
            />
          </div>
        </div>

        <div className="hero-footer">
          <div className="security-badge">
            <Lock size={14} /> 256-bit SSL Encrypted
          </div>
          <span>•</span>
          <span>Certified Medical Software</span>
        </div>
      </section>

      {/* RIGHT SIDE: Login Card */}
      <section className="medix-form-section">
        <LoginForm
          onLoginSuccess={handleSuccessfulLogin}
          onOpenForgotPassword={() => setIsForgotPasswordOpen(true)}
        />
      </section>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
      />
    </div>
  );
}