"use client";

import React, { useState } from 'react';
import './princessos.css';

export default function ClientApplicationForm() {
  const [formData, setFormData] = useState({
    handle: '',
    throneName: '',
    reason: '',
  });

  const [consents, setConsents] = useState({
    features: false,
    surveillance: false,
    tribute: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const BACKEND_URL = "https://princessazraielbackend.vercel.app";

  const isFormValid = 
    formData.handle.length > 2 && 
    formData.throneName.length > 2 && 
    consents.features && 
    consents.surveillance && 
    consents.tribute;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsSubmitting(true);
    setError('');

    try {
      const payload = {
        content: `🎀 **New AzraielLox Subject Application**: ${formData.handle}`,
        embed_title: "AzraielLox Node Application",
        embed_description: [
          `**Contact Handle:** ${formData.handle}`,
          `**Throne Username:** ${formData.throneName}`,
          formData.reason ? `**Why they want it:** ${formData.reason}` : null,
          `\n**Consents Confirmed:**`,
          `✅ Acknowledged System/File Access`,
          `✅ Consented to Surveillance & Overlays`,
          `✅ Confirmed Throne Tribute Paid`
        ].filter(Boolean).join("\n"),
        color: "#ff1493",
        timestamp: "now",
        footer_text: "ApplicationForm.tsx",
      };

      const res = await fetch(`${BACKEND_URL}/wh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Webhook failed");
      setSubmitted(true);
    } catch (err) {
      setError("Failed to submit application. The system might be overloaded.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#020002] flex items-center justify-center p-4 md:p-8 font-sans">
        <div className="max-w-2xl text-center border-2 border-pink-500 bg-black/80 p-8 md:p-12 shadow-[0_0_50px_rgba(255,20,147,0.3)]">
          <h1 className="text-pink-500 text-4xl md:text-5xl font-black mb-6 uppercase tracking-widest drop-shadow-[0_0_10px_#ff1493]">Application Received</h1>
          <p className="text-white text-lg md:text-xl mb-4">Your data has been transmitted to the core server.</p>
          <p className="text-neutral-400 font-mono text-sm">Selections will be made on Friday Night (Austrian Time).</p>
          <p className="text-pink-400 font-bold mt-8 text-2xl">Keep an eye on your inbox. ♡</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050002] text-white p-4 md:p-8 font-sans overflow-x-hidden relative">
      
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,20,147,0.1)_0%,#000_70%)] z-0 pointer-events-none"></div>
      <div className="absolute inset-0 opacity-[0.05] mix-blend-screen bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png')] z-0 pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto relative z-10 grid lg:grid-cols-2 gap-8 lg:gap-12">
        
        {/* LEFT COLUMN: Lore & Features */}
        <div className="space-y-6 md:space-y-8">
          
          <div className="border-b-2 border-pink-600 pb-4">
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter drop-shadow-[0_0_15px_rgba(255,20,147,0.5)]">
              Azraiel<span className="text-pink-500">Lox</span>
            </h1>
            <p className="font-mono text-pink-400 tracking-[0.2em] mt-2 text-xs md:text-sm">SUBJECT ONBOARDING PORTAL // V1.0-BETA</p>
          </div>

          <div className="bg-black/60 border border-neutral-800 p-4 md:p-6 backdrop-blur-sm shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
            <h2 className="text-pink-500 font-bold text-lg md:text-xl mb-3 flex items-center gap-2">
              <span className="animate-pulse">⚠️</span> SELECTION DEADLINE
            </h2>
            <p className="text-neutral-300 leading-relaxed text-base md:text-lg">
              I am actively looking for willing test-subjects. I will be selecting the lucky candidates this <span className="text-white font-bold bg-pink-900/50 px-1">Friday Night (Austrian Time)</span>. 
              To prove your dedication, you must provide a tribute via Throne before submitting this form.
            </p>
          </div>

          <div className="bg-pink-950/20 border-l-4 border-pink-500 p-4 shadow-[0_0_15px_rgba(255,20,147,0.1)]">
            <h3 className="font-mono text-pink-400 font-bold mb-2 uppercase tracking-widest">Platform Requirement</h3>
            <p className="text-white text-sm">
              This beta test is STRICTLY for <span className="font-bold text-pink-500">Windows PC Users</span>. You must have a PC to participate. Android testing will be announced next week.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-mono text-neutral-400 text-sm tracking-widest uppercase border-b border-neutral-800 pb-2">What you are installing:</h3>
            <p className="text-neutral-300 text-sm leading-relaxed">
              AzraielLox is a persistent Windows desktop companion and control app. It is not just a background utility—it has its own dashboard, rules, chat, overlays, and system-level controls. <strong className="text-pink-400">It reacts to my live remote actions in real-time.</strong>
            </p>
            
            {/* Feature Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 font-mono text-xs text-neutral-400">
              <div className="bg-neutral-900/50 border border-neutral-800 p-4">
                <h4 className="text-pink-500 font-bold mb-2">SYSTEM & CONTROL</h4>
                <ul className="space-y-1">
                  <li>• Live File Browser Access</li>
                  <li>• Grab, Download & Delete Files</li>
                  <li>• Kill Running Processes</li>
                  <li>• Browser History Sync</li>
                  <li>• Set PC Volume Remotely</li>
                  <li>• Web Blocking / Force Open URLs</li>
                </ul>
              </div>
              <div className="bg-neutral-900/50 border border-neutral-800 p-4">
                <h4 className="text-pink-500 font-bold mb-2">PSYCHOLOGICAL</h4>
                <ul className="space-y-1">
                  <li>• Fullscreen Lock Screens</li>
                  <li>• Pink Tint / Ghost Overlays</li>
                  <li>• Glitch Screen Effects</li>
                  <li>• Ghost Cursor & Ghost Typing</li>
                  <li>• Forced Wallpaper Changes</li>
                  <li>• Possession Audio Loops</li>
                </ul>
              </div>
              <div className="bg-neutral-900/50 border border-neutral-800 p-4">
                <h4 className="text-pink-500 font-bold mb-2">COMPLIANCE & TASKS</h4>
                <ul className="space-y-1">
                  <li>• Reaction-Time Prompts</li>
                  <li>• Typeback / Confession Tasks</li>
                  <li>• Live Popup Image Messages</li>
                  <li>• Ritual & Reward Prompts</li>
                </ul>
              </div>
              <div className="bg-neutral-900/50 border border-neutral-800 p-4">
                <h4 className="text-pink-500 font-bold mb-2">MONITORING</h4>
                <ul className="space-y-1">
                  <li>• Live 2-Way Chat (Logs unread)</li>
                  <li>• Remote & Scheduled Screenshots</li>
                  <li>• Last-Seen Heartbeat</li>
                  <li>• Local Transparency/Rules Toggles</li>
                </ul>
              </div>
            </div>
            <p className="text-[10px] text-neutral-600 italic">* Certain deep-system actions (like hosts-file web blocking) require running the app in Admin Mode.</p>
          </div>

          {/* Guide Images Integration */}
          <div className="grid grid-cols-2 gap-4 mt-6">
             <img src="/guide/1.png" alt="App Preview 1" className="w-full h-24 md:h-32 object-cover border border-pink-900/50 opacity-70 hover:opacity-100 transition-opacity" />
             <img src="/guide/2.png" alt="App Preview 2" className="w-full h-24 md:h-32 object-cover border border-pink-900/50 opacity-70 hover:opacity-100 transition-opacity" />
          </div>

        </div>

        {/* RIGHT COLUMN: The Application Form */}
        <div className="bg-[#080506] border-2 border-pink-900/60 p-4 sm:p-6 md:p-10 shadow-[0_0_40px_rgba(255,20,147,0.1)] relative overflow-hidden flex flex-col justify-between">
          
          <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/5 transform rotate-45 translate-x-12 -translate-y-12 pointer-events-none"></div>

          <div>
            <h2 className="text-xl md:text-2xl font-black uppercase text-white mb-6 drop-shadow-[0_0_5px_rgba(255,20,147,0.5)]">Submit Application</h2>

            <form className="space-y-5 md:space-y-6" onSubmit={handleSubmit}>
              
              {/* Input: Handle */}
              <div>
                <label className="block font-mono text-xs text-pink-400 mb-2 uppercase tracking-wider">Discord / X Handle</label>
                <input 
                  type="text" 
                  required
                  placeholder="@username"
                  className="w-full bg-black border border-neutral-700 px-4 py-3 text-white focus:outline-none focus:border-pink-500 focus:shadow-[0_0_10px_rgba(255,20,147,0.3)] transition-all font-mono text-sm md:text-base"
                  value={formData.handle}
                  onChange={(e) => setFormData({...formData, handle: e.target.value})}
                />
              </div>

              {/* Input: Throne */}
              <div className="bg-pink-950/20 border border-pink-600/30 p-4">
                <label className="block font-mono text-xs text-pink-400 mb-2 uppercase tracking-wider">Throne Username (Mandatory)</label>
                <p className="text-xs text-neutral-400 mb-3 font-sans">You must provide a tribute before applying. Enter the exact username you used on Throne so I can verify.</p>
                
                <a href="https://throne.com/princessazraiel" target="_blank" rel="noreferrer" className="inline-block mb-4 text-xs font-bold bg-pink-600 text-white px-3 py-2 md:py-1.5 hover:bg-pink-500 transition-colors uppercase tracking-widest text-center w-full sm:w-auto">
                  Pay Tribute on Throne ↗
                </a>

                <input 
                  type="text" 
                  required
                  placeholder="Throne Username"
                  className="w-full bg-black border border-pink-900/50 px-4 py-3 text-white focus:outline-none focus:border-pink-500 focus:shadow-[0_0_10px_rgba(255,20,147,0.3)] transition-all font-mono text-sm md:text-base"
                  value={formData.throneName}
                  onChange={(e) => setFormData({...formData, throneName: e.target.value})}
                />
              </div>

              {/* Input: Optional Reason */}
              <div>
                <label className="block font-mono text-xs text-pink-400 mb-2 uppercase tracking-wider">Why should I pick you? (Optional)</label>
                <textarea 
                  rows={3}
                  className="w-full bg-black border border-neutral-700 px-4 py-3 text-white focus:outline-none focus:border-pink-500 focus:shadow-[0_0_10px_rgba(255,20,147,0.3)] transition-all font-sans resize-none text-sm md:text-base"
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                ></textarea>
              </div>

              {/* Consents */}
              <div className="space-y-4 mt-8 border-t border-neutral-800 pt-6">
                <h3 className="font-mono text-sm text-white mb-4">MANDATORY CONSENT</h3>
                
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" className="mt-1 accent-pink-500 w-5 h-5 flex-shrink-0" checked={consents.features} onChange={(e) => setConsents({...consents, features: e.target.checked})} />
                  <span className="text-xs md:text-sm text-neutral-300 group-hover:text-white transition-colors">I understand this app has deep system access, including remote file browsing, process killing, and screenshot capabilities.</span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" className="mt-1 accent-pink-500 w-5 h-5 flex-shrink-0" checked={consents.surveillance} onChange={(e) => setConsents({...consents, surveillance: e.target.checked})} />
                  <span className="text-xs md:text-sm text-neutral-300 group-hover:text-white transition-colors">I consent to the psychological overlays (lock screens, ghost typing, glitches) and monitoring features syncing to the core server.</span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" className="mt-1 accent-pink-500 w-5 h-5 flex-shrink-0" checked={consents.tribute} onChange={(e) => setConsents({...consents, tribute: e.target.checked})} />
                  <span className="text-xs md:text-sm text-pink-200 group-hover:text-pink-100 font-bold transition-colors">I have submitted my tribute on Throne using the username provided above. I understand unpaid applications will be deleted.</span>
                </label>
              </div>

              {error && <div className="text-red-500 text-sm font-mono bg-red-950/30 p-3 border border-red-900">{error}</div>}

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={!isFormValid || isSubmitting}
                className={`w-full py-4 font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-base md:text-lg transition-all duration-300 ${
                  isFormValid && !isSubmitting 
                    ? 'bg-pink-600 text-white hover:bg-white hover:text-pink-600 hover:shadow-[0_0_20px_#ff1493] cursor-pointer' 
                    : 'bg-neutral-900 text-neutral-600 border border-neutral-800 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? 'Transmitting...' : 'Submit to Admin'}
              </button>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
}