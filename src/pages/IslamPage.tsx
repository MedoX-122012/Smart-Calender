import { useState, useEffect, useMemo } from "react";
import { surahs } from "@/data/islamic/quran";
import { morningAthkar, eveningAthkar, sleepAthkar, wakingAthkar, prayerAthkar, generalAthkar } from "@/data/islamic/athkar";
import { sunnahItems } from "@/data/islamic/sunnah";
import { ATHKAR_CATEGORIES, SUNNAH_CATEGORIES } from "@/types";
import { BookOpen, BookHeart, CheckCircle2, Circle, Sparkles, Search, ChevronLeft, Book, Droplets } from "lucide-react";

type IslamTab = "quran" | "athkar" | "sunnah";

export default function IslamPage() {
  const [activeTab, setActiveTab] = useState<IslamTab>("athkar");
  const [athkarCategory, setAthkarCategory] = useState<string>("morning");
  const [sunnahCategory, setSunnahCategory] = useState<string>("all");
  const [quranSearch, setQuranSearch] = useState("");
  const [sunnahCompleted, setSunnahCompleted] = useState<Set<string>>(new Set());
  const [zekrCounters, setZekrCounters] = useState<Record<string, number>>({});

  const filteredSurahs = surahs.filter((s) => s.name.includes(quranSearch) || s.nameEnglish.toLowerCase().includes(quranSearch.toLowerCase()));
  const filteredSunnah = sunnahCategory === "all" ? sunnahItems : sunnahItems.filter((s) => s.category === sunnahCategory);

  const getAthkar = () => {
    switch (athkarCategory) {
      case "morning": return morningAthkar;
      case "evening": return eveningAthkar;
      case "sleep": return sleepAthkar;
      case "waking": return wakingAthkar;
      case "prayer": return prayerAthkar;
      default: return generalAthkar;
    }
  };

  const toggleSunnah = (id: string) => {
    setSunnahCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const incrementZekr = (id: string, maxCount: number) => {
    setZekrCounters((prev) => {
      const current = prev[id] || 0;
      if (current >= maxCount) return prev;
      return { ...prev, [id]: current + 1 };
    });
  };

  const resetZekr = (id: string) => {
    setZekrCounters((prev) => ({ ...prev, [id]: 0 }));
  };

  const sunnahCount = useMemo(() => ({
    completed: sunnahCompleted.size,
    total: sunnahItems.length,
    percentage: Math.round((sunnahCompleted.size / sunnahItems.length) * 100),
  }), [sunnahCompleted]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header - Warm Islamic Gradient (no AI green/teal) */}
      <div className="relative overflow-hidden bg-earth-700 rounded-3xl p-6 sm:p-8 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-6 -right-2 text-7xl" style={{ fontFamily: "'Noto Kufi Arabic', sans-serif" }}>﷽</div>
          <div className="absolute bottom-2 left-4 text-5xl" style={{ fontFamily: "'Noto Kufi Arabic', sans-serif" }}>﴿﴾</div>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(255,255,255,0.08)_0%,transparent_50%)]" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <BookHeart className="w-5 h-5 text-white/80" />
            <span className="text-sm font-medium text-white/80">الإسلام نور الحياة</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">المركز الإسلامي</h1>
          <p className="text-white/80 text-sm">القرآن • الأذكار • السنن النبوية</p>
        </div>
      </div>

      {/* Tabs - Warm Earthy */}
      <div className="flex items-center gap-2 card-solid p-1.5">
        {([{ key: "athkar", label: "الأذكار", icon: Book }, { key: "sunnah", label: "السنن", icon: BookHeart }, { key: "quran", label: "القرآن", icon: BookOpen }] as const).map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setActiveTab(key as IslamTab)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeTab === key
                ? "              bg-earth-100 dark:bg-night-800 text-earth-700 dark:text-earth-300 shadow-sm border border-earth-200 dark:border-night-600"
                : "text-earth-500 dark:text-earth-400 hover:bg-earth-50 dark:hover:bg-night-800"
            }`}>
            <Icon className="w-4 h-4" />{label}
          </button>
        ))}
      </div>

      {/* === ATHKAR TAB - Warm Palette === */}
      {activeTab === "athkar" && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 flex-wrap">
            {Object.entries(ATHKAR_CATEGORIES).map(([key, label]) => (
              <button key={key} onClick={() => setAthkarCategory(key)}
                className={`px-4 py-2 rounded-xl text-xs font-medium border transition-all ${
                  athkarCategory === key
                    ? "bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border-primary-200 dark:border-primary-700 shadow-sm"
                    : "bg-white dark:bg-night-800 text-earth-500 dark:text-earth-400 border-earth-200 dark:border-night-700 hover:border-earth-300"
                }`}>
                {key === "morning" ? "🌅" : key === "evening" ? "🌇" : key === "sleep" ? "🌙" : key === "waking" ? "☀️" : key === "prayer" ? "🕌" : "📿"} {label}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {getAthkar().map((zekr) => {
              const currentCount = zekrCounters[zekr.id] || 0;
              const isComplete = currentCount >= zekr.count;
              return (
                <div key={zekr.id} className={`card-solid border-2 p-4 sm:p-5 transition-all duration-300 hover:shadow-lg ${
                  isComplete
                    ? "border-accent-200 dark:border-accent-700 bg-accent-50/50 dark:bg-accent-900/10"
                    : "border-earth-200 dark:border-night-700"
                }`}>
                  <div className="flex items-start gap-3">
                    <button onClick={() => incrementZekr(zekr.id, zekr.count)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                        isComplete
                          ? "bg-accent-500 text-white shadow-md"
                          : "bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 hover:bg-primary-100"
                      }`}>
                      {isComplete ? <CheckCircle2 className="w-5 h-5" /> : <Droplets className="w-5 h-5" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="text-base leading-relaxed text-earth-900 dark:text-earth-50 font-arabic mb-2">
                        {zekr.text}
                      </p>
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-2">
                          <button onClick={() => incrementZekr(zekr.id, zekr.count)}
                            className="px-3 py-1 rounded-lg bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-medium hover:bg-primary-100 transition-all">
                            {currentCount}/{zekr.count}
                          </button>
                          {currentCount > 0 && <button onClick={() => resetZekr(zekr.id)} className="text-[10px] text-earth-400 hover:text-earth-600 dark:hover:text-earth-300 transition-colors">إعادة</button>}
                        </div>
                        {zekr.reference && <span className="text-[10px] text-earth-400 dark:text-earth-500">{zekr.reference}</span>}
                      </div>
                    </div>
                  </div>
                  {/* Progress bar - Warm gradient */}
                  <div className="mt-3 h-1.5 bg-earth-100 dark:bg-night-800 rounded-full overflow-hidden">
                    <div className="h-full bg-earth-500 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (currentCount / zekr.count) * 100)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* === SUNNAH TAB - Warm Palette === */}
      {activeTab === "sunnah" && (
        <div className="space-y-6">
          {/* Progress */}
          <div className="bg-earth-100 dark:bg-night-800 rounded-2xl border border-earth-200 dark:border-night-600 p-4 sm:p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-earth-500" />
                <span className="text-sm font-bold text-earth-700 dark:text-earth-300">تتبع السنن اليومية</span>
              </div>
              <span className="text-xs font-medium text-earth-600 dark:text-earth-400">{sunnahCount.completed}/{sunnahCount.total}</span>
            </div>
            <div className="w-full h-2 bg-earth-200 dark:bg-night-700 rounded-full overflow-hidden">
              <div className="h-full bg-earth-500 rounded-full transition-all duration-500" style={{ width: `${sunnahCount.percentage}%` }} />
            </div>
          </div>

          {/* Category filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={() => setSunnahCategory("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                sunnahCategory === "all"
                  ? "bg-primary-50 border-primary-200 text-primary-700 shadow-sm"
                  : "bg-white dark:bg-night-800 border-earth-200 text-earth-500 hover:border-earth-300"
              }`}>الكل</button>
            {Object.entries(SUNNAH_CATEGORIES).map(([key, label]) => (
              <button key={key} onClick={() => setSunnahCategory(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  sunnahCategory === key
                    ? "bg-primary-50 border-primary-200 text-primary-700 shadow-sm"
                    : "bg-white dark:bg-night-800 border-earth-200 text-earth-500 hover:border-earth-300"
                }`}>{label}</button>
            ))}
          </div>

          {/* Sunnah items grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredSunnah.map((item) => (
              <button key={item.id} onClick={() => toggleSunnah(item.id)}
                className={`flex items-start gap-3 p-4 rounded-2xl border-2 text-right transition-all duration-200 ${
                  sunnahCompleted.has(item.id)
                    ? "bg-accent-50 dark:bg-accent-900/10 border-accent-300 dark:border-accent-700"
                    : "bg-white dark:bg-night-800 border-earth-200 dark:border-night-700 hover:border-primary-200 dark:hover:border-primary-700 hover:shadow-md"
                }`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                  sunnahCompleted.has(item.id)
                    ? "bg-accent-500 text-white"
                    : "bg-primary-50 dark:bg-primary-900/30 text-primary-500"
                }`}>
                  {sunnahCompleted.has(item.id) ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold truncate ${
                    sunnahCompleted.has(item.id)
                      ? "text-earth-400 dark:text-earth-500 line-through"
                      : "text-earth-900 dark:text-earth-50"
                  }`}>{item.title}</p>
                  <p className="text-xs text-earth-500 dark:text-earth-400 mt-0.5">{item.description}</p>
                  {item.source && <p className="text-[10px] text-earth-400 dark:text-earth-500 mt-0.5">{item.source}</p>}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* === QURAN TAB - Warm Palette === */}
      {activeTab === "quran" && (
        <div className="space-y-6">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-earth-400" />
            <input type="text" value={quranSearch} onChange={(e) => setQuranSearch(e.target.value)}
              placeholder="ابحث عن سورة..."
              className="input-warm pr-10" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredSurahs.map((surah) => (
              <a key={surah.id} href={`https://quran.com/${surah.id}`} target="_blank" rel="noopener noreferrer"
                className="group flex items-center gap-4 p-4 bg-white dark:bg-night-800 rounded-2xl border-2 border-earth-200 dark:border-night-700 hover:border-primary-200 dark:hover:border-primary-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                <div className="w-12 h-12 bg-earth-500 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-sm">
                  {surah.id}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-earth-900 dark:text-earth-50 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {surah.name}
                  </h3>
                  <p className="text-xs text-earth-500 dark:text-earth-400">
                    {surah.nameEnglish} • {surah.versesCount} آية • {surah.revelationType === "meccan" ? "مكية" : "مدنية"}
                  </p>
                </div>
                <ChevronLeft className="w-4 h-4 text-earth-300 group-hover:text-primary-500 transition-colors" />
              </a>
            ))}
          </div>

          {filteredSurahs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <BookOpen className="w-12 h-12 text-earth-300 dark:text-earth-600 mb-4" />
              <p className="text-earth-400 dark:text-earth-500">لا توجد نتائج للبحث</p>
            </div>
          )}
        </div>
      )}

      {/* Footer - Hadith */}
      <div className="bg-earth-100 dark:bg-night-800 rounded-2xl border border-earth-200 dark:border-night-600 p-5 text-center">
        <p className="text-lg font-arabic text-earth-700 dark:text-earth-300 leading-relaxed mb-1">
          «خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ»
        </p>
        <p className="text-xs text-earth-400 dark:text-earth-500">رواه البخاري</p>
      </div>
    </div>
  );
}
