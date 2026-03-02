import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Briefcase, BookOpen, UserCheck, ShieldCheck, ArrowRight, Building, GraduationCap, Users } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Hero3D from '../components/landing/Hero3D';
import HowItWorks from '../components/landing/HowItWorks';
import { Button } from '../components/ui/Button';
import { FadeUp, StaggerContainer, StaggerItem, SlideIn } from '../components/ui/AnimatedWrappers';

gsap.registerPlugin(ScrollTrigger);

const FeatureCard = ({ icon: Icon, title, desc }) => (
    <StaggerItem className="p-8 bg-white/60 backdrop-blur-lg rounded-[2rem] hover:bg-white hover:shadow-2xl transition-all duration-500 border border-primary-100 hover:border-primary-300 group cursor-pointer shadow-sm">
        <div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-primary-50 rounded-2xl flex items-center justify-center mb-6 text-primary-600 group-hover:scale-110 transition-transform duration-500 shadow-sm">
            <Icon className="w-7 h-7" />
        </div>
        <h3 className="text-2xl font-bold text-secondary-900 mb-3 group-hover:text-primary-600 transition-colors">{title}</h3>
        <p className="text-secondary-600 leading-relaxed text-lg">{desc}</p>
    </StaggerItem>
);

const RoleCard = ({ title, features, role, icon: Icon, colorClass }) => (
    <div className={`p-8 rounded-[2rem] border-2 ${colorClass} bg-white shadow-xl hover:-translate-y-2 transition-transform duration-500`}>
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg bg-gradient-to-br ${colorClass.replace('border-', 'from-').replace('-200', '') === 'from-blue' ? 'from-blue-500' : colorClass.replace('border-', 'from-').replace('-200', '') === 'from-indigo' ? 'from-indigo-500' : 'from-purple-500'} to-blue-600`}>
            <Icon className="w-8 h-8" />
        </div>
        <h3 className="text-3xl font-extrabold text-secondary-900 mb-4">{title}</h3>
        <ul className="space-y-4 mb-8">
            {features.map((f, i) => (
                <li key={i} className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-secondary-100 text-secondary-600 flex items-center justify-center mr-3 shrink-0 mt-1">
                        <ArrowRight className="w-3 h-3" />
                    </div>
                    <span className="text-secondary-700 text-[1.1rem]">{f}</span>
                </li>
            ))}
        </ul>
        <Link to="/register">
            <Button variant="outline" className="w-full text-lg h-14 rounded-xl border-secondary-300">Join as {role}</Button>
        </Link>
    </div>
);

function AnimatedCounter({ end, suffix = "", duration = 2.5 }) {
    const [count, setCount] = React.useState(0);
    const ref = useRef(null);

    useEffect(() => {
        let animationFrame;
        let startTime;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                const step = (timestamp) => {
                    if (!startTime) startTime = timestamp;
                    const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
                    const easeProgress = 1 - Math.pow(1 - progress, 4);

                    setCount(Math.floor(easeProgress * end));

                    if (progress < 1) {
                        animationFrame = requestAnimationFrame(step);
                    }
                };
                animationFrame = requestAnimationFrame(step);
                observer.disconnect();
            }
        });

        if (ref.current) observer.observe(ref.current);

        return () => {
            if (animationFrame) cancelAnimationFrame(animationFrame);
            observer.disconnect();
        };
    }, [end, duration]);

    return <span ref={ref}>{count}{suffix}</span>;
}

const LandingPage = () => {
    const { scrollYProgress } = useScroll();
    const yHero = useTransform(scrollYProgress, [0, 1], [0, 200]);

    useEffect(() => {
        // Subtle parallax for background elements
        gsap.to('.parallax-bg', {
            yPercent: 20,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero-section',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });
    }, []);

    return (
        <div className="min-h-screen bg-secondary-50 selection:bg-primary-500 selection:text-white">
            {/* Navbar */}
            <nav className="fixed w-full bg-white/80 backdrop-blur-xl z-50 border-b border-gray-200/50 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center space-x-2"
                        >
                            <div className="w-8 h-8 bg-primary-600 rounded-lg shadow-glow" />
                            <span className="text-2xl font-extrabold text-secondary-900 tracking-tight">InternPortal</span>
                        </motion.div>
                        <div className="flex space-x-4 items-center">
                            <Link to="/login" className="text-secondary-600 font-semibold hover:text-primary-600 transition-colors px-4">
                                Sign In
                            </Link>
                            <Link to="/register">
                                <Button variant="primary" size="default" className="shadow-3d hover:shadow-3d-hover active:shadow-3d-active">
                                    Get Started
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero-section relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-32 min-h-screen flex items-center">
                <div className="parallax-bg absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                    <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary-200/40 blur-[120px] animate-blob" />
                    <div className="absolute top-40 -left-20 w-[500px] h-[500px] rounded-full bg-blue-200/40 blur-[120px] animate-blob animation-delay-2000" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
                    <div className="text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center px-4 py-2 rounded-full bg-primary-50 border border-primary-100 text-primary-600 font-semibold text-sm mb-8 shadow-sm"
                        >
                            <span className="flex h-2 w-2 rounded-full bg-primary-500 mr-2 animate-pulse" />
                            The New Era of Internship Management
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
                            className="text-6xl md:text-7xl font-extrabold text-secondary-950 tracking-tight mb-6 leading-[1.1]"
                        >
                            Manage <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-500">Talent.</span> <br />
                            Empower <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">Growth.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                            className="text-xl md:text-2xl text-secondary-600 mb-10 max-w-2xl leading-relaxed font-medium mx-auto lg:mx-0"
                        >
                            A unified, dynamic platform bridging students, top companies, and faculty to streamline the entire academic internship lifecycle.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                        >
                            <Link to="/register">
                                <Button size="lg" className="w-full sm:w-auto text-lg px-8">
                                    Start Exploring <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                            <a href="#roles">
                                <Button variant="secondary" size="lg" className="w-full sm:w-auto text-lg px-8">
                                    View Roles
                                </Button>
                            </a>
                        </motion.div>
                    </div>

                    {/* 3D Hero */}
                    <div className="relative w-full h-full lg:h-auto z-20">
                        <FadeUp delay={0.4} duration={1}>
                            <Hero3D />
                        </FadeUp>
                    </div>
                </div>
            </section>

            {/* Metrics Section */}
            <section className="py-20 bg-white border-y border-secondary-200/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-secondary-100">
                        <div className="p-4">
                            <div className="text-5xl font-black text-primary-600 mb-2 tracking-tighter">
                                <AnimatedCounter end={10} suffix="k+" />
                            </div>
                            <div className="text-secondary-500 font-semibold tracking-wide uppercase text-sm">Active Students</div>
                        </div>
                        <div className="p-4">
                            <div className="text-5xl font-black text-primary-600 mb-2 tracking-tighter">
                                <AnimatedCounter end={500} suffix="+" />
                            </div>
                            <div className="text-secondary-500 font-semibold tracking-wide uppercase text-sm">Hiring Companies</div>
                        </div>
                        <div className="p-4">
                            <div className="text-5xl font-black text-primary-600 mb-2 tracking-tighter">
                                <AnimatedCounter end={98} suffix="%" />
                            </div>
                            <div className="text-secondary-500 font-semibold tracking-wide uppercase text-sm">Placement Rate</div>
                        </div>
                        <div className="p-4">
                            <div className="text-5xl font-black text-primary-600 mb-2 tracking-tighter">
                                <AnimatedCounter end={50} suffix="+" />
                            </div>
                            <div className="text-secondary-500 font-semibold tracking-wide uppercase text-sm">Partner Colleges</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <HowItWorks />

            {/* Core Features Overview */}
            <section className="py-32 bg-secondary-50 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <FadeUp className="text-center mb-20">
                        <h2 className="text-sm text-primary-600 font-bold tracking-widest uppercase mb-4">Platform Overview</h2>
                        <h3 className="text-4xl md:text-5xl font-extrabold text-secondary-900 tracking-tight">Everything You Need</h3>
                    </FadeUp>

                    <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <FeatureCard icon={Briefcase} title="Workflow Automation" desc="End-to-end internship lifecycle management, from posting to selection." />
                        <FeatureCard icon={UserCheck} title="Role-Specific UI" desc="Dedicated immersive dashboards tailored for Students, Faculty, and HR." />
                        <FeatureCard icon={BookOpen} title="Digital Reporting" desc="Students seamlessly submit progress, and mentors provide digital feedback." />
                        <FeatureCard icon={ShieldCheck} title="Smart Certification" desc="Automated, verifiable certificates generated instantly upon completion." />
                    </StaggerContainer>
                </div>
            </section>

            {/* Role Based Section */}
            <section id="roles" className="py-32 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <SlideIn direction="right" className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-secondary-900 tracking-tight mb-6">Designed for the Entire Ecosystem</h2>
                        <p className="text-xl text-secondary-500 max-w-3xl mx-auto">InternPortal offers specialized tools and views so everyone can perform at their best.</p>
                    </SlideIn>

                    <div className="grid lg:grid-cols-3 gap-10">
                        <RoleCard
                            title="For Students"
                            icon={GraduationCap}
                            role="Student"
                            colorClass="border-blue-200"
                            features={[
                                "Apply to premium internships",
                                "Request multiple industry mentors",
                                "Submit weekly milestone reports",
                                "Track application status in real-time"
                            ]}
                        />
                        <RoleCard
                            title="For Companies"
                            icon={Building}
                            role="Recruiter"
                            colorClass="border-indigo-200"
                            features={[
                                "Post exciting internship drives",
                                "Filter and shortlist top talent",
                                "Manage interview scheduling",
                                "Monitor intern progress post-hire"
                            ]}
                        />
                        <RoleCard
                            title="For Faculty"
                            icon={Users}
                            role="Internal Mentor"
                            colorClass="border-purple-200"
                            features={[
                                "Approve academic project requests",
                                "Grade weekly student submissions",
                                "Provide actionable digital feedback",
                                "Track entire batch performance"
                            ]}
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-primary-950 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary-900 via-primary-800 to-blue-900 z-0 opacity-80" />
                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <FadeUp>
                        <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-8 tracking-tight">Ready to Transform Your Journey?</h2>
                        <p className="text-xl text-primary-100 mb-12">Join thousands of students and leading organizations revolutionizing internship management today.</p>
                        <Link to="/register">
                            <Button size="lg" className="text-lg px-12 h-16 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.4)] bg-white text-primary-900 hover:bg-gray-50 border-none transition-all duration-300">
                                Create Free Account <ArrowRight className="ml-3 w-6 h-6" />
                            </Button>
                        </Link>
                    </FadeUp>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
