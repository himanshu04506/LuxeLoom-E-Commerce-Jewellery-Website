import React from 'react';
import { CheckCircle2, Clock, PackageCheck, Truck, Home, ShieldAlert } from 'lucide-react';

const OrderTimeline = ({ orderStatus, timeline = [] }) => {
  const steps = [
    { key: 'PLACED', label: 'Order Placed', icon: Clock },
    { key: 'PAYMENT_CONFIRMED', label: 'Payment Verified', icon: CheckCircle2 },
    { key: 'PROCESSING', label: 'Quality Check & Tagging', icon: PackageCheck },
    { key: 'PACKED', label: 'Tamper-Evident Packing', icon: PackageCheck },
    { key: 'SHIPPED', label: 'Insured Transit', icon: Truck },
    { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: Truck },
    { key: 'DELIVERED', label: 'Delivered', icon: Home },
  ];

  const statusOrder = [
    'PLACED',
    'PAYMENT_CONFIRMED',
    'PROCESSING',
    'PACKED',
    'SHIPPED',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
  ];

  const currentIndex = statusOrder.indexOf(orderStatus);

  if (orderStatus === 'CANCELLED') {
    return (
      <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl text-rose-800 text-xs flex items-center gap-3">
        <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0" />
        <div>
          <h4 className="font-bold text-sm">Order Cancelled</h4>
          <p>This order was cancelled. If payment was deducted, a refund has been initiated.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gold-200 p-6 rounded-2xl shadow-sm space-y-6">
      <h3 className="font-serif font-bold text-base text-obsidian border-b border-gold-100 pb-3">
        Delivery Timeline & Status
      </h3>

      <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        {steps.map((step, idx) => {
          const isCompleted = currentIndex >= idx;
          const isCurrent = currentIndex === idx;
          const StepIcon = step.icon;

          return (
            <div key={step.key} className="flex md:flex-col items-center gap-3 md:text-center flex-1 relative z-10">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                  isCompleted
                    ? 'bg-gold-500 text-white border-gold-500 shadow-md'
                    : 'bg-ivory text-zinc-400 border-zinc-200'
                } ${isCurrent ? 'ring-4 ring-gold-200 scale-110' : ''}`}
              >
                <StepIcon className="w-5 h-5" />
              </div>
              <div>
                <p className={`text-xs font-bold ${isCompleted ? 'text-obsidian' : 'text-zinc-400'}`}>
                  {step.label}
                </p>
                {isCurrent && (
                  <span className="inline-block mt-0.5 text-[10px] font-semibold text-gold-600 bg-gold-50 px-2 py-0.5 rounded-full">
                    Active Step
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* History Log */}
      {timeline.length > 0 && (
        <div className="mt-6 pt-4 border-t border-zinc-100 space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Activity Log</h4>
          <div className="space-y-1.5 text-xs text-zinc-600 max-h-40 overflow-y-auto">
            {timeline.map((event, i) => (
              <div key={i} className="flex justify-between items-center py-1 border-b border-zinc-50">
                <span className="font-medium text-obsidian">{event.comment || event.status}</span>
                <span className="text-[11px] text-zinc-400">
                  {new Date(event.timestamp).toLocaleString('en-IN', {
                    dateStyle: 'short',
                    timeStyle: 'short',
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTimeline;
