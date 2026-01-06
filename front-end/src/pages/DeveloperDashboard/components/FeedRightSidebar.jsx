import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { searchUsers } from "../../../api/users";
import { Users, Code, ArrowRight, UserPlus, X } from "lucide-react";
import toast from "react-hot-toast";
import { sendFriendRequest } from "../../../api/friendRequestApi";

const SidebarSection = ({ title, icon: Icon, users, type, onConnect, linkTo }) => {
    if (users.length === 0) return null;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-blue-600" />
                    <h3 className="font-bold text-gray-800">{title}</h3>
                </div>
                <Link
                    to={linkTo}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                    View All <ArrowRight className="w-3 h-3" />
                </Link>
            </div>

            <div className="flex flex-col gap-3">
                {users.slice(0, 3).map((user) => (
                    <div key={user._id} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors group relative">
                        <Link to={`/profile/${user._id}`} className="flex-shrink-0">
                            <img
                                src={user.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
                                alt={user.name}
                                className="w-10 h-10 rounded-full object-cover border border-gray-100"
                            />
                        </Link>

                        <div className="flex-1 min-w-0">
                            <Link to={`/profile/${user._id}`}>
                                <h4 className="font-semibold text-sm text-gray-900 truncate hover:text-blue-600">
                                    {user.name}
                                </h4>
                            </Link>
                            <p className="text-xs text-gray-500 truncate mb-1">
                                {user.role === 'mentor' ? 'Senior Mentor' : user.headline || 'Developer'}
                            </p>

                            <div className="flex flex-wrap gap-1">
                                {user.skills?.slice(0, 2).map((skill, i) => (
                                    <span key={i} className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
                                        {typeof skill === 'string' ? skill : skill.name}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={() => onConnect(user)}
                            className="absolute right-2 top-2 p-1.5 text-blue-600 hover:bg-blue-50 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                            title="Connect"
                        >
                            <UserPlus className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const FeedRightSidebar = () => {
    const [mentors, setMentors] = useState([]);
    const [developers, setDevelopers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Request Modal State
    const [selectedUser, setSelectedUser] = useState(null);
    const [requestMessage, setRequestMessage] = useState("");
    const [sending, setSending] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [mentorsData, developersData] = await Promise.all([
                    searchUsers({ role: "mentor", limit: 5 }),
                    searchUsers({ role: "developer", limit: 5 })
                ]);
                setMentors(mentorsData.users || []);
                setDevelopers(developersData.users || []);
            } catch (error) {
                console.error("Failed to fetch sidebar users", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleConnectClick = (user) => {
        setSelectedUser(user);
        setRequestMessage(`Hi ${user.name}, I'd like to connect with you!`);
    };

    const handleSendRequest = async () => {
        if (!selectedUser) return;
        setSending(true);
        try {
            await sendFriendRequest(selectedUser._id, requestMessage);
            toast.success("Connection request sent!");

            // Optimistic update: Remove user from the list or update status
            if (selectedUser.role === 'mentor') {
                setMentors(prev => prev.filter(u => u._id !== selectedUser._id));
            } else {
                setDevelopers(prev => prev.filter(u => u._id !== selectedUser._id));
            }

            setSelectedUser(null);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send request");
        } finally {
            setSending(false);
        }
    };

    if (loading) {
        return (
            <div className="w-full space-y-4 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-xl"></div>
                <div className="h-48 bg-gray-200 rounded-xl"></div>
            </div>
        );
    }

    return (
        <div className="w-full sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pb-10">
            <div className="mb-4">
                <h2 className="text-lg font-bold text-gray-800">Suggestions for You</h2>
                <p className="text-sm text-gray-500">People you might want to connect with</p>
            </div>

            <SidebarSection
                title="Suggested Mentors"
                icon={Users}
                users={mentors}
                type="mentor"
                onConnect={handleConnectClick}
                linkTo="/developer-dashboard?section=find&role=mentor"
            />

            <SidebarSection
                title="Developers to Connect"
                icon={Code}
                users={developers}
                type="developer"
                onConnect={handleConnectClick}
                linkTo="/developer-dashboard?section=find&role=developer"
            />

            {/* Quick Connect Modal */}
            {selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-xl w-full max-w-sm p-5 shadow-xl animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg">Connect with {selectedUser.name}</h3>
                            <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <textarea
                            value={requestMessage}
                            onChange={(e) => setRequestMessage(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg text-sm mb-4 h-24 focus:outline-none focus:border-blue-500 resize-none"
                            placeholder="Write a message..."
                        />

                        <div className="flex gap-2">
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="flex-1 py-2 text-gray-600 font-semibold hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSendRequest}
                                disabled={sending}
                                className="flex-1 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                {sending ? "Sending..." : "Send Request"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeedRightSidebar;
