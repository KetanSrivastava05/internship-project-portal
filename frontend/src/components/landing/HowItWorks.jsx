import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const steps = [
    { number: "01", title: "Create Profile", desc: "Sign up and build your academic or professional portfolio." },
    { number: "02", title: "Discover", desc: "Browse tailored internships and verified college projects." },
    { number: "03", title: "Apply & Track", desc: "Submit your application and monitor its status in real-time." },
    { number: "04", title: "Mentorship", desc: "Get assigned a mentor and submit weekly progress reports." }
];

export default function HowItWorks() {
    const sectionRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            const cards = gsap.utils.toArray('.step-card');

            // Set initial state
            gsap.set(cards, { opacity: 0, y: 50 });
            gsap.set('.hiw-title', { opacity: 0, y: 30 });

            // Animate title
            gsap.to('.hiw-title', {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                },
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power2.out"
            });

            // Animate cards
            gsap.to(cards, {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                },
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.2,
                ease: "power3.out"
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="py-32 bg-secondary-950 text-white relative overflow-hidden">
            {/* Subtle Grid */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiIGZpbGw9Im5vbmUiLz4KPHBhdGggZD0iTTAgMGg0MHYxbS00MC0xbTF2NDBIMSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz4KPC9zdmc+')] opacity-20" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-20 hiw-title">
                    <h2 className="text-sm text-primary-400 font-bold tracking-widest uppercase mb-4">Process</h2>
                    <h3 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">How It Works</h3>
                </div>

                <div ref={containerRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, idx) => (
                        <div key={idx} className="step-card bg-secondary-900/50 backdrop-blur-sm border border-secondary-800 p-8 rounded-[2rem] relative group hover:bg-secondary-800/50 hover:border-primary-500/50 transition-all duration-500">
                            <div className="text-6xl font-black text-white/5 mb-8 group-hover:text-primary-500/20 transition-colors duration-500 px-2 py-4">
                                {step.number}
                            </div>
                            <h4 className="text-2xl font-bold text-white mb-4 group-hover:text-primary-400 transition-colors">{step.title}</h4>
                            <p className="text-secondary-400 leading-relaxed text-lg">{step.desc}</p>

                            {idx < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-[40%] -right-4 w-8 h-[2px] bg-secondary-800 group-hover:bg-primary-500/50 transition-colors" />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
