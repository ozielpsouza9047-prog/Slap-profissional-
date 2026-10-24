import React, { useState } from 'react';
import { UserRole } from '../types';
import { Crown, Lock, Mail, ShieldCheck, UserCheck, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: (role: UserRole, userName: string) => void;
  onNavigate: (view: string) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<UserRole>('client');
  const [email, setEmail] = useState('helena.cavalcanti@exemplo.com');
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const name = activeTab === 'admin' ? 'Sophia Royale (ADM)' : 'Helena Cavalcanti (VIP)';
      onLoginSuccess(activeTab, name);
      onNavigate(activeTab === 'admin' ? 'admin' : 'home');
    }, 600);
  };

  const handleQuickDemo = (role: UserRole) => {
    setActiveTab(role);
    const demoEmail = role === 'admin' ? 'adm.sophia@studioroyale.com' : 'helena.cavalcanti@exemplo.com';
    const demoName = role === 'admin' ? 'Sophia Royale (ADM)' : 'Helena Cavalcanti (VIP)';
    setEmail(demoEmail);
    onLoginSuccess(role, demoName);
    onNavigate(role === 'admin' ? 'admin' : 'home');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-[#121214] border border-[#D4AF37]/30 rounded-2xl shadow-2xl p-6 sm:p-8 relative overflow-hidden">
        
        {/* Glow Effects */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="text-center space-y-2 mb-8 relative z-10">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#E5C158] via-[#D4AF37] to-[#8C6F1E] p-[1px] mx-auto shadow-lg shadow-[#D4AF37]/20">
            <div className="w-full h-full bg-[#0B0B0C] rounded-full flex items-center justify-center">
              <Crown className="w-7 h-7 text-[#D4AF37]" />
            </div>
          </div>
          <h2 className="font-cinzel text-2xl font-bold gold-gradient-text tracking-wide">
            STUDIO ROYALE
          </h2>
          <p className="text-xs text-[#C5A059] font-medium">
            Portal de Autenticação Exclusiva
          </p>
        </div>

        {/* Role Tab Selector */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-[#0B0B0C] border border-[#26242A] rounded-xl mb-6">
          <button
            type="button"
            onClick={() => {
              setActiveTab('client');
              setEmail('helena.cavalcanti@exemplo.com');
            }}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'client'
                ? 'bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#FFF1C5] shadow-sm'
                : 'text-[#8E8A80] hover:text-[#E2D4B7]'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Cliente VIP</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('admin');
              setEmail('adm.sophia@studioroyale.com');
            }}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'admin'
                ? 'bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#FFF1C5] shadow-sm'
                : 'text-[#8E8A80] hover:text-[#E2D4B7]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Painel ADM</span>
          </button>
        </div>

        {/* Quick Demo Login Bar */}
        <div className="p-3 rounded-xl bg-[#18181B] border border-[#D4AF37]/20 mb-6 text-xs text-center space-y-2">
          <div className="flex items-center justify-center gap-1.5 text-[#D4AF37] font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Acesso Rápido de Demonstração</span>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleQuickDemo('client')}
              className="px-2.5 py-1.5 rounded-lg bg-[#222127] border border-[#D4AF37]/30 text-[11px] font-medium text-[#FFF1C5] hover:bg-[#D4AF37]/15 transition-all truncate"
            >
              Demo: Cliente VIP
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="px-2.5 py-1.5 rounded-lg bg-[#222127] border border-[#D4AF37]/30 text-[11px] font-medium text-[#FFF1C5] hover:bg-[#D4AF37]/15 transition-all truncate"
            >
              Demo: ADM Salão
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#C5A059] mb-1.5">
              E-mail de Acesso
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8E8A80] absolute left-3 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@exemplo.com"
                className="w-full bg-[#0B0B0C] border border-[#26242A] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#FFF1C5] focus:border-[#D4AF37] outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#C5A059] mb-1.5">
              Senha
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8E8A80] absolute left-3 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0B0B0C] border border-[#26242A] rounded-xl pl-10 pr-10 py-2.5 text-xs text-[#FFF1C5] focus:border-[#D4AF37] outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-[#8E8A80] hover:text-[#FFF1C5]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#C5A059]">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded accent-[#D4AF37] bg-[#0B0B0C]" />
              <span>Lembrar neste dispositivo</span>
            </label>
            <button type="button" className="hover:underline hover:text-[#FFF1C5]">
              Esqueceu a senha?
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#E5C158] via-[#D4AF37] to-[#B8860B] text-[#0B0B0C] font-extrabold text-xs tracking-wider uppercase hover:brightness-110 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Autenticando...</span>
            ) : (
              <>
                <span>Entrar no Studio Royale</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};
