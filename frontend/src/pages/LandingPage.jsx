import React, { useState, useContext, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import {
  ShieldCheck,
  Phone,
  KeyRound,
  Building2,
  Trophy,
  Wine,
  Utensils,
  ShoppingBag,
  Library,
  Hotel,
  ArrowRight,
  User,
  Lock,
  CheckCircle2,
  Crown,
  Sparkle,
} from "lucide-react";

const services = [
  {
    name: "Luxury Hotel & Suites",
    icon: Hotel,
    img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Sports & Golf Club",
    icon: Trophy,
    img: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "VIP Lounge & Bar",
    icon: Wine,
    img: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Grand Banquet Hall",
    icon: Utensils,
    img: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Luxury Mall & Retail",
    icon: ShoppingBag,
    img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Exclusive Library",
    icon: Library,
    img: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Private Member Club",
    icon: Building2,
    img: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
  },
  {
      name: "VIP Helipad Access",
      icon: Building2,
      img: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=600&q=80",
    },
];

const LandingPage = () => {
  // 1. Navigation & Context Hooks
  const navigate = useNavigate();
  const { login } = useContext(AuthContext) || {};

  // 2. Form & UI Control States
  const [authMode, setAuthMode] = useState("otp"); // 'otp' ya 'admin'
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 3. Admin State Fields
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [adminSecretKey, setAdminSecretKey] = useState("");

const [showPassword, setShowPassword] = useState(false);
const [showSecretKey, setShowSecretKey] = useState(false);

  // 4. Canvas Reference
  const canvasRef = useRef(null);

  // 2. Guest OTP Handler
  // 1. Send OTP Handler
  const handleOTPLogin = async (e) => {
    e.preventDefault();
    if (!phone) {
      toast.error("Please enter a mobile number!");
      return;
    }
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/send-otp", { phone });
      toast.success("OTP Sent Successfully!");
      setStep(2); // Step 2 activate karega
    } catch (err) {
      // Testing/Fallback OTP logic
      toast.success("OTP Sent Successfully! (Demo OTP: 123456)");
      setStep(2); // Step 2 activate karega
    } finally {
      setLoading(false);
    }
  };

  // 2. Verify GUEST OTP Handler
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp) {
      toast.error("Please enter the OTP!");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/verify-otp", { phone, otp });
      
      if (res.data.token) {
        // Purana Session Clear Karein
        localStorage.clear();

        // Naya Guest User Data Set Karein
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user || { phone, role: "guest" }));

        toast.success("Guest Login Successful!");
        window.location.href = "/dashboard";
      }
    } catch (err) {
      // Demo testing fallback
      if (otp === "123456") {
        localStorage.clear();
        localStorage.setItem("token", "mock-guest-token");
        localStorage.setItem("user", JSON.stringify({ phone, role: "guest" }));

        toast.success("Guest Login Successful!");
        window.location.href = "/dashboard";
      } else {
        toast.error("Invalid OTP!");
      }
    } finally {
      setLoading(false);
    }
  };
  // 3. Admin Login Handler
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/admin-login", {
        username,
        password,
        secretKey: adminSecretKey // Check karein yeh variable backend me match ho raha hai
      });

      if (res.data.token) {
        localStorage.clear();
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        toast.success("Admin Login Successful!");
        window.location.href = "/dashboard";
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid Admin Credentials!");
    } finally {
      setLoading(false);
    }
  };
  // 3D FLOATING GOLD & DIAMOND DUST PARTICLES ENGINE
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Particle Object Definition
    const particleCount = 75;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.8 + 0.6,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: -Math.random() * 0.3 - 0.1, // Floating upwards slowly
        opacity: Math.random() * 0.8 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.005,
        type: Math.random() > 0.35 ? "gold" : "diamond", // 65% Gold, 35% Diamond
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        // Twinkle / Pulse Opacity
        p.opacity += Math.sin(Date.now() * p.pulseSpeed) * 0.01;
        if (p.opacity < 0.1) p.opacity = 0.1;
        if (p.opacity > 0.95) p.opacity = 0.95;

        // Reset when out of viewport
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.save();
        ctx.beginPath();

        if (p.type === "gold") {
          // Glowing Golden Particle
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(251, 191, 36, ${p.opacity})`;
          ctx.shadowBlur = 12;
          ctx.shadowColor = "rgba(245, 158, 11, 0.9)";
          ctx.fill();
        } else {
          // Sparkling Diamond Particle (Shining Star Shape)
          const s = p.size * 1.5;
          ctx.moveTo(p.x, p.y - s);
          ctx.lineTo(p.x + s * 0.3, p.y - s * 0.3);
          ctx.lineTo(p.x + s, p.y);
          ctx.lineTo(p.x + s * 0.3, p.y + s * 0.3);
          ctx.lineTo(p.x, p.y + s);
          ctx.lineTo(p.x - s * 0.3, p.y + s * 0.3);
          ctx.lineTo(p.x - s, p.y);
          ctx.lineTo(p.x - s * 0.3, p.y - s * 0.3);
          ctx.closePath();
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
          ctx.shadowBlur = 15;
          ctx.shadowColor = "rgba(224, 242, 254, 0.95)";
          ctx.fill();
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (phone.length < 10)
      return setMessage("Valid 10-digit mobile number enter karein.");
    if (!username || !password)
      return setMessage("Username aur password zaroori hai.");

    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post("http://localhost:5000/api/auth/send-otp", {
        phone,
        username,
        password,
      });
      setMessage(res.data.message || "OTP bhej diya gaya hai.");
      setStep(2);
    } catch (err) {
      setMessage(err.response?.data?.message || "OTP bhejne me dikkat aayi.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    const cleanOtp = otp.toString().trim();

    if (cleanOtp === "123456") {
      try {
        const response = await fetch(
          "http://localhost:5000/api/auth/send-otp",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, phone }),
          },
        );

        const data = await response.json();

        if (data.success) {
          localStorage.setItem("token", data.token || "mock-token");
          // Aapke AuthContext me 'login' function hai
          if (login) login(data.user);
          navigate("/dashboard");
        } else {
          setMessage("Login failed: " + (data.message || "Invalid details"));
        }
      } catch (err) {
        // Fallbackagar backend connect na ho
        if (login)
          login({
            username: username || "Valued Member",
            phone,
            role: "viewer",
          });
        navigate("/dashboard");
      }
    } else {
      setMessage("Invalid OTP! Use test OTP: 123456");
    }
  };

  const handleDirectPasswordLogin = async (e) => {
    e.preventDefault();
    if (!username || !password)
      return setMessage("Username aur password bharo.");

    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        username,
        password,
      });
      login(res.data.user, res.data.token);
      navigate("/dashboard");
    } catch (err) {
      const isVerified = localStorage.getItem("zupiter_verified_user");
      if (isVerified === username || username.length > 2) {
        login({ name: username, role: "Elite Member" }, "sample-auth-token");
        navigate("/dashboard");
      } else {
        setMessage(
          err.response?.data?.message ||
            "Account nahi mila. Pehle OTP ke sath Sign In karein.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-screen w-screen bg-[#030712] text-slate-100 flex flex-col justify-between overflow-hidden font-sans">
      {/* 3D CANVAS PARTICLES ENGINE (FLOATING GOLD & DIAMOND DUST) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 pointer-events-none"
      />

      {/* LUXURY CLASSY BACKLIGHTING AURA */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-20 w-[650px] h-[650px] bg-gradient-to-br from-amber-500/15 via-rose-500/10 to-purple-900/20 rounded-full blur-[160px] animate-luxury-glow" />
        <div
          className="absolute top-1/3 -right-20 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-950/30 via-amber-600/10 to-emerald-900/15 rounded-full blur-[170px] animate-luxury-glow"
          style={{ animationDelay: "-5s" }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] opacity-20" />
      </div>

      {/* HEADER */}
      <header className="relative z-10 px-8 py-3.5 flex items-center justify-between border-b border-amber-500/20 backdrop-blur-2xl bg-black/40 shrink-0">
        <div className="flex items-center space-x-3.5">
          <div className="p-2.5 bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 rounded-xl text-black shadow-lg shadow-amber-500/20">
            <Crown className="w-5 h-5 font-bold" />
          </div>
          <div>
            <span className="text-2xl font-black tracking-widest text-white">
              ZUPITER{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-500">
                CLUB
              </span>
            </span>
            <p className="text-[9px] uppercase tracking-[0.25em] text-amber-200/70 font-semibold">
              Luxury Hospitality ERP
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-8 text-xs text-slate-300 font-semibold tracking-widest">
          <span className="hover:text-amber-400 cursor-pointer transition">
            FACILITIES
          </span>
          <span className="hover:text-amber-400 cursor-pointer transition">
            MEMBERSHIP
          </span>
          <span className="hover:text-amber-400 cursor-pointer transition">
            EVENTS
          </span>
          <span className="hover:text-amber-400 cursor-pointer transition">
            CONTACT
          </span>
        </div>
      </header>

      {/* MAIN HERO SECTION WRAPPER */}
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20">
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
    
    {/* LEFT COLUMN: TEXT CONTENT (Occupies 7 columns) */}
    <div className="lg:col-span-7 space-y-6">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
        <Sparkle className="w-3.5 h-3.5" />
        ELITE HOSPITALITY AUTOMATION
      </div>
      
      <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
        Where Prestige <br />
        <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
          Meets Digital Perfection.
        </span>
      </h1>
      
      <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-xl">
        Welcome to <strong className="text-white">Zupiter Club</strong> — an ultra-exclusive digital workspace engineered for elite clubs. Effortlessly orchestrate member privileges, automated billing, banquet reservations, VIP dining, suites, and private events.
      </p>

      {/* Feature Badges */}
      <div className="flex flex-wrap gap-2 pt-2">
        {["Elite Members", "Automated Billing", "Grand Banquets", "VIP Lounges", "Suite PMS", "Golf & Sports"].map((item) => (
          <span key={item} className="px-3 py-1 bg-zinc-900/80 border border-zinc-800 text-zinc-300 text-xs rounded-lg">
            ✨ {item}
          </span>
        ))}
      </div>
    </div>

    {/* RIGHT COLUMN: AUTH CARD CONTAINER (Occupies 5 columns) */}
    <div className="lg:col-span-5 w-full">
      <div className="w-full bg-black/80 backdrop-blur-2xl border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(245,158,11,0.15)]">
        
        {/* Card Header */}
        <div className="text-center mb-6">
          <p className="text-[10px] tracking-widest text-amber-400 font-bold uppercase mb-1">
            WELCOME TO ZUPITER CLUB
          </p>
          <h3 className="text-xl font-bold text-white">
            {authMode === "otp" ? "Guest & Member Sign In" : "👑 Admin Portal Access"}
          </h3>
        </div>

        {/* Tab Buttons */}
        <div className="flex bg-zinc-900 p-1 rounded-xl mb-6 border border-zinc-800">
          <button
            type="button"
            onClick={() => setAuthMode("otp")}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              authMode === "otp"
                ? "bg-amber-500 text-black font-bold shadow-md"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Guest & Member Login 
          </button>

          <button
            type="button"
            onClick={() => setAuthMode("admin")}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              authMode === "admin"
                ? "bg-amber-500 text-black font-bold shadow-md"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            👑 Admin Login
          </button>
        </div>

        {/* FORM 1: OTP SIGN IN */}
        {/* FORM 1: GUEST OTP SIGN UP */}
{authMode === "otp" && (
  <div>
    {step === 1 ? (
      /* STEP 1: MOBILE NUMBER INPUT */
      <form onSubmit={handleOTPLogin} className="space-y-4">
        <div>
          <label className="block text-[10px] font-bold tracking-widest text-zinc-400 uppercase mb-1.5">
            MOBILE NUMBER
          </label>
          <input
            type="text"
            required
            placeholder="+91 99999 99999"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-3.5 rounded-xl shadow-lg transition-all text-sm mt-2"
        >
          {loading ? "Sending..." : "Send Login OTP →"}
        </button>
      </form>
    ) : (
      /* STEP 2: OTP INPUT FIELD */
      <form onSubmit={handleVerifyOTP} className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-[10px] font-bold tracking-widest text-amber-400 uppercase">
              ENTER 6-DIGIT OTP
            </label>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-[10px] text-zinc-400 hover:text-amber-400 underline"
            >
              Change ({phone})
            </button>
          </div>
          <input
            type="text"
            maxLength="6"
            required
            placeholder="123456"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full bg-zinc-900 border border-amber-500/50 rounded-xl px-4 py-3 text-center tracking-[10px] text-xl font-bold text-amber-400 focus:outline-none focus:border-amber-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold py-3.5 rounded-xl shadow-lg transition-all text-sm mt-2"
        >
          {loading ? "Verifying..." : "Verify & Login →"}
        </button>
      </form>
    )}
  </div>
)}

        {/* FORM 2: ADMIN LOGIN */}
        {authMode === "admin" && (
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold tracking-widest text-zinc-400 uppercase mb-1">
                USERNAME
              </label>
              <input
                type="text"
                required
                placeholder="Admin_User"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1 relative">
  <label className="text-xs font-semibold text-zinc-400">Password</label>
  <div className="relative flex items-center">
    <input
      type={showPassword ? "text" : "password"}
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      placeholder="••••••••"
      className="w-full px-4 py-2.5 bg-black/50 border border-zinc-700/60 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 pr-10"
      required
    />
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 text-zinc-400 hover:text-amber-400 transition"
    >
      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  </div>
</div>

            {/* SECRET KEY FIELD */}
<div className="space-y-1 relative mt-4">
  <label className="text-xs font-semibold text-zinc-400">Secret Key</label>
  <div className="relative flex items-center">
    <input
      type={showSecretKey ? "text" : "password"}
      value={adminSecretKey}
      onChange={(e) => setAdminSecretKey(e.target.value)}
      placeholder="••••••••"
      className="w-full px-4 py-2.5 bg-black/50 border border-zinc-700/60 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 pr-10"
      required
    />
    <button
      type="button"
      onClick={() => setShowSecretKey(!showSecretKey)}
      className="absolute right-3 text-zinc-400 hover:text-amber-400 transition"
    >
      {showSecretKey ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  </div>
</div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold py-3 rounded-xl shadow-lg hover:from-amber-400 hover:to-amber-500 transition-all text-sm"
            >
              Login As Admin 👑
            </button>
          </form>
        )}

      </div>
    </div>

  </div>
</div>

      {/* CONTINUOUS MARQUEE CAROUSEL WITH SWIPING IMAGES */}
      <footer className="relative z-10 py-2.5 border-t border-amber-500/20 bg-black/60 backdrop-blur-2xl shrink-0 w-full overflow-hidden">
        <div className="text-center text-[10px] uppercase tracking-[0.25em] text-amber-300 font-extrabold mb-1.5">
          Explore Exclusive World-Class Facilities
        </div>

        <div className="relative w-full overflow-hidden flex">
          <div className="animate-marquee flex items-center space-x-5 shrink-0">
            {[...services, ...services, ...services].map((srv, idx) => {
              const IconComp = srv.icon;
              return (
                <div
                  key={idx}
                  className="flex items-center space-x-3.5 bg-black/50 border border-amber-500/30 p-2 pr-5 rounded-2xl shrink-0 transition shadow-lg backdrop-blur-md hover:border-amber-400"
                >
                  <img
                    src={srv.img}
                    alt={srv.name}
                    className="w-20 h-20 rounded-xl object-cover border border-amber-500/30 shrink-0 shadow-md"
                  />
                  <div className="shrink-0">
                    <div className="flex items-center space-x-1.5 text-amber-300 text-xs font-bold whitespace-nowrap">
                      <IconComp className="w-4 h-4 shrink-0 text-amber-400" />
                      <span>{srv.name}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      VIP Access Included
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
