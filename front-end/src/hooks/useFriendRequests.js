// import { useEffect, useState } from "react";
// import {
//   getPendingFriendRequests,
//   getSentFriendRequests,
//   acceptFriendRequest,
//   rejectFriendRequest,
//   cancelFriendRequest,
//   sendFriendRequest,
//   getFriends,          // <-- new API call for getting connected friends
// } from "../api/friendRequestApi";

// // Hook for pending/received/sent requests
// export const useFriendRequests = (type = "received") => {
//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchRequests = async () => {
//     setLoading(true);
//     try {
//       const data = type === "sent"
//         ? await getSentFriendRequests()
//         : await getPendingFriendRequests();
//       setRequests(data);
//     } catch (error) {
//       console.error("Error fetching friend requests:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const accept = async (id) => {
//     await acceptFriendRequest(id);
//     setRequests((prev) => prev.filter((r) => (r.sender?._id || r.receiver?._id) !== id));
//     // Notify other parts of the app that the friends list changed
//     try {
//       window.dispatchEvent(new CustomEvent("friends:changed"));
//     // eslint-disable-next-line no-unused-vars
//     } catch (_) {
//       // no-op in non-browser environments
//     }
//   };

//   const reject = async (id) => {
//     await rejectFriendRequest(id);
//     setRequests((prev) => prev.filter((r) => (r.sender?._id || r.receiver?._id) !== id));
//   };

//   const cancel = async (id) => {
//     await cancelFriendRequest(id);
//     setRequests((prev) => prev.filter((r) => (r.receiver?._id) !== id));
//   };

//   const send = async (recipientId) => {
//     await sendFriendRequest(recipientId);
//   };

//   useEffect(() => {
//     fetchRequests();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [type]);

//   return { requests, loading, fetchRequests, accept, reject, cancel, send };
// };

// // ======================
// // Hook for connected friends
// // ======================
// export const useFriends = () => {
//   const [friends, setFriends] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchFriends = async () => {
//     setLoading(true);
//     try {
//       const data = await getFriends();
//       setFriends(data);
//     } catch (error) {
//       console.error("Error fetching friends:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchFriends();
//     const onFriendsChanged = () => {
//       fetchFriends();
//     };
//     window.addEventListener("friends:changed", onFriendsChanged);
//     return () => {
//       window.removeEventListener("friends:changed", onFriendsChanged);
//     };
//   }, []);

//   return { friends, loading, fetchFriends };
// };

import { useEffect, useState } from "react";
import {
  getPendingFriendRequests,
  getSentFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  cancelFriendRequest,
  sendFriendRequest,
  getFriends,          // <-- new API call for getting connected friends
} from "../api/friendRequestApi";

// Hook for pending/received/sent requests
export const useFriendRequests = (type = "received") => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = type === "sent"
        ? await getSentFriendRequests()
        : await getPendingFriendRequests();
      setRequests(data);
    } catch (error) {
      console.error("Error fetching friend requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const accept = async (id) => {
    await acceptFriendRequest(id);
    setRequests((prev) => prev.filter((r) => (r.sender?._id || r.receiver?._id) !== id));
  };

  const reject = async (id) => {
    await rejectFriendRequest(id);
    setRequests((prev) => prev.filter((r) => (r.sender?._id || r.receiver?._id) !== id));
  };

  const cancel = async (id) => {
    await cancelFriendRequest(id);
    setRequests((prev) => prev.filter((r) => (r.receiver?._id) !== id));
  };

  const send = async (recipientId) => {
    await sendFriendRequest(recipientId);
  };

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  return { requests, loading, fetchRequests, accept, reject, cancel, send };
};

// ======================
// Hook for connected friends
// ======================
export const useFriends = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFriends = async () => {
    setLoading(true);
    try {
      const data = await getFriends();
      setFriends(data);
    } catch (error) {
      console.error("Error fetching friends:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  return { friends, loading, fetchFriends };
};

