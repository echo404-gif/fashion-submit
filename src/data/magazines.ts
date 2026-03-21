export type Difficulty = "顶级极难" | "极难" | "较难" | "中等" | "较易";
export type Region = "US" | "UK" | "France" | "Italy" | "Germany" | "Netherlands" | "Hong Kong" | "Taiwan" | "China Edition" | "China Local" | "Global";
export type Format = "hybrid" | "digital";
export type PubType = "女刊" | "男刊" | "美妆" | "生活方式" | "摄影" | "文化" | "艺术" | "综合";
export type Style = "主流时装" | "先锋时装文化" | "商业准一线" | "潮流青年" | "独立艺术时尚";

export interface Brand {
  name: string;
  website: string;
  instagram: string;
}

export interface Magazine {
  name: string;
  difficulty: Difficulty;
  region: Region;
  format: Format;
  pubType: PubType;
  style: Style;
  website?: string;
  instagram?: string;
  submissionEmail?: string;
  cnSearchName?: string;
}

// ── 主品牌区块 ──────────────────────────────────────────────────────────
export const brands: Brand[] = [
  { name: "Vogue",           website: "https://www.vogue.com",                          instagram: "voguemagazine" },
  { name: "Harper's Bazaar", website: "https://www.harpersbazaar.com",                  instagram: "harpersbazaarus" },
  { name: "ELLE",            website: "https://www.elle.com",                           instagram: "elleusa" },
  { name: "GQ",              website: "https://www.gq.com",                             instagram: "gq" },
  { name: "Esquire",         website: "https://www.esquire.com",                        instagram: "esquire" },
  { name: "L'Officiel",      website: "https://www.lofficiel.com",                      instagram: "lofficiel.magazine" },
  { name: "Numéro",          website: "https://numero.com",                             instagram: "numeromagazine" },
  { name: "W Magazine",      website: "https://www.wmagazine.com",                      instagram: "wmag" },
  { name: "Madame Figaro",   website: "https://madame.lefigaro.fr",                     instagram: "madamefigarofr" },
  { name: "T Magazine",      website: "https://www.nytimes.com/section/t-magazine",     instagram: "tmagazine" },
  { name: "V Magazine",      website: "https://vmagazine.com",                          instagram: "vmagazine" },
  { name: "CR Fashion Book", website: "https://crfashionbook.com",                      instagram: "crfashionbook" },
  { name: "Vanity Fair",     website: "https://www.vanityfair.com",                     instagram: "vanityfair" },
  { name: "NOWNESS",         website: "https://www.nowness.com",                        instagram: "nowness" },
  { name: "Cosmopolitan",    website: "https://www.cosmopolitan.com",                   instagram: "cosmopolitan" },
  { name: "Marie Claire",    website: "https://www.marieclaire.com",                    instagram: "marieclairemag" },
  { name: "Grazia",          website: "https://graziamagazine.com",                     instagram: "grazia" },
];

// ── 杂志数据库 ──────────────────────────────────────────────────────────
export const magazines: Magazine[] = [
  // 🇺🇸 US
  { name: "Vogue US",           region: "US", difficulty: "顶级极难", format: "hybrid",  pubType: "女刊", style: "主流时装",    website: "https://www.vogue.com",                instagram: "voguemagazine" },
  { name: "Harper's Bazaar US", region: "US", difficulty: "顶级极难", format: "hybrid",  pubType: "女刊", style: "主流时装",    website: "https://www.harpersbazaar.com",        instagram: "harpersbazaarus" },
  { name: "ELLE US",            region: "US", difficulty: "顶级极难", format: "hybrid",  pubType: "女刊", style: "主流时装",    website: "https://www.elle.com",                 instagram: "elleusa" },
  { name: "GQ US",              region: "US", difficulty: "顶级极难", format: "hybrid",  pubType: "男刊", style: "主流时装",    website: "https://www.gq.com",                   instagram: "gq" },
  { name: "Esquire US",         region: "US", difficulty: "顶级极难", format: "hybrid",  pubType: "男刊", style: "商业准一线",  website: "https://www.esquire.com",              instagram: "esquire" },
  { name: "W Magazine",         region: "US", difficulty: "顶级极难", format: "hybrid",  pubType: "综合", style: "主流时装",    website: "https://www.wmagazine.com",            instagram: "wmag" },
  { name: "V Magazine",         region: "US", difficulty: "极难",     format: "hybrid",  pubType: "综合", style: "先锋时装文化", website: "https://vmagazine.com",               instagram: "vmagazine" },
  { name: "CR Fashion Book",    region: "US", difficulty: "极难",     format: "hybrid",  pubType: "女刊", style: "先锋时装文化", website: "https://crfashionbook.com",           instagram: "crfashionbook" },
  { name: "Interview",          region: "US", difficulty: "极难",     format: "hybrid",  pubType: "综合", style: "先锋时装文化", website: "https://interviewmagazine.com",       instagram: "interviewmag" },
  { name: "Document Journal",   region: "US", difficulty: "极难",     format: "hybrid",  pubType: "综合", style: "先锋时装文化", website: "https://documentjournal.com",         instagram: "documentjournal" },
  { name: "Vanity Fair",        region: "US", difficulty: "较难",     format: "hybrid",  pubType: "综合", style: "商业准一线",  website: "https://www.vanityfair.com",           instagram: "vanityfair" },
  { name: "L'Officiel USA",     region: "US", difficulty: "较难",     format: "hybrid",  pubType: "女刊", style: "商业准一线",  website: "https://lofficielusa.com",             instagram: "lofficielusa" },
  { name: "WSJ. Magazine",      region: "US", difficulty: "较难",     format: "hybrid",  pubType: "综合", style: "商业准一线",  website: "https://www.wsj.com/style",            instagram: "wsjmag" },
  { name: "Cosmopolitan",       region: "US", difficulty: "较难",     format: "hybrid",  pubType: "女刊", style: "商业准一线",  website: "https://www.cosmopolitan.com",         instagram: "cosmopolitan" },
  { name: "Marie Claire",       region: "US", difficulty: "较难",     format: "hybrid",  pubType: "女刊", style: "商业准一线",  website: "https://www.marieclaire.com",          instagram: "marieclairemag" },
  { name: "Allure",             region: "US", difficulty: "较难",     format: "digital", pubType: "美妆", style: "商业准一线",  website: "https://www.allure.com",               instagram: "allure" },
  { name: "InStyle",            region: "US", difficulty: "中等",     format: "digital", pubType: "女刊", style: "商业准一线",  website: "https://www.instyle.com",              instagram: "instylemagazine" },
  { name: "NYLON",              region: "US", difficulty: "中等",     format: "hybrid",  pubType: "综合", style: "潮流青年",    website: "https://www.nylon.com",                instagram: "nylonmag" },
  { name: "Office",             region: "US", difficulty: "中等",     format: "hybrid",  pubType: "综合", style: "潮流青年",    website: "https://officemagazine.net",           instagram: "officemagazine" },

  // 🇬🇧 UK
  { name: "British Vogue",      region: "UK", difficulty: "顶级极难", format: "hybrid",  pubType: "女刊", style: "主流时装",    website: "https://www.vogue.co.uk",              instagram: "britishvogue" },
  { name: "Harper's Bazaar UK", region: "UK", difficulty: "顶级极难", format: "hybrid",  pubType: "女刊", style: "主流时装",    website: "https://www.harpersbazaar.com/uk",     instagram: "bazaaruk" },
  { name: "ELLE UK",            region: "UK", difficulty: "顶级极难", format: "hybrid",  pubType: "女刊", style: "主流时装",    website: "https://www.elle.com/uk",              instagram: "elleuk" },
  { name: "GQ UK",              region: "UK", difficulty: "顶级极难", format: "hybrid",  pubType: "男刊", style: "主流时装",    website: "https://www.gq-magazine.co.uk",        instagram: "britishgq" },
  { name: "i-D",                region: "UK", difficulty: "顶级极难", format: "hybrid",  pubType: "综合", style: "先锋时装文化", website: "https://i-d.co",                      instagram: "i_d" },
  { name: "Dazed",              region: "UK", difficulty: "顶级极难", format: "hybrid",  pubType: "综合", style: "先锋时装文化", website: "https://www.dazeddigital.com",         instagram: "dazed" },
  { name: "AnOther Magazine",   region: "UK", difficulty: "极难",     format: "hybrid",  pubType: "综合", style: "先锋时装文化", website: "https://www.anothermag.com",           instagram: "anothermagazine" },
  { name: "Another Man",        region: "UK", difficulty: "极难",     format: "hybrid",  pubType: "男刊", style: "先锋时装文化", website: "https://www.anothermag.com/another-man", instagram: "another_man" },
  { name: "The Face",           region: "UK", difficulty: "极难",     format: "hybrid",  pubType: "综合", style: "先锋时装文化", website: "https://theface.com",                  instagram: "thefacemagazine" },
  { name: "Arena Homme+",       region: "UK", difficulty: "极难",     format: "hybrid",  pubType: "男刊", style: "先锋时装文化", website: "https://shop.exacteditions.com/gb/arena-homme", instagram: "thehommeplusmag" },
  { name: "Luncheon",           region: "UK", difficulty: "极难",     format: "hybrid",  pubType: "综合", style: "先锋时装文化", website: "https://luncheonmagazine.com",          instagram: "luncheonmagazine" },
  { name: "POP",                region: "UK", difficulty: "极难",     format: "hybrid",  pubType: "综合", style: "先锋时装文化", website: "https://thepop.com",                   instagram: "thepopmag" },
  { name: "Wallpaper*",         region: "UK", difficulty: "较难",     format: "hybrid",  pubType: "生活方式", style: "商业准一线", website: "https://www.wallpaper.com",          instagram: "wallpapermag" },
  { name: "Esquire UK",         region: "UK", difficulty: "较难",     format: "hybrid",  pubType: "男刊", style: "商业准一线",  website: "https://www.esquire.com/uk",           instagram: "esquire.uk" },
  { name: "Grazia UK",          region: "UK", difficulty: "中等",     format: "hybrid",  pubType: "女刊", style: "商业准一线",  website: "https://www.graziadaily.co.uk",         instagram: "graziauk" },
  { name: "Wonderland",         region: "UK", difficulty: "中等",     format: "hybrid",  pubType: "综合", style: "潮流青年",    website: "https://www.wonderlandmagazine.com",   instagram: "wonderland" },
  { name: "Hunger",             region: "UK", difficulty: "中等",     format: "hybrid",  pubType: "综合", style: "潮流青年",    website: "https://hungermag.com",                instagram: "hungermagazine" },
  { name: "Hero",               region: "UK", difficulty: "中等",     format: "hybrid",  pubType: "综合", style: "潮流青年",    website: "https://hero-magazine.com",            instagram: "hero_magazine" },
  { name: "Teeth",              region: "UK", difficulty: "较易",     format: "hybrid",  pubType: "艺术", style: "独立艺术时尚", website: "https://teethmag.net",                instagram: "teethmag" },

  // 🇫🇷 France
  { name: "Vogue France",      region: "France", difficulty: "顶级极难", format: "hybrid", pubType: "女刊", style: "主流时装",    website: "https://www.vogue.fr",               instagram: "voguefrance" },
  { name: "ELLE France",       region: "France", difficulty: "顶级极难", format: "hybrid", pubType: "女刊", style: "主流时装",    website: "https://www.elle.fr",                instagram: "ellefr" },
  { name: "Numéro",            region: "France", difficulty: "极难",     format: "hybrid", pubType: "综合", style: "先锋时装文化", website: "https://numero.com",                instagram: "numeromagazine" },
  { name: "Purple",            region: "France", difficulty: "极难",     format: "hybrid", pubType: "综合", style: "先锋时装文化", website: "https://purple.fr",                 instagram: "purplefashionmagazine" },
  { name: "Self Service",      region: "France", difficulty: "极难",     format: "hybrid", pubType: "综合", style: "先锋时装文化", website: "https://selfservicemagazine.com",    instagram: "selfservicemagazine" },
  { name: "L'Officiel France", region: "France", difficulty: "较难",     format: "hybrid", pubType: "女刊", style: "商业准一线",  website: "https://www.lofficiel.com",          instagram: "lofficielparis" },
  { name: "Madame Figaro",     region: "France", difficulty: "较难",     format: "hybrid", pubType: "女刊", style: "商业准一线",  website: "https://madame.lefigaro.fr",         instagram: "madamefigarofr" },

  // 🇮🇹 Italy
  { name: "Vogue Italia",          region: "Italy", difficulty: "顶级极难", format: "hybrid", pubType: "女刊", style: "主流时装",   website: "https://www.vogue.it",              instagram: "vogueitalia" },
  { name: "Harper's Bazaar Italy", region: "Italy", difficulty: "较难",     format: "hybrid", pubType: "女刊", style: "商业准一线", website: "https://www.harpersbazaar.com/it",  instagram: "bazaaritalia" },
  { name: "ELLE Italy",            region: "Italy", difficulty: "较难",     format: "hybrid", pubType: "女刊", style: "商业准一线", website: "https://www.elle.com/it",           instagram: "elle_italia" },
  { name: "Vanity Fair Italy",     region: "Italy", difficulty: "较难",     format: "hybrid", pubType: "综合", style: "商业准一线", website: "https://www.vanityfair.it",         instagram: "vanityfairitalia" },
  { name: "Grazia Italy",          region: "Italy", difficulty: "中等",     format: "hybrid", pubType: "女刊", style: "商业准一线", website: "https://www.grazia.it",             instagram: "grazia_it" },
  { name: "Lampoon",               region: "Italy", difficulty: "中等",     format: "hybrid", pubType: "艺术", style: "独立艺术时尚", website: "https://lampoonmagazine.com",     instagram: "lampoonmagazine" },
  { name: "PAP Magazine",          region: "Italy", difficulty: "较易",     format: "hybrid", pubType: "摄影", style: "独立艺术时尚", website: "https://www.pap-magazine.com",    instagram: "pap_magazine" },

  // 🇩🇪 Germany
  { name: "Vogue Germany", region: "Germany", difficulty: "顶级极难", format: "hybrid", pubType: "女刊", style: "主流时装",    website: "https://www.vogue.de",              instagram: "voguegermany" },
  { name: "ELLE Germany",  region: "Germany", difficulty: "较难",     format: "hybrid", pubType: "女刊", style: "商业准一线",  website: "https://www.elle.de",               instagram: "ellegermany" },
  { name: "032c",          region: "Germany", difficulty: "极难",     format: "hybrid", pubType: "综合", style: "先锋时装文化", website: "https://032c.com",                  instagram: "032c" },
  { name: "Gruppe",        region: "Germany", difficulty: "较易",     format: "hybrid", pubType: "艺术", style: "独立艺术时尚", website: "http://shop.gruppemagazine.com",     instagram: "gruppemagazine" },

  // 🇳🇱 Netherlands
  { name: "Fantastic Man", region: "Netherlands", difficulty: "极难", format: "hybrid", pubType: "男刊", style: "先锋时装文化", website: "https://fantasticman.com",          instagram: "manfantastic" },

  // 🇭🇰 Hong Kong
  { name: "Vogue Hong Kong",      region: "Hong Kong", difficulty: "顶级极难", format: "hybrid", pubType: "女刊", style: "主流时装",   website: "https://www.voguehk.com",          instagram: "voguehongkong" },
  { name: "Harper's Bazaar HK",   region: "Hong Kong", difficulty: "较难",     format: "hybrid", pubType: "女刊", style: "商业准一线", website: "https://www.harpersbazaar.com.hk", instagram: "harpersbazaarhk" },
  { name: "ELLE Hong Kong",       region: "Hong Kong", difficulty: "较难",     format: "hybrid", pubType: "女刊", style: "商业准一线", website: "https://www.elle.com.hk",          instagram: "ellehongkong" },
  { name: "Milk X",               region: "Hong Kong", difficulty: "中等",     format: "hybrid", pubType: "综合", style: "潮流青年",   website: "https://www.milkx.com",            instagram: "milkxhk" },

  // 🇹🇼 Taiwan
  { name: "Vogue Taiwan",           region: "Taiwan", difficulty: "顶级极难", format: "hybrid", pubType: "女刊", style: "主流时装",   website: "https://www.vogue.com.tw",         instagram: "voguetaiwan" },
  { name: "Harper's Bazaar Taiwan", region: "Taiwan", difficulty: "较难",     format: "hybrid", pubType: "女刊", style: "商业准一线", website: "https://www.harpersbazaar.com/tw", instagram: "harpersbazaar_tw" },
  { name: "ELLE Taiwan",            region: "Taiwan", difficulty: "较难",     format: "hybrid", pubType: "女刊", style: "商业准一线", website: "https://www.elle.com/tw",          instagram: "elletaiwan" },
  { name: "GQ Taiwan",              region: "Taiwan", difficulty: "较难",     format: "hybrid", pubType: "男刊", style: "商业准一线", website: "https://www.gq.com.tw",            instagram: "gqtaiwan" },

  // 🇨🇳 China Edition
  { name: "Vogue China",          region: "China Edition", difficulty: "顶级极难", format: "hybrid",  pubType: "女刊", style: "主流时装",    website: "https://www.vogue.com.cn",       instagram: "voguechina",          cnSearchName: "VOGUE服饰与美容" },
  { name: "Harper's Bazaar China",region: "China Edition", difficulty: "顶级极难", format: "hybrid",  pubType: "女刊", style: "主流时装",    website: "http://www.bazaar.com.cn",       instagram: "bazaarchinaofficial", cnSearchName: "时尚芭莎" },
  { name: "ELLE China",           region: "China Edition", difficulty: "顶级极难", format: "hybrid",  pubType: "女刊", style: "主流时装",    website: "https://ellechina.com",          instagram: "ellechina",           cnSearchName: "世界时装之苑ELLE" },
  { name: "GQ China",             region: "China Edition", difficulty: "顶级极难", format: "hybrid",  pubType: "男刊", style: "主流时装",    website: "https://www.gq.com.cn",          instagram: "gqchinaofficial",     cnSearchName: "精英GQ" },
  { name: "Numéro China",         region: "China Edition", difficulty: "极难",     format: "hybrid",  pubType: "综合", style: "先锋时装文化",                                    instagram: "numerochina",         cnSearchName: "Numéro大都市" },
  { name: "V China",              region: "China Edition", difficulty: "极难",     format: "hybrid",  pubType: "综合", style: "先锋时装文化",                                    instagram: "vchina_official",     cnSearchName: "V China" },
  { name: "Esquire China",        region: "China Edition", difficulty: "较难",     format: "hybrid",  pubType: "男刊", style: "商业准一线",  website: "https://esquirecn.cn",           instagram: "esquire_china",       cnSearchName: "时尚先生Esquire" },
  { name: "L'Officiel China",     region: "China Edition", difficulty: "较难",     format: "hybrid",  pubType: "女刊", style: "商业准一线",                                       instagram: "lofficiel.china",     cnSearchName: "时装L'OFFICIEL" },
  { name: "Marie Claire China",   region: "China Edition", difficulty: "较难",     format: "hybrid",  pubType: "女刊", style: "商业准一线",  website: "https://mcchina.com",            instagram: "marieclaire.china",   cnSearchName: "嘉人Marie Claire" },
  { name: "Cosmopolitan China",   region: "China Edition", difficulty: "较难",     format: "hybrid",  pubType: "女刊", style: "商业准一线",  website: "https://cosmopolitancn.com",                                       cnSearchName: "时尚Cosmo" },
  { name: "T China",              region: "China Edition", difficulty: "较难",     format: "hybrid",  pubType: "综合", style: "先锋时装文化",                                    instagram: "tmagazinechina",      cnSearchName: "T中文版" },
  { name: "Madame Figaro China",  region: "China Edition", difficulty: "较难",     format: "hybrid",  pubType: "女刊", style: "商业准一线",                                       instagram: "madamefigarochina",   cnSearchName: "Madame Figaro China" },
  { name: "NOWNESS China",        region: "China Edition", difficulty: "较难",     format: "digital", pubType: "文化", style: "先锋时装文化", website: "https://www.nowness.cn",         instagram: "nowness.china",       cnSearchName: "NOWNESS现在" },

  // 🇨🇳 China Local
  { name: "Rouge Fashion Book", region: "China Local", difficulty: "中等", format: "hybrid",  pubType: "艺术", style: "独立艺术时尚", website: "https://boutiquegalleria.com/collections/boutique-mags", instagram: "rougefashionbook",  cnSearchName: "Rouge Fashion Book" },
  { name: "MODERN WEEKLY STYLE",region: "China Local", difficulty: "中等", format: "hybrid",  pubType: "综合", style: "商业准一线",                                                                     instagram: "modernweeklystyle", cnSearchName: "周末画报STYLE" },
  { name: "瑞丽",               region: "China Local", difficulty: "中等", format: "hybrid",  pubType: "女刊", style: "商业准一线",  website: "https://rayli.com.cn",                                                                              cnSearchName: "瑞丽" },
  { name: "OK!精彩",            region: "China Local", difficulty: "中等", format: "hybrid",  pubType: "女刊", style: "商业准一线",                                                                    cnSearchName: "OK!精彩" },
  { name: "昕薇",               region: "China Local", difficulty: "较易", format: "digital", pubType: "女刊", style: "商业准一线",                                                                                                               cnSearchName: "昕薇" },
  { name: "Grazia China",       region: "China Edition", difficulty: "较难", format: "hybrid",  pubType: "女刊", style: "商业准一线",  website: "https://chinagrazia.com",        instagram: "graziachina",       cnSearchName: "红秀GRAZIA" },

  // 🌍 Global
  { name: "Re-Edition",    region: "Global", difficulty: "极难",  format: "hybrid",  pubType: "综合", style: "先锋时装文化", website: "https://www.reeditionmagazine.com",    instagram: "reeditionmag" },
  { name: "System",        region: "Global", difficulty: "极难",  format: "hybrid",  pubType: "综合", style: "先锋时装文化", website: "https://system-magazine.com",          instagram: "systemmagazine" },
  { name: "Perfect Magazine", region: "Global", difficulty: "极难", format: "hybrid", pubType: "综合", style: "先锋时装文化", website: "https://theperfectmagazine.com",      instagram: "theperfectmagazine" },
  { name: "Twin",          region: "Global", difficulty: "中等",  format: "hybrid",  pubType: "综合", style: "独立艺术时尚", website: "https://twinfactory.co.uk",            instagram: "twinmagazine" },
  { name: "Novembre",      region: "Global", difficulty: "中等",  format: "hybrid",  pubType: "摄影", style: "独立艺术时尚", website: "https://novembre.global",              instagram: "novembreglobal" },
  { name: "Buffalo Zine",  region: "Global", difficulty: "中等",  format: "hybrid",  pubType: "艺术", style: "独立艺术时尚", website: "https://buffalozine.com",              instagram: "buffalozine" },
  { name: "Cake",          region: "Global", difficulty: "中等",  format: "hybrid",  pubType: "综合", style: "独立艺术时尚", website: "https://www.cake-mag.com",             instagram: "cakemagazine" },
  { name: "Schön!",        region: "Global", difficulty: "中等",  format: "hybrid",  pubType: "综合", style: "潮流青年",    website: "https://schonmagazine.com",            instagram: "schonmagazine" },
  { name: "Nasty Magazine",region: "Global", difficulty: "较易",  format: "hybrid",  pubType: "艺术", style: "独立艺术时尚", website: "https://www.nastymagazine.com",        instagram: "nastymagazine" },
  { name: "PUSS PUSS",     region: "Global", difficulty: "较易",  format: "hybrid",  pubType: "综合", style: "独立艺术时尚", website: "https://pusspussmagazine.com",         instagram: "pusspussmag" },
  { name: "SICKY",         region: "Global", difficulty: "较易",  format: "digital", pubType: "摄影", style: "独立艺术时尚", website: "https://sickymag.com",                 instagram: "sickymag" },
];

// ── Config & constants ────────────────────────────────────────────────
export const difficultyConfig: Record<Difficulty, { color: string; label: string }> = {
  顶级极难: { color: "#111111", label: "⛔ 顶级极难" },
  极难:     { color: "#EF4444", label: "🔴 极难" },
  较难:     { color: "#F97316", label: "🟠 较难" },
  中等:     { color: "#EAB308", label: "🟡 中等" },
  较易:     { color: "#22C55E", label: "🟢 较易" },
};

export const regionLabels: Record<Region, string> = {
  US:             "🇺🇸 US",
  UK:             "🇬🇧 UK",
  France:         "🇫🇷 France",
  Italy:          "🇮🇹 Italy",
  Germany:        "🇩🇪 Germany",
  Netherlands:    "🇳🇱 Netherlands",
  "Hong Kong":    "🇭🇰 Hong Kong",
  Taiwan:         "🇹🇼 Taiwan",
  "China Edition":"🇨🇳 China Edition",
  "China Local":  "🇨🇳 China Local",
  Global:         "🌍 Global",
};

export const formatLabels: Record<Format, string> = {
  hybrid:  "📄💻 印刷+数字",
  digital: "💻 纯数字",
};

export const isChina = (r: Region) => r === "China Edition" || r === "China Local";

export const difficulties: Difficulty[] = ["顶级极难", "极难", "较难", "中等", "较易"];
export const regions: Region[] = ["Global", "China Edition", "China Local", "Hong Kong", "Taiwan", "US", "UK", "France", "Italy", "Germany", "Netherlands"];
export const pubTypes: PubType[] = ["女刊", "男刊", "美妆", "生活方式", "摄影", "文化", "艺术", "综合"];
export const styles: Style[] = ["主流时装", "先锋时装文化", "商业准一线", "潮流青年", "独立艺术时尚"];
