import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Compass, Car, Clock, ExternalLink, Phone, ShieldCheck } from 'lucide-react';
import { EventSettings } from '../types';

interface LocationSectionProps {
  settings: EventSettings;
}

export const LocationSection: React.FC<LocationSectionProps> = ({ settings }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapError, setMapError] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Official coordinates for Mediateca Zé Dú - Cazenga, Luanda, Angola
  const cazengaCoords = {
    lat: -8.8158,
    lng: 13.2922,
  };

  // Google Maps directions search URL
  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    'Mediateca Zé Dú Cazenga Luanda Angola'
  )}&destination_place_id=ChIJc454eP9uXhARv_Z82B14N08`;

  const apiKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyDLZ7yMN7yBGg7JJ6TyAfFTG9EMr6PO0-8';

  useEffect(() => {
    let isMounted = true;

    // Load Google Maps JavaScript API script
    const loadGoogleMaps = () => {
      if ((window as any).google?.maps) {
        initMap();
        return;
      }

      const existingScript = document.getElementById('google-maps-script');
      if (!existingScript) {
        const script = document.createElement('script');
        script.id = 'google-maps-script';
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          if (isMounted) initMap();
        };
        script.onerror = () => {
          if (isMounted) setMapError(true);
        };
        document.head.appendChild(script);
      } else {
        existingScript.addEventListener('load', () => {
          if (isMounted) initMap();
        });
      }
    };

    const initMap = () => {
      if (!mapContainerRef.current || !(window as any).google?.maps) return;
      try {
        const google = (window as any).google;
        const map = new google.maps.Map(mapContainerRef.current, {
          center: cazengaCoords,
          zoom: 16,
          mapTypeId: 'roadmap',
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          styles: [
            { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
            { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
            { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#d59563' }],
            },
            {
              featureType: 'poi',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#d59563' }],
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{ color: '#38414e' }],
            },
            {
              featureType: 'road',
              elementType: 'geometry.stroke',
              stylers: [{ color: '#212a37' }],
            },
            {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#9ca5b3' }],
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [{ color: '#746855' }],
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{ color: '#17263c' }],
            },
          ],
        });

        // Custom Marker for Mediateca Zé Dú
        const marker = new google.maps.Marker({
          position: cazengaCoords,
          map: map,
          title: 'Mediateca Zé Dú - Cazenga (Café do Empreendedor)',
          animation: google.maps.Animation.DROP,
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="padding: 10px; color: #111; font-family: sans-serif; max-width: 240px;">
              <h4 style="margin: 0 0 4px; font-weight: 800; color: #991b1b; font-size: 14px;">Mediateca Zé Dú - Cazenga</h4>
              <p style="margin: 0 0 8px; font-size: 11px; color: #444;">Local Oficial da 79.ª Edição do Café do Empreendedor</p>
              <a href="${googleMapsDirectionsUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; font-size: 11px; font-weight: bold; color: #b91c1c; text-decoration: underline;">
                Como Chegar no Google Maps &rarr;
              </a>
            </div>
          `,
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });

        setMapLoaded(true);
      } catch (err) {
        console.warn('Google Maps initialization error:', err);
        setMapError(true);
      }
    };

    loadGoogleMaps();

    return () => {
      isMounted = false;
    };
  }, [apiKey]);

  return (
    <section id="localizacao" className="py-20 bg-[#0F081D] text-white relative overflow-hidden border-t border-b border-white/10">
      {/* Decorative ambient gradient */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#DC1037]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#67206D]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20 text-xs font-black uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Localização Oficial do Evento</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-tight">
              MEDIATECA ZÉ DÚ — CAZENGA
            </h2>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-normal">
              O palco de todos os encontros de negócios, conferências, validação de ingressos e mostra de expositores da 79.ª Edição.
            </p>
          </div>

          <a
            href={googleMapsDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="self-start md:self-end px-6 py-3.5 text-xs font-black uppercase tracking-wider text-white rounded-xl bg-gradient-to-r from-[#DC1037] via-[#B20D64] to-[#75116E] hover:from-[#ED3038] hover:to-[#B20D64] shadow-xl shadow-rose-950/60 transition-all hover:scale-105 active:scale-95 flex items-center space-x-2 shrink-0 cursor-pointer border border-rose-400/30 no-underline"
          >
            <Navigation className="w-4 h-4 text-amber-300" />
            <span>COMO CHEGAR NO GOOGLE MAPS</span>
            <ExternalLink className="w-3.5 h-3.5 ml-1" />
          </a>
        </div>

        {/* Content Grid: Map + Practical Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Google Map View (7 columns) */}
          <div className="lg:col-span-7 rounded-3xl overflow-hidden border border-white/15 bg-zinc-950 shadow-2xl relative min-h-[380px] flex flex-col">
            <div ref={mapContainerRef} className="w-full flex-1 min-h-[380px]" />

            {/* Fallback iframe if Web API Key isn't fully enabled or has CSP delay */}
            {mapError && (
              <iframe
                title="Google Maps Mediateca Zé Dú Cazenga"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15769.757077421396!2d13.2842!3d-8.8158!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1a51f33f11d13f9f%3A0x6b14d84f86d63428!2sMediateca%20do%20Cazenga%20-%20Z%C3%A9%20D%C3%BA!5e0!3m2!1spt-PT!2sao!4v1718000000000!5m2!1spt-PT!2sao"
                className="w-full h-full min-h-[380px] border-0"
                loading="lazy"
                allowFullScreen
              />
            )}

            {/* Live Indicator Pill on top-left of map */}
            <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-xs text-white font-bold flex items-center space-x-2 shadow-lg">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <span>Mediateca Zé Dú · Cazenga</span>
            </div>

            {/* Footer bar over map */}
            <div className="p-3 bg-zinc-950/90 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
              <span className="truncate">Coordenadas: -8.8158° S, 13.2922° E (Luanda)</span>
              <a
                href={googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 font-bold hover:underline flex items-center space-x-1 shrink-0"
              >
                <span>Abrir Rota</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Location Cards & Helpful Info (5 columns) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            <div className="p-6 rounded-3xl bg-zinc-900/80 border border-white/10 backdrop-blur-md space-y-4 shadow-xl">
              <div className="flex items-center space-x-3 text-amber-400">
                <div className="p-3 rounded-2xl bg-amber-400/10 border border-amber-400/20">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Endereço Oficial</h3>
                  <p className="text-xs text-zinc-400">Município do Cazenga, Luanda</p>
                </div>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                <strong>Mediateca Zé Dú</strong> — Avenida Principal do Cazenga, Luanda, Angola. Ponto de referência cívico e cultural de fácil acesso rodoviário para todos os participantes de Luanda e províncias vizinhas.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/10 space-y-1.5">
                <div className="flex items-center space-x-2 text-rose-400">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider text-white">Horário</span>
                </div>
                <p className="text-sm font-black text-amber-400 font-mono">08h00 – 16h00</p>
                <p className="text-[11px] text-zinc-400">Credenciamento a partir das 07h30</p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/10 space-y-1.5">
                <div className="flex items-center space-x-2 text-purple-400">
                  <Car className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider text-white">Acesso & Auto</span>
                </div>
                <p className="text-sm font-black text-white font-mono">Estacionamento</p>
                <p className="text-[11px] text-zinc-400">Área vigiada para viaturas</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-zinc-900 to-rose-950/40 border border-purple-500/30 space-y-3">
              <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Portaria & Check-In</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                O controlo de acesso à entrada será feito por leitura de QR Code da sua credencial digital pela câmara da equipa autorizada. Tenha o seu bilhete digital disponível no telemóvel.
              </p>
              <div className="flex items-center justify-between pt-1 text-xs">
                <span className="text-zinc-400">Linha de Apoio à Chegada:</span>
                <span className="font-mono text-amber-300 font-bold">+244 921 152 162</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
