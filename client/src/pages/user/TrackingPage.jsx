import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getTrackingInfo } from '../../services/orderService';
import LiveMapTracker from '../../components/tracking/LiveMapTracker';
import OrderTimeline from '../../components/tracking/OrderTimeline';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Truck, ShieldCheck, MapPin, PhoneCall } from 'lucide-react';
import { formatINR } from '../../utils/currencyFormatter';

const TrackingPage = () => {
  const { orderId } = useParams();
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTracking = async () => {
      try {
        setLoading(true);
        const data = await getTrackingInfo(orderId);
        if (data.success) {
          setTrackingData(data);
        }
      } catch (err) {
        console.error('Error fetching tracking info', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTracking();
  }, [orderId]);

  if (loading) return <LoadingSpinner text="Connecting to GPS live delivery stream..." />;
  if (!trackingData) return <div className="text-center py-20 text-sm text-zinc-500">Tracking information not found.</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="border-b border-gold-200 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-gold-600 uppercase tracking-widest">
            <Truck className="w-4 h-4" /> Live GPS Insured Delivery Tracking
          </div>
          <h1 className="font-serif text-3xl font-bold text-obsidian mt-1">
            Order #{trackingData.orderId}
          </h1>
          <p className="text-xs text-zinc-500">Tracking ID: {trackingData.trackingId}</p>
        </div>

        <div className="bg-ivory border border-gold-300 px-4 py-2 rounded-xl text-xs space-y-0.5 text-right">
          <span className="text-zinc-500 text-[10px] uppercase font-bold block">Estimated Arrival</span>
          <strong className="text-gold-700 font-serif text-sm">
            {new Date(trackingData.estimatedDelivery).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
          </strong>
        </div>
      </div>

      {/* Interactive Map Visualizer */}
      <LiveMapTracker trackingData={trackingData} />

      {/* Status Stepper Timeline */}
      <OrderTimeline orderStatus={trackingData.orderStatus} timeline={trackingData.timeline} />

    </div>
  );
};

export default TrackingPage;
