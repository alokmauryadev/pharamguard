"use client";

import { useEffect, useState } from "react";
import { Dna } from "lucide-react";

export function SplashScreen() {
    const [show, setShow] = useState(true);
    const [isFadingOut, setIsFadingOut] = useState(false);

    useEffect(() => {
        // Start fading out after 2 seconds
        const fadeTimer = setTimeout(() => {
            setIsFadingOut(true);
        }, 2000);

        // Remove from DOM after 2.5 seconds (allowing 500ms for fade out)
        const removeTimer = setTimeout(() => {
            setShow(false);
        }, 2500);

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(removeTimer);
        };
    }, []);

    if (!show) return null;

    return (
        <div
            className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-950 transition-opacity duration-500 ease-in-out ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}
        >
            <div className="relative flex items-center justify-center">
                {/* Glowing effect behind logo */}
                <div className="absolute inset-0 bg-emerald-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>

                {/* Logo container */}
                <div className="relative flex flex-col items-center gap-8 animate-in slide-in-from-bottom-8 fade-in-0 duration-1000">
                    <div
                        className="flex items-center justify-center w-28 h-28 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-3xl"
                        style={{ boxShadow: '0 0 50px rgba(16,185,129,0.3)' }}
                    >
                        <Dna className="w-14 h-14 text-white animate-pulse" />
                    </div>

                    <div className="text-center space-y-4">
                        <h1 className="text-5xl font-extrabold tracking-tight text-white flex items-baseline justify-center gap-1">
                            PharmaGuard
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        </h1>

                        <p
                            className="text-emerald-400 text-sm font-medium uppercase animate-pulse"
                            style={{ letterSpacing: '0.2em' }}
                        >
                            Precision Medicine AI
                        </p>
                    </div>

                    {/* Loading bar */}
                    <div className="w-64 h-1.5 overflow-hidden bg-slate-800 rounded-full mt-4">
                        <div className="h-full bg-emerald-500 rounded-full animate-progress" style={{ width: '100%' }}>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
