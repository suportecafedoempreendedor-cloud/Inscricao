import React from 'react';
import { Sponsor } from '../types';
import { Award, Sparkles, ExternalLink, Handshake, CheckCircle } from 'lucide-react';

interface SponsorsSectionProps {
  sponsors: Sponsor[];
  onOpenSponsorModal: () => void;
}

export const SponsorsSection: React.FC<SponsorsSectionProps> = ({
  sponsors,
  onOpenSponsorModal,
}) => {
  const getTierLabel = (tier: Sponsor['tier']) => {
    switch (tier) {
      case 'PATROCINADOR_OFICIAL':
        return 'Patrocinador Oficial';
      case 'PATROCINADOR_OURO':
        return 'Patrocinador Ouro';
      case 'PARCEIRO_ESTRATEGICO':
        return 'Parceiro Estratégico';
      case 'MEDIA_PARTNER':
        return 'Media Partner';
      case 'APOIO_INSTITUCIONAL':
        return 'Apoio Institucional';
      default:
        return 'Parceiro';
    }
  };

  const getTierColor = (tier: Sponsor['tier']) => {
    switch (tier) {
      case 'PATROCINADOR_OFICIAL':
        return 'text-[#BE123C] border-[#BE123C]/50 bg-rose-950/20';
      case 'PATROCINADOR_OURO':
        return 'text-amber-400 border-amber-500/50 bg-amber-950/20';
      case 'PARCEIRO_ESTRATEGICO':
        return 'text-purple-300 border-purple-500/50 bg-purple-950/20';
      default:
        return 'text-zinc-300 border-zinc-700 bg-zinc-900';
    }
  };

  return (
    <section id="patrocinadores" className="py-20 bg-zinc-950/80 border-t border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-xs font-bold text-[#F59E0B] uppercase tracking-wider">
              Marcas & Alianças Institucionais
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
              Patrocinadores e Parceiros
            </h2>
            <p className="text-sm text-zinc-400 mt-1 max-w-xl">
              Instituições e empresas que apoiam activamente a consolidação do ecossistema empreendedor em Angola.
            </p>
          </div>

          <button
            onClick={onOpenSponsorModal}
            className="self-start md:self-end px-5 py-3 text-xs font-bold text-white rounded-xl bg-gradient-to-r from-purple-800 to-[#BE123C] hover:opacity-95 shadow-lg shadow-purple-950/40 transition-all flex items-center space-x-2"
          >
            <Handshake className="w-4 h-4 text-amber-300" />
            <span>Tornar-se Patrocinador</span>
          </button>
        </div>

        {/* Sponsor Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sponsors.map((sp) => (
            <div
              key={sp.id}
              className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between space-y-4 hover:shadow-xl group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-1 rounded text-[11px] font-bold border ${getTierColor(sp.tier)}`}>
                    {getTierLabel(sp.tier)}
                  </span>
                  {sp.website && (
                    <a
                      href={sp.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-500 hover:text-white p-1"
                      title="Website Oficial"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-bold flex items-center justify-center text-lg group-hover:border-amber-500/50 transition-colors">
                  {sp.name.charAt(0)}
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                  {sp.name}
                </h3>

                <p className="text-xs text-zinc-400 leading-relaxed">{sp.description}</p>

                <div className="pt-2">
                  <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Benefícios & Presença:</p>
                  <p className="text-xs text-zinc-300 mt-1">{sp.benefitsSummary}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sponsorship proposal callout banner */}
        <div className="p-8 rounded-2xl bg-gradient-to-r from-purple-950/50 via-zinc-900 to-rose-950/50 border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-lg font-bold text-white">Posicione a sua marca perante mais de 500 empresários em Luanda.</h4>
            <p className="text-xs text-zinc-300">
              Pacotes customizados de patrocínio com ativação de marca, menção nos palcos, stands de destaque e convites VIP exclusivos.
            </p>
          </div>

          <button
            onClick={onOpenSponsorModal}
            className="px-6 py-3 text-xs font-bold text-white bg-[#BE123C] hover:bg-rose-600 rounded-xl transition-colors shrink-0"
          >
            Solicitar Proposta Comercial
          </button>
        </div>
      </div>
    </section>
  );
};
