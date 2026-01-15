import { create } from "zustand";

export const useCallStore = create((set) => ({
    callActive: false,
    incomingCall: null, // { fromUserId, offer }
    callRemoteUser: null, // { _id, name, profilePhoto }

    startVideoCall: (friend) => set({
        callActive: true,
        callRemoteUser: friend,
        incomingCall: null
    }),

    setIncomingCall: (data, callerInfo) => set({
        incomingCall: data,
        callRemoteUser: callerInfo || { _id: data.fromUserId, name: "Unknown User", profilePhoto: "/default-avatar.png" },
        callActive: true
    }),

    acceptCall: () => set({
        incomingCall: null,
        // callActive remains true
        // callRemoteUser remains set
    }),

    endCall: () => set({
        callActive: false,
        incomingCall: null,
        callRemoteUser: null
    })
}));
