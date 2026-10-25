import React, { useState } from 'react';
import { SalonProduct } from '../types';
import { Search, Filter, Star, ShoppingBag, Sparkles, Check, Info, X, Package } from 'lucide-react';

interface VitrineViewProps {
  products: SalonProduct[];
  onAddToCart: (product: SalonProduct) => void;
  onNavigateToAdmin?: () => void;
}

export const VitrineView: React.FC<VitrineViewProps> = ({
  products,
  onAddToCart,
  onNavigateToAdmin
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'rating'>('featured');
  const [selectedProduct, setSelectedProduct] = useState<SalonProduct | null>(null);
  const [addedNoticeId, setAddedNoticeId] = useState<string | null>(null);

  const categories = [
    { id: 'todos', label: 'Todos os Produtos' },
    { id: 'cabelos', label: 'Cabelos & Óleos' },
    { id: 'tratamentos', label: 'Tratamentos & Máscaras' },
    { id: 'perfumes', label: 'Perfumes & Brumas' },
    { id: 'homecare', label: 'Velas & Ambiance' }
  ];

  const handleAdd = (product: SalonProduct) => {
    if (product.stock <= 0) {
      alert('Produto indisponível no momento.');
      return;
    }
    onAddToCart(product);
    setAddedNoticeId(product.id);
    setTimeout(() => setAddedNoticeId(null), 2000);
  };

  // Filter & Sort Logic
  const filteredProducts = products.filter(p => {
    const matchCategory = selectedCategory === 'todos' || p.category === selectedCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  }).sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-[#121214] via-[#18181B] to-[#121214] border border-[#D4AF37]/30 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-xs font-bold text-[#FFF1C5]">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Boutique Royale Exclusiva</span>
          </div>
          <h1 className="font-cinzel text-3xl font-bold champagne-gradient-text">
            Cosméticos de Alta Performance
          </h1>
          <p className="text-xs text-[#E2D4B7]/80 leading-relaxed">
            Produtos selecionados por nossos especialistas em beleza para dar continuidade aos cuidados de salão na sua casa.
          </p>
        </div>

        <div className="relative w-full md:w-auto flex flex-col sm:flex-row gap-3 justify-end items-center">
          <div className="px-4 py-3 rounded-2xl bg-[#0B0B0C]/80 border border-[#D4AF37]/30 text-center font-mono">
            <span className="text-[10px] text-[#C5A059] uppercase block">Frete Grátis VIP</span>
            <span className="text-xs font-bold text-[#FFF1C5]">Em compras acima de R$ 350,00</span>
          </div>

          {onNavigateToAdmin && (
            <button
              onClick={onNavigateToAdmin}
              className="px-3.5 py-2.5 rounded-xl bg-[#18181B] hover:bg-[#222127] border border-[#D4AF37]/40 text-xs font-semibold text-[#D4AF37] flex items-center gap-1.5 transition-all"
            >
              <Package className="w-4 h-4" />
              <span>Gerenciar no ADM</span>
            </button>
          )}
        </div>
      </div>

      {/* Controls Bar: Search, Categories & Sort */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#8E8A80] absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Buscar por marca, produto, tratamento..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#121214] border border-[#D4AF37]/30 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#FFF1C5] placeholder-[#8E8A80] focus:border-[#D4AF37] outline-none"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="w-4 h-4 text-[#C5A059]" />
            <span className="text-xs font-bold text-[#FFF1C5]">Ordenar por:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#121214] border border-[#D4AF37]/30 rounded-xl px-3 py-2 text-xs text-[#FFF1C5] outline-none focus:border-[#D4AF37]"
            >
              <option value="featured">Destaques & Bestsellers</option>
              <option value="price_asc">Menor Preço</option>
              <option value="price_desc">Maior Preço</option>
              <option value="rating">Melhor Avaliados</option>
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-[#26242A]">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-[#E5C158] to-[#B8860B] text-[#0B0B0C] shadow-md'
                  : 'bg-[#121214] text-[#C5A059] border border-[#26242A] hover:border-[#D4AF37]/40'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.length === 0 ? (
          <div className="col-span-3 py-16 text-center bg-[#121214] rounded-3xl border border-[#26242A] text-[#E2D4B7]/70 space-y-2">
            <Package className="w-10 h-10 text-[#C5A059] mx-auto opacity-50" />
            <h3 className="font-cinzel text-lg text-[#FFF1C5]">Nenhum produto encontrado</h3>
            <p className="text-xs">Tente ajustar seus termos de busca ou filtros de categoria.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('todos');
              }}
              className="text-xs text-[#D4AF37] underline font-semibold pt-2"
            >
              Ver todos os produtos
            </button>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="p-5 rounded-2xl bg-[#121214] border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 transition-all flex flex-col justify-between group shadow-lg"
            >
              <div>
                {/* Image Box */}
                <div className="relative overflow-hidden rounded-xl mb-4 bg-[#0B0B0C] h-56">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {product.isBestSeller && (
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-gradient-to-r from-[#E5C158] to-[#B8860B] text-[#0B0B0C] text-[10px] font-extrabold uppercase shadow-md">
                      Bestseller Royale
                    </span>
                  )}

                  {product.stock <= 0 && (
                    <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-red-950 text-red-300 text-[10px] font-bold border border-red-800 uppercase shadow-md">
                      Esgotado
                    </span>
                  )}

                  <button
                    onClick={() => setSelectedProduct(product)}
                    className="absolute bottom-3 right-3 p-2 rounded-full bg-[#0B0B0C]/80 backdrop-blur-md border border-[#D4AF37]/40 text-[#FFF1C5] hover:text-[#D4AF37] transition-all"
                    title="Ver Detalhes do Produto"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </div>

                {/* Info */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059]">
                    {product.brand} · {product.volume}
                  </span>
                  <h3 className="font-cinzel font-bold text-base text-[#FFF1C5] group-hover:text-[#D4AF37] transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-xs text-[#E2D4B7]/70 line-clamp-2 mt-1">
                    {product.description}
                  </p>

                  <div className="flex items-center gap-1.5 pt-2 text-amber-400 text-xs">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="font-bold">{product.rating.toFixed(1)}</span>
                    <span className="text-[#8E8A80] text-[10px]">
                      ({product.stock > 0 ? `${product.stock} em estoque` : 'Esgotado'})
                    </span>
                  </div>
                </div>
              </div>

              {/* Price & Add Action */}
              <div className="pt-4 mt-4 border-t border-[#26242A] flex items-center justify-between">
                <div>
                  {product.oldPrice && product.oldPrice > product.price && (
                    <span className="text-[11px] text-[#8E8A80] line-through block font-mono">
                      R$ {product.oldPrice.toFixed(2)}
                    </span>
                  )}
                  <span className="text-xl font-bold font-mono gold-gradient-text">
                    R$ {product.price.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={() => handleAdd(product)}
                  disabled={product.stock <= 0}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed ${
                    addedNoticeId === product.id
                      ? 'bg-emerald-500 text-[#0B0B0C]'
                      : 'bg-gradient-to-r from-[#E5C158] to-[#B8860B] text-[#0B0B0C] hover:brightness-110 shadow-md'
                  }`}
                >
                  {addedNoticeId === product.id ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Adicionado!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>{product.stock <= 0 ? 'Indisponível' : 'Adicionar à Sacola'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-[#0B0B0C]/80 backdrop-blur-sm"
            onClick={() => setSelectedProduct(null)}
          />
          <div className="relative w-full max-w-lg bg-[#121214] border border-[#D4AF37]/40 rounded-3xl p-6 shadow-2xl space-y-4 text-[#F5E6C8] z-10 animate-in fade-in">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-[#C5A059] hover:text-[#FFF1C5] hover:bg-[#18181B]"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              className="w-full h-56 rounded-2xl object-cover border border-[#D4AF37]/20"
            />

            <div>
              <span className="text-xs font-bold text-[#C5A059] uppercase tracking-widest">
                {selectedProduct.brand} · {selectedProduct.volume}
              </span>
              <h3 className="font-cinzel font-bold text-xl gold-gradient-text mt-1">
                {selectedProduct.name}
              </h3>
              <p className="text-xs text-[#E2D4B7]/90 leading-relaxed mt-2">
                {selectedProduct.description}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0B0B0C] border border-[#26242A] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#8E8A80]">Categoria</span>
                <span className="font-bold text-[#FFF1C5] capitalize">{selectedProduct.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E8A80]">Disponibilidade</span>
                <span className={`font-bold ${selectedProduct.stock > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {selectedProduct.stock > 0 ? `Em Estoque (${selectedProduct.stock} un)` : 'Esgotado'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E8A80]">Avaliação Clientes</span>
                <span className="font-bold text-amber-400 font-mono">★ {selectedProduct.rating.toFixed(1)} / 5.0</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-2xl font-bold font-mono gold-gradient-text">
                R$ {selectedProduct.price.toFixed(2)}
              </span>
              <button
                onClick={() => {
                  handleAdd(selectedProduct);
                  setSelectedProduct(null);
                }}
                disabled={selectedProduct.stock <= 0}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#E5C158] to-[#B8860B] text-[#0B0B0C] font-extrabold text-xs shadow-lg flex items-center gap-2 disabled:opacity-50"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Adicionar à Sacola</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
