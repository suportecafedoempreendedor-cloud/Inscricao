import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import {
  Camera,
  CameraOff,
  Zap,
  ZapOff,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Scan,
  Maximize2,
  X,
  Volume2,
} from 'lucide-react';
import { playAudioFeedback, triggerHapticFeedback } from '../utils/audioFeedback';

export interface QrCameraScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onError?: (errMessage: string) => void;
  isProcessing?: boolean;
  buttonLabel?: string;
  className?: string;
  autoStart?: boolean;
  onCloseScanner?: () => void;
}

export const QrCameraScanner: React.FC<QrCameraScannerProps> = ({
  onScanSuccess,
  onError,
  isProcessing = false,
  buttonLabel = 'ABRIR CÂMARA E LER QR CODE',
  className = '',
  autoStart = false,
  onCloseScanner,
}) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [availableCameras, setAvailableCameras] = useState<Array<{ id: string; label: string }>>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>('');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isTorchOn, setIsTorchOn] = useState<boolean>(false);
  const [hasTorchSupport, setHasTorchSupport] = useState<boolean>(false);
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isScanningRef = useRef<boolean>(false);
  const isProcessingRef = useRef<boolean>(isProcessing);

  useEffect(() => {
    isProcessingRef.current = isProcessing;
  }, [isProcessing]);

  // Clean shutdown on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Fetch available cameras when mounted
  useEffect(() => {
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length > 0) {
          setAvailableCameras(devices);
          // Prefer environment/rear camera if label indicates back/environment
          const rear = devices.find(
            (d) =>
              d.label.toLowerCase().includes('back') ||
              d.label.toLowerCase().includes('rear') ||
              d.label.toLowerCase().includes('traseira') ||
              d.label.toLowerCase().includes('environment')
          );
          setSelectedCameraId(rear ? rear.id : devices[0].id);
        }
      })
      .catch(() => {
        // Cameras could not be listed prior to permission
      });
  }, []);

  // Start Camera
  const startCamera = async (cameraId?: string) => {
    setCameraError(null);
    setIsActive(true);

    // Wait for DOM element #qr-camera-viewport to be rendered
    setTimeout(async () => {
      try {
        const container = document.getElementById('qr-camera-viewport');
        if (!container) return;

        // Stop any running scanner instance
        if (scannerRef.current) {
          try {
            await scannerRef.current.stop();
            scannerRef.current.clear();
          } catch {}
          scannerRef.current = null;
        }

        const scanner = new Html5Qrcode('qr-camera-viewport');
        scannerRef.current = scanner;

        // Configure camera target: prefer environment or selected camera ID
        const cameraConfig = cameraId
          ? { deviceId: { exact: cameraId } }
          : selectedCameraId
          ? { deviceId: { exact: selectedCameraId } }
          : { facingMode: 'environment' };

        await scanner.start(
          cameraConfig,
          {
            fps: 15,
            qrbox: (viewfinderWidth, viewfinderHeight) => {
              const minDim = Math.min(viewfinderWidth, viewfinderHeight);
              const edge = Math.max(220, Math.floor(minDim * 0.72));
              return { width: edge, height: edge };
            },
            aspectRatio: 1.0,
          },
          (decodedText) => {
            // Check if already processing or duplicate instant firing
            if (isProcessingRef.current || isScanningRef.current) return;

            isScanningRef.current = true;
            setLastScannedCode(decodedText);

            // Auditory and Haptic Feedback
            playAudioFeedback('success');
            triggerHapticFeedback([100, 50, 100]);

            // Forward to consumer
            onScanSuccess(decodedText);

            // Cooldown before next scan
            setTimeout(() => {
              isScanningRef.current = false;
            }, 1200);
          },
          () => {
            // Frame analysis ongoing; ignore transient frame parse errors
          }
        );

        // Check torch capability
        try {
          const capabilities = (scanner as any).getRunningTrackCapabilities?.();
          if (capabilities && capabilities.torch) {
            setHasTorchSupport(true);
          } else {
            setHasTorchSupport(false);
          }
        } catch {
          setHasTorchSupport(false);
        }

        // Refresh devices list if was empty
        if (availableCameras.length === 0) {
          Html5Qrcode.getCameras()
            .then((devs) => {
              if (devs && devs.length > 0) {
                setAvailableCameras(devs);
              }
            })
            .catch(() => {});
        }
      } catch (err: any) {
        console.error('QR Scanner Start Error:', err);
        setIsActive(false);

        let userMsg = 'Não foi possível aceder à câmara do dispositivo.';
        const errStr = String(err?.message || err);

        if (errStr.includes('NotAllowedError') || errStr.includes('Permission')) {
          userMsg =
            'Permissão de câmara recusada pelo navegador. Autorize o acesso à câmara nas permissões do browser ou valide o código manualmente.';
        } else if (errStr.includes('NotFoundError') || errStr.includes('DevicesNotFoundError')) {
          userMsg =
            'Nenhuma câmara compatível foi encontrada no dispositivo. Utilize a pesquisa manual de ingressos.';
        } else if (errStr.includes('NotReadableError') || errStr.includes('TrackStartError')) {
          userMsg =
            'A câmara já está a ser utilizada por outra aplicação ou janela do navegador. Feche outras aplicações e tente novamente.';
        }

        setCameraError(userMsg);
        if (onError) onError(userMsg);
      }
    }, 180);
  };

  // Stop Camera
  const stopCamera = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (e) {
        console.warn('Error stopping scanner:', e);
      }
      scannerRef.current = null;
    }
    setIsActive(false);
    setIsTorchOn(false);
    isScanningRef.current = false;
    if (onCloseScanner) {
      onCloseScanner();
    }
  };

  // Switch Camera Device
  const handleSwitchCamera = async (newCamId: string) => {
    setSelectedCameraId(newCamId);
    if (isActive) {
      await stopCamera();
      await startCamera(newCamId);
    }
  };

  // Toggle Torch (Lanterna)
  const toggleTorch = async () => {
    if (!scannerRef.current || !hasTorchSupport) return;
    try {
      const nextTorch = !isTorchOn;
      await (scannerRef.current as any).applyVideoConstraints({
        advanced: [{ torch: nextTorch }],
      });
      setIsTorchOn(nextTorch);
    } catch (e) {
      console.warn('Torch toggle not supported on this track:', e);
    }
  };

  // Auto-start if requested
  useEffect(() => {
    if (autoStart && !isActive) {
      startCamera();
    }
  }, [autoStart]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* If Camera is NOT Active -> Show Prominent "ABRIR CÂMARA E LER QR CODE" Button */}
      {!isActive && (
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => startCamera()}
            className="w-full py-4 px-6 bg-gradient-to-r from-[#9F1239] via-[#BE123C] to-[#881337] hover:from-[#BE123C] hover:to-[#9F1239] text-white font-black text-sm sm:text-base rounded-2xl shadow-xl shadow-rose-950/50 flex items-center justify-center space-x-3 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer group border border-rose-500/30"
          >
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Camera className="w-6 h-6 text-amber-300" />
            </div>
            <div className="text-left">
              <span className="block tracking-wide uppercase">{buttonLabel}</span>
              <span className="block text-[11px] font-normal text-rose-200">
                Detecção automática instantânea com câmara traseira de telemóvel ou webcam
              </span>
            </div>
          </button>

          {cameraError && (
            <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-200 text-xs flex items-start space-x-3 animate-fade-in">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-white">Falha ao Abrir Câmara:</p>
                <p className="leading-relaxed">{cameraError}</p>
                <p className="text-[11px] text-zinc-400 pt-1">
                  Dica: Verifique se o navegador tem permissão para aceder à câmara ou utilize o campo abaixo para introduzir o código do ingresso.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* If Camera IS Active -> Render Viewfinder, Controls & Scan Overlay */}
      {isActive && (
        <div className="rounded-2xl bg-zinc-950 border border-zinc-700 p-4 space-y-4 shadow-2xl relative overflow-hidden animate-fade-in">
          {/* Top Camera Controls Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-zinc-800 text-xs">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-bold text-white flex items-center space-x-1.5">
                <Camera className="w-4 h-4 text-emerald-400" />
                <span>Câmara Activa · Validação em Directo</span>
              </span>
            </div>

            <div className="flex items-center space-x-2">
              {/* Torch Toggle if Supported */}
              {hasTorchSupport && (
                <button
                  type="button"
                  onClick={toggleTorch}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer ${
                    isTorchOn
                      ? 'bg-amber-400 text-black border-amber-300 shadow-md'
                      : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:text-white'
                  }`}
                  title="Activar / Desactivar Lanterna"
                >
                  {isTorchOn ? <Zap className="w-3.5 h-3.5 fill-black" /> : <ZapOff className="w-3.5 h-3.5" />}
                  <span>{isTorchOn ? 'Lanterna Ligada' : 'Lanterna'}</span>
                </button>
              )}

              {/* Close Camera Button */}
              <button
                type="button"
                onClick={stopCamera}
                className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white rounded-xl text-xs font-bold flex items-center space-x-1 transition-colors cursor-pointer border border-zinc-700"
              >
                <CameraOff className="w-3.5 h-3.5 text-rose-400" />
                <span>Fechar Câmara</span>
              </button>
            </div>
          </div>

          {/* Camera Selection Dropdown (if multiple cameras exist) */}
          {availableCameras.length > 1 && (
            <div className="flex items-center space-x-2 text-xs">
              <label className="text-zinc-400 font-semibold shrink-0">Seleccionar Câmara:</label>
              <select
                value={selectedCameraId}
                onChange={(e) => handleSwitchCamera(e.target.value)}
                className="bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1 text-white text-xs font-mono focus:outline-none focus:border-[#BE123C] max-w-full truncate"
              >
                {availableCameras.map((cam, idx) => (
                  <option key={cam.id} value={cam.id}>
                    {cam.label || `Câmara ${idx + 1}`}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Video Stream Container with Custom Viewfinder Framing */}
          <div className="relative w-full aspect-square max-h-[380px] sm:max-h-[420px] rounded-2xl overflow-hidden bg-black flex items-center justify-center border-2 border-zinc-700 shadow-inner">
            {/* HTML5-QRCode Viewport Hook */}
            <div
              id="qr-camera-viewport"
              className="w-full h-full object-cover rounded-2xl overflow-hidden"
            />

            {/* Viewfinder Target Overlays (Corners & Target Box) */}
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6">
              <div className="relative w-56 h-56 sm:w-64 sm:h-64 border-2 border-dashed border-emerald-400/40 rounded-2xl flex items-center justify-center shadow-2xl">
                {/* 4 Glowing Corner Brackets */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-400 rounded-tl-xl -mt-1 -ml-1" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-400 rounded-tr-xl -mt-1 -mr-1" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-400 rounded-bl-xl -mb-1 -ml-1" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-400 rounded-br-xl -mb-1 -mr-1" />

                {/* Animated Laser Scanning Line */}
                <div className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#34d399] animate-pulse -translate-y-2" />

                {/* Central Target Icon */}
                <Scan className="w-12 h-12 text-emerald-400/25 animate-ping" />
              </div>
            </div>

            {/* Floating Instructional Banner */}
            <div className="absolute bottom-3 inset-x-3 pointer-events-none">
              <div className="p-2.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 text-center shadow-lg">
                <p className="text-xs font-semibold text-emerald-300">
                  Posicione o QR Code dentro da área de leitura e aguarde a validação.
                </p>
              </div>
            </div>
          </div>

          {/* Processing / Status Indicator */}
          <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
            <span className="flex items-center space-x-1.5 text-zinc-300">
              <Volume2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Sinal sonoro e vibração activos</span>
            </span>

            {isProcessing && (
              <span className="text-amber-400 font-bold flex items-center space-x-1 animate-pulse">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>A consultar servidor...</span>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
