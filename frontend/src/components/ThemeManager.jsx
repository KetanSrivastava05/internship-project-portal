import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Color Palettes
const themes = {
    // Brand Default (Original Blue)
    brand: {
        50: '#f0f9ff',
        100: '#e0f2fe',
        200: '#bae6fd',
        300: '#7dd3fc',
        400: '#38bdf8',
        500: '#0ea5e9',
        600: '#0284c7',
        700: '#0369a1',
        800: '#075985',
        900: '#0c4a6e',
        950: '#082f49',
    },
    // Default (Student) - Calm Green
    student: {
        50: '#f0fdf4',
        100: '#dcfce7',
        200: '#bbf7d0',
        300: '#86efac',
        400: '#4ade80',
        500: '#22c55e',
        600: '#22c55e',
        700: '#16a34a',
        800: '#15803d',
        900: '#14532d',
        950: '#052e16',
    },
    // Company - Corporate Blue
    company: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb', // Primary Action
        700: '#1d4ed8', // Hover
        800: '#1e40af',
        900: '#1e3a8a',
        950: '#172554',
    },
    // Academic (Faculty/Mentor/Evaluator) - Purple
    educational: {
        50: '#f5f3ff',
        100: '#ede9fe',
        200: '#ddd6fe',
        300: '#c4b5fd',
        400: '#a78bfa',
        500: '#8b5cf6',
        600: '#7c3aed', // Primary Action
        700: '#6d28d9', // Hover
        800: '#5b21b6',
        900: '#4c1d95',
        950: '#2e1065',
    },
    // Admin (College/TPO/System) - Red/Authority
    admin: {
        50: '#fef2f2',
        100: '#fee2e2',
        200: '#fecaca',
        300: '#fca5a5',
        400: '#f87171',
        500: '#ef4444',
        600: '#dc2626', // Primary Action
        700: '#b91c1c', // Hover
        800: '#991b1b',
        900: '#7f1d1d',
        950: '#450a0a',
    }
};

const ThemeManager = () => {
    const { user } = useAuth();
    const location = useLocation();

    useEffect(() => {
        const root = document.documentElement;
        let palette = themes.brand; // Default to Brand Blue

        // Force Brand theme on Landing Page
        if (location.pathname === '/') {
            palette = themes.brand;
        }
        else if (user) {
            switch (user.role) {
                case 'student':
                    palette = themes.student;
                    break;
                case 'company':
                    palette = themes.company;
                    break;
                case 'faculty':
                case 'external_mentor':
                case 'evaluator':
                    palette = themes.educational;
                    break;
                case 'college_admin':
                case 'tpo':
                case 'system_admin':
                    palette = themes.admin;
                    break;
                default:
                    palette = themes.brand;
            }
        } else {
            // Logged out default
            palette = themes.brand;
        }

        // Apply variables
        Object.keys(palette).forEach(key => {
            root.style.setProperty(`--color-primary-${key}`, palette[key]);
        });

    }, [user, location.pathname]);

    return null; // Logic only component
};

export default ThemeManager;
