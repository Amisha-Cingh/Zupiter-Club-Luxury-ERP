import React from 'react';
import { Star } from 'lucide-react';

const membershipTiers = [
  {
    id: 'silver',
    name: 'Silver Membership',
    duration: '1 Year',
    stars: 1,
    color: 'from-slate-400 to-slate-200',
    starColor: 'text-slate-300',
    borderColor: 'border-slate-400/40',
    price: '₹ 25,000',
    benefits: ['1 Year VIP Access', 'Standard Banquet Discounts', 'Basic Concierge Support']
  },
  {
    id: 'gold',
    name: 'Gold Membership',
    duration: '2 Years',
    stars: 2,
    color: 'from-amber-500 to-amber-200',
    starColor: 'text-amber-400',
    borderColor: 'border-amber-500/40',
    price: '₹ 45,000',
    benefits: ['2 Year VIP Access', '10% Dining & Lounge Discount', 'Priority Suite Booking']
  },
  {
    id: 'diamond',
    name: 'Diamond Membership',
    duration: '3 Years',
    stars: 3,
    color: 'from-cyan-400 to-blue-200',
    starColor: 'text-cyan-300',
    borderColor: 'border-cyan-400/40',
    price: '₹ 75,000',
    benefits: ['3 Year Full Access', 'Free Suite Upgrades', 'Complimentary Banquet Usage']
  },
  {
    id: 'platinum',
    name: 'Platinum Membership',
    duration: '5 Years',
    stars: 5,
    color: 'from-zinc-200 to-slate-400',
    starColor: 'text-slate-100',
    borderColor: 'border-slate-200/50',
    price: '₹ 1,20,000',
    benefits: ['5 Year All-Inclusive VIP', 'Personal Helipad Booking', 'Lifetime ERP Concierge']
  }
];

export const MembershipCards = ({ onSelectTier }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
      {membershipTiers.map((tier) => (
        <div
          key={tier.id}
          onClick={() => onSelectTier(tier)}
          className={`relative cursor-pointer group rounded-2xl p-6 bg-gradient-to-b bg-black/60 border ${tier.borderColor} backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/10 flex flex-col justify-between`}
        >
          <div>
            <div className="text-right">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400/80 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                {tier.duration}
              </span>
            </div>

            {/* Dynamic Center Stars */}
            <div className="my-6 flex justify-center items-center gap-1">
              {[...Array(tier.stars)].map((_, i) => (
                <Star
                  key={i}
                  size={tier.stars === 1 ? 48 : 32}
                  className={`${tier.starColor} fill-current drop-shadow-[0_0_12px_rgba(255,255,255,0.4)] animate-pulse`}
                />
              ))}
            </div>

            <h3 className="text-center text-xl font-extrabold text-white tracking-wide uppercase mb-1">
              {tier.name}
            </h3>
            <p className="text-center text-2xl font-black text-amber-400 mb-4">{tier.price}</p>

            <ul className="space-y-2 mb-6">
              {tier.benefits.map((b, idx) => (
                <li key={idx} className="text-xs text-zinc-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <button className="w-full py-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider group-hover:bg-amber-500 group-hover:text-black transition-all">
            Apply For Contract &rarr;
          </button>
        </div>
      ))}
    </div>
  );
};