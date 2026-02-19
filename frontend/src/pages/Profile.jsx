import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { User, Mail, Briefcase, Globe, MapPin, BookOpen, Link as LinkIcon, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState({});
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data } = await api.get('/users/profile');
            setUser(data.user);
            setProfile(data.profile || {});
        } catch (error) {
            console.error(error);
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (['name', 'email'].includes(name)) {
            setUser({ ...user, [name]: value });
        } else if (name.startsWith('education.')) {
            const field = name.split('.')[1];
            setProfile(prev => ({
                ...prev,
                education: {
                    ...prev.education,
                    [field]: field === 'startYear' || field === 'endYear' || field === 'cgpa'
                        ? (value === '' ? undefined : (field === 'cgpa' ? parseFloat(value) : parseInt(value)))
                        : value
                }
            }));
        } else {
            setProfile({ ...profile, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...user,
                ...profile,
                skills: typeof profile.skills === 'string' ? profile.skills : profile.skills?.join(', '),
                expertise: typeof profile.expertise === 'string' ? profile.expertise : profile.expertise?.join(', ')
            };

            const { data } = await api.put('/users/profile', payload);
            setUser(data.user);
            setProfile(data.profile || {});
            setIsEditing(false);
            toast.success('Profile updated successfully');
        } catch (error) {
            console.error(error);
            toast.error('Failed to update profile');
        }
    };

    if (loading) return <div>Loading profile...</div>;

    const role = user?.role;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize mt-2">
                        {role?.replace('_', ' ')}
                    </span>
                </div>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`px-4 py-2 rounded-md ${isEditing ? 'bg-gray-200 text-gray-800' : 'bg-primary-600 text-white'}`}
                >
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
            </div>

            <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 space-y-6">
                {/* Common User Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                name="name"
                                value={user?.name || ''}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md disabled:bg-gray-50"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email Address</label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="email"
                                name="email"
                                value={user?.email || ''}
                                onChange={handleChange}
                                disabled={!isEditing} // Email usually shouldn't be changed easily, but allowing for now or readonly
                                className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md disabled:bg-gray-50"
                            />
                        </div>
                    </div>
                </div>

                <hr className="border-gray-200" />

                {/* Role Specific Fields */}
                {role === 'student' && (
                    <>
                        <h3 className="text-lg font-medium text-gray-900">Student Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Resume URL</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FileText className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="url"
                                        name="resumeUrl"
                                        value={profile?.resumeUrl || ''}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        placeholder="https://drive.google.com/..."
                                        className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md disabled:bg-gray-50"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Portfolio URL</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <LinkIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="url"
                                        name="portfolioUrl"
                                        value={profile?.portfolioUrl || ''}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        placeholder="https://yourportfolio.com"
                                        className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md disabled:bg-gray-50"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">GitHub URL</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <LinkIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="url"
                                        name="githubUrl"
                                        value={profile?.githubUrl || ''}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        placeholder="https://github.com/username"
                                        className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md disabled:bg-gray-50"
                                    />
                                </div>
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Skills (comma separated)</label>
                                <input
                                    type="text"
                                    name="skills"
                                    value={Array.isArray(profile?.skills) ? profile.skills.join(', ') : profile?.skills || ''}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    placeholder="JavaScript, React, Node.js, Python..."
                                    className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md disabled:bg-gray-50 p-2 border"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Degree</label>
                                <input
                                    type="text"
                                    name="education.degree"
                                    value={profile?.education?.degree || ''}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    placeholder="B.Tech, B.E., etc."
                                    className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md disabled:bg-gray-50 p-2 border"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Institution</label>
                                <input
                                    type="text"
                                    name="education.institution"
                                    value={profile?.education?.institution || ''}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    placeholder="College/University name"
                                    className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md disabled:bg-gray-50 p-2 border"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Start Year</label>
                                <input
                                    type="number"
                                    name="education.startYear"
                                    value={profile?.education?.startYear || ''}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    placeholder="2020"
                                    min="2000"
                                    max="2030"
                                    className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md disabled:bg-gray-50 p-2 border"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">End Year (Expected)</label>
                                <input
                                    type="number"
                                    name="education.endYear"
                                    value={profile?.education?.endYear || ''}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    placeholder="2024"
                                    min="2000"
                                    max="2030"
                                    className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md disabled:bg-gray-50 p-2 border"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">CGPA</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="10"
                                    name="education.cgpa"
                                    value={profile?.education?.cgpa || ''}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    placeholder="8.5"
                                    className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md disabled:bg-gray-50 p-2 border"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700">About / Bio</label>
                                <textarea
                                    name="about"
                                    rows="3"
                                    value={profile?.about || ''}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    placeholder="Tell us about yourself, your interests, and goals..."
                                    className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md disabled:bg-gray-50 p-2 border"
                                ></textarea>
                            </div>
                        </div>
                    </>
                )}

                {role === 'company' && (
                    <>
                        <h3 className="text-lg font-medium text-gray-900">Company Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Company Name (Display)</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Briefcase className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="companyName"
                                        value={profile?.companyName || user?.name || ''}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md disabled:bg-gray-50"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Website</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Globe className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="url"
                                        name="website"
                                        value={profile?.website || ''}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md disabled:bg-gray-50"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Domain / Industry</label>
                                <input
                                    type="text"
                                    name="domain"
                                    value={profile?.domain || ''}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md disabled:bg-gray-50 p-2 border"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Location</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MapPin className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="location"
                                        value={profile?.location || ''}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md disabled:bg-gray-50"
                                    />
                                </div>
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    name="description"
                                    rows="4"
                                    value={profile?.description || ''}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md disabled:bg-gray-50 p-2 border"
                                ></textarea>
                            </div>
                        </div>
                    </>
                )}

                {role === 'faculty' && (
                    <>
                        <h3 className="text-lg font-medium text-gray-900">Faculty Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Department</label>
                                <input
                                    type="text"
                                    name="department"
                                    value={profile?.department || ''}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    placeholder="Computer Science, Electronics, etc."
                                    className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md disabled:bg-gray-50 p-2 border"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Designation</label>
                                <input
                                    type="text"
                                    name="designation"
                                    value={profile?.designation || ''}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    placeholder="Professor, Associate Professor, etc."
                                    className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md disabled:bg-gray-50 p-2 border"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Employee ID</label>
                                <input
                                    type="text"
                                    name="employeeId"
                                    value={profile?.employeeId || ''}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    placeholder="EMP001"
                                    className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md disabled:bg-gray-50 p-2 border"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Subject Specialization (comma separated)</label>
                                <input
                                    type="text"
                                    name="subjectSpecialization"
                                    value={Array.isArray(profile?.subjectSpecialization) ? profile.subjectSpecialization.join(', ') : profile?.subjectSpecialization || ''}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    placeholder="Data Structures, Algorithms, Machine Learning..."
                                    className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md disabled:bg-gray-50 p-2 border"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700">About / Bio</label>
                                <textarea
                                    name="about"
                                    rows="4"
                                    value={profile?.about || ''}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    placeholder="Your teaching experience, research interests, achievements..."
                                    className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md disabled:bg-gray-50 p-2 border"
                                ></textarea>
                            </div>
                        </div>
                    </>
                )}

                {role === 'external_mentor' && (
                    <>
                        <h3 className="text-lg font-medium text-gray-900">External Mentor Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Company / Organization</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Briefcase className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="companyName"
                                        value={profile?.companyName || user?.name || ''}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        placeholder="Current company name"
                                        className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md disabled:bg-gray-50"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Designation / Role</label>
                                <input
                                    type="text"
                                    name="designation"
                                    value={profile?.designation || ''}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    placeholder="Senior Developer, Tech Lead, etc."
                                    className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md disabled:bg-gray-50 p-2 border"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Industry / Domain</label>
                                <input
                                    type="text"
                                    name="domain"
                                    value={profile?.domain || ''}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    placeholder="Software, FinTech, Healthcare, etc."
                                    className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md disabled:bg-gray-50 p-2 border"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Years of Experience</label>
                                <input
                                    type="number"
                                    name="experience"
                                    value={profile?.experience || ''}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    placeholder="5"
                                    min="0"
                                    className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md disabled:bg-gray-50 p-2 border"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">LinkedIn Profile</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <LinkIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="url"
                                        name="linkedinUrl"
                                        value={profile?.linkedinUrl || ''}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        placeholder="https://linkedin.com/in/username"
                                        className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md disabled:bg-gray-50"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Location</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MapPin className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="location"
                                        value={profile?.location || ''}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        placeholder="City, Country"
                                        className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md disabled:bg-gray-50"
                                    />
                                </div>
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Expertise Areas (comma separated)</label>
                                <input
                                    type="text"
                                    name="expertise"
                                    value={Array.isArray(profile?.expertise) ? profile.expertise.join(', ') : profile?.expertise || ''}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    placeholder="Full Stack Development, Cloud Architecture, DevOps..."
                                    className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md disabled:bg-gray-50 p-2 border"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700">About / Bio</label>
                                <textarea
                                    name="about"
                                    rows="4"
                                    value={profile?.about || ''}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    placeholder="Your professional background, mentoring experience, and areas you can help students with..."
                                    className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md disabled:bg-gray-50 p-2 border"
                                ></textarea>
                            </div>
                        </div>
                    </>
                )}

                {role === 'evaluator' && (
                    <>
                        <h3 className="text-lg font-medium text-gray-900">Evaluator Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Department</label>
                                <input
                                    type="text"
                                    name="department"
                                    value={profile?.department || ''}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    placeholder="Computer Science, etc."
                                    className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md disabled:bg-gray-50 p-2 border"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Designation</label>
                                <input
                                    type="text"
                                    name="designation"
                                    value={profile?.designation || ''}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    placeholder="Professor, External Examiner, etc."
                                    className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md disabled:bg-gray-50 p-2 border"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Years of Experience</label>
                                <input
                                    type="number"
                                    name="experience"
                                    value={profile?.experience || ''}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    placeholder="10"
                                    min="0"
                                    className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md disabled:bg-gray-50 p-2 border"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Expertise Areas (comma separated)</label>
                                <input
                                    type="text"
                                    name="expertise"
                                    value={Array.isArray(profile?.expertise) ? profile.expertise.join(', ') : profile?.expertise || ''}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    placeholder="AI, Machine Learning, Web Security..."
                                    className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md disabled:bg-gray-50 p-2 border"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700">About / Bio</label>
                                <textarea
                                    name="about"
                                    rows="4"
                                    value={profile?.about || ''}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    placeholder="Brief introduction..."
                                    className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md disabled:bg-gray-50 p-2 border"
                                ></textarea>
                            </div>
                        </div>
                    </>
                )}

                {/* Generic "No additional details" message for other roles */}
                {!['student', 'company', 'faculty', 'external_mentor', 'evaluator'].includes(role) && (
                    <div className="text-gray-500 italic mt-4 p-4 bg-gray-50 rounded-md">
                        Additional profile details for {role?.replace('_', ' ')} are not yet configured. You can still update your basic account info above.
                    </div>
                )}

                {isEditing && (
                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                            Save Changes
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default Profile;
