import React, { useEffect, useRef, useState, useCallback } from "react";
import { useCallStore } from "../../ZustandStore/callStore";  // Import Store
import {
    createPeerConnection,
    startLocalMedia,
    createSendOffer,
    handleIncomingOffer,
    handleAnswer,
    handleIceCandidate,
    endCall,
    toggleAudio,
    toggleVideo
} from "../../webrtc/call";
import { socket } from "../../socket/socket";

// Control Button Component
const ControlButton = ({ onClick, isActive, activeIcon, inactiveIcon, activeClass, inactiveClass, title }) => (
    <button
        onClick={onClick}
        className={`p-4 rounded-full shadow-lg backdrop-blur-md transition-all duration-300 transform hover:scale-110 ${isActive ? activeClass : inactiveClass}`}
        title={title}
    >
        {isActive ? activeIcon : inactiveIcon}
    </button>
);

const VideoCall = ({ activeUser, remoteUser, endCallHandler, isIncomingCall, incomingOffer }) => {
    // DEBUG LOG


    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const offerRef = useRef(incomingOffer); // Persist offer even if prop is cleared
    const { acceptCall } = useCallStore(); // Get action
    const callStartedRef = useRef(false); // Ref to track if call init has run

    // Update ref if incomingOffer changes (but only if it's not null)
    useEffect(() => {
        if (incomingOffer) {
            offerRef.current = incomingOffer;
        }
    }, [incomingOffer]);

    // State
    const [callStatus, setCallStatus] = useState(isIncomingCall ? "incoming" : "calling");
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [isCallAccepted, setIsCallAccepted] = useState(!isIncomingCall); // If outgoing, it's already "accepted" by us

    // Initialize Call (Signaling & Media)
    const initCall = useCallback(async () => {
        // Prevent double init in Strict Mode or re-renders
        if (callStartedRef.current) {

            return;
        }
        callStartedRef.current = true;



        // 1. Setup peer connection engine
        createPeerConnection(remoteVideoRef.current);

        // 2. Start local media
        try {
            await startLocalMedia(localVideoRef.current);

            // Use local state (or persisted ref) to determine if it WAS an incoming call initially
            // But checking 'isIncomingCall' prop might be false now if we cleared store.
            // So we use the fact that we are in "isCallAccepted" true branch.

            // We check if we have an offer to answer
            const offerToAnswer = offerRef.current;

            if (offerToAnswer) {
                // It's an incoming call we are answering

                await handleIncomingOffer(offerToAnswer, remoteUser._id, localVideoRef.current);
                setCallStatus("connected");
            } else {
                // It's an outgoing call

                await createSendOffer(remoteUser._id);
            }
        } catch (err) {
            console.error("Error starting media:", err);
        }
    }, [remoteUser._id]);

    // Handle Incoming Call Acceptance
    useEffect(() => {
        if (isCallAccepted) {
            initCall();
        }
    }, [isCallAccepted, initCall]);


    // Socket Event Listeners
    useEffect(() => {
        const onAnswer = (data) => {
            handleAnswer(data.answer);
            setCallStatus("connected");
        };

        const onIceCandidate = (data) => {
            handleIceCandidate(data.candidate);
        };

        const onEndCall = () => {
            cleanup();
            endCallHandler();
        };

        socket.on("webrtc-answer", onAnswer);
        socket.on("webrtc-ice-candidate", onIceCandidate);
        socket.on("call-ended", onEndCall);

        return () => {
            cleanup(); // Clean WebRTC resources on unmount
            socket.off("webrtc-answer", onAnswer);
            socket.off("webrtc-ice-candidate", onIceCandidate);
            socket.off("call-ended", onEndCall);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const cleanup = () => {
        endCall(localVideoRef.current, remoteVideoRef.current);
        callStartedRef.current = false; // Allow re-init on remount
    };

    const onHangup = () => {
        socket.emit("call-end", { toUserId: remoteUser._id });
        cleanup();
        endCallHandler();
    };

    const onAcceptCall = () => {
        setIsCallAccepted(true);
        acceptCall(); // Clear global incomingCall state so ringtone stops
    };

    const onToggleMute = () => {
        const newState = !isMuted;
        setIsMuted(newState);
        toggleAudio(!newState); // active means NOT muted
    };

    const onToggleVideo = () => {
        const newState = !isVideoOff;
        setIsVideoOff(newState);
        toggleVideo(!newState);
    };

    // Icons
    const MicOnIcon = (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
    );
    const MicOffIcon = (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
        </svg>
    );
    const VideoOnIcon = (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
    );
    const VideoOffIcon = (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
        </svg>
    );
    const PhoneIcon = (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
    );
    const HangupIcon = (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" /></svg>
    );

    return (
        <div className={`fixed inset-0 z-[60] flex items-center justify-center bg-gray-900 transition-all duration-300 ${isMinimized ? "invisible" : "visible"}`}>
            {/* Background Blur/Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-[#032f60] to-black opacity-90"></div>

            <div className="relative w-full h-full sm:p-4 flex flex-col">

                {/* Header Info */}
                <div className="absolute top-0 left-0 right-0 z-10 p-6 bg-gradient-to-b from-black/60 to-transparent flex justify-between items-start">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <img src={remoteUser.profilePhoto || "/default-avatar.png"} className="w-12 h-12 rounded-full border-2 border-white/20 shadow-lg" alt="" />
                            <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-black ${callStatus === 'connected' ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`}></div>
                        </div>
                        <div className="text-white">
                            <h3 className="text-xl font-bold tracking-wide">{remoteUser.name}</h3>
                            <p className="text-sm text-gray-300 font-medium opacity-80 uppercase tracking-widest">
                                {callStatus === 'connected' ? '00:00' : callStatus === 'incoming' ? 'Incoming Video Call' : 'Calling...'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* MAIN CONTENT AREA */}
                <div className="flex-1 relative flex items-center justify-center overflow-hidden rounded-none sm:rounded-3xl bg-black shadow-2xl border border-white/5">

                    {/* INCOMING CALL SCREEN - Shows if we haven't accepted yet AND we are the receiver */}
                    {(!isCallAccepted && !offerRef.current) && isIncomingCall ? (
                        /* 
                           Wait, if we use offerRef.current to detect incoming call nature, 
                           we must ensure correct logic.
                           If it is an incoming call, isCallAccepted is false initially.
                           State: isCallAccepted = false.
                        */
                        <div className="flex flex-col items-center gap-8 z-50">
                            <img src={remoteUser.profilePhoto || "/default-avatar.png"} className="w-40 h-40 rounded-full border-4 border-white/20 shadow-2xl animate-pulse" alt="" />
                            <h2 className="text-2xl text-white font-semibold">Incoming Video Call from {remoteUser.name}</h2>
                            <div className="flex gap-8 mt-4">
                                <ControlButton
                                    onClick={onHangup}
                                    isActive={true}
                                    title="Decline"
                                    activeIcon={HangupIcon}
                                    inactiveIcon={null}
                                    activeClass="bg-red-600 hover:bg-red-700 text-white w-16 h-16"
                                    inactiveClass=""
                                />
                                <ControlButton
                                    onClick={onAcceptCall}
                                    isActive={true}
                                    title="Accept"
                                    activeIcon={PhoneIcon}
                                    inactiveIcon={null}
                                    activeClass="bg-green-500 hover:bg-green-600 text-white w-16 h-16 animate-bounce"
                                    inactiveClass=""
                                />
                            </div>
                        </div>
                    ) : !isCallAccepted && offerRef.current ? (
                        /* Case: It IS an incoming call (we have an offerRef), but we haven't accepted yet. */
                        <div className="flex flex-col items-center gap-8 z-50">
                            <img src={remoteUser.profilePhoto || "/default-avatar.png"} className="w-40 h-40 rounded-full border-4 border-white/20 shadow-2xl animate-pulse" alt="" />
                            <h2 className="text-2xl text-white font-semibold">Incoming Video Call from {remoteUser.name}</h2>
                            <div className="flex gap-8 mt-4">
                                <ControlButton
                                    onClick={onHangup}
                                    isActive={true}
                                    title="Decline"
                                    activeIcon={HangupIcon}
                                    inactiveIcon={null}
                                    activeClass="bg-red-600 hover:bg-red-700 text-white w-16 h-16"
                                    inactiveClass=""
                                />
                                <ControlButton
                                    onClick={onAcceptCall}
                                    isActive={true}
                                    title="Accept"
                                    activeIcon={PhoneIcon}
                                    inactiveIcon={null}
                                    activeClass="bg-green-500 hover:bg-green-600 text-white w-16 h-16 animate-bounce"
                                    inactiveClass=""
                                />
                            </div>
                        </div>
                    ) : (
                        /* VIDEO STREAMS (ACTIVE CALL) */
                        <>
                            {/* Poster / No Video State */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <img src={remoteUser.profilePhoto || "/default-avatar.png"} className={`w-32 h-32 rounded-full opacity-20 filter blur-xl animate-pulse ${callStatus === 'connected' ? 'hidden' : 'block'}`} alt="" />
                            </div>

                            <video
                                ref={remoteVideoRef}
                                autoPlay
                                playsInline
                                className="w-full h-full object-cover sm:object-contain"
                            />

                            {/* LOCAL VIDEO (PIP) */}
                            <div className="absolute top-24 right-4 sm:top-8 sm:right-8 w-32 sm:w-48 aspect-[3/4] sm:aspect-video bg-gray-800 rounded-xl overflow-hidden shadow-2xl border-2 border-white/10 group transition-all hover:scale-105 hover:border-white/30 z-20">
                                <video
                                    ref={localVideoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className={`w-full h-full object-cover transform scale-x-[-1] transition-opacity duration-300 ${isVideoOff ? 'opacity-0' : 'opacity-100'}`}
                                />
                                {isVideoOff && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-white/50 text-xs font-medium">
                                        Camera Off
                                    </div>
                                )}
                                <div className="absolute bottom-2 left-2 text-[10px] bg-black/50 px-2 py-0.5 rounded text-white/80 backdrop-blur-sm">You</div>
                            </div>

                            {/* BOTTOM CONTROLS BAR (Only in Active Call) */}
                            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 sm:gap-6 z-30">
                                <ControlButton
                                    onClick={onToggleMute}
                                    isActive={!isMuted}
                                    title={isMuted ? "Unmute" : "Mute"}
                                    activeIcon={MicOnIcon}
                                    inactiveIcon={MicOffIcon}
                                    activeClass="bg-gray-600/50 hover:bg-gray-500/50 text-white"
                                    inactiveClass="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50"
                                />

                                <ControlButton
                                    onClick={onHangup}
                                    isActive={true}
                                    title="End Call"
                                    activeIcon={HangupIcon}
                                    inactiveIcon={null}
                                    activeClass="bg-red-600 hover:bg-red-700 text-white shadow-red-900/50 scale-110"
                                    inactiveClass=""
                                />

                                <ControlButton
                                    onClick={onToggleVideo}
                                    isActive={!isVideoOff}
                                    title={isVideoOff ? "Turn Video On" : "Turn Video Off"}
                                    activeIcon={VideoOnIcon}
                                    inactiveIcon={VideoOffIcon}
                                    activeClass="bg-gray-600/50 hover:bg-gray-500/50 text-white"
                                    inactiveClass="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50"
                                />
                            </div>
                        </>
                    )}
                </div>

            </div>
        </div>
    );
};

export default VideoCall;
