import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

export const RefundModal = ({ isOpen, onClose, onConfirm, booking }) => {
  if (!isOpen || !booking) return null;

  const baseAmount = Number(booking.amount || booking.price || 0);
  const cancellationFee = baseAmount * 0.20;
  const refundAmount = baseAmount - cancellationFee;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md p-6 bg-zinc-950 border border-amber-500/30 rounded-2xl shadow-2xl relative animate-fadeIn">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-zinc-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6">
          <div className="text-center space-y-2 border-b border-zinc-800 pb-4">
            <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto" />
            <h2 className="text-xl font-black text-rose-400 uppercase tracking-widest">
              Cancel Reservation
            </h2>
            <p className="text-xs text-zinc-400">Please review the cancellation policy</p>
          </div>

          <div className="space-y-3 text-sm text-zinc-300">
            <div className="flex justify-between">
              <span className="text-zinc-500">Facility:</span>
              <span className="font-semibold">{booking.facility || booking.facilityName || 'N/A'}</span>
            </div>
            
            <div className="border-t border-zinc-800 my-3 pt-3 space-y-2">
              <div className="flex justify-between">
                <span className="text-zinc-500">Total Amount Paid:</span>
                <span>₹{baseAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-rose-400">
                <span className="text-rose-500/70">Cancellation Fee (20%):</span>
                <span>- ₹{cancellationFee.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-emerald-400 pt-2 border-t border-zinc-800 mt-2">
                <span>Refund Amount (80%):</span>
                <span>₹{refundAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-zinc-900 border border-zinc-700 text-zinc-300 font-bold rounded-xl hover:bg-zinc-800 transition text-xs uppercase"
            >
              Keep Booking
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-3 bg-rose-500/20 border border-rose-500/40 text-rose-400 font-bold rounded-xl hover:bg-rose-500/30 transition text-xs uppercase"
            >
              Confirm Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
