import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserProfile } from "../../api/users";
import ProfileHeader from "../Profile/components/ProfileHeader";
import AboutSection from "../Profile/components/AboutSection";
import SkillsSection from "../Profile/components/SkillSection";
import LinksSection from "../Profile/components/LinksSection";
import PostsSection from "../Profile/components/PostSection";

const ProfilePage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await getUserProfile(id);
        setUser(data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [id]);

  if (loading) return <div className="p-10 text-center text-gray-500">Loading...</div>;
  if (!user) return <div className="p-10 text-center text-red-500">User not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 max-w-5xl mx-auto space-y-6">
      <ProfileHeader user={user} />
      <AboutSection bio={user.bio} />
      <SkillsSection skills={user.skills || []} />
      <LinksSection links={user.links || []} />
      <PostsSection posts={user.posts || []} />
    </div>
  );
};

export default ProfilePage;
