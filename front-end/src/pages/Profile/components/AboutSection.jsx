const AboutSection = ({ bio }) => (
  <section className="bg-white rounded-xl p-5 shadow-sm border">
    <h3 className="text-lg font-bold mb-2">About</h3>
    <p className="text-gray-800">{bio || "No bio provided."}</p>
  </section>
);
export default AboutSection;
