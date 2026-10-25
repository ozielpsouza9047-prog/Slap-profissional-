import React, { useState } from 'react';
import { CartItem, SalonOrder } from '../types';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag, Check, CreditCard, QrCode, Store, Sparkles } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onNavigate: (view: string) => void;
  onCheckoutComplete?: (newOrder: SalonOrder) => void;
  activeClientName?: string;
  activeClientPhone?: string;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onNavigate,
  onCheckoutComplete,
  activeClientName = 'Dra. Helena Cavalcanti',
  activeClientPhone = '(11) 98765-4321'
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'payment' | 'confirmation'>('cart');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card' | 'salon'>('pix');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string>('PED-9045');

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const total = Math.max(0, subtotal - discountAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = couponCode.trim().toUpperCase();
    if (clean === 'ROYALE10' || clean === 'VIPGOLD') {
      setDiscountPercent(10);
      setCouponApplied(true);
      setCouponError('');
    } else if (clean === 'DIAMOND20') {
      setDiscountPercent(20);
      setCouponApplied(true);
      setCouponError('');
    } else {
      setCouponError('Cupom inválido. Tente ROYALE10');
    }
  };

  const handleFinishCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      
      const orderId = `PED-${Math.floor(1000 + Math.random() * 9000)}`;
      const itemsSummaryStr = items.map(i => `${i.quantity}x ${i.title}`).join(', ');
      const paymentLabel = paymentMethod === 'pix' ? 'Pix' : paymentMethod === 'card' ? 'Cartão 12x' : 'Pagar no Salão';
      const statusVal = paymentMethod === 'salon' ? 'Pendente' : 'Pago';

      const now = new Date();
      const dateFormatted = `${now.toLocaleDateString('pt-BR')} ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;

      const newOrder: SalonOrder = {
        id: orderId,
        clientName: activeClientName,
        clientPhone: activeClientPhone,
        itemsSummary: itemsSummaryStr,
        total: total,
        paymentMethod: paymentLabel,
        date: dateFormatted,
        status: statusVal,
        items: [...items]
      };

      if (onCheckoutComplete) {
        onCheckoutComplete(newOrder);
      }

      setConfirmedOrderId(orderId);
      setCheckoutStep('confirmation');
      onClearCart();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#0B0B0C]/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#121214] border-l border-[#D4AF37]/30 shadow-2xl flex flex-col text-[#F5E6C8]">
          
          {/* Drawer Header */}
          <div className="px-6 py-5 border-b border-[#26242A] flex items-center justify-between bg-[#0B0B0C]/60">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37]">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-cinzel font-bold text-lg gold-gradient-text">
                  Sacola Royale
                </h2>
                <p className="text-xs text-[#C5A059]">
                  {items.length} {items.length === 1 ? 'item selecionado' : 'itens selecionados'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-[#C5A059] hover:text-[#FFF1C5] hover:bg-[#18181B] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Content Body */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {checkoutStep === 'cart' && (
              <>
                {items.length === 0 ? (
                  <div className="text-center py-16 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-[#18181B] border border-[#D4AF37]/20 flex items-center justify-center mx-auto text-[#C5A059]">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <h3 className="font-cinzel text-lg text-[#FFF1C5]">Sua sacola está vazia</h3>
                    <p className="text-xs text-[#E2D4B7]/70 max-w-xs mx-auto">
                      Explore nossos serviços de beleza VIP ou nossa boutique de produtos exclusivos.
                    </p>
                    <div className="pt-2 flex justify-center gap-2">
                      <button
                        onClick={() => {
                          onClose();
                          onNavigate('agenda');
                        }}
                        className="px-4 py-2 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-xs font-bold text-[#FFF1C5]"
                      >
                        Agendar Serviço
                      </button>
                      <button
                        onClick={() => {
                          onClose();
                          onNavigate('vitrine');
                        }}
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#E5C158] to-[#B8860B] text-[#0B0B0C] text-xs font-bold"
                      >
                        Ver Produtos
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-xl bg-[#18181B] border border-[#D4AF37]/20 flex items-center gap-3 group hover:border-[#D4AF37]/40 transition-all"
                      >
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-16 h-16 rounded-lg object-cover border border-[#D4AF37]/20"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-lg bg-[#222127] border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
                            <Sparkles className="w-6 h-6" />
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] uppercase font-bold text-[#D4AF37] px-1.5 py-0.5 rounded bg-[#D4AF37]/10">
                              {item.type === 'service' ? 'Serviço' : 'Produto'}
                            </span>
                          </div>
                          <h4 className="text-sm font-semibold text-[#FFF1C5] truncate mt-1">
                            {item.title}
                          </h4>
                          {item.selectedStylistName && (
                            <p className="text-xs text-[#C5A059]">
                              Com: {item.selectedStylistName}
                            </p>
                          )}
                          {item.selectedDate && (
                            <p className="text-[11px] text-[#E2D4B7]/70">
                              Data: {item.selectedDate} às {item.selectedTime}
                            </p>
                          )}
                          <div className="text-sm font-bold text-[#D4AF37] font-mono mt-1">
                            R$ {(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>

                        {/* Quantity Stepper & Delete */}
                        <div className="flex flex-col items-end gap-2">
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="p-1 rounded text-red-400 hover:text-red-300 hover:bg-red-950/40 transition-colors"
                            title="Remover"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          
                          {item.type === 'product' && (
                            <div className="flex items-center border border-[#D4AF37]/30 rounded-lg bg-[#0B0B0C] overflow-hidden">
                              <button
                                onClick={() => onUpdateQuantity(item.id, -1)}
                                className="px-2 py-0.5 text-xs text-[#C5A059] hover:bg-[#18181B]"
                              >
                                -
                              </button>
                              <span className="px-2 text-xs font-mono font-bold text-[#FFF1C5]">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => onUpdateQuantity(item.id, 1)}
                                className="px-2 py-0.5 text-xs text-[#C5A059] hover:bg-[#18181B]"
                              >
                                +
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {checkoutStep === 'payment' && (
              <div className="space-y-4 animate-in fade-in">
                <button
                  onClick={() => setCheckoutStep('cart')}
                  className="text-xs text-[#C5A059] hover:text-[#FFF1C5] flex items-center gap-1"
                >
                  ← Voltar para revisão da sacola
                </button>

                <h3 className="font-cinzel text-base font-bold text-[#FFF1C5]">
                  Forma de Pagamento
                </h3>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setPaymentMethod('pix')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-2 text-center transition-all ${
                      paymentMethod === 'pix'
                        ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#FFF1C5]'
                        : 'bg-[#18181B] border-[#26242A] text-[#C5A059]'
                    }`}
                  >
                    <QrCode className="w-5 h-5 text-[#D4AF37]" />
                    <span className="text-xs font-semibold">Pix Instantâneo</span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-2 text-center transition-all ${
                      paymentMethod === 'card'
                        ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#FFF1C5]'
                        : 'bg-[#18181B] border-[#26242A] text-[#C5A059]'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-[#D4AF37]" />
                    <span className="text-xs font-semibold">Cartão 12x</span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('salon')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-2 text-center transition-all ${
                      paymentMethod === 'salon'
                        ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#FFF1C5]'
                        : 'bg-[#18181B] border-[#26242A] text-[#C5A059]'
                    }`}
                  >
                    <Store className="w-5 h-5 text-[#D4AF37]" />
                    <span className="text-xs font-semibold">Pagar no Salão</span>
                  </button>
                </div>

                {paymentMethod === 'pix' && (
                  <div className="p-4 rounded-xl bg-[#18181B] border border-[#D4AF37]/30 text-center space-y-3">
                    <div className="bg-white p-3 rounded-lg w-36 h-36 mx-auto flex items-center justify-center">
                      <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-white text-[10px] font-mono p-2">
                        <span>[PIX QR CODE]</span>
                        <span className="mt-1 text-center font-bold">STUDIO ROYALE LTDA</span>
                      </div>
                    </div>
                    <p className="text-xs text-[#E2D4B7]/80">
                      Escaneie o QR Code ou utilize a chave Pix copia e cola abaixo.
                    </p>
                    <button
                      onClick={() => alert('Chave Pix copiada para a área de transferência!')}
                      className="w-full py-2 bg-[#222127] border border-[#D4AF37]/40 rounded-lg text-xs text-[#D4AF37] font-semibold hover:bg-[#D4AF37]/10"
                    >
                      Copiar Chave Pix (00020126...ROYALE)
                    </button>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="p-4 rounded-xl bg-[#18181B] border border-[#D4AF37]/30 space-y-3 text-xs">
                    <div>
                      <label className="block text-[#C5A059] mb-1">Número do Cartão</label>
                      <input
                        type="text"
                        placeholder="0000 0000 0000 0000"
                        className="w-full bg-[#0B0B0C] border border-[#26242A] rounded-lg p-2.5 text-[#FFF1C5] focus:border-[#D4AF37] outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[#C5A059] mb-1">Validade</label>
                        <input
                          type="text"
                          placeholder="MM/AA"
                          className="w-full bg-[#0B0B0C] border border-[#26242A] rounded-lg p-2.5 text-[#FFF1C5] focus:border-[#D4AF37] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[#C5A059] mb-1">CVV</label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full bg-[#0B0B0C] border border-[#26242A] rounded-lg p-2.5 text-[#FFF1C5] focus:border-[#D4AF37] outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'salon' && (
                  <div className="p-4 rounded-xl bg-[#18181B] border border-[#D4AF37]/30 text-xs text-[#E2D4B7] space-y-2">
                    <p className="font-semibold text-[#FFF1C5]">Pagamento Presencial</p>
                    <p className="text-[#E2D4B7]/70">
                      Você pode efetuar o pagamento diretamente na recepção do salão via Pix, Cartão de Crédito/Débito ou Dinheiro ao chegar para seu atendimento.
                    </p>
                  </div>
                )}
              </div>
            )}

            {checkoutStep === 'confirmation' && (
              <div className="text-center py-10 space-y-4 animate-in fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-950/60 border border-emerald-500/50 text-emerald-400 flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="font-cinzel text-xl font-bold gold-gradient-text">
                  Pedido Confirmado!
                </h3>
                <p className="text-xs text-[#E2D4B7]/80 leading-relaxed max-w-xs mx-auto">
                  Seu pedido foi registrado em seu histórico VIP ("Meus Pedidos") e os itens foram removidos da sua sacola.
                </p>

                <div className="p-4 rounded-xl bg-[#18181B] border border-[#D4AF37]/30 text-left text-xs space-y-2 font-mono">
                  <div className="flex justify-between border-b border-[#26242A] pb-2 text-[#C5A059]">
                    <span>CÓDIGO PEDIDO</span>
                    <span className="text-[#FFF1C5] font-bold">#{confirmedOrderId}</span>
                  </div>
                  <div className="flex justify-between text-[#E2D4B7]/70">
                    <span>Cliente</span>
                    <span className="text-[#FFF1C5] font-bold">{activeClientName}</span>
                  </div>
                  <div className="flex justify-between text-[#E2D4B7]/70">
                    <span>Status</span>
                    <span className="text-emerald-400 font-bold">Registrado</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setCheckoutStep('cart');
                      onClose();
                      onNavigate('clientes');
                    }}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#E5C158] to-[#B8860B] text-[#0B0B0C] font-extrabold text-xs"
                  >
                    Ver Meus Pedidos no Perfil VIP
                  </button>

                  <button
                    onClick={() => {
                      setCheckoutStep('cart');
                      onClose();
                    }}
                    className="w-full py-2.5 rounded-xl bg-[#18181B] border border-[#26242A] text-[#FFF1C5] font-semibold text-xs"
                  >
                    Fechar Sacola
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Drawer Footer (Subtotal & Coupon & Checkout CTA) */}
          {items.length > 0 && checkoutStep !== 'confirmation' && (
            <div className="p-6 border-t border-[#26242A] bg-[#0B0B0C]/80 space-y-4">
              {/* Cupom Form */}
              {checkoutStep === 'cart' && (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-4 h-4 text-[#C5A059] absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Cupom de desconto (ex: ROYALE10)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full bg-[#18181B] border border-[#D4AF37]/30 rounded-lg pl-9 pr-3 py-2 text-xs text-[#FFF1C5] placeholder-[#8E8A80] focus:border-[#D4AF37] outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-[#222127] border border-[#D4AF37]/40 text-xs font-semibold text-[#D4AF37] hover:bg-[#D4AF37]/10"
                  >
                    Aplicar
                  </button>
                </form>
              )}

              {couponError && (
                <p className="text-[11px] text-red-400 font-medium">{couponError}</p>
              )}
              {couponApplied && (
                <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Cupom de {discountPercent}% aplicado com sucesso!
                </p>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-[#E2D4B7]/70">
                  <span>Subtotal</span>
                  <span>R$ {subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Desconto VIP ({discountPercent}%)</span>
                    <span>- R$ {discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-[#FFF1C5] pt-2 border-t border-[#26242A]">
                  <span>Total</span>
                  <span className="gold-gradient-text text-lg font-extrabold">
                    R$ {total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              {checkoutStep === 'cart' ? (
                <button
                  onClick={() => setCheckoutStep('payment')}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#E5C158] via-[#D4AF37] to-[#B8860B] text-[#0B0B0C] font-extrabold text-sm tracking-wide shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2"
                >
                  <span>Avançar para Pagamento</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleFinishCheckout}
                  disabled={isProcessing}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#E5C158] via-[#D4AF37] to-[#B8860B] text-[#0B0B0C] font-extrabold text-sm tracking-wide shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span>Processando Pedido VIP...</span>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Confirmar Pedido & Pagamento</span>
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
