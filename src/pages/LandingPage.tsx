import { Link, useNavigate } from "react-router-dom";
import {
  Rocket, CalendarDays, BookHeart, GitBranch,
  CheckCircle2, Bell, ArrowLeft, Sparkles, Star,
  Shield, Smartphone, Zap, UserCheck,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";

const features = [
  {
    icon: CalendarDays,
    title: "التقويم الذكي",
    description: "تتبع أحداثك ومناسباتك مع تقويم تفاعلي يعرض لك كل شيء في مكان واحد",
    color: "bg-primary-500",
  },
  {
    icon: BookHeart,
    title: "المركز الإسلامي",
    description:        "أذكار الصباح والمساء، القرآن الكريم، والسنن النبوية - كل شيء مرتّب لمجديك",
    color: "bg-accent-500",
  },
  {
    icon: GitBranch,
    title: "تتبع العادات",
    description: "ابنِ عادات حسنة واترك السيئة مع نظام تتبع ذكي يحسب سلسلتك ونسبة نجاحك",
    color: "bg-warm-500",
  },
  {
    icon: Bell,
    title: "تنبيهات ذكية",
    description: "لا تفوت أي مهمة مع نظام إشعارات يذكّرك بالمهام المهمة في الوقت المناسب",
    color: "bg-violet-500",
  },
  {
    icon: Shield,
    title: "خصوصية تامة",
    description: "بياناتك محفوظة على جهازك فقط - لا خوادم، لا تسريب، لا مخاوف",
    color: "bg-emerald-500",
  },
  {
    icon: Zap,
    title: "سريع وخفيف",
    description: "تصميم محسّن يعمل بسرعة فائقة حتى بدون اتصال بالإنترنت",
    color: "bg-amber-500",
  },
];

const stats = [
  { number: "+500", label: " مستخدم نشط" },
  { number: "100%", label: "مجاني" },
  { number: "24/7", label: "متاح دائماً" },
  { number: "0", label: "إعلانات" },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { enterAsGuest } = useAuthStore();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const handleGuestMode = () => {
    enterAsGuest();
    navigate("/", { replace: true });
  };

  const testimonials = [
    {
      name: "أحمد محمد",
      role: "طالب جامعي",
      text: "تطبيق غيّر حياتي اليومية! أصبحت أنظم وقتي بشكل أفضل وألتزم بأذكاري",
      rating: 5,
    },
    {
      name: "فاطمة علي",
      role: "أم وموظفة",
      text: "أحب كيف يجمع لي كل شيء في مكان واحد - المهام والأذكار والعادات. تطبيق رائع!",
      rating: 5,
    },
    {
      name: "خالد العمري",
      role: "رائد أعمال",
      text: "التصميم جميل جداً والتبسيط في الاستخدام. أنصح الجميع بتجربته",
      rating: 5,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-earth-50/90 dark:bg-night-900/90 backdrop-blur-xl border-b border-earth-200 dark:border-night-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-earth-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">جد</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-earth-800 dark:text-earth-100">جدول يومي</h1>
                <p className="text-xs text-earth-500 dark:text-earth-400">لحياة أفضل</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/login"
                className="px-4 py-2 text-sm font-medium text-earth-600 dark:text-earth-400 hover:text-earth-800 dark:hover:text-earth-200 transition-colors">
                تسجيل الدخول
              </Link>
              <Link to="/signup"
                className="btn-primary text-sm">
                إنشاء حساب
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-earth-700 via-earth-800 to-earth-900 text-white">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 right-10 text-[10rem] leading-none select-none">﷽</div>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(232,141,42,0.15)_0%,transparent_50%),radial-gradient(circle_at_70%_80%,rgba(109,140,86,0.1)_0%,transparent_50%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-white/10">
              <Sparkles className="w-4 h-4 text-primary-300" />
              <span className="text-sm text-white/80">مجاني بالكامل - بدون إعلانات</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              جدول يومي
              <span className="block text-primary-300 mt-2">لحياة أكثر تنظيماً وإيماناً</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed">
              رفيقك اليومي لإدارة مهامك، تتبع عاداتك، والالتزام بالذكر والعبادة.
              كل ما تحتاجه في تطبيق واحد جميل وبسيط.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-earth-800 rounded-2xl text-lg font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                <Rocket className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                ابدأ الآن مجاناً
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </Link>
              <button
                onClick={handleGuestMode}
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-2xl text-lg font-medium border border-white/20 hover:bg-white/20 transition-all duration-300">
                <UserCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
                تصفح كضيف
              </button>
              <Link to="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-white/60 rounded-2xl text-sm font-medium hover:text-white/80 transition-all duration-300">
                لدي حساب بالفعل
              </Link>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {stats.map((stat, i) => (
              <div key={i} className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                <p className="text-2xl sm:text-3xl font-bold text-primary-300">{stat.number}</p>
                <p className="text-sm text-white/60 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" className="w-full h-auto">
            <path d="M0 40L48 36.7C96 33.3 192 26.7 288 26.7C384 26.7 480 33.3 576 40C672 46.7 768 53.3 864 50C960 46.7 1056 33.3 1152 30C1248 26.7 1344 33.3 1392 36.7L1440 40V80H1392C1344 80 1248 80 1152 80C1056 80 960 80 864 80C768 80 672 80 576 80C480 80 384 80 288 80C192 80 96 80 48 80H0V40Z" fill="currentColor" className="text-earth-50 dark:text-night-900"/>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-earth-50 dark:bg-night-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="badge-accent mb-4 inline-flex">المميزات</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-earth-900 dark:text-earth-50 mb-4">
              كل ما تحتاجه في مكان واحد
            </h2>
            <p className="text-lg text-earth-500 dark:text-earth-400 max-w-2xl mx-auto">
              صُمم التطبيق ليكون شريكك اليومي في التنظيم والعبادة والنمو الشخصي
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i}
                  className="group p-6 bg-white dark:bg-night-800 rounded-2xl border border-earth-200 dark:border-night-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-earth-900 dark:text-earth-50 mb-2">{feature.title}</h3>
                  <p className="text-sm text-earth-500 dark:text-earth-400 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-white dark:bg-night-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="badge-primary mb-4 inline-flex">كيف يعمل</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-earth-900 dark:text-earth-50 mb-4">
              ثلاث خطوات لحياة أفضل
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "١", title: "أنشئ حسابك", desc: "سجّل مجاناً في ثوانٍ - لا بريد إلكتروني معقد", icon: Smartphone },
              { step: "٢", title: "أضف مهامك", desc: "حدد روتينك اليومي وأضف عاداتك ومحتواك الإسلامي", icon: CheckCircle2 },
              { step: "٣", title: "تابع تقدمك", desc: "راقب إنجازاتك واحتفظ بنسب نجاحك وسلسلتك", icon: Star },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="text-center p-8">
                  <div className="w-16 h-16 bg-primary-50 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-primary-200 dark:border-primary-700">
                    <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">{item.step}</span>
                  </div>
                  <div className="w-12 h-12 bg-earth-100 dark:bg-night-700 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-earth-600 dark:text-earth-400" />
                  </div>
                  <h3 className="text-lg font-bold text-earth-900 dark:text-earth-50 mb-2">{item.title}</h3>
                  <p className="text-sm text-earth-500 dark:text-earth-400">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-earth-50 dark:bg-night-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="badge-accent mb-4 inline-flex">آراء المستخدمين</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-earth-900 dark:text-earth-50 mb-4">
              ماذا يقول المستخدمون؟
            </h2>
          </div>

          <div className="relative overflow-hidden bg-white dark:bg-night-800 rounded-3xl border border-earth-200 dark:border-night-700 p-8 sm:p-12 shadow-sm">
            <div className="absolute top-6 left-8 text-6xl text-earth-200 dark:text-night-600 font-serif leading-none">"</div>
            <div className="relative z-10">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary-400 text-primary-400" />
                ))}
              </div>
              <p className="text-lg sm:text-xl text-earth-700 dark:text-earth-300 mb-6 leading-relaxed">
                {testimonials[currentTestimonial].text}
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-earth-200 dark:bg-night-600 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-earth-600 dark:text-earth-300">
                    {testimonials[currentTestimonial].name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-bold text-earth-900 dark:text-earth-50">{testimonials[currentTestimonial].name}</p>
                  <p className="text-sm text-earth-500 dark:text-earth-400">{testimonials[currentTestimonial].role}</p>
                </div>
              </div>
            </div>
            {/* Dots */}
            <div className="flex items-center justify-center gap-2 mt-6">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setCurrentTestimonial(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === currentTestimonial ? "bg-primary-500 w-6" : "bg-earth-300 dark:bg-night-600"}`} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-earth-700 via-earth-800 to-earth-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(232,141,42,0.1)_0%,transparent_50%)]" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            ابدأ رحلتك نحو حياة أفضل
          </h2>
          <p className="text-lg text-white/70 mb-8 max-w-xl mx-auto">
            انضم لمجتمع يسعى للتنظيم والإيمان. حسابك مجاني وبياناتك آمنة على جهازك.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup"
              className="group inline-flex items-center gap-3 px-10 py-4 bg-white text-earth-800 rounded-2xl text-lg font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <Rocket className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              أنشئ حسابك الآن
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </Link>
            <button
              onClick={handleGuestMode}
              className="group inline-flex items-center gap-3 px-10 py-4 bg-white/10 backdrop-blur-sm text-white rounded-2xl text-lg font-medium border border-white/20 hover:bg-white/20 transition-all duration-300">
              <UserCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
              جرّب كضيف
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-earth-900 dark:bg-night-950 border-t border-earth-800 dark:border-night-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2.5 mb-4">
            <div className="w-8 h-8 bg-earth-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">جد</span>
            </div>
            <span className="text-sm font-bold text-earth-300">جدول يومي</span>
          </div>
          <p className="text-sm text-earth-500">© {new Date().getFullYear()} جدول يومي - جميع الحقوق محفوظة</p>
          <p className="text-xs text-earth-600 mt-1">صنع بـ ❤️ للإنتاجية والإيمان</p>
        </div>
      </footer>
    </div>
  );
}
