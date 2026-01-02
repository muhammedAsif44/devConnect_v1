import React from "react";

const PostSkills = ({ skills }) => {
  const getSkillNames = () => {
    if (!skills || skills.length === 0) return [];

    const skillNames = [];
    for (const skill of skills) {
      let skillName = null;

      if (typeof skill === "string") {
        if (!skill.match(/^[0-9a-fA-F]{24}$/)) {
          skillName = skill;
        }
      } else if (skill && typeof skill === "object") {
        skillName = skill.name || skill.skill || skill.skillName || null;
      }

      if (skillName && typeof skillName === "string" && skillName.trim().length > 0) {
        skillNames.push(skillName.trim());
      }
    }
    return skillNames;
  };

  const skillNames = getSkillNames();

  if (skillNames.length === 0) return null;

  return (
    <div className="px-4 md:px-6 pb-3 flex flex-wrap gap-2">
      {skillNames.slice(0, 3).map((skillName, i) => (
        <span
          key={`skill-${i}-${skillName}`}
          className="px-2 md:px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded-full font-medium border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer"
        >
          {skillName}
        </span>
      ))}
      {skillNames.length > 3 && (
        <span className="px-2 md:px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full font-medium">
          +{skillNames.length - 3}
        </span>
      )}
    </div>
  );
};

export default PostSkills;
