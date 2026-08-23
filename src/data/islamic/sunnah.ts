import { SunnahItem } from "@/types";

export const sunnahItems: SunnahItem[] = [
  // Prayer Sunnah
  { id: "sunnah-1", title: "صلاة الفجر في وقتها", description: "أداء صلاة الفجر مع الجماعة", category: "prayer", source: "متفق عليه" },
  { id: "sunnah-2", title: "السنن الراتبة", description: "12 ركعة سنة مؤكدة يومياً", category: "prayer" },
  { id: "sunnah-3", title: "صلاة الضحى", description: "صلاة الضحى (ركعتان إلى 8 ركعات)", category: "prayer", source: "مسلم" },
  { id: "sunnah-4", title: "الوتر", description: "صلاة الوتر قبل النوم", category: "prayer", source: "متفق عليه" },
  { id: "sunnah-5", title: "قيام الليل", description: "صلاة قيام الليل ولو ركعتين", category: "prayer", source: "مسلم" },
  { id: "sunnah-6", title: "صلاة الجماعة", description: "أداء الصلوات الخمس في المسجد", category: "prayer" },
  { id: "sunnah-7", title: "تحية المسجد", description: "صلاة ركعتين عند دخول المسجد", category: "prayer", source: "البخاري" },
  { id: "sunnah-8", title: "صلاة الاستخارة", description: "صلاة الاستخارة عند اتخاذ القرارات", category: "prayer", source: "البخاري" },
  // Fasting Sunnah
  { id: "sunnah-9", title: "صيام الإثنين والخميس", description: "صيام يومي الإثنين والخميس من كل أسبوع", category: "fasting", source: "الترمذي" },
  { id: "sunnah-10", title: "صيام الأيام البيض", description: "صيام 13-14-15 من كل شهر هجري", category: "fasting", source: "الترمذي" },
  { id: "sunnah-11", title: "صيام الاثنين", description: "صيام يوم الاثنين", category: "fasting" },
  { id: "sunnah-12", title: "صيام الخميس", description: "صيام يوم الخميس", category: "fasting" },
  // Daily Sunnah
  { id: "sunnah-13", title: "السواك", description: "استخدام السواك خاصة عند الوضوء والصلاة", category: "daily", source: "البخاري" },
  { id: "sunnah-14", title: "قراءة القرآن", description: "قراءة ورد يومي من القرآن الكريم", category: "daily" },
  { id: "sunnah-15", title: "أذكار الصباح والمساء", description: "قراءة أذكار الصباح والمساء", category: "daily" },
  { id: "sunnah-16", title: "الصدقة اليومية", description: "التصدق ولو بالقليل يومياً", category: "daily" },
  { id: "sunnah-17", title: "الدعاء", description: "الإكثار من الدعاء في كل وقت", category: "daily" },
  // Manners
  { id: "sunnah-18", title: "السلام", description: "إفشاء السلام وإلقاء التحية", category: "manners", source: "مسلم" },
  { id: "sunnah-19", title: "الابتسامة", description: "التبسم في وجه أخيك صدقة", category: "manners", source: "الترمذي" },
  { id: "sunnah-20", title: "بر الوالدين", description: "الإحسان إلى الوالدين وطاعتهما", category: "manners", source: "متفق عليه" },
  { id: "sunnah-21", title: "صلة الرحم", description: "زيارة الأقارب والتواصل معهم", category: "manners", source: "متفق عليه" },
  { id: "sunnah-22", title: "الصدق", description: "التزام الصدق في الأقوال والأفعال", category: "manners", source: "متفق عليه" },
  { id: "sunnah-23", title: "الأمانة", description: "أداء الأمانات إلى أهلها", category: "manners" },
  { id: "sunnah-24", title: "غض البصر", description: "حفظ البصر عما حرم الله", category: "manners" },
  // Worship
  { id: "sunnah-25", title: "ذكر الله", description: "الإكثار من ذكر الله في كل وقت", category: "worship" },
  { id: "sunnah-26", title: "الدعاء للمسلمين", description: "الدعاء لإخوانك المسلمين بظهر الغيب", category: "worship" },
  { id: "sunnah-27", title: "شكر النعم", description: "الحمد والشكر لله على نعمه", category: "worship" },
  { id: "sunnah-28", title: "الصبر", description: "الصبر على البلاء والابتلاء", category: "worship" },
  { id: "sunnah-29", title: "التوكل على الله", description: "التوكل على الله في جميع الأمور", category: "worship" },
  { id: "sunnah-30", title: "التوبة والاستغفار", description: "الإكثار من الاستغفار والتوبة", category: "worship" },
];

export const getSunnahByCategory = (category: string): SunnahItem[] =>
  sunnahItems.filter((item) => item.category === category);
