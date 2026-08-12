  import Navbar from "../../../components/navbar";
   import {
  Leaf,
  Target,
  Eye,
  Gem,
  HeartHandshake,
  Users,
  Gift,
  Smile,
  Sprout,
  Package,
  Rocket,
  Globe2,
  Heart,
} from "lucide-react";

const features = [
  {
    icon: Target,
    title: "Our Mission",
    desc: "To reduce waste and help people by sharing useful items and resources.",
  },
  {
    icon: Eye,
    title: "Our Vision",
    desc: "A world where no useful item is wasted and everyone has equal access to essentials.",
  },
  {
    icon: Gem,
    title: "Our Values",
    desc: "We believe in kindness, sustainability, transparency, and building strong communities.",
  },
  {
    icon: HeartHandshake,
    title: "What We Do",
    desc: "We connect donors, volunteers and recipients on a single platform and ensure items reach the right people.",
  },
];

const stats = [
  { icon: Users, value: "12K+", label: "Active Users" },
  { icon: Gift, value: "25K+", label: "Items Shared" },
  { icon: Smile, value: "15K+", label: "Happy Recipients" },
  { icon: Users, value: "500+", label: "Volunteers" },
  { icon: Leaf, value: "20K+", label: "KG CO₂ Saved" },
];

const journey = [
  {
    icon: Sprout,
    year: "2021",
    title: "The Idea",
    desc: "The journey began with a simple idea to reduce waste and help communities.",
  },
  {
    icon: Users,
    year: "2022",
    title: "Building Community",
    desc: "We built a great team and onboarded our first donors and volunteers.",
  },
  {
    icon: Package,
    year: "2023",
    title: "Expanding Reach",
    desc: "We expanded to more cities and helped thousands of people.",
  },
  {
    icon: Rocket,
    year: "2024",
    title: "Growing Impact",
    desc: "Our impact grew stronger with more categories and amazing supporters.",
  },
  {
    icon: Globe2,
    year: "2025+",
    title: "Towards a Better Future",
    desc: "We continue working towards a sustainable and happier world for all.",
  },
];

export default function AboutReLifeHub() {
  return (
    <> <Navbar></Navbar>
    <div className="w-full bg-white px-4 py-10 md:px-10">
      <div className="max-w-6xl mx-auto">
        {/* Hero */}
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 text-sm font-semibold">
              <Leaf className="w-4 h-4" />
              Get to know us
            </div>
            <h1 className="mt-3 text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
              About <span className="text-emerald-600">ReLife Hub</span>
            </h1>
            <p className="mt-4 text-sm text-slate-500 leading-relaxed">
              ReLife Hub is a platform that connects donors, volunteers and
              recipients to share useful items and create a positive impact
              on our planet and communities.
            </p>
            <p className="mt-3 text-sm text-slate-500 leading-relaxed">
              We believe that every item has value and every act of kindness
              creates a ripple of change.
            </p>

            <div className="mt-6 bg-emerald-50 border border-emerald-100 rounded-xl p-4 relative">
              <span className="text-emerald-300 text-3xl font-serif leading-none absolute top-2 left-4">
                &ldquo;
              </span>
              <p className="pl-6 text-sm italic text-slate-700">
                Together, we can reduce waste, help people in need, and build
                a sustainable future.
              </p>
              <Heart className="w-4 h-4 text-emerald-500 fill-emerald-500 absolute bottom-3 right-4" />
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden">
            <img
              src="/about.png"
              alt="Volunteers in ReLife Hub shirts packing a donation box"
              className="w-full h-64 md:h-80 object-cover rounded-2xl"
            />
          </div>
        </div>

        {/* Feature cards */}
        <div className="mt-12 border border-slate-100 rounded-2xl p-6 md:p-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-8 shadow-sm">
          {features.map(({ icon: Icon, title, desc }, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-11 h-11 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-emerald-600" strokeWidth={1.75} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">{title}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-8 bg-emerald-50/60 rounded-2xl p-6 md:p-8 flex flex-wrap items-center justify-between gap-y-6">
          {stats.map(({ icon: Icon, value, label }, i) => (
            <div key={i} className="flex items-center gap-3 px-2">
              <Icon className="w-6 h-6 text-emerald-600" strokeWidth={1.75} />
              <div className="leading-tight">
                <div className="text-lg font-extrabold text-slate-900">
                  {value}
                </div>
                <div className="text-xs text-slate-500 whitespace-nowrap">
                  {label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Our Journey */}
        <div className="mt-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
              Our Journey
            </h2>
            <div className="w-10 h-1 bg-emerald-500 mx-auto mt-2 rounded-full" />
          </div>

          <div className="relative grid grid-cols-1 sm:grid-cols-5 gap-8 sm:gap-4">
            {/* connecting line */}
            <div className="hidden sm:block absolute top-6 left-[10%] right-[10%] border-t-2 border-dashed border-emerald-200 z-0" />

            {journey.map(({ icon: Icon, year, title, desc }, i) => (
              <div key={i} className="relative z-10 text-center px-2">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-600 flex items-center justify-center shadow-sm">
                  <Icon className="w-5 h-5 text-white" strokeWidth={1.75} />
                </div>
                <div className="mt-3 text-sm font-bold text-emerald-600">
                  {year}
                </div>
                <div className="text-sm font-bold text-slate-900 mt-0.5">
                  {title}
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
