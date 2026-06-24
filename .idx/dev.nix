import { Heart, Globe, Users, Briefcase, Activity } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-white">

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-10 items-center">

          {/* LEFT */}
          <div>
            <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow">
              <Heart className="h-4 w-4 text-pink-500" />
              <span className="font-semibold text-pink-500">
                GLOBAL COMMUNITY VERIFIED
              </span>
            </div>

            <h1 className="mt-8 text-6xl md:text-7xl font-black leading-tight">
              Spark{" "}
              <span className="bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-transparent">
                Love.
              </span>
              <br />
              End{" "}
              <span className="bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-transparent">
                Poverty.
              </span>
            </h1>

            <p className="mt-6 text-2xl text-slate-600">
              Connecting hearts across every city and village to build
              opportunity and community.
            </p>

            <div className="mt-8 flex gap-4 flex-wrap">
              <button className="rounded-full px-8 py-4 text-white font-bold bg-gradient-to-r from-pink-500 to-orange-400 shadow-xl">
                Launch Spark
              </button>

              <button className="rounded-full px-8 py-4 border-2 border-pink-200 font-bold text-pink-500 bg-white">
                Support Mission
              </button>
            </div>
          </div>

          {/* RIGHT */}
          <div className="relative">

            <img
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac"
              alt="community"
              className="rounded-[40px] shadow-2xl w-full h-[500px] object-cover"
            />

            <div className="absolute top-6 left-6 bg-white p-6 rounded-3xl shadow-xl">
              <p className="text-pink-500 font-bold">Live Community</p>
              <h2 className="text-4xl font-black">18.2K+</h2>
              <p>Active Members</p>
            </div>

            <div className="absolute bottom-6 right-6 bg-white p-6 rounded-3xl shadow-xl">
              <p className="text-pink-500 font-bold">Global Impact</p>
              <h2 className="text-4xl font-black">192</h2>
              <p>Countries</p>
            </div>

          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="bg-white rounded-[40px] shadow-xl p-8 grid md:grid-cols-5 gap-6">

          <StatCard
            icon={<Users />}
            number="18.2K+"
            title="Members"
            subtitle="Growing every day"
          />

          <StatCard
            icon={<Globe />}
            number="192"
            title="Countries"
            subtitle="United by respect"
          />

          <StatCard
            icon={<Activity />}
            number="47.6K+"
            title="Moments"
            subtitle="Shared with love"
          />

          <StatCard
            icon={<Briefcase />}
            number="12.3K+"
            title="Opportunities"
            subtitle="Jobs & growth"
          />

          <StatCard
            icon={<Heart />}
            number="100%"
            title="Respect Zone"
            subtitle="Kindness First"
          />
        </div>
      </section>

      {/* POLICY */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="rounded-[40px] bg-pink-50 border border-pink-100 p-8 flex justify-between items-center">
          <div>
            <h3 className="text-3xl font-black">
              Respect is Mandatory
            </h3>

            <p className="text-slate-600 mt-2">
              We celebrate kindness, inclusion, and positive connections.
            </p>
          </div>

          <button className="rounded-full px-8 py-4 bg-white shadow font-bold">
            Read Our Policy →
          </button>
        </div>
      </section>

    </main>
  );
}

function StatCard({
  icon,
  number,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  number: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 mx-auto rounded-full bg-pink-100 flex items-center justify-center text-pink-500">
        {icon}
      </div>

      <h3 className="mt-4 text-4xl font-black">{number}</h3>

      <p className="font-bold">{title}</p>

      <p className="text-sm text-slate-500">{subtitle}</p>
    </div>
  );
}