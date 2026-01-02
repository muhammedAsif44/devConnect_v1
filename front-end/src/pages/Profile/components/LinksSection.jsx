const LinksSection = ({ links }) => (
  <section className="bg-white rounded-xl p-5 shadow-sm border">
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-bold mb-2">Links</h3>
      <button className="text-[#032f60] text-sm font-semibold hover:underline">+ Add Link</button>
    </div>
    <ul className="space-y-1 mt-2">
      {links?.length ? links.map((link, idx) => (
        <li key={idx} className="flex items-center gap-2">
          <span className="text-gray-600">{link.label || link.name}:</span>
          <a 
            href={link.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-700 hover:underline text-sm"
          >
            {link.url}
          </a>
        </li>
      )) : (
        <li className="text-gray-400 text-sm">No links added</li>
      )}
    </ul>
  </section>
);
export default LinksSection;
