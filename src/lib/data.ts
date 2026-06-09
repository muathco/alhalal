import type { Animal, AnimalType, Farm } from "@/types";

// مرآة لبيانات seed.sql — تُستخدم لعرض الواجهة قبل ربطها بالكامل بـ Supabase queries
export const FARMS: Farm[] = [
  {
    id: "33333333-3333-3333-3333-333333333301",
    owner_id: "11111111-1111-1111-1111-111111111101",
    name: "حضيرة الوادي الأخضر",
    region: "المنطقة الوسطى",
    location_text: "الرياض - طريق الرياض الخارجي",
    bio: "حضيرة متخصصة في الأغنام النجدية بتغذية طبيعية، تأسست عام ١٤٣٨هـ وتخدم أكثر من ٣٠٠ عميل",
    feed_type: "natural",
    is_verified: true,
    is_active: true,
    avg_rating: 4.9,
    total_reviews: 120,
    total_orders: 340,
    created_at: "2024-01-01",
  },
  {
    id: "33333333-3333-3333-3333-333333333302",
    owner_id: "11111111-1111-1111-1111-111111111102",
    name: "حضيرة آل سالم",
    region: "منطقة القصيم",
    location_text: "بريدة - الطريق الزراعي",
    bio: "حضيرة عائلية بشهادات بيطرية معتمدة، متخصصة في الأغنام والماعز",
    feed_type: "certified",
    is_verified: true,
    is_active: true,
    avg_rating: 4.7,
    total_reviews: 85,
    total_orders: 210,
    created_at: "2024-01-01",
  },
  {
    id: "33333333-3333-3333-3333-333333333303",
    owner_id: "11111111-1111-1111-1111-111111111103",
    name: "مزرعة الإبل الذهبية",
    region: "المنطقة الشرقية",
    location_text: "الأحساء - طريق الملك فهد",
    bio: "متخصصون في الإبل المهرية والمجاهيم بخبرة تتجاوز ٢٠ عاماً",
    feed_type: "mixed",
    is_verified: true,
    is_active: true,
    avg_rating: 4.8,
    total_reviews: 64,
    total_orders: 150,
    created_at: "2024-01-01",
  },
  {
    id: "33333333-3333-3333-3333-333333333304",
    owner_id: "11111111-1111-1111-1111-111111111104",
    name: "حضيرة بني مالك",
    region: "منطقة مكة المكرمة",
    location_text: "جدة - طريق المدينة",
    bio: "حضيرة أبقار وأغنام بتغذية طبيعية معتمدة من الهيئة العامة للغذاء والدواء",
    feed_type: "natural",
    is_verified: true,
    is_active: true,
    avg_rating: 4.6,
    total_reviews: 47,
    total_orders: 98,
    created_at: "2024-01-01",
  },
  {
    id: "33333333-3333-3333-3333-333333333305",
    owner_id: "11111111-1111-1111-1111-111111111105",
    name: "حضيرة شمّر",
    region: "المنطقة الشمالية",
    location_text: "حائل - الطريق الدائري",
    bio: "حضيرة ماعز وأغنام محلية بتغذية طبيعية وخبرة عائلية موروثة",
    feed_type: "natural",
    is_verified: true,
    is_active: true,
    avg_rating: 4.8,
    total_reviews: 39,
    total_orders: 77,
    created_at: "2024-01-01",
  },
];

export const ANIMALS: Animal[] = [
  // حضيرة الوادي الأخضر — أغنام
  { id: "44444444-4444-4444-4444-444444444401", farm_id: FARMS[0].id, type: "sheep", breed: "نجدي", live_weight_kg: 18, net_weight_estimate_kg: 9, price_sar: 1450, slaughter_options: ["live", "slaughtered", "cut"], feed_type: "natural", images: [], is_available: true, is_reserved: false },
  { id: "44444444-4444-4444-4444-444444444402", farm_id: FARMS[0].id, type: "sheep", breed: "نجدي", live_weight_kg: 22, net_weight_estimate_kg: 11, price_sar: 1750, slaughter_options: ["live", "slaughtered", "cut"], feed_type: "natural", images: [], is_available: true, is_reserved: false },
  { id: "44444444-4444-4444-4444-444444444411", farm_id: FARMS[0].id, type: "sheep", breed: "حري", live_weight_kg: 14, net_weight_estimate_kg: 7, price_sar: 1050, slaughter_options: ["live", "slaughtered", "cut"], feed_type: "natural", images: [], is_available: true, is_reserved: false },

  // حضيرة آل سالم — أغنام وماعز
  { id: "44444444-4444-4444-4444-444444444403", farm_id: FARMS[1].id, type: "sheep", breed: "حري", live_weight_kg: 16, net_weight_estimate_kg: 8, price_sar: 1250, slaughter_options: ["live", "slaughtered", "cut"], feed_type: "certified", images: [], is_available: true, is_reserved: false },
  { id: "44444444-4444-4444-4444-444444444404", farm_id: FARMS[1].id, type: "goat", breed: "ماعز عارضي", live_weight_kg: 14, net_weight_estimate_kg: 7, price_sar: 980, slaughter_options: ["live", "slaughtered", "cut"], feed_type: "certified", images: [], is_available: true, is_reserved: false },
  { id: "44444444-4444-4444-4444-444444444412", farm_id: FARMS[1].id, type: "goat", breed: "ماعز عارضي", live_weight_kg: 19, net_weight_estimate_kg: 9.5, price_sar: 1320, slaughter_options: ["live", "slaughtered", "cut"], feed_type: "certified", images: [], is_available: true, is_reserved: false },

  // مزرعة الإبل الذهبية — إبل
  { id: "44444444-4444-4444-4444-444444444405", farm_id: FARMS[2].id, type: "camel", breed: "مهري", live_weight_kg: 320, net_weight_estimate_kg: 160, price_sar: 12000, slaughter_options: ["live", "slaughtered", "cut"], feed_type: "mixed", images: [], is_available: true, is_reserved: false },
  { id: "44444444-4444-4444-4444-444444444406", farm_id: FARMS[2].id, type: "camel", breed: "مجاهيم", live_weight_kg: 280, net_weight_estimate_kg: 140, price_sar: 9500, slaughter_options: ["live", "slaughtered", "cut"], feed_type: "mixed", images: [], is_available: true, is_reserved: false },
  { id: "44444444-4444-4444-4444-444444444413", farm_id: FARMS[2].id, type: "camel", breed: "صفر", live_weight_kg: 300, net_weight_estimate_kg: 150, price_sar: 10800, slaughter_options: ["live", "slaughtered", "cut"], feed_type: "mixed", images: [], is_available: true, is_reserved: false },

  // حضيرة بني مالك — أبقار وأغنام
  { id: "44444444-4444-4444-4444-444444444407", farm_id: FARMS[3].id, type: "cow", breed: "هولندية", live_weight_kg: 250, net_weight_estimate_kg: 125, price_sar: 6200, slaughter_options: ["live", "slaughtered", "cut"], feed_type: "natural", images: [], is_available: true, is_reserved: false },
  { id: "44444444-4444-4444-4444-444444444408", farm_id: FARMS[3].id, type: "sheep", breed: "نعيمي", live_weight_kg: 20, net_weight_estimate_kg: 10, price_sar: 1600, slaughter_options: ["live", "slaughtered", "cut"], feed_type: "natural", images: [], is_available: true, is_reserved: false },
  { id: "44444444-4444-4444-4444-444444444414", farm_id: FARMS[3].id, type: "cow", breed: "محلية", live_weight_kg: 220, net_weight_estimate_kg: 110, price_sar: 5400, slaughter_options: ["live", "slaughtered", "cut"], feed_type: "natural", images: [], is_available: true, is_reserved: false },

  // حضيرة شمّر — ماعز وأغنام
  { id: "44444444-4444-4444-4444-444444444409", farm_id: FARMS[4].id, type: "goat", breed: "ماعز نجدي", live_weight_kg: 17, net_weight_estimate_kg: 8.5, price_sar: 1100, slaughter_options: ["live", "slaughtered", "cut"], feed_type: "natural", images: [], is_available: true, is_reserved: false },
  { id: "44444444-4444-4444-4444-444444444410", farm_id: FARMS[4].id, type: "sheep", breed: "نجدي", live_weight_kg: 19, net_weight_estimate_kg: 9.5, price_sar: 1500, slaughter_options: ["live", "slaughtered", "cut"], feed_type: "natural", images: [], is_available: true, is_reserved: false },
  { id: "44444444-4444-4444-4444-444444444415", farm_id: FARMS[4].id, type: "goat", breed: "ماعز عارضي", live_weight_kg: 15, net_weight_estimate_kg: 7.5, price_sar: 990, slaughter_options: ["live", "slaughtered", "cut"], feed_type: "natural", images: [], is_available: true, is_reserved: false },
];

export const TYPE_LABELS: Record<AnimalType, { label: string; emoji: string }> = {
  sheep: { label: "أغنام", emoji: "🐑" },
  camel: { label: "إبل", emoji: "🐪" },
  cow: { label: "بقر", emoji: "🐄" },
  goat: { label: "ماعز", emoji: "🐐" },
};

export type SizeTag = "small" | "mid" | "large";

export const SIZE_RANGES: Record<SizeTag, { label: string; weight: string; price: string; min: number; max: number }> = {
  small: { label: "صغير", weight: "١٠–١٥ كجم", price: "٨٠٠–١٢٠٠ ر.س", min: 0, max: 15 },
  mid: { label: "وسط", weight: "١٥–٢٥ كجم", price: "١٢٠٠–٢٠٠٠ ر.س", min: 15, max: 25 },
  large: { label: "كبير", weight: "+٢٥ كجم", price: "+٢٠٠٠ ر.س", min: 25, max: Infinity },
};

export function getFarm(id: string): Farm | undefined {
  return FARMS.find((f) => f.id === id);
}

export function getAnimal(id: string): Animal | undefined {
  return ANIMALS.find((a) => a.id === id);
}

export function getFarmAnimals(farmId: string): Animal[] {
  return ANIMALS.filter((a) => a.farm_id === farmId);
}

export function sizeTagForAnimal(a: Animal): SizeTag {
  const w = a.live_weight_kg;
  if (w < 15) return "small";
  if (w < 25) return "mid";
  return "large";
}

export function searchAnimals(type: AnimalType | null, size: SizeTag | null) {
  return ANIMALS.filter((a) => {
    if (type && a.type !== type) return false;
    if (size && sizeTagForAnimal(a) !== size) return false;
    return a.is_available;
  });
}
