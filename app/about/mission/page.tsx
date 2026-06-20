export default function MissionStatement() {
  const values = [
    {
      title: "Expression",
      body: "We believe what you wear is a statement. Our pieces are designed for people who dress with intention — not just for function, but for meaning.",
    },
    {
      title: "Boldness",
      body: "We don't make safe clothing. Every collection is built around a point of view, and we stand behind it with the design choices to match.",
    },
    {
      title: "Transparency",
      body: "We're honest about what we make, who makes it, and what it costs. No inflated markups dressed up as exclusivity.",
    },
    {
      title: "Quality",
      body: "Every product is made to last. We work with manufacturers who share our standards, and we don't compromise on materials to hit a lower price point.",
    },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-10 text-center">
        <p className="text-xs uppercase tracking-widest text-blue-500 font-semibold mb-2">
          About
        </p>
        <h1 className="text-3xl font-bold text-text-primary">Our Mission Statement</h1>
        <p className="text-text-muted text-sm mt-2">
          What we're here to do.
        </p>
      </div>

      {/* The statement */}
      <div className="bg-surface-accent border-l-4 border-blue-500 rounded-r-xl p-6 mb-10">
        <p className="text-text-secondary text-base leading-relaxed italic">
          "To provide fashion that means something — to people who want to mean
          something — at a price point that reflects the craft behind what
          we make."
        </p>
        <p className="text-xs text-text-muted mt-3">— Adidolf, est. 2019</p>
      </div>

      {/* Values */}
      <h2 className="text-lg font-semibold text-text-primary mb-5">Our Values</h2>
      <div className="space-y-1">
        {values.map(({ title, body }) => (
          <div
            key={title}
            className="border-b border-border-divider last:border-0 py-4"
          >
            <p className="font-semibold text-text-primary text-sm mb-1">{title}</p>
            <p className="text-sm text-text-muted leading-relaxed">{body}</p>
          </div>
        ))}
      </div>

      {/* Closing */}
      <div className="mt-10 text-center">
        <p className="text-sm text-text-muted leading-relaxed">
          Adidolf is headquartered in Hanoi, Vietnam. We ship worldwide
          and are committed to growing a brand that our customers are proud to wear.
        </p>
      </div>
    </div>
  );
}