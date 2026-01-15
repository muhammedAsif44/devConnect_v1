import React, { useEffect, useRef } from "react";
import { socket } from "../socket/socket";
import { useCallStore } from "../ZustandStore/callStore";
import { useFriends } from "../hooks/useFriendRequests";
import { useAllUsers } from "../hooks/useAllUsers";
import VideoCall from "../components/videoCall/VideoCall";
import useAuthStore from "../ZustandStore/useAuthStore";
import { getUserProfile } from "../api/users";

const CallManager = () => {
    const { user } = useAuthStore();
    const {
        callActive,
        incomingCall,
        callRemoteUser,
        setIncomingCall,
        endCall
    } = useCallStore();

    const { friends } = useFriends();
    const { users: allUsers } = useAllUsers();

    // Audio ref for ringtone
    const ringtoneRef = useRef(null);

    // Global Socket Connection & Online Status
    const isConnectingRef = useRef(false);

    useEffect(() => {
        if (!user?._id) return;

        const handleConnect = () => {

            socket.emit("userOnline", user._id);
            isConnectingRef.current = false;
        };

        // Always ensure listener is bound
        socket.on("connect", handleConnect);

        // If already connected, emit online immediately
        if (socket.connected) {

            socket.emit("userOnline", user._id);
        } else if (!isConnectingRef.current) {

            isConnectingRef.current = true;
            socket.connect();
        }

        return () => {
            socket.off("connect", handleConnect);
            // We do not disconnect on unmount to preserve global connection
            isConnectingRef.current = false;
        };
    }, [user?._id]);

    useEffect(() => {
        if (!socket) return;

        // ... socket listener setup ...
        const handleIncomingCall = async (data) => {


            // Prevent self-call handling
            if (data.fromUserId === user?._id) {
                console.warn("Ignored incoming call from self.");
                return;
            }

            // ... rest of handler ...
            // Log known users to debug matching


            // Find the user details
            let caller = allUsers.find(u => u._id === data.fromUserId) || friends.find(f => f._id === data.fromUserId);

            // If not found, fetch profile
            if (!caller) {

                try {
                    caller = await getUserProfile(data.fromUserId);

                } catch (err) {
                    console.error("Failed to fetch caller profile:", err);
                }
            }

            setIncomingCall(data, caller);
        };

        socket.on("incoming-call", handleIncomingCall);

        return () => {
            socket.off("incoming-call", handleIncomingCall);
        };
    }, [socket, allUsers, friends, setIncomingCall, user?._id]);

    // Handle Ringtone
    useEffect(() => {
        // Initialize audio if not already done
        if (!ringtoneRef.current) {
            ringtoneRef.current = new Audio("/sounds/ringtone.mp3");
            ringtoneRef.current.loop = true;
        }

        // Play ringtone if there is an incoming call AND call is active (showing overlay)
        if (incomingCall && callActive) {
            ringtoneRef.current.play().catch(() => { });
        } else {
            // Stop ringtone if call accepted or ended
            ringtoneRef.current.pause();
            ringtoneRef.current.currentTime = 0;
        }

        // Cleanup on unmount
        return () => {
            if (ringtoneRef.current) {
                ringtoneRef.current.pause();
                ringtoneRef.current.currentTime = 0;
            }
        };
    }, [incomingCall, callActive]);

    if (!callActive || !callRemoteUser) return null;

    return (
        <VideoCall
            activeUser={user}
            remoteUser={callRemoteUser}
            endCallHandler={endCall}
            isIncomingCall={!!incomingCall}
            incomingOffer={incomingCall?.offer}
        />
    );
};

export default CallManager;
