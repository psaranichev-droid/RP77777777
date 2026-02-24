// Встроенные SVG текстуры для избежания сетевых запросов

/** Текстура помятой бумаги (Base64 SVG) */
export const CRUMPLED_PAPER_SVG = `data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3CfilterPattern id='crumpled'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='4' result='noise' /%3E%3CfeDisplacementMap in='SourceGraphic' in2='noise' scale='3' /%3E%3C/filterPattern%3E%3C/defs%3E%3Crect width='100' height='100' fill='%23f5f5f5' filter='url(%23crumpled)' /%3E%3C/svg%3E`;

/** Облегченная шумная текстура для меньшего размера */
export const NOISE_TEXTURE_SVG = `data:image/svg+xml,%3Csvg width='50' height='50' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='50' height='50' fill='%23ffffff'/%3E%3Cg opacity='0.05'%3E%3Ccircle cx='10' cy='10' r='1' fill='%23000'/%3E%3Ccircle cx='25' cy='15' r='0.8' fill='%23000'/%3E%3Ccircle cx='40' cy='25' r='1.2' fill='%23000'/%3E%3Ccircle cx='15' cy='35' r='0.9' fill='%23000'/%3E%3Ccircle cx='35' cy='40' r='1.1' fill='%23000'/%3E%3Ccircle cx='45' cy='45' r='0.7' fill='%23000'/%3E%3C/g%3E%3C/svg%3E`;

/** Текстура ткани */
export const FABRIC_TEXTURE_SVG = `data:image/svg+xml,%3Csvg width='4' height='4' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='4' height='4' fill='%23fafafa'/%3E%3Cpath d='M0,0 l4,4 M4,0 l-4,4' stroke='%23e0e0e0' stroke-width='0.5'/%3E%3C/svg%3E`;

export const TEXTURE_PATTERNS = {
  crumpledPaper: CRUMPLED_PAPER_SVG,
  noise: NOISE_TEXTURE_SVG,
  fabric: FABRIC_TEXTURE_SVG,
};
