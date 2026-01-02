const colors = [
  "bg-[#13d9a1]/20 text-[#13d9a1] border-[#13d9a1]/10",
  "bg-[#f7c32e]/20 text-[#f7c32e] border-[#f7c32e]/10",
  "bg-[#1d8cd6]/20 text-[#1d8cd6] border-[#1d8cd6]/10",
  "bg-[#925fe2]/20 text-[#925fe2] border-[#925fe2]/10",
  "bg-[#ff7f50]/20 text-[#ff7f50] border-[#ff7f50]/10",
];

const SkillsSection = ({ skills }) => (
  <section className="bg-white rounded-xl p-5 shadow-sm border">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-bold">Skills & Technologies</h3>
      <button className="text-[#032f60] text-sm font-semibold hover:underline">+ Add Skill</button>
    </div>
    <div className="flex flex-wrap gap-2 mt-3">
      {skills.length ? skills.map((skill, i) => (
        <span
          key={skill}
          className={`px-3 py-1 text-sm rounded-full border font-medium ${colors[i % colors.length]}`}
        >
          {typeof skill === "string" ? skill : skill.name}
        </span>
      )) : (
        <span className="text-gray-400">No skills</span>
      )}
    </div>
  </section>
);
export default SkillsSection;
