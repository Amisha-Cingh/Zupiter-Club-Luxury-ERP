import React, { useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';

export const MockPaymentModal = ({ isOpen, onClose, onSuccess, amount, itemName, date, guests, type = 'facility' }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('UPI / QR');

  if (!isOpen) return null;

  const baseAmount = Number(amount) || 0;
  const gst = baseAmount * 0.18;
  const total = baseAmount + gst;

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        onSuccess();
      }, 1500);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md p-6 bg-zinc-950 border border-amber-500/30 rounded-2xl shadow-2xl relative">
        <button 
          onClick={!isProcessing && !isSuccess ? onClose : undefined} 
          className="absolute top-4 right-4 text-zinc-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-8 space-y-4 animate-fadeIn">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto" />
            <h2 className="text-xl font-black text-white">Payment Successful!</h2>
            <p className="text-xs text-zinc-400">Processing your {type === 'facility' ? 'reservation' : 'membership'}...</p>
          </div>
        ) : isProcessing ? (
          <div className="text-center py-10 space-y-5">
            <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <h2 className="text-lg font-bold text-amber-400">Processing Payment...</h2>
            <p className="text-xs text-zinc-400">Please do not close this window</p>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-xl font-black text-amber-400 uppercase tracking-widest text-center border-b border-zinc-800 pb-4">
              Secure Checkout
            </h2>

            <div className="space-y-2 text-sm text-zinc-300">
              <div className="flex justify-between">
                <span className="text-zinc-500">Item:</span>
                <span className="font-semibold">{itemName}</span>
              </div>
              {date && (
                <div className="flex justify-between">
                  <span className="text-zinc-500">Date:</span>
                  <span className="font-semibold">{date}</span>
                </div>
              )}
              {guests && (
                <div className="flex justify-between">
                  <span className="text-zinc-500">Guests:</span>
                  <span className="font-semibold">{guests}</span>
                </div>
              )}
              
              <div className="border-t border-zinc-800 my-3 pt-3 space-y-1">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Base Amount:</span>
                  <span>₹{baseAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">GST (18%):</span>
                  <span>₹{gst.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-amber-400 pt-2 border-t border-zinc-800 mt-2">
                  <span>Total Payable:</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-bold text-zinc-500 uppercase">Payment Method</p>
              <div className="grid grid-cols-3 gap-2">
                {['UPI / QR', 'Credit/Debit Card', 'Net Banking'].map(method => (
                  <button
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`py-2 px-1 text-[10px] font-bold rounded-lg border transition ${
                      paymentMethod === method 
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-500'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handlePay}
              className="w-full py-3.5 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-600 text-black font-extrabold rounded-xl shadow-lg transition hover:brightness-110 text-xs tracking-wider uppercase"
            >
              Pay Now (₹{total.toLocaleString('en-IN')})
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
