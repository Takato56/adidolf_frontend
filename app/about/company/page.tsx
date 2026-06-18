export default function Company() {
  const milestones = [
    {
      year: "2019",
      event: "Founded with a focus on statement-driven fashion — clothing designed to reflect identity, culture, and personal expression.",
    },
    {
      year: "2020",
      event: "First product line launched. Sold out within the first week. Restocking followed shortly after.",
    },
    {
      year: "2021",
      event: "Expanded international shipping to over 20 countries, with a growing customer base across Europe and North America.",
    },
    {
      year: "2022",
      event: "Introduced the accessories line, responding to customer demand for a complete head-to-toe offering.",
    },
    {
      year: "2023",
      event: "Surpassed 10,000 orders. Launched a loyalty program and expanded the team across product, operations, and support.",
    },
    {
      year: "2024",
      event: "Launched new seasonal collections and redesigned the storefront to better reflect the brand's visual identity.",
    },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-10 text-center">
        <p className="text-xs uppercase tracking-widest text-blue-500 font-semibold mb-2">
          About
        </p>
        <h1 className="text-3xl font-bold text-gray-900">Company</h1>
        <p className="text-gray-500 text-sm mt-2">
          Who we are and where we came from.
        </p>
      </div>

      {/* Who we are */}
      <div className="mb-10 space-y-4 text-gray-600 text-sm leading-relaxed">
        <p>
          Adidolf is a fashion-forward e-commerce platform built on the premise
          that clothing can carry a message — and that the message doesn't
          have to be subtle.
        </p>
        <p>
          We design and source pieces for people who want their wardrobe to say
          something. Whether that's a cultural reference, a mood, or just an
          appreciation for a well-structured lapel, we have something for you.
        </p>
        <p>
          Our headquarters are in Nuremberg, Germany. We operate entirely online
          and ship to customers across the world, with a focus on quality
          materials, deliberate design, and a straightforward shopping experience.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          { stat: "10,000+", label: "Orders shipped" },
          { stat: "20+", label: "Countries served" },
          { stat: "2019", label: "Year founded" },
        ].map(({ stat, label }) => (
          <div
            key={label}
            className="text-center border border-gray-100 rounded-xl py-5 px-3 bg-white hover:shadow-sm transition-shadow"
          >
            <p className="text-2xl font-bold text-gray-900">{stat}</p>
            <p className="text-xs text-gray-400 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-6">History</h2>
        <div className="space-y-0">
          {milestones.map(({ year, event }, i) => (
            <div key={year} className="flex gap-5">
              <div className="flex flex-col items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 flex-shrink-0 mt-1" />
                {i < milestones.length - 1 && (
                  <div className="w-px flex-1 bg-gray-100 my-1" />
                )}
              </div>
              <div className="pb-6">
                <p className="text-xs font-semibold text-blue-500 mb-1">{year}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{event}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}