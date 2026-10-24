import React, { useEffect, useRef } from 'react';
import { MapPin, Navigation, Truck, ShieldCheck, Compass } from 'lucide-react';

const LiveMapTracker = ({ trackingData }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!trackingData || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear background
    ctx.fillStyle = '#FAF8F5';
    ctx.fillRect(0, 0, width, height);

    // Draw Map Grid Lines
    ctx.strokeStyle = '#E5E0D8';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Coordinates mapping
    const origin = { x: 80, y: height - 80 };
    const destination = { x: width - 80, y: 80 };
    const progress = (trackingData.progressPercentage || 50) / 100;

    // Current driver location along quadratic curve
    const controlPoint = { x: width / 2, y: height / 2 - 60 };
    
    // Draw Curved Delivery Route Path
    ctx.beginPath();
    ctx.moveTo(origin.x, origin.y);
    ctx.quadraticCurveTo(controlPoint.x, controlPoint.y, destination.x, destination.y);
    ctx.strokeStyle = '#C5A059';
    ctx.lineWidth = 4;
    ctx.setLineDash([8, 6]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Calculate current interpolated position
    const t = progress;
    const currentX = (1 - t) * (1 - t) * origin.x + 2 * (1 - t) * t * controlPoint.x + t * t * destination.x;
    const currentY = (1 - t) * (1 - t) * origin.y + 2 * (1 - t) * t * controlPoint.y + t * t * destination.y;

    // Draw Covered Completed Path
    ctx.beginPath();
    ctx.moveTo(origin.x, origin.y);
    ctx.quadraticCurveTo(
      (1 - t) * origin.x + t * controlPoint.x,
      (1 - t) * origin.y + t * controlPoint.y,
      currentX,
      currentY
    );
    ctx.strokeStyle = '#18181B';
    ctx.lineWidth = 5;
    ctx.stroke();

    // Draw Origin Warehouse Pin
    ctx.fillStyle = '#18181B';
    ctx.beginPath();
    ctx.arc(origin.x, origin.y, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 10px sans-serif';
    ctx.fillText('HUB', origin.x - 10, origin.y + 25);

    // Draw Destination Pin
    ctx.fillStyle = '#16A34A';
    ctx.beginPath();
    ctx.arc(destination.x, destination.y, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#18181B';
    ctx.font = 'bold 10px sans-serif';
    ctx.fillText('HOME', destination.x - 14, destination.y + 25);

    // Draw Animated Truck Position Indicator
    ctx.fillStyle = '#D4AF37';
    ctx.beginPath();
    ctx.arc(currentX, currentY, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3;
    ctx.stroke();

  }, [trackingData]);

  if (!trackingData) return null;

  return (
    <div className="bg-white border border-gold-300 rounded-2xl overflow-hidden shadow-lg space-y-4">
      {/* Map Control Header */}
      <div className="bg-obsidian text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Navigation className="w-5 h-5 text-gold-400 animate-spin" style={{ animationDuration: '10s' }} />
          <div>
            <h4 className="font-serif text-sm font-bold text-gold-400">Live GPS Express Transit Map</h4>
            <p className="text-[11px] text-zinc-400">Insured Armored Logistics Vehicle</p>
          </div>
        </div>
        <div className="bg-zinc-800 border border-gold-500/30 px-3 py-1 rounded-full text-xs text-gold-300 font-semibold flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5" /> GPS Live Active
        </div>
      </div>

      {/* Canvas Map Container */}
      <div className="relative p-2 flex justify-center bg-ivory">
        <canvas
          ref={canvasRef}
          width={600}
          height={260}
          className="w-full h-auto max-h-[260px] rounded-xl border border-gold-200 shadow-inner"
        />

        {/* Live Floating Driver Card Overlay */}
        <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md border border-gold-300 p-3 rounded-xl shadow-xl text-xs space-y-1 max-w-xs">
          <div className="flex items-center gap-2 text-obsidian font-bold">
            <Truck className="w-4 h-4 text-gold-600" />
            <span>Courier Dispatch: Armored Express</span>
          </div>
          <p className="text-[11px] text-zinc-600">
            Current Status: <strong className="text-gold-700">{trackingData.orderStatus}</strong>
          </p>
          <p className="text-[10px] text-zinc-400">
            Speed: 45 km/h | Security Lock Verified
          </p>
        </div>
      </div>

      {/* Address Details Bar */}
      <div className="p-4 bg-ivory border-t border-gold-200 text-xs grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <span className="text-[10px] text-zinc-400 uppercase tracking-widest block font-bold">Fulfillment Origin</span>
          <p className="font-semibold text-obsidian">{trackingData.warehouseCoords?.name || 'LuxeLoom Central Hub'}</p>
        </div>
        <div>
          <span className="text-[10px] text-zinc-400 uppercase tracking-widest block font-bold">Delivery Destination</span>
          <p className="font-semibold text-obsidian flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            {trackingData.shippingAddress?.fullName}, {trackingData.shippingAddress?.city} ({trackingData.shippingAddress?.pincode})
          </p>
        </div>
      </div>
    </div>
  );
};

export default LiveMapTracker;
