import toast from "react-hot-toast";
import React, { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SignatureCanvas from "react-signature-canvas";
import { jsPDF } from "jspdf";
import { Trash2 } from "lucide-react";
import { MembershipCards } from "../components/MembershipCards";
import { EContractFlow } from "../components/EContractFlow";
import { MockPaymentModal } from "../components/MockPaymentModal";
import { RefundModal } from "../components/RefundModal";

import {
  Crown,
  LogOut,
  Users,
  Hotel,
  BookmarkCheck,
  Award,
  ArrowUpRight,
  CheckCircle2,
  PlusCircle,
  QrCode,
  FileText,
  Download,
  Eraser,
  Sparkle,
  Utensils,
} from "lucide-react";

const Dashboard = () => {
  const [guestName, setGuestName] = useState("");

  // 1. Context se user access karein
  const { user, logout } = useContext(AuthContext) || {};

  // 2. LocalStorage fallback logic
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const currentUser = user && Object.keys(user).length > 0 ? user : storedUser;

  const [selectedTier, setSelectedTier] = useState(null);

  // Card click hone par contract page par redirect karne ke liye:
  const handleSelectTier = (tier) => {
    setSelectedTier(tier);
    setActiveTab("contract"); // "E-Contract & Signature" tab par switch karega
  };

  // Admin check fallback ke saath
  const isAdmin =
    user?.role === "admin" ||
    user?.user?.role === "admin" ||
    currentUser?.role === "admin";

  const [facilitiesList, setFacilitiesList] = useState([
    {
      name: "Presidential Suite",
      category: "Stay",
      price: 25000,
      img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Grand Banquet Hall",
      category: "Event",
      price: 150000,
      img: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "VIP Lounge & Bar",
      category: "Dining",
      price: 12000,
      img: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Championship Golf Club",
      category: "Sports",
      price: 35000,
      img: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "VIP Helipad Access",
      price: 50000,
      category: "Event",
      img: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Royal Banquet Hall",
      price: 75000,
      category: "Event",
      img: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=300&q=80",
    },
  ]);
  const [selectedFacility, setSelectedFacility] = useState(facilitiesList[0]);

  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("overview");

  // Duplicate selectedFacility & facilitiesList ko hata kar baaki states rakhein:
  const [newFacilityCategory, setNewFacilityCategory] = useState("Stay");
  const [bookingDate, setBookingDate] = useState("");
  const [guestsCount, setGuestsCount] = useState(2);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState("");
  const [userBookings, setUserBookings] = useState([]);

  const [newFacilityName, setNewFacilityName] = useState("");
  const [newFacilityPrice, setNewFacilityPrice] = useState("");

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);

  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [refundBooking, setRefundBooking] = useState(null);
 
  // Signature Canvas Reference
  const sigCanvas = useRef({});

  const [adminStats, setAdminStats] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    recentBookings: [],
  });

  const fetchAdminStats = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/admin/stats");
    
    // Agar API direct stats object de rahi ho (e.g. { totalRevenue, totalBookings, recentBookings })
    if (res.data) {
      const bookingsArray = Array.isArray(res.data) 
        ? res.data 
        : (res.data.recentBookings || []);

      const calculatedRevenue = res.data.totalRevenue ?? bookingsArray.reduce(
        (sum, item) => sum + (Number(item?.amount) || Number(item?.price) || 0),
        0
      );

      setAdminStats({
        totalRevenue: calculatedRevenue,
        totalBookings: res.data.totalBookings ?? bookingsArray.length,
        recentBookings: bookingsArray
      });
    }
  } catch (err) {
    console.error("Failed to load Admin Panel stats:", err);
  }
};

useEffect(() => {
  fetchAdminStats();
}, [activeTab]);

  // Handle tab switch to admin
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "admin") {
      
    }
  };
  // Default 4 initial facilities ka backup list
  const defaultFacilities = [
    {
      _id: "default-1",
      name: "Presidential Suite",
      price: 25000,
      category: "Stay",
      img: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=300&q=80",
    },
    {
      _id: "default-2",
      name: "Grand Banquet Hall",
      price: 150000,
      category: "Event",
      img: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=300&q=80",
    },
    {
      _id: "default-3",
      name: "VIP Lounge & Bar",
      price: 12000,
      category: "Dining",
      img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=300&q=80",
    },
    {
      _id: "default-4",
      name: "Championship Golf Club",
      price: 35000,
      category: "Sports",
      img: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=300&q=80",
    },
  ];

  // 1. Facilities Fetch Karein
  // Facilities Fetch Karein
  const fetchFacilities = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/facilities");
      let apiData = [];

      if (Array.isArray(res.data)) {
        apiData = res.data;
      } else if (res.data?.facilities) {
        apiData = res.data.facilities;
      }

      const combined = [...defaultFacilities];

      apiData.forEach((item) => {
        if (
          !combined.some(
            (d) => d.name.toLowerCase() === item.name.toLowerCase(),
          )
        ) {
          combined.push(item);
        }
      });

      // Sirf setFacilitiesList use karein
      setFacilitiesList(combined);
    } catch (err) {
      console.error("Fetch Facilities Error:", err);
      setFacilitiesList(defaultFacilities);
    }
  };

  // 2. Nayi Facility Add Karein
  const handleAddFacility = async (e) => {
    e.preventDefault();

    if (!newFacilityName || !newFacilityPrice) {
      return toast.error("Please fill all fields!");
    }

    try {
      await axios.post("http://localhost:5000/api/facilities/add", {
        name: newFacilityName,
        price: Number(newFacilityPrice),
        category: newFacilityCategory || "Stay",
        img: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=300&q=80",
      });

      toast.success("Facility Added Successfully!");

      setNewFacilityName("");
      setNewFacilityPrice("");

      await fetchFacilities();
      if (typeof fetchAdminStats === "function") {
        await fetchAdminStats();
      }
    } catch (err) {
      console.error("Add Facility Error:", err);
      toast.error("Error adding facility");
    }
  };

  const handleDeleteFacility = async (id) => {
    if (!id) return toast.error("Invalid Facility ID");

    try {
      const res = await axios.delete(
        `http://localhost:5000/api/facilities/delete/${id}`,
      );
      if (res.status === 200 || res.data.success) {
        toast.success("Facility Deleted Successfully!");
        fetchFacilities();
      }
    } catch (err) {
      console.error("Delete Error:", err);
      toast.error(err.response?.data?.message || "Error deleting facility");
    }
  };

  // 4. Bookings Load Karein
  // 1. Fetch User Bookings from Database
  const fetchUserBookings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/bookings/my-bookings");
      let data = res.data;

      if (Array.isArray(data)) {
        setUserBookings(data);
      } else if (data && Array.isArray(data.bookings)) {
        setUserBookings(data.bookings);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  // 2. Load Data on Initial Page Render & Auto-populate guestName
  useEffect(() => {
    fetchFacilities();
    fetchUserBookings();
  }, []);

  useEffect(() => {
    if (!guestName && (currentUser?.username || currentUser?.name || currentUser?.user?.name)) {
      setGuestName(currentUser?.username || currentUser?.name || currentUser?.user?.name || "");
    }
  }, [currentUser]);

  useEffect(() => {
    if (activeTab === "reservations") {
      fetchUserBookings();
    }
  }, [activeTab]);

  // 3. Create Booking
  const handleCreateBooking = async (e) => {
    e.preventDefault();
    if (!guestName.trim()) return toast.error("Please enter Guest Name.");
    if (!bookingDate) return toast.error("Please select a reservation date.");

    const selectedObj = typeof selectedFacility === "object" ? selectedFacility : null;
    const facilityName = selectedObj?.name || (typeof selectedFacility === "string" ? selectedFacility : "Presidential Suite");
    const basePrice = selectedObj?.price || 25000;
    const totalAmount = Number(basePrice) * (Number(guestsCount) || 1);

    setPaymentDetails({
      itemName: facilityName,
      date: bookingDate,
      guests: guestsCount,
      amount: totalAmount
    });
    setIsPaymentModalOpen(true);
  };

  const executeBooking = async () => {
    setBookingLoading(true);
    try {
      const { itemName: facilityName, date, guests, amount: totalAmount } = paymentDetails;

      const payload = {
        username: guestName.trim(),
        facility: facilityName,
        date: date,
        guests: Number(guests) || 1,
        amount: totalAmount,
      };

      const res = await axios.post("http://localhost:5000/api/bookings/book", payload);

      const createdBooking = res.data?.booking || {
        _id: Date.now().toString(),
        ...payload,
        status: "Confirmed & Paid",
      };
      
      if(createdBooking) createdBooking.status = "Confirmed & Paid";

      setUserBookings((prev) => [createdBooking, ...(prev || []).filter((b) => (b?._id || b?.id) !== createdBooking._id)]);
      
      setAdminStats(prev => ({
          ...prev,
          totalRevenue: prev.totalRevenue + totalAmount,
          totalBookings: prev.totalBookings + 1
      }));

      toast.success(`Booking confirmed for ${payload.facility}!`);
      setBookingSuccess(`Booking confirmed for ${payload.facility}!`);
      setTimeout(() => setBookingSuccess(""), 4000);

      setBookingDate("");
      setPaymentDetails(null);

      setTimeout(() => {
        setActiveTab("reservations");
      }, 500);
    } catch (err) {
      console.error("Booking Error:", err);
      toast.error("Booking failed. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  // 4. Cancel Booking
  const handleCancelBooking = (bookingId) => {
    const booking = (userBookings || []).find(b => (b?._id || b?.id) === bookingId);
    if (!booking) return toast.error("Invalid Booking ID");
    setRefundBooking(booking);
    setIsRefundModalOpen(true);
  };

  const processRefund = async () => {
    if (!refundBooking) return;
    const bookingId = refundBooking._id || refundBooking.id;
    setIsRefundModalOpen(false);
    
    try {
      if (bookingId && !String(bookingId).startsWith("default-")) {
        await axios.put(`http://localhost:5000/api/bookings/cancel/${bookingId}`, {
          status: "Cancelled (Refunded 80%)"
        });
      }
      
      toast.success("Refund processed successfully!");
      
      const refundAmt = (Number(refundBooking.amount || refundBooking.price) || 0) * 0.8;
      
      setUserBookings((prev) => (prev || []).map((b) => 
        (b?._id || b?.id) === bookingId ? { ...b, status: "Cancelled (Refunded 80%)", refundAmount: refundAmt } : b
      ));
      
      setAdminStats(prev => ({
          ...prev,
          totalRevenue: Math.max(0, (prev?.totalRevenue || 0) - refundAmt)
      }));
      setRefundBooking(null);
    } catch (err) {
      console.error("Cancel Error:", err);
      // Fallback update for local state
      const refundAmt = (Number(refundBooking.amount || refundBooking.price) || 0) * 0.8;
      setUserBookings((prev) => (prev || []).map((b) => 
        (b?._id || b?.id) === bookingId ? { ...b, status: "Cancelled (Refunded 80%)", refundAmount: refundAmt } : b
      ));
      toast.success("Refund processed!");
      setRefundBooking(null);
    }
  };

  // 7. VIP Pass Printable
  const handleDownloadMemberPass = () => {
    const memberName =
      user?.username || user?.fullName || user?.name || "Guest Member";
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>VIP Pass - ${memberName}</title>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 90vh; background: #0f172a; margin: 0; }
            .card { width: 380px; background: linear-gradient(135deg, #000000 0%, #1e1b4b 50%, #451a03 100%); border: 2px solid #d97706; border-radius: 20px; padding: 24px; color: #fff; box-shadow: 0 10px 30px rgba(217, 119, 6, 0.3); font-family: sans-serif; }
            .header { text-align: center; border-bottom: 1px solid rgba(217, 119, 6, 0.3); padding-bottom: 12px; margin-bottom: 20px; }
            .brand { font-size: 22px; font-weight: 800; color: #fbbf24; letter-spacing: 2px; }
            .sub { font-size: 10px; color: #94a3b8; text-transform: uppercase; tracking: 1px; }
            .info-group { margin-bottom: 14px; }
            .label { font-size: 9px; color: #94a3b8; text-transform: uppercase; font-weight: bold; }
            .val { font-size: 16px; font-weight: 700; color: #f8fafc; }
            .badge { display: inline-block; padding: 4px 12px; background: #d97706; color: #000; font-weight: 800; font-size: 10px; border-radius: 20px; text-transform: uppercase; }
            .footer { margin-top: 24px; font-size: 9px; color: #64748b; text-align: center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 10px; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <div class="brand">ZUPITER CLUB</div>
              <div class="sub">Executive Membership Pass</div>
            </div>
            <div class="info-group">
              <div class="label">Member Name</div>
              <div class="val">${memberName}</div>
            </div>
            <div class="info-group">
              <div class="label">Access Level</div>
              <div class="badge">Platinum VIP</div>
            </div>
            <div class="info-group">
              <div class="label">Pass ID</div>
              <div class="val">ZUP-${Math.floor(100000 + Math.random() * 900000)}</div>
            </div>
            <div class="footer">
              Valid for all Zupiter Club private lounges, presidential suites, and amenities.
            </div>
          </div>
          <script>window.onload = function() { window.print(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // 2. E-Contract Handler (English Toast Alerts)
  const handleDownloadContract = async () => {
    if (sigCanvas.current.isEmpty()) {
      return toast.error("Please provide your signature first.");
    }

    try {
      const memberName = user?.name || "Valued Member";
      const canvas = sigCanvas.current.getCanvas();
      const signatureImg = canvas.toDataURL("image/png");

      await axios.post("http://localhost:5000/api/contract/save-contract", {
        username: memberName,
        signatureDataUrl: signatureImg,
      });

      toast.success("VIP Contract saved to database successfully!");

      const printWindow = window.open("", "_blank");
      printWindow.document.write(`
      <html>
        <head>
          <title>Zupiter Club VIP Contract - ${memberName}</title>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #111; line-height: 1.6; }
            .header { text-align: center; border-bottom: 2px solid #d97706; padding-bottom: 15px; margin-bottom: 30px; }
            .title { font-size: 24px; font-weight: bold; color: #d97706; letter-spacing: 1px; }
            .subtitle { font-size: 12px; color: #666; text-transform: uppercase; margin-top: 5px; }
            .content { margin-bottom: 30px; font-size: 14px; }
            .field { margin-bottom: 10px; }
            .signature-box { margin-top: 40px; padding: 15px; border: 1px dashed #d97706; display: inline-block; border-radius: 8px; }
            .sig-img { width: 220px; display: block; margin-top: 10px; }
            .footer { margin-top: 60px; text-align: center; font-size: 10px; color: #888; border-top: 1px solid #eee; padding-top: 15px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">ZUPITER CLUB VIP CONTRACT</div>
            <div class="subtitle">Official Hospitality Membership Agreement</div>
          </div>
          <div class="content">
            <div class="field"><strong>Member Name:</strong> ${memberName}</div>
            <div class="field"><strong>Issue Date:</strong> ${new Date().toLocaleDateString()}</div>
            <div class="field"><strong>Membership Status:</strong> Platinum VIP Member</div>
            <br/>
            <p>This official contract confirms that the member is granted full access to all Zupiter Club exclusive amenities, including Presidential Suites, VIP Lounge, Banquet Halls, and Championship Golf Club. The member agrees to maintain club standards and compliance protocols.</p>
          </div>
          <div class="signature-box">
            <strong>Digital Member Signature:</strong>
            <img src="${signatureImg}" class="sig-img" />
          </div>
          <div class="footer">
            Generated automatically by Zupiter Club ERP Enterprise System.
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
      printWindow.document.close();
    } catch (err) {
      console.error("Contract Processing Error:", err);
      toast.error("Failed to save or download contract.");
    }
  };

  const clearSignature = () => {
    sigCanvas.current.clear();
  };

  // FACILITY BOOKING RECEIPT PDF GENERATION
  const handleDownloadReceipt = (booking) => {
    if (!booking) return toast.error("No booking selected.");
    try {
      const reservedName = booking.username || currentUser?.username || currentUser?.name || "Valued Member";
      const facilityName = booking.facility || booking.facilityName || "Facility";
      const bookingDateVal = booking.date || "N/A";
      const guestCountVal = booking.guests || 1;
      const statusVal = booking.status || "Confirmed";
      
      const rawAmount = Number(booking.amount || booking.price) || 0;
      const amountVal = rawAmount.toLocaleString("en-IN");
      
      const isCancelled = statusVal.toLowerCase().includes("cancel");
      const subHeader = isCancelled 
        ? `<span style="color: #ef4444; font-weight: bold;">FACILITY BOOKING PASS CANCELLED</span>` 
        : `Facility Booking Confirmation Pass`;
        
      const refundAmount = rawAmount * 0.8;
      const refundRow = isCancelled 
        ? `<div class="row"><span>Total Refunded Amount (80%):</span> <strong style="color: #10b981;">₹ ${refundAmount.toLocaleString("en-IN")}</strong></div>` 
        : '';
        
      const statusColor = isCancelled ? "#ef4444" : "#10b981";

      const printWindow = window.open("", "_blank");
      printWindow.document.write(`
      <html>
        <head>
          <title>Zupiter Club Receipt - ${facilityName}</title>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #111; line-height: 1.6; }
            .header { text-align: center; border-bottom: 2px solid #d97706; padding-bottom: 15px; margin-bottom: 30px; }
            .title { font-size: 22px; font-weight: bold; color: #d97706; letter-spacing: 1px; }
            .subtitle { font-size: 11px; color: #666; text-transform: uppercase; margin-top: 5px; }
            .receipt-box { border: 1px solid #e5e7eb; border-radius: 12px; padding: 25px; margin-bottom: 30px; background: #fafafa; }
            .row { display: flex; justify-content: space-between; border-bottom: 1px solid #eee; padding: 10px 0; font-size: 14px; }
            .row:last-child { border-bottom: none; font-weight: bold; font-size: 16px; color: #d97706; }
            .footer { text-align: center; font-size: 10px; color: #888; border-top: 1px solid #eee; padding-top: 15px; margin-top: 40px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">ZUPITER CLUB OFFICIAL RECEIPT</div>
            <div class="subtitle">${subHeader}</div>
          </div>

          <div class="receipt-box">
            <div class="row"><span>Reserved By:</span> <strong>${reservedName}</strong></div>
            <div class="row"><span>Facility Booked:</span> <strong>${facilityName}</strong></div>
            <div class="row"><span>Reservation Date:</span> <strong>${bookingDateVal}</strong></div>
            <div class="row"><span>Total Guests:</span> <strong>${guestCountVal} Guests</strong></div>
            <div class="row"><span>Booking Status:</span> <strong style="color: ${statusColor};">${statusVal}</strong></div>
            <div class="row"><span>Total Amount Paid:</span> <strong>₹ ${amountVal}</strong></div>
            ${refundRow}
          </div>

          <div class="footer">
            Thank you for choosing Zupiter Club. Present this receipt at entry.
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
      printWindow.document.close();
    } catch (err) {
      toast.error("Receipt generate karne me dikkat aayi.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen h-auto w-full bg-[#030712] text-slate-100 flex flex-col font-sans relative overflow-y-auto">
      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[150px] pointer-events-none" />

      {/* HEADER NAVBAR */}
      <header className="px-8 py-4 bg-black/60 border-b border-amber-500/20 flex items-center justify-between backdrop-blur-2xl relative z-10 shrink-0">
        <div
          className="flex items-center space-x-3.5 cursor-pointer"
          onClick={() => setActiveTab("overview")}
        >
          <div className="p-2.5 bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 rounded-xl text-black shadow-lg shadow-amber-500/20">
            <Crown className="w-5 h-5 font-bold" />
          </div>
          <div>
            <span className="text-xl font-black text-white tracking-widest">
              ZUPITER{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-500">
                CLUB
              </span>
            </span>
            <p className="text-[9px] uppercase tracking-[0.2em] text-amber-200/70 font-semibold">
              Luxury ERP Portal
            </p>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <nav className="hidden md:flex items-center space-x-1 bg-black/50 p-1.5 rounded-xl border border-amber-500/20 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-lg transition ${activeTab === "overview" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" : "text-slate-400 hover:text-white"}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("booking")}
            className={`px-4 py-2 rounded-lg transition ${activeTab === "booking" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" : "text-slate-400 hover:text-white"}`}
          >
            Book Facility
          </button>
          <button
            onClick={() => setActiveTab("reservations")}
            className={`px-4 py-2 rounded-lg transition ${activeTab === "reservations" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" : "text-slate-400 hover:text-white"}`}
          >
            My Reservations ({userBookings?.length || 0})
          </button>

          <button
            onClick={() => setActiveTab("card")}
            className={`px-4 py-2 rounded-lg transition ${activeTab === "card" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" : "text-slate-400 hover:text-white"}`}
          >
            VIP Member Pass
          </button>

          {/* E-Contract & Signature Tab */}
          <button
            onClick={() => setActiveTab("contract")}
            className={`px-4 py-2 rounded-lg transition text-xs font-bold ${
              activeTab === "contract"
                ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            VIP Member Form
          </button>

          {/* ONLY SHOW ADMIN TAB IF USER IS ADMIN */}
          {/* ONLY SHOW ADMIN TAB IF USER IS ADMIN */}
          {isAdmin && (
            <button
              onClick={() => setActiveTab("analytics")}
              className={`px-4 py-2 rounded-lg transition ${
                activeTab === "analytics"
                  ? "bg-amber-500 text-black font-bold"
                  : "text-zinc-400"
              }`}
            >
              Admin Analytics
            </button>
          )}
        </nav>

        {/* USER INFO */}
        <div className="flex items-center space-x-5">
          <div className="text-right">
            <p className="text-xs font-bold text-amber-300 flex items-center justify-end gap-1">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              {currentUser?.username || currentUser?.name || "Valued Member"}
            </p>
            <p className="text-[10px] text-slate-400">
              {currentUser?.role || "Elite Member"}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl hover:bg-rose-500/20 transition flex items-center space-x-1.5 text-xs font-semibold"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 1. VIP MEMBERSHIP CARDS TAB */}
      {(activeTab === "card" || activeTab === "vip-pass") && (
        <div>
          <MembershipCards onSelectTier={handleSelectTier} />
        </div>
      )}

      {/* 2. E-CONTRACT & SIGNATURE TAB */}
      {activeTab === "contract" && (
        <div>
          <EContractFlow selectedTier={selectedTier} />
        </div>
      )}

      {/* DASHBOARD CONTENT */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 relative z-10 ">
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950/40 via-black to-slate-950/80 border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 backdrop-blur-xl shadow-2xl">
              <div>
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-bold mb-2">
                  <Sparkle className="w-3 h-3 text-amber-400 animate-spin" />
                  <span>MONGODB CONNECTED</span>
                </div>
                <h2 className="text-2xl font-black text-white">
                  Welcome Back,{" "}
                  <span className="text-amber-300">
                    {user?.name || "Valued Member"}
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Manage your VIP bookings and club facilities in real-time.
                </p>
              </div>

              <button
                onClick={() => setActiveTab("booking")}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-600 text-black font-extrabold rounded-xl text-xs shadow-lg hover:brightness-110 transition flex items-center space-x-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>New Reservation</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 bg-black/40 border border-amber-500/20 rounded-2xl backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">
                    Active Members
                  </span>
                  <Users className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="text-2xl font-extrabold text-white mt-2">
                  1,248
                </h3>
                <span className="text-[10px] text-emerald-400 flex items-center gap-0.5 mt-1">
                  <ArrowUpRight className="w-3 h-3" /> 12% increase
                </span>
              </div>

              <div className="p-5 bg-black/40 border border-amber-500/20 rounded-2xl backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">
                    Suite Occupancy
                  </span>
                  <Hotel className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="text-2xl font-extrabold text-white mt-2">94%</h3>
                <span className="text-[10px] text-amber-300 mt-1 block">
                  • High Season
                </span>
              </div>

              <div className="p-5 bg-black/40 border border-amber-500/20 rounded-2xl backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">
                    Your Bookings
                  </span>
                  <BookmarkCheck className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="text-2xl font-extrabold text-white mt-2">
                  {userBookings?.length || 0}
                </h3>
                <span className="text-[10px] text-emerald-400 mt-1 block">
                  • Saved in Database
                </span>
              </div>

              <div className="p-5 bg-black/40 border border-amber-500/20 rounded-2xl backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">
                    Banquet Events
                  </span>
                  <Utensils className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="text-2xl font-extrabold text-white mt-2">
                  18 Events
                </h3>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  • This week
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "booking" && (
          <div className="max-w-4xl mx-auto p-7 bg-black/40 border border-amber-500/30 rounded-3xl backdrop-blur-2xl shadow-2xl space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-black text-white">
                Reserve Luxury Facilities
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Select facility and date to confirm instant reservation
              </p>
            </div>

            {bookingSuccess && (
              <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs text-center font-bold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{bookingSuccess}</span>
              </div>
            )}

            <form onSubmit={handleCreateBooking} className="space-y-6">
              <div className="max-h-[260px] overflow-y-auto custom-scrollbar pr-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {facilitiesList && facilitiesList.length > 0 ? (
                  facilitiesList.map((item, idx) => {
                    const isSelected =
                      selectedFacility?._id === item._id ||
                      selectedFacility?.name === item.name;

                    return (
                      <div
                        key={item._id || idx}
                        onClick={() => setSelectedFacility(item)}
                        className={`p-3 rounded-2xl border cursor-pointer transition flex items-center space-x-3 ${
                          isSelected
                            ? "border-amber-400 bg-amber-500/10 shadow-lg shadow-amber-500/10"
                            : "border-slate-800 bg-black/40 hover:border-slate-700"
                        }`}
                      >
                        <img
                          src={
                            item.img ||
                            "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=300&q=80"
                          }
                          alt={item.name || "Facility"}
                          className="w-16 h-16 rounded-xl object-cover"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-white">
                            {item.name}
                          </h4>
                          <p className="text-[10px] text-amber-400 font-semibold mt-0.5">
                            ₹{" "}
                            {item.price
                              ? Number(item.price).toLocaleString("en-IN")
                              : "0"}
                          </p>
                          <span className="text-[9px] text-slate-400">
                            {item.category || "General"}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-slate-500 col-span-2 text-center py-4">
                    No facilities available for booking.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-2">
                    Reservation Date
                  </label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full p-3 bg-black/60 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-2">
                    Guests
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={guestsCount}
                    onChange={(e) => setGuestsCount(e.target.value)}
                    className="w-full p-3 bg-black/60 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>
                {/* Guest Name Input Field */}
                <div>
                  <label className="text-xs text-zinc-400 block mb-1 uppercase">
                    Guest Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Guest Full Name"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl p-3 text-sm focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={bookingLoading}
                className="w-full py-3.5 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-600 text-black font-extrabold rounded-xl shadow-lg transition hover:brightness-110 text-xs tracking-wider"
              >
                {bookingLoading
                  ? "Confirming..."
                  : `Confirm Reservation (₹ ${
                      selectedFacility?.price
                        ? (
                            selectedFacility.price * (Number(guestsCount) || 1)
                          ).toLocaleString("en-IN")
                        : 0
                    })`}
              </button>
            </form>
          </div>
        )}

        {/* My Reservations section  */}
        {activeTab === "reservations" && (
          <div className="p-6 bg-black/40 border border-amber-500/20 rounded-2xl backdrop-blur-md">
            <h3 className="text-sm font-bold text-amber-300 mb-4 flex items-center gap-2">
              <BookmarkCheck className="w-4 h-4 text-amber-400" />
              YOUR RESERVATIONS & BOOKING HISTORY
            </h3>

            {!userBookings || userBookings.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                No active reservations found.{" "}
                <button
                  onClick={() => setActiveTab("booking")}
                  className="text-amber-300 font-bold underline ml-1"
                >
                  Book Now
                </button>
              </div>
            ) : (
              <div className="max-h-[350px] overflow-y-auto custom-scrollbar border border-zinc-800/60 rounded-xl">
                <table className="w-full text-left text-sm text-zinc-300">
                  <thead className="bg-zinc-950 sticky top-0 z-10 text-[10px] uppercase font-bold text-zinc-400">
                    <tr>
                      <th className="p-3">FACILITY</th>
                      <th className="p-3">DATE</th>
                      <th className="p-3">GUESTS</th>
                      <th className="p-3">AMOUNT</th>
                      <th className="p-3">STATUS</th>
                      <th className="p-3 text-center">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {userBookings?.map((b, idx) => {
                      const isCancelled = (b?.status || "").toLowerCase().includes("cancel");
                      const amount = Number(b?.amount || b?.price) || 0;
                      const refundAmount = amount * 0.8;

                      return (
                      <tr key={b?._id || b?.id || idx} className="hover:bg-slate-900/30">
                        <td className="p-3 font-semibold text-white">
                          {b?.facility || b?.facilityName || "N/A"}
                        </td>
                        <td className="p-3 text-slate-300">{b?.date || "N/A"}</td>
                        <td className="p-3">{b?.guests || 1} Guests</td>
                        <td className="p-3 text-amber-300 font-semibold">
                          <div>₹{amount.toLocaleString("en-IN")}</div>
                          {isCancelled && (
                            <div className="text-[10px] text-red-400 mt-0.5">
                              Refunded: ₹{refundAmount.toLocaleString("en-IN")}
                            </div>
                          )}
                        </td>
                        <td className={`p-3 font-bold ${isCancelled ? "text-red-400" : "text-emerald-400"}`}>
                          {b?.status || "Confirmed"}
                        </td>
                        <td className="p-3 text-center flex justify-center gap-2">
                          <button
                            onClick={() => handleDownloadReceipt(b)}
                            className="px-3 py-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 rounded-lg text-[11px] hover:bg-amber-500/30 transition-all"
                          >
                            Receipt
                          </button>
                          {!isCancelled && (
                            <button
                              onClick={() => handleCancelBooking(b?._id || b?.id)}
                              className="px-3 py-1 bg-red-500/20 border border-red-500/40 text-red-400 rounded-lg text-[11px] hover:bg-red-500/30 transition-all"
                            >
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    )})}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="space-y-6">
            {/* 1. ADMINISTRATIVE ANALYTICS & RECENT BOOKINGS */}
            <div className="p-5 bg-black/40 border border-amber-500/20 rounded-2xl backdrop-blur-md space-y-4">
              <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                ADMINISTRATIVE ANALYTICS & RECENT BOOKINGS
              </h3>

              {/* STATS CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 bg-black/50 border border-slate-800 rounded-xl">
                  <p className="text-[9px] text-slate-400 uppercase font-bold">
                    Total Revenue
                  </p>
                  <p className="text-lg font-extrabold text-amber-400 mt-0.5">
                    ₹{" "}
                    {adminStats?.totalRevenue
                      ? adminStats.totalRevenue.toLocaleString("en-IN")
                      : 0}
                  </p>
                </div>

                <div className="p-3 bg-black/50 border border-slate-800 rounded-xl">
                  <p className="text-[9px] text-slate-400 uppercase font-bold">
                    Total Bookings
                  </p>
                  <p className="text-lg font-extrabold text-white mt-0.5">
                    {adminStats?.totalBookings || 0}
                  </p>
                </div>

                <div className="p-3 bg-black/50 border border-slate-800 rounded-xl">
                  <p className="text-[9px] text-slate-400 uppercase font-bold">
                    System Status
                  </p>
                  <p className="text-lg font-extrabold text-emerald-400 mt-0.5">
                    Active ERP
                  </p>
                </div>
              </div>

              {/* RECENT BOOKINGS TABLE */}
              <div className="max-h-[220px] overflow-y-auto custom-scrollbar border border-zinc-800/80 rounded-xl">
                <table className="w-full text-left text-xs text-zinc-300">
                  <thead className="bg-zinc-950 sticky top-0 z-10 text-[9px] uppercase font-bold text-zinc-400 border-b border-zinc-800">
                    <tr>
                      <th className="p-2.5">FACILITY</th>
                      <th className="p-2.5">DATE</th>
                      <th className="p-2.5">PRICE</th>
                      <th className="p-2.5">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 bg-zinc-900/30">
                    {adminStats?.recentBookings &&
                    adminStats.recentBookings.length > 0 ? (
                      adminStats.recentBookings.map((b, idx) => (
                        <tr
                          key={b._id || idx}
                          className="hover:bg-zinc-800/40 transition-colors"
                        >
                          <td className="p-2 font-semibold text-white">
                            {b.facility || b.facilityName}
                          </td>
                          <td className="p-2 text-slate-400">{b.date}</td>
                          <td className="p-2 text-amber-400 font-bold">
                            ₹{" "}
                            {Number(b.amount || b.price)?.toLocaleString(
                              "en-IN",
                            )}
                          </td>
                          <td className="p-2 text-emerald-400 font-semibold">
                            {b.status || "Confirmed"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="4"
                          className="p-3 text-center text-zinc-500 text-xs"
                        >
                          No recent bookings found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 2. DYNAMIC AMENITIES & PRICING MANAGER */}
            <div className="p-5 bg-black/40 border border-amber-500/20 rounded-2xl backdrop-blur-md space-y-4">
              <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                DYNAMIC AMENITIES & PRICING MANAGER
              </h3>

              {/* ADD FACILITY FORM */}
              <form
                onSubmit={handleAddFacility}
                className="grid grid-cols-1 sm:grid-cols-4 gap-2"
              >
                <input
                  type="text"
                  placeholder="Facility Name (e.g. VIP Helipad)"
                  value={newFacilityName}
                  onChange={(e) => setNewFacilityName(e.target.value)}
                  className="p-2.5 bg-black/50 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                />
                <input
                  type="number"
                  placeholder="Price (₹)"
                  value={newFacilityPrice}
                  onChange={(e) => setNewFacilityPrice(e.target.value)}
                  className="p-2.5 bg-black/50 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                />
                <select
                  value={newFacilityCategory}
                  onChange={(e) => setNewFacilityCategory(e.target.value)}
                  className="p-2.5 bg-black/50 border border-zinc-800 rounded-xl text-zinc-300 text-xs focus:outline-none focus:border-amber-500"
                >
                  <option value="Stay">Stay</option>
                  <option value="Event">Event</option>
                  <option value="Dining">Dining</option>
                  <option value="Sports">Sports</option>
                </select>
                <button
                  type="submit"
                  className="p-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl text-xs transition-all"
                >
                  + Add Facility
                </button>
              </form>

              {/* FACILITIES LIST TABLE (6-7 ITEMS VISIBLE AT ONCE) */}
              {/* ADMIN AMENITIES TABLE WRAPPER - YAHAN CHANGE KARNA HAI */}
              <div className="max-h-[220px] overflow-y-scroll custom-scrollbar border border-zinc-800/80 rounded-xl">
                <table className="w-full text-left text-xs text-zinc-300">
                  <thead className="bg-zinc-950 sticky top-0 z-10 text-[9px] uppercase font-bold text-zinc-400 border-b border-zinc-800">
                    <tr>
                      <th className="p-2.5">FACILITY</th>
                      <th className="p-2.5">CATEGORY</th>
                      <th className="p-2.5">PRICE</th>
                      <th className="p-2.5 text-center">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 bg-zinc-900/30">
                    {facilitiesList && facilitiesList.length > 0 ? (
                      facilitiesList.map((item, index) => (
                        <tr
                          key={item._id || index}
                          className="hover:bg-zinc-800/40 transition-colors"
                        >
                          <td className="p-2.5 font-semibold text-white">
                            {item.name}
                          </td>
                          <td className="p-2.5 text-zinc-400">
                            {item.category || "General"}
                          </td>
                          <td className="p-2.5 text-amber-400 font-bold">
                            ₹ {Number(item.price)?.toLocaleString("en-IN")}
                          </td>
                          <td className="p-2.5 text-center">
                            <button
                              type="button"
                              onClick={() => handleDeleteFacility(item._id)}
                              className="px-2.5 py-1 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-[10px] hover:bg-red-500/20 transition-all"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="4"
                          className="p-3 text-center text-zinc-500 text-xs"
                        >
                          No facilities available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {isPaymentModalOpen && paymentDetails && (
        <MockPaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          onSuccess={executeBooking}
          amount={paymentDetails.amount}
          itemName={paymentDetails.itemName}
          date={paymentDetails.date}
          guests={paymentDetails.guests}
          type="facility"
        />
      )}

      {isRefundModalOpen && refundBooking && (
        <RefundModal
          isOpen={isRefundModalOpen}
          onClose={() => setIsRefundModalOpen(false)}
          onConfirm={processRefund}
          booking={refundBooking}
        />
      )}
    </div>
  );
};

export default Dashboard;
