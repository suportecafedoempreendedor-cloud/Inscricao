import React, { useState } from 'react';
import { GalleryItem } from '../types';
import { Image, Filter, Eye, X } from 'lucide-react';

interface GallerySectionProps {
  items: GalleryItem[];
}

export const GallerySection: React.FC<GallerySectionProps> = ({ items }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  const categories = [
    'todos',
    'Palco & Painéis',
    'Networking',
    'Expositores',
    'Pitch Empresarial',
    'Público',
  ];

  const filtered = items.filter(
    (item) => selectedCategory === 'todos' || item.category === selectedCategory
  );

  return (
    <section className="py-20 bg-zinc-950/60 border-t border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-xs font-bold text-[#F59E0B] uppercase tracking-wider">
              Memória Visual & Histórico
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
              Galeria das Edições Anteriores
            </h2>
            <p className="text-sm text-zinc-400 mt-1 max-w-xl">
              Registo de momentos marcantes, palestrantes, feira de expositores e ambiente executivo que consolidaram o Café do Empreendedor em Angola.
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#BE123C] text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800'
                }`}
              >
                {cat === 'todos' ? 'Todas as Categorias' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => setLightboxItem(item)}
              className="group relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 cursor-pointer aspect-4/3 hover:border-zinc-600 transition-all shadow-md"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

              <div className="absolute bottom-0 inset-x-0 p-5 space-y-1">
                <div className="flex items-center space-x-2 text-[11px] font-mono font-bold text-amber-400">
                  <span>{item.edition} ({item.year})</span>
                  <span>·</span>
                  <span className="text-zinc-300 font-sans">{item.category}</span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-zinc-300 line-clamp-1">{item.caption}</p>
              </div>

              <div className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Eye className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {lightboxItem && (
          <div
            onClick={() => setLightboxItem(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md cursor-pointer"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl space-y-4"
            >
              <div className="relative aspect-16/10 w-full bg-black">
                <img
                  src={lightboxItem.imageUrl}
                  alt={lightboxItem.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setLightboxItem(null)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-black/70 text-white hover:bg-black"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-2">
                <div className="flex items-center space-x-2 text-xs font-mono text-amber-400 font-bold">
                  <span>{lightboxItem.edition} ({lightboxItem.year})</span>
                  <span>·</span>
                  <span className="text-zinc-400 font-sans">{lightboxItem.category}</span>
                </div>
                <h3 className="text-xl font-bold text-white">{lightboxItem.title}</h3>
                <p className="text-sm text-zinc-300">{lightboxItem.caption}</p>
                <p className="text-[11px] text-zinc-500 pt-2 border-t border-zinc-800">
                  Fotografia documental de arquivo · Café do Empreendedor Angola / Geração Digital Angola
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
