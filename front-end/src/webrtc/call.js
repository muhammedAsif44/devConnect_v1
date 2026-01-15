import { socket } from "../socket/socket";

/**
 * =========================
 * GLOBAL STATE (ONE CALL)
 * =========================
 */

export let peerConnection = null;
let localStream = null;
let currentCallUserId = null;

// Queue to hold ICE candidates that arrive before Remote Description is set
let iceCandidateQueue = [];

/**
 * =========================
 * STUN CONFIGURATION
 * =========================
 */

const configuration = {
    iceServers: [
        { urls: "stun:stun.l.google.com:19302" }
    ]
};

/**
 * =========================
 * CREATE PEER CONNECTION
 * =========================
 */

export function createPeerConnection(remoteVideo) {
    peerConnection = new RTCPeerConnection(configuration);
    iceCandidateQueue = []; // Reset queue for new call

    // Send ICE candidates to other user
    peerConnection.onicecandidate = (event) => {
        if (event.candidate && currentCallUserId) {
            socket.emit("webrtc-ice-candidate", {
                toUserId: currentCallUserId,
                candidate: event.candidate
            });
        }
    };

    // Receive remote video stream
    peerConnection.ontrack = (event) => {
        if (remoteVideo) {
            remoteVideo.srcObject = event.streams[0];
        }
    };
}

/**
 * =========================
 * START CAMERA & MIC
 * =========================
 */

export async function startLocalMedia(localVideo) {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        });

        if (localVideo) {
            localVideo.srcObject = localStream;
        }

        // Check if peerConnection still exists (it might have been closed while awaiting media)
        if (peerConnection) {
            localStream.getTracks().forEach((track) => {
                peerConnection.addTrack(track, localStream);
            });
        } else {
            console.debug("PeerConnection closed before media could be added. Stopping tracks.");
            localStream.getTracks().forEach(track => track.stop());
        }
    } catch (err) {
        console.error("Error accessing media devices:", err);
        throw err;
    }
}

/**
 * =========================
 * CALLER: CREATE & SEND OFFER
 * =========================
 */

export async function createSendOffer(toUserId) {
    if (!peerConnection) return;
    currentCallUserId = toUserId;

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    // FIX: Emit 'call-user' to trigger 'incoming-call' on backend
    const payload = {
        toUserId,
        offer
    };




    if (!socket.connected) {
        console.error("createSendOffer FAILED: Socket is NOT connected!");
        alert("Connection lost. Please refresh the page.");
        return;
    }

    socket.emit("call-user", payload);

}

/**
 * =========================
 * RECEIVER: HANDLE OFFER
 * =========================
 */

export async function handleIncomingOffer(offer, fromUserId, localVideo) {
    if (!peerConnection) return;
    currentCallUserId = fromUserId;

    await peerConnection.setRemoteDescription(offer);
    await startLocalMedia(localVideo);

    // Process any queued ICE candidates now that we have a remote description
    await processIceQueue();

    if (!peerConnection) return; // Re-check after await
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    socket.emit("webrtc-answer", {
        toUserId: fromUserId,
        answer
    });
}

/**
 *  
 * CALLER: HANDLE ANSWER
 *  
 */

export async function handleAnswer(answer) {
    if (!peerConnection) {
        console.warn("handleAnswer ignored: PeerConnection is null");
        return;
    }

    try {
        if (peerConnection.signalingState === "stable") {
            console.warn("handleAnswer ignored: Signaling state is 'stable' (likely duplicate answer or race condition).");
            return;
        }


        await peerConnection.setRemoteDescription(answer);
        await processIceQueue();
    } catch (err) {
        console.error("handleAnswer Error:", err);
    }
}

/**
 *  
 * HANDLE ICE CANDIDATE
 *  
 */

export async function handleIceCandidate(candidate) {
    if (peerConnection) {
        // Check if remote description is set
        if (peerConnection.remoteDescription && peerConnection.remoteDescription.type) {
            try {
                await peerConnection.addIceCandidate(candidate);
            } catch (err) {
                console.error("Error adding ICE candidate:", err);
            }
        } else {
            // Queue it

            iceCandidateQueue.push(candidate);
        }
    }
}

async function processIceQueue() {
    if (!peerConnection) return;


    while (iceCandidateQueue.length > 0) {
        const candidate = iceCandidateQueue.shift();
        try {
            await peerConnection.addIceCandidate(candidate);
        } catch (err) {
            console.error("Error processing queued ICE candidate:", err);
        }
    }
}

/**
 *  
 * END CALL (CLEANUP)
 *  
 */

export function endCall(localVideo, remoteVideo) {
    if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
        localStream = null;
    }

    if (peerConnection) {
        peerConnection.close();
        peerConnection = null;
    }

    if (localVideo) localVideo.srcObject = null;
    if (remoteVideo) remoteVideo.srcObject = null;

    currentCallUserId = null;
    iceCandidateQueue = [];
}


export function toggleAudio(isEnabled) {
    if (localStream) {
        localStream.getAudioTracks().forEach(track => {
            track.enabled = isEnabled;
        });
    }
}

export function toggleVideo(isEnabled) {
    if (localStream) {
        localStream.getVideoTracks().forEach(track => {
            track.enabled = isEnabled;
        });
    }
}
