import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, BookOpen, UserCheck, ShieldCheck, ArrowRight } from 'lucide-react';
import LaptopIllustration from '../components/LaptopIllustration';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Navbar */}
            <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent"
                        >
                            InternPortal
                        </motion.div>
                        <div className="flex space-x-4">
                            <Link to="/login" className="px-6 py-2 rounded-full bg-primary-600 text-white font-medium hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/30 hover:shadow-primary-600/40">
                                Login
                            </Link>
                            <Link to="/register" className="px-6 py-2 rounded-full text-primary-600 font-medium hover:bg-primary-50 transition-colors border border-primary-100">
                                Register
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative overflow-hidden bg-secondary-50 pt-16 pb-32">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                    {/* Abstract Background Shapes */}
                    <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary-200/50 blur-3xl"></div>
                    <div className="absolute top-20 -left-20 w-72 h-72 rounded-full bg-blue-200/50 blur-3xl"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-6"
                    >
                        Manage Internships <br />
                        <span className="text-primary-600">Like a Pro</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-xl text-gray-600 max-w-2xl mb-10"
                    >
                        A unified platform for students, companies, and faculty to streamline the academic internship lifecycle. From application to certification.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="flex gap-4 mb-16"
                    >
                        <Link to="/register" className="flex items-center px-8 py-3 rounded-full bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-all shadow-xl">
                            Get Started <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                        <a href="#features" className="px-8 py-3 rounded-full bg-white text-gray-900 font-semibold border border-gray-200 hover:bg-gray-50 transition-all shadow-sm">
                            Learn More
                        </a>
                    </motion.div>

                    {/* 3D Laptop Illustration */}
                    <div className="w-full mt-10">
                        <LaptopIllustration />
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div id="features" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Features</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            Everything you need
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <FeatureCard
                            icon={Briefcase}
                            title="Internship Workflow"
                            desc="End-to-end management from posting requirements to final selection."
                            delay={0.1}
                        />
                        <FeatureCard
                            icon={UserCheck}
                            title="Role-Based Access"
                            desc="Dedicated dashboards for Students, Faculty, Companies, and Admins."
                            delay={0.2}
                        />
                        <FeatureCard
                            icon={BookOpen}
                            title="Weekly Reports"
                            desc="Students submit progress, mentors review and provide feedback digitally."
                            delay={0.3}
                        />
                        <FeatureCard
                            icon={ShieldCheck}
                            title="Certification"
                            desc="Automated certificate generation upon successful completion and evaluation."
                            delay={0.4}
                        />
                    </div>
                </div>
            </div>

        </div>
    );
};

const FeatureCard = ({ icon: Icon, title, desc, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay }}
        className="p-6 bg-secondary-50 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100"
    >
        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 text-primary-600">
            <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{desc}</p>
    </motion.div>
);

export default LandingPage;
