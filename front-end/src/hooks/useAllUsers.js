import { useEffect, useState } from "react";
import { searchUsers } from "../api/users";
import useAuthStore from "../ZustandStore/useAuthStore";

export const useAllUsers = () => {
  const { isPremium } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      // Only fetch if user is premium
      if (isPremium) {
        // Fetch mentors and developers separately
        const [mentorsResponse, developersResponse] = await Promise.all([
          searchUsers({ role: "mentor" }),
          searchUsers({ role: "developer" })
        ]);
        
        const mentors = mentorsResponse?.users || [];
        const developers = developersResponse?.users || [];
        
        // Combine and deduplicate users
        const allUsers = [...mentors, ...developers];
        const uniqueUsers = Array.from(
          new Map(allUsers.map(user => [user._id, user])).values()
        );
        
        setUsers(uniqueUsers);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching all users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, [isPremium]);

  return { users, loading, fetchAllUsers };
};