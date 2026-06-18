export default function Careers() {
  const openings = [
    {
      title: "Senior Apparel Designer",
      dept: "Product",
      location: "Nuremberg, Germany (Remote Optional)",
      type: "Full-time",
      description:
        "Lead the design of new seasonal collections from concept to production-ready specs. You'll work closely with sourcing and brand to ensure every piece is visually cohesive and manufacturable. A strong portfolio and experience with garment construction are required.",
    },
    {
      title: "Brand & Marketing Manager",
      dept: "Marketing",
      location: "Remote",
      type: "Full-time",
      description:
        "Own Adidolf's brand voice across all channels — from campaign creative to product copy to social. You'll develop and execute marketing strategies that grow awareness and drive conversions, while keeping the brand identity sharp and consistent.",
    },
    {
      title: "Customer Support Specialist",
      dept: "Support",
      location: "Remote",
      type: "Part-time",
      description:
        "Handle customer inquiries across email and chat — covering orders, returns, sizing questions, and general support. You're calm under pressure, clear in your communication, and genuinely care about getting people sorted quickly.",
    },
    {
      title: "Logistics & Fulfillment Analyst",
      dept: "Operations",
      location: "Remote",
      type: "Contract",
      description:
        "Analyse and optimise our fulfilment pipeline across all active shipping regions. You'll work with carrier data, identify bottlenecks, and help us hit delivery targets as we scale into new markets. Experience with international logistics and customs requirements is a plus.",
    },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-10 text-center">
        <p className="text-xs uppercase tracking-widest text-blue-500 font-semibold mb-2">
          About
        </p>
        <h1 className="text-3xl font-bold text-gray-900">Careers</h1>
        <p className="text-gray-500 text-sm mt-2">
          Join the team. We have {openings.length} open roles.
        </p>
      </div>

      {/* Culture blurb */}
      <div className="bg-gray-50 rounded-xl p-6 mb-8 text-sm text-gray-600 leading-relaxed">
        <p>
          Working at Adidolf means being part of a small, focused team that
          cares deeply about fashion and the people who wear it. We move
          fast, value good judgment over process, and give people real
          ownership over their work. Benefits include a competitive salary,
          remote flexibility, and a generous staff discount.
        </p>
      </div>

      {/* Openings */}
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Open Positions
      </h2>
      <div className="space-y-3">
        {openings.map(({ title, dept, location, type, description }) => (
          <div
            key={title}
            className="border border-gray-100 rounded-xl p-5 bg-white hover:shadow-sm transition-shadow"
          >
            <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
              <p className="font-semibold text-gray-900 text-sm">{title}</p>
              <div className="flex gap-2">
                <span className="text-xs bg-blue-50 text-blue-600 font-medium px-2.5 py-0.5 rounded-full">
                  {dept}
                </span>
                <span className="text-xs bg-gray-100 text-gray-500 font-medium px-2.5 py-0.5 rounded-full">
                  {type}
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mb-2">{location}</p>
            <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
            <button className="mt-4 text-xs font-semibold text-blue-600 hover:underline cursor-pointer">
              Apply →
            </button>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 text-center mt-8">
        Don't see a fit? Send a speculative application to careers@adidolf.com
        and tell us what you'd bring to the team.
      </p>
    </div>
  );
}