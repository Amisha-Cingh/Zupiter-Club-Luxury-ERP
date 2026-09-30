import React, { useState, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import html2pdf from 'html2pdf.js';
import axios from 'axios';
import { MockPaymentModal } from './MockPaymentModal';

export const EContractFlow = ({ selectedTier }) => {
  const [step, setStep] = useState(1);
  const sigCanvas = useRef({});
  const contractRef = useRef();

  // All keys mapped cleanly
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    gender: 'Male',
    nationality: 'Indian',
    fatherName: '',
    passportNo: '',
    occupation: '',
    annualIncome: '',
    emergencyContact: '',
    address: '',
    accountHolder: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
  });

  const [isSigned, setIsSigned] = useState(false);
  const [signatureDataUrl, setSignatureDataUrl] = useState('');
  
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  const tierPriceStr = selectedTier?.price?.toString().replace(/[^0-9]/g, '') || '25000';
  const baseAmount = parseInt(tierPriceStr, 10);
  const gst = baseAmount * 0.18;
  const totalAmount = baseAmount + gst;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClearSignature = () => {
    if (sigCanvas.current && sigCanvas.current.clear) {
      sigCanvas.current.clear();
    }
    setIsSigned(false);
    setSignatureDataUrl('');
  };

  const handleSignatureEnd = () => {
    if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
      const dataUrl = sigCanvas.current.getCanvas().toDataURL('image/png');
      setSignatureDataUrl(dataUrl);
      setIsSigned(true);
    }
  };

  const handleDownloadAndSave = async () => {
    // Get signature
    let currentSig = signatureDataUrl;
    if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
      currentSig = sigCanvas.current.getCanvas().toDataURL('image/png');
      setSignatureDataUrl(currentSig);
    }

    // Payload for DB
    const payload = {
      tierName: selectedTier?.name || "Silver Membership",
      tierPrice: selectedTier?.price || "₹ 25,000",
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      dob: formData.dob,
      gender: formData.gender,
      nationality: formData.nationality,
      fatherName: formData.fatherName,
      passportNo: formData.passportNo,
      occupation: formData.occupation,
      annualIncome: formData.annualIncome,
      emergencyContact: formData.emergencyContact,
      address: formData.address,
      accountHolder: formData.accountHolder,
      bankName: formData.bankName,
      accountNumber: formData.accountNumber,
      ifscCode: formData.ifscCode,
      signatureDataUrl: currentSig
    };

    // 1. Save to Database
    try {
      const res = await axios.post("http://localhost:5000/api/contracts", payload);
      console.log("Saved to DB:", res.data);
      alert("Contract Data Successfully Saved to Database!");
    } catch (error) {
      console.error("DB Save Error:", error);
      alert("Database Save Error: " + (error.response?.data?.message || error.message));
      return; // Stop PDF download if DB save fails so you can see errors
    }

    // 2. Generate PDF
    const element = contractRef.current;
    const opt = {
      margin:       0.2,
      filename:     `Zupiter_Club_${selectedTier?.name || 'VIP'}_Contract.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, logging: false },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    try {
      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error("PDF generation error:", err);
    }
  };

  const inputStyle = "w-full px-4 py-3 bg-zinc-900/90 border border-zinc-700/60 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all text-sm";
  const labelStyle = "text-xs font-semibold text-zinc-400 mb-1 block uppercase tracking-wider";

  return (
    <div className="max-w-4xl mx-auto my-6 p-6 bg-zinc-950/90 border border-zinc-800/80 rounded-2xl text-white backdrop-blur-xl shadow-2xl max-h-[85vh] overflow-y-auto custom-scrollbar">
      {/* HEADER */}
      <div className="mb-6 border-b border-zinc-800/80 pb-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-black text-amber-400 uppercase tracking-widest">
            {selectedTier ? `${selectedTier.name} Application` : 'Silver Membership Application'}
          </h2>
          <span className="text-xs font-bold px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full">
            Step {step} of 4
          </span>
        </div>
        <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
          <div className="bg-amber-500 h-full transition-all duration-500" style={{ width: `${(step / 4) * 100}%` }} />
        </div>
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <div className="space-y-5 animate-fadeIn">
          <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider">1. Basic Personal Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelStyle}>Full Legal Name</label>
              <input name="fullName" value={formData.fullName} placeholder="e.g. John Doe" onChange={handleChange} className={inputStyle} />
            </div>
            <div>
              <label className={labelStyle}>Email Address</label>
              <input name="email" value={formData.email} type="email" placeholder="e.g. john@example.com" onChange={handleChange} className={inputStyle} />
            </div>
            <div className="md:col-span-2">
              <label className={labelStyle}>Mobile Number</label>
              <input name="phone" value={formData.phone} placeholder="+91 9876543210" onChange={handleChange} className={inputStyle} />
            </div>
          </div>
          <div className="pt-4 flex justify-end">
            <button onClick={() => setStep(2)} className="px-6 py-3 rounded-xl bg-amber-500 text-black font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition">
              Proceed to Detailed Form &rarr;
            </button>
          </div>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="space-y-5 animate-fadeIn">
          <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider">2. Comprehensive Identification</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelStyle}>Date of Birth</label>
              <input name="dob" value={formData.dob} type="date" onChange={handleChange} className={inputStyle} />
            </div>
            <div>
              <label className={labelStyle}>Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className={inputStyle}>
                <option value="Male" className="bg-zinc-900">Male</option>
                <option value="Female" className="bg-zinc-900">Female</option>
                <option value="Other" className="bg-zinc-900">Other</option>
              </select>
            </div>
            <div>
              <label className={labelStyle}>Nationality</label>
              <input name="nationality" value={formData.nationality} onChange={handleChange} className={inputStyle} />
            </div>
            <div>
              <label className={labelStyle}>Father's / Guardian Name</label>
              <input name="fatherName" value={formData.fatherName} placeholder="Father's Name" onChange={handleChange} className={inputStyle} />
            </div>
            <div>
              <label className={labelStyle}>Passport / Govt ID No.</label>
              <input name="passportNo" value={formData.passportNo} placeholder="ABCD1234E" onChange={handleChange} className={inputStyle} />
            </div>
            <div>
              <label className={labelStyle}>Current Occupation</label>
              <input name="occupation" value={formData.occupation} placeholder="Designation/Business" onChange={handleChange} className={inputStyle} />
            </div>
            <div>
              <label className={labelStyle}>Annual Income Range</label>
              <input name="annualIncome" value={formData.annualIncome} placeholder="e.g. ₹ 25-50 Lakhs" onChange={handleChange} className={inputStyle} />
            </div>
            <div>
              <label className={labelStyle}>Emergency Contact No.</label>
              <input name="emergencyContact" value={formData.emergencyContact} placeholder="+91 Mobile No." onChange={handleChange} className={inputStyle} />
            </div>
          </div>
          <div>
            <label className={labelStyle}>Permanent Residential Address</label>
            <textarea name="address" value={formData.address} rows="2" placeholder="Complete Street Address, City, State, Pincode" onChange={handleChange} className={inputStyle} />
          </div>
          <div className="pt-4 flex justify-between">
            <button onClick={() => setStep(1)} className="px-6 py-3 rounded-xl bg-zinc-800 text-zinc-300 border border-zinc-700 font-bold text-xs uppercase tracking-wider hover:bg-zinc-700 transition">
              &larr; Back
            </button>
            <button onClick={() => setStep(3)} className="px-6 py-3 rounded-xl bg-amber-500 text-black font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition">
              Proceed to Banking & Payment &rarr;
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div className="space-y-5 animate-fadeIn">
          <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider">3. Banking Details & Subscription</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelStyle}>Account Holder Name</label>
              <input name="accountHolder" value={formData.accountHolder} placeholder="Name as per Bank" onChange={handleChange} className={inputStyle} />
            </div>
            <div>
              <label className={labelStyle}>Bank Name</label>
              <input name="bankName" value={formData.bankName} placeholder="HDFC / ICICI / SBI" onChange={handleChange} className={inputStyle} />
            </div>
            <div>
              <label className={labelStyle}>Account Number</label>
              <input name="accountNumber" value={formData.accountNumber} placeholder="1234567890" onChange={handleChange} className={inputStyle} />
            </div>
            <div>
              <label className={labelStyle}>IFSC Code</label>
              <input name="ifscCode" value={formData.ifscCode} placeholder="HDFC0001234" onChange={handleChange} className={inputStyle} />
            </div>
          </div>

          <div className="p-4 bg-black/60 border border-amber-500/30 rounded-xl mt-4 space-y-1">
            <p className="text-xs text-zinc-400">Selected Tier: <b className="text-amber-400">{selectedTier?.name || 'Silver Membership'}</b></p>
            <p className="text-xl font-black text-amber-400">Amount Payable: {selectedTier?.price || '₹ 25,000'}</p>
          </div>

          <div className="pt-4 flex justify-between">
            <button onClick={() => setStep(2)} className="px-6 py-3 rounded-xl bg-zinc-800 text-zinc-300 border border-zinc-700 font-bold text-xs uppercase tracking-wider hover:bg-zinc-700 transition">
              &larr; Back
            </button>
            <button onClick={() => setStep(4)} className="px-6 py-3 rounded-xl bg-amber-500 text-black font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition">
              Confirm & Go to Digital Signature &rarr;
            </button>
          </div>
        </div>
      )}

      {/* STEP 4 */}
      {step === 4 && (
        <div className="space-y-6 animate-fadeIn">
          <div className="space-y-2">
            <label className={labelStyle}>Sign Inside Box Below:</label>
            <div className="border-2 border-amber-500/60 rounded-xl overflow-hidden bg-white">
              <SignatureCanvas
                ref={sigCanvas}
                penColor="black"
                canvasProps={{ width: 500, height: 140, className: 'sigCanvas w-full' }}
                onEnd={handleSignatureEnd}
              />
            </div>
            <button onClick={handleClearSignature} className="text-xs text-rose-400 underline hover:text-rose-300 transition">
              Clear Signature
            </button>
          </div>

          <div className="flex gap-4 pt-2 flex-col">
            <div className="p-4 bg-black/60 border border-amber-500/30 rounded-xl space-y-2 mt-4">
              <h4 className="text-xs font-bold text-amber-300 uppercase">Membership Fee Breakdown</h4>
              <div className="flex justify-between text-zinc-400 text-sm">
                 <span>Base Amount ({selectedTier?.name || 'Silver'})</span>
                 <span>₹ {baseAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-zinc-400 text-sm">
                 <span>GST (18%)</span>
                 <span>₹ {gst.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-amber-400 font-bold text-lg pt-2 border-t border-zinc-800">
                 <span>Total Payable</span>
                 <span>₹ {totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {!isPaid ? (
              <button
                onClick={() => setIsPaymentModalOpen(true)}
                disabled={!isSigned}
                className={`w-full py-3.5 rounded-xl font-bold uppercase text-xs tracking-wider transition shadow-xl ${
                  isSigned ? 'bg-amber-500 text-black hover:bg-amber-400' : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                }`}
              >
                Pay & Generate Pass
              </button>
            ) : (
              <button
                onClick={handleDownloadAndSave}
                className="w-full py-3.5 rounded-xl font-bold uppercase text-xs tracking-wider transition shadow-xl bg-amber-500 text-black hover:bg-amber-400"
              >
               Download Contract & Membership Card
              </button>
            )}
          </div>
        </div>
      )}

      <MockPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSuccess={() => setIsPaid(true)}
        amount={baseAmount}
        itemName={`${selectedTier?.name || 'Silver'} Membership`}
        type="membership"
      />

      {/* OFF-SCREEN CONTRACT TEMPLATE FOR PDF & PREVIEW */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        <div ref={contractRef} style={{ width: '700px', backgroundColor: '#ffffff', color: '#000000', padding: '24px', fontFamily: 'sans-serif' }}>
          
          {/* VIP MEMBER PASS CARD */}
          <div style={{ backgroundColor: '#09090b', color: '#ffffff', borderRadius: '16px', padding: '20px', border: '2px solid #f59e0b', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(245, 158, 11, 0.4)', paddingBottom: '12px', marginBottom: '14px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: '900', color: '#fbbf24', margin: '0', letterSpacing: '1px' }}>ZUPITER CLUB VIP PASS</h2>
                <p style={{ fontSize: '10px', color: '#a1a1aa', margin: '2px 0 0 0', textTransform: 'uppercase', letterSpacing: '1.5px' }}>{selectedTier?.name || 'GOLD MEMBERSHIP'}</p>
              </div>
              <div style={{ backgroundColor: '#f59e0b', color: '#000000', fontSize: '10px', fontWeight: 'bold', padding: '4px 10px', borderRadius: '6px', textTransform: 'uppercase' }}>
                ACTIVE VIP
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '12px' }}>
              <div>
                <p style={{ fontSize: '9px', color: '#a1a1aa', textTransform: 'uppercase', margin: '0 0 2px 0' }}>Member Name</p>
                <p style={{ fontWeight: 'bold', color: '#f4f4f5', margin: '0' }}>{formData.fullName || 'N/A'}</p>
              </div>
              <div>
                <p style={{ fontSize: '9px', color: '#a1a1aa', textTransform: 'uppercase', margin: '0 0 2px 0' }}>Mobile / Contact</p>
                <p style={{ fontWeight: 'bold', color: '#f4f4f5', margin: '0' }}>{formData.phone || 'N/A'}</p>
              </div>
              <div>
                <p style={{ fontSize: '9px', color: '#a1a1aa', textTransform: 'uppercase', margin: '0 0 2px 0' }}>Govt / Passport ID</p>
                <p style={{ fontWeight: 'bold', color: '#f4f4f5', margin: '0' }}>{formData.passportNo || 'N/A'}</p>
              </div>
              <div>
                <p style={{ fontSize: '9px', color: '#a1a1aa', textTransform: 'uppercase', margin: '0 0 2px 0' }}>Issue Date</p>
                <p style={{ fontWeight: 'bold', color: '#f4f4f5', margin: '0' }}>{new Date().toLocaleDateString()}</p>
              </div>
            </div>

            <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #27272a', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <p style={{ fontSize: '9px', color: '#fbbf24', fontWeight: 'bold', textTransform: 'uppercase', margin: '0 0 4px 0' }}>Authorized Member Signature</p>
                <div style={{ backgroundColor: '#ffffff', padding: '4px', borderRadius: '6px', width: '150px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {signatureDataUrl ? (
                    <img src={signatureDataUrl} alt="Member Signature" style={{ maxHeight: '36px', maxWidth: '140px', objectFit: 'contain' }} />
                  ) : (
                    <span style={{ fontSize: '9px', color: '#000000' }}>[ Unsigned ]</span>
                  )}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '8px', color: '#71717a', margin: '0' }}>AUTHENTIC ZUPITER DIGITAL PASS</p>
              </div>
            </div>
          </div>

          {/* CUT SYMBOL */}
          <div style={{ position: 'relative', marginTop: '20px', marginBottom: '20px', textAlign: 'center' }}>
            <div style={{ borderBottom: '2px dashed #a1a1aa', width: '100%', position: 'absolute', top: '50%' }} />
            <span style={{ position: 'relative', backgroundColor: '#ffffff', padding: '0 12px', color: '#52525b', fontSize: '12px', fontWeight: 'bold' }}>
              ✂ ---------------- DETACH CARD HERE ---------------- ✂
            </span>
          </div>

          {/* FORMAL CONTRACT DETAILS */}
          <div style={{ fontSize: '11px', lineHeight: '1.5', color: '#27272a' }}>
            <div style={{ textAlign: 'center', borderBottom: '1px solid #e4e4e7', paddingBottom: '10px', marginBottom: '14px' }}>
              <h1 style={{ fontSize: '18px', fontWeight: 'bold', color: '#09090b', margin: '0' }}>OFFICIAL MEMBERSHIP AGREEMENT & CONTRACT</h1>
              <p style={{ fontSize: '9px', color: '#71717a', textTransform: 'uppercase', margin: '2px 0 0 0' }}>Zupiter ERP Luxury Hospitality & Club Network</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px', backgroundColor: '#f4f4f5', padding: '12px', borderRadius: '8px', border: '1px solid #e4e4e7', marginBottom: '14px' }}>
              <p style={{ margin: 0 }}><b>Full Name:</b> {formData.fullName || 'N/A'}</p>
              <p style={{ margin: 0 }}><b>Email:</b> {formData.email || 'N/A'}</p>
              <p style={{ margin: 0 }}><b>Phone:</b> {formData.phone || 'N/A'}</p>
              <p style={{ margin: 0 }}><b>Date of Birth:</b> {formData.dob || 'N/A'}</p>
              <p style={{ margin: 0 }}><b>Gender:</b> {formData.gender || 'N/A'}</p>
              <p style={{ margin: 0 }}><b>Nationality:</b> {formData.nationality || 'Indian'}</p>
              <p style={{ margin: 0 }}><b>Father/Guardian:</b> {formData.fatherName || 'N/A'}</p>
              <p style={{ margin: 0 }}><b>Govt ID / Passport:</b> {formData.passportNo || 'N/A'}</p>
              <p style={{ margin: 0 }}><b>Occupation:</b> {formData.occupation || 'N/A'}</p>
              <p style={{ margin: 0 }}><b>Annual Income:</b> {formData.annualIncome || 'N/A'}</p>
              <p style={{ margin: 0 }}><b>Bank Name:</b> {formData.bankName || 'N/A'}</p>
              <p style={{ margin: 0 }}><b>Account Number:</b> {formData.accountNumber || 'N/A'}</p>
              <p style={{ gridColumn: 'span 2', margin: 0 }}><b>Residential Address:</b> {formData.address || 'N/A'}</p>
            </div>

            <div style={{ fontSize: '10px', color: '#52525b', marginBottom: '20px' }}>
              <h4 style={{ fontWeight: 'bold', color: '#09090b', fontSize: '11px', margin: '0 0 4px 0' }}>Contract Terms & Membership Conditions:</h4>
              <p style={{ margin: '2px 0' }}>1. The Member agrees to abide by all bylaws and operational rules set by Zupiter Club Management.</p>
              <p style={{ margin: '2px 0' }}>2. Subscription fees for tier <b>{selectedTier?.name || 'Gold Membership'}</b> ({selectedTier?.price || '₹ 25,000'}) are non-refundable once activated.</p>
              <p style={{ margin: '2px 0' }}>3. This contract is non-transferable without written consent from the Board of Directors.</p>
            </div>

            <div style={{ paddingTop: '16px', borderTop: '1px solid #d4d4d8', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '10px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ height: '40px', width: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #a1a1aa', marginBottom: '4px' }}>
                  {signatureDataUrl ? (
                    <img src={signatureDataUrl} alt="Sign" style={{ maxHeight: '36px', maxWidth: '140px', objectFit: 'contain' }} />
                  ) : null}
                </div>
                <p style={{ fontWeight: 'bold', color: '#09090b', margin: '0' }}>Member Digital Signature</p>
                <p style={{ color: '#71717a', margin: '0' }}>{formData.fullName || 'Member'}</p>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#b45309', fontStyle: 'italic', borderBottom: '1px solid #a1a1aa', marginBottom: '4px', padding: '0 16px' }}>
                  [ ZUPITER OFFICIAL SEAL ]
                </div>
                <p style={{ fontWeight: 'bold', color: '#09090b', margin: '0' }}>Authorized Signatory</p>
                <p style={{ color: '#71717a', margin: '0' }}>Zupiter Executive Management</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};