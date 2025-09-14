import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sun, Moon, Eye, EyeOff, Loader2 } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState(localStorage.getItem("rememberedEmail") || "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(localStorage.getItem("rememberedEmail") ? true : false);
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    document.body.className = darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black";
  }, [darkMode]);

  // --- Login Function ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (rememberMe) {
      localStorage.setItem("rememberedEmail", email);
    } else {
      localStorage.removeItem("rememberedEmail");
    }

    try {
      const response = await fetch("https://employeemanagement-ccan.onrender.com/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Invalid credentials. Please try again.");
      if (!data.token || !data.role) throw new Error("Missing token or role in response.");

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role.toLowerCase());

      navigate(data.role.toLowerCase() === "admin" ? "/admin" : "/employee");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- Forgot Password Step 1: Ask OTP ---
  const handleAskOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log("Requesting OTP for:", email);
      setForgotStep(2);
    } catch (err) {
      setError("Failed to request OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- Forgot Password Step 2: Verify OTP & Set Password ---
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log("Verifying OTP:", otp, "for email:", email, "with new password:", newPassword);
      setForgotMode(false);
      setForgotStep(1);
      setOtp("");
      setNewPassword("");
    } catch (err) {
      setError("Invalid OTP or error resetting password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 font-mono">
      <div
        className={`relative w-full max-w-md border-2 border-black rounded-xl p-8 transition-all shadow-[8px_8px_0px_black] 
          ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}
      >
        {/* Theme Toggle */}
     <button
  onClick={() => setDarkMode(!darkMode)}
  className={`absolute top-4 right-4 border-2 border-black rounded-full p-2 hover:scale-105 transition 
    ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}
>
  {darkMode ? <Sun size={18} /> : <Moon size={18} />}
</button>



        <h1 className="text-center text-3xl font-bold mb-6">
          {forgotMode ? "RESET PASSWORD" : "LOGIN"}
        </h1>

        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        {/* --- LOGIN FORM --- */}
        {!forgotMode ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block mb-1 font-bold">EMAIL</label>
              <input
                type="email"
                className={`w-full border-2 border-black px-4 py-2 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-[4px_4px_0px_black] 
                  ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="relative">
              <label className="block mb-1 font-bold">PASSWORD</label>
              <input
                type={showPassword ? "text" : "password"}
                className={`w-full border-2 border-black px-4 py-2 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-[4px_4px_0px_black] 
                  ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-600 dark:text-gray-300"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <label className="flex items-center text-sm">
              <input
                type="checkbox"
                className="mr-2"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              Remember Me
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-500 text-white font-bold border-2 border-black py-2 rounded-md hover:shadow-[4px_4px_0px_black] hover:-translate-x-1 hover:-translate-y-1 transition flex items-center justify-center"
            >
              {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
              {loading ? "Logging in..." : "SIGN IN"}
            </button>
          </form>
        ) : (
          <>
            {/* --- FORGOT STEP 1: Ask OTP --- */}
            {forgotStep === 1 && (
              <form onSubmit={handleAskOtp} className="space-y-4">
                <div>
                  <label className="block mb-1 font-bold">EMAIL</label>
                  <input
                    type="email"
                    className={`w-full border-2 border-black px-4 py-2 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-[4px_4px_0px_black] 
                      ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-500 text-white font-bold border-2 border-black py-2 rounded-md hover:shadow-[4px_4px_0px_black] transition"
                >
                  {loading ? "Sending OTP..." : "Send OTP"}
                </button>
              </form>
            )}

            {/* --- FORGOT STEP 2: Verify OTP + New Password --- */}
            {forgotStep === 2 && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="block mb-1 font-bold">OTP</label>
                  <input
                    type="text"
                    className={`w-full border-2 border-black px-4 py-2 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-[4px_4px_0px_black] 
                      ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 font-bold">NEW PASSWORD</label>
                  <input
                    type="password"
                    className={`w-full border-2 border-black px-4 py-2 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-[4px_4px_0px_black] 
                      ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-500 text-white font-bold border-2 border-black py-2 rounded-md hover:shadow-[4px_4px_0px_black] transition"
                >
                  {loading ? "Verifying..." : "Verify & Reset Password"}
                </button>
              </form>
            )}
          </>
        )}

        {/* Switch Between Login & Forgot */}
        <div className="text-right mt-4">
          {!forgotMode ? (
            <button
              onClick={() => setForgotMode(true)}
              className="text-sm font-bold underline hover:text-red-500"
            >
              Forgot password?
            </button>
          ) : (
            <button
              onClick={() => {
                setForgotMode(false);
                setForgotStep(1);
                setOtp("");
                setNewPassword("");
              }}
              className="text-sm font-bold underline hover:text-blue-500"
            >
              Back to Login
            </button>
          )}
        </div>

        {/* Demo Credentials Section */}
        <div
          className={`mt-6 border border-dashed p-3 rounded-md text-sm 
            ${darkMode ? "border-white text-white" : "border-black text-black"}`}
        >
          <p>
            <b>Admin:</b> admin@gmail.com | admin
          </p>
          <p>
            <b>Employee:</b> employee@gmail.com | employee
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
