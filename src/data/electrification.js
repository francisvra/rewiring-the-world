// Electricity share of final energy consumption (%) — approximate 2022 values
// Source: Our World in Data / IEA (electricity_share_energy field)
// ISO numeric codes used to match TopoJSON world-atlas

export const electrificationData = {
  // North America
  840: { name: "United States", iso2: "US", value: 21.5 },
  124: { name: "Canada", iso2: "CA", value: 23.1 },
  484: { name: "Mexico", iso2: "MX", value: 20.8 },

  // Central America & Caribbean
  188: { name: "Costa Rica", iso2: "CR", value: 27.2 },
  320: { name: "Guatemala", iso2: "GT", value: 12.4 },
  340: { name: "Honduras", iso2: "HN", value: 14.8 },
  222: { name: "El Salvador", iso2: "SV", value: 15.2 },
  558: { name: "Nicaragua", iso2: "NI", value: 16.1 },
  591: { name: "Panama", iso2: "PA", value: 19.4 },
  192: { name: "Cuba", iso2: "CU", value: 18.6 },

  // South America
  76: { name: "Brazil", iso2: "BR", value: 26.4 },
  32: { name: "Argentina", iso2: "AR", value: 22.3 },
  152: { name: "Chile", iso2: "CL", value: 24.7 },
  170: { name: "Colombia", iso2: "CO", value: 21.9 },
  604: { name: "Peru", iso2: "PE", value: 17.8 },
  862: { name: "Venezuela", iso2: "VE", value: 19.2 },
  218: { name: "Ecuador", iso2: "EC", value: 18.3 },
  68: { name: "Bolivia", iso2: "BO", value: 14.6 },
  600: { name: "Paraguay", iso2: "PY", value: 33.8 },
  858: { name: "Uruguay", iso2: "UY", value: 31.2 },
  740: { name: "Suriname", iso2: "SR", value: 16.4 },
  328: { name: "Guyana", iso2: "GY", value: 13.2 },

  // Western Europe
  276: { name: "Germany", iso2: "DE", value: 22.8 },
  250: { name: "France", iso2: "FR", value: 25.6 },
  826: { name: "United Kingdom", iso2: "GB", value: 21.9 },
  380: { name: "Italy", iso2: "IT", value: 23.4 },
  724: { name: "Spain", iso2: "ES", value: 23.1 },
  528: { name: "Netherlands", iso2: "NL", value: 19.8 },
  56: { name: "Belgium", iso2: "BE", value: 21.6 },
  752: { name: "Sweden", iso2: "SE", value: 33.4 },
  578: { name: "Norway", iso2: "NO", value: 49.8 },
  246: { name: "Finland", iso2: "FI", value: 28.9 },
  208: { name: "Denmark", iso2: "DK", value: 25.7 },
  756: { name: "Switzerland", iso2: "CH", value: 27.3 },
  40: { name: "Austria", iso2: "AT", value: 26.1 },
  620: { name: "Portugal", iso2: "PT", value: 26.8 },
  372: { name: "Ireland", iso2: "IE", value: 23.2 },
  300: { name: "Greece", iso2: "GR", value: 20.4 },
  203: { name: "Czechia", iso2: "CZ", value: 22.7 },
  616: { name: "Poland", iso2: "PL", value: 20.3 },
  348: { name: "Hungary", iso2: "HU", value: 20.8 },
  703: { name: "Slovakia", iso2: "SK", value: 22.1 },
  705: { name: "Slovenia", iso2: "SI", value: 24.6 },
  191: { name: "Croatia", iso2: "HR", value: 23.9 },
  642: { name: "Romania", iso2: "RO", value: 19.6 },
  100: { name: "Bulgaria", iso2: "BG", value: 18.9 },
  688: { name: "Serbia", iso2: "RS", value: 17.8 },
  8: { name: "Albania", iso2: "AL", value: 27.4 },
  807: { name: "North Macedonia", iso2: "MK", value: 16.2 },
  70: { name: "Bosnia and Herzegovina", iso2: "BA", value: 15.9 },
  499: { name: "Montenegro", iso2: "ME", value: 24.1 },
  428: { name: "Latvia", iso2: "LV", value: 25.8 },
  440: { name: "Lithuania", iso2: "LT", value: 22.4 },
  233: { name: "Estonia", iso2: "EE", value: 23.1 },
  112: { name: "Belarus", iso2: "BY", value: 24.6 },
  804: { name: "Ukraine", iso2: "UA", value: 20.1 },
  498: { name: "Moldova", iso2: "MD", value: 15.3 },

  // Russia & Central Asia
  643: { name: "Russia", iso2: "RU", value: 19.4 },
  398: { name: "Kazakhstan", iso2: "KZ", value: 16.8 },
  860: { name: "Uzbekistan", iso2: "UZ", value: 16.2 },
  795: { name: "Turkmenistan", iso2: "TM", value: 13.4 },
  417: { name: "Kyrgyzstan", iso2: "KG", value: 22.8 },
  762: { name: "Tajikistan", iso2: "TJ", value: 24.1 },
  4: { name: "Afghanistan", iso2: "AF", value: 5.2 },

  // Middle East
  364: { name: "Iran", iso2: "IR", value: 17.6 },
  368: { name: "Iraq", iso2: "IQ", value: 14.8 },
  682: { name: "Saudi Arabia", iso2: "SA", value: 20.3 },
  784: { name: "United Arab Emirates", iso2: "AE", value: 21.8 },
  634: { name: "Qatar", iso2: "QA", value: 19.6 },
  414: { name: "Kuwait", iso2: "KW", value: 20.1 },
  400: { name: "Jordan", iso2: "JO", value: 17.2 },
  422: { name: "Lebanon", iso2: "LB", value: 14.8 },
  760: { name: "Syria", iso2: "SY", value: 11.2 },
  887: { name: "Yemen", iso2: "YE", value: 7.4 },
  512: { name: "Oman", iso2: "OM", value: 18.9 },
  48: { name: "Bahrain", iso2: "BH", value: 20.4 },
  376: { name: "Israel", iso2: "IL", value: 22.6 },
  792: { name: "Turkey", iso2: "TR", value: 22.3 },

  // South Asia
  356: { name: "India", iso2: "IN", value: 16.8 },
  586: { name: "Pakistan", iso2: "PK", value: 12.4 },
  50: { name: "Bangladesh", iso2: "BD", value: 10.6 },
  524: { name: "Nepal", iso2: "NP", value: 14.2 },
  144: { name: "Sri Lanka", iso2: "LK", value: 15.8 },
  524: { name: "Nepal", iso2: "NP", value: 14.2 },
  64: { name: "Bhutan", iso2: "BT", value: 38.6 },

  // East Asia
  156: { name: "China", iso2: "CN", value: 23.7 },
  392: { name: "Japan", iso2: "JP", value: 26.8 },
  410: { name: "South Korea", iso2: "KR", value: 22.4 },
  408: { name: "North Korea", iso2: "KP", value: 9.8 },
  496: { name: "Mongolia", iso2: "MN", value: 14.2 },
  158: { name: "Taiwan", iso2: "TW", value: 22.1 },

  // Southeast Asia
  360: { name: "Indonesia", iso2: "ID", value: 12.8 },
  764: { name: "Thailand", iso2: "TH", value: 19.4 },
  458: { name: "Malaysia", iso2: "MY", value: 18.6 },
  608: { name: "Philippines", iso2: "PH", value: 15.2 },
  704: { name: "Vietnam", iso2: "VN", value: 17.8 },
  104: { name: "Myanmar", iso2: "MM", value: 8.4 },
  116: { name: "Cambodia", iso2: "KH", value: 11.2 },
  418: { name: "Laos", iso2: "LA", value: 19.6 },
  702: { name: "Singapore", iso2: "SG", value: 28.4 },

  // Oceania
  36: { name: "Australia", iso2: "AU", value: 22.9 },
  554: { name: "New Zealand", iso2: "NZ", value: 34.2 },
  598: { name: "Papua New Guinea", iso2: "PG", value: 5.8 },

  // Africa - North
  818: { name: "Egypt", iso2: "EG", value: 18.4 },
  788: { name: "Tunisia", iso2: "TN", value: 16.8 },
  12: { name: "Algeria", iso2: "DZ", value: 14.2 },
  504: { name: "Morocco", iso2: "MA", value: 16.4 },
  434: { name: "Libya", iso2: "LY", value: 13.8 },

  // Africa - Sub-Saharan
  710: { name: "South Africa", iso2: "ZA", value: 18.6 },
  566: { name: "Nigeria", iso2: "NG", value: 6.4 },
  288: { name: "Ghana", iso2: "GH", value: 10.8 },
  404: { name: "Kenya", iso2: "KE", value: 12.4 },
  231: { name: "Ethiopia", iso2: "ET", value: 6.8 },
  800: { name: "Uganda", iso2: "UG", value: 7.2 },
  834: { name: "Tanzania", iso2: "TZ", value: 6.4 },
  180: { name: "DR Congo", iso2: "CD", value: 5.8 },
  120: { name: "Cameroon", iso2: "CM", value: 8.4 },
  24: { name: "Angola", iso2: "AO", value: 7.6 },
  508: { name: "Mozambique", iso2: "MZ", value: 5.2 },
  72: { name: "Botswana", iso2: "BW", value: 12.4 },
  454: { name: "Malawi", iso2: "MW", value: 4.8 },
  894: { name: "Zambia", iso2: "ZM", value: 10.2 },
  716: { name: "Zimbabwe", iso2: "ZW", value: 8.6 },
  694: { name: "Sierra Leone", iso2: "SL", value: 3.8 },
  324: { name: "Guinea", iso2: "GN", value: 4.2 },
  686: { name: "Senegal", iso2: "SN", value: 8.6 },
  466: { name: "Mali", iso2: "ML", value: 4.8 },
  854: { name: "Burkina Faso", iso2: "BF", value: 4.2 },
  562: { name: "Niger", iso2: "NE", value: 3.2 },
  148: { name: "Chad", iso2: "TD", value: 2.8 },
  729: { name: "Sudan", iso2: "SD", value: 7.4 },
  706: { name: "Somalia", iso2: "SO", value: 2.4 },
  232: { name: "Eritrea", iso2: "ER", value: 3.6 },
  516: { name: "Namibia", iso2: "NA", value: 13.2 },
  426: { name: "Lesotho", iso2: "LS", value: 8.4 },
  748: { name: "Eswatini", iso2: "SZ", value: 9.6 },
  174: { name: "Comoros", iso2: "KM", value: 5.4 },
  646: { name: "Rwanda", iso2: "RW", value: 8.2 },
  108: { name: "Burundi", iso2: "BI", value: 3.8 },
  266: { name: "Gabon", iso2: "GA", value: 10.4 },
  178: { name: "Republic of Congo", iso2: "CG", value: 8.6 },
  140: { name: "Central African Republic", iso2: "CF", value: 2.8 },
  384: { name: "Côte d'Ivoire", iso2: "CI", value: 9.2 },
  288: { name: "Ghana", iso2: "GH", value: 10.8 },
  204: { name: "Benin", iso2: "BJ", value: 6.8 },
  768: { name: "Togo", iso2: "TG", value: 6.4 },
  566: { name: "Nigeria", iso2: "NG", value: 6.4 },
  678: { name: "São Tomé and Príncipe", iso2: "ST", value: 9.2 },
  624: { name: "Guinea-Bissau", iso2: "GW", value: 4.2 },
  430: { name: "Liberia", iso2: "LR", value: 4.8 },
  818: { name: "Egypt", iso2: "EG", value: 18.4 },
  262: { name: "Djibouti", iso2: "DJ", value: 8.4 },
  706: { name: "Somalia", iso2: "SO", value: 2.4 },
  736: { name: "Sudan (former)", iso2: "SS", value: 3.2 },
  728: { name: "South Sudan", iso2: "SS", value: 2.8 },
  516: { name: "Namibia", iso2: "NA", value: 13.2 },
};

// Rewiring organizations
export const rewiringOrgs = {
  840: {
    name: "Rewiring America",
    url: "https://www.rewiringamerica.org",
    country: "United States",
  },
  36: {
    name: "Rewiring Australia",
    url: "https://www.rewiringaustralia.org",
    country: "Australia",
  },
  554: {
    name: "Rewiring Aotearoa",
    url: "https://www.rewiringaotearoa.nz",
    country: "New Zealand",
  },
};

// Get electrification value adjusted for metric
export function getMetricValue(countryId, metric) {
  const entry = electrificationData[countryId];
  if (!entry) return null;
  const base = entry.value;
  // Productive Energy: multiply by ~2.5x efficiency factor
  return metric === 'productive' ? Math.min(base * 2.5, 100) : base;
}

// 35x35 target: 35% electricity share of final energy by 2035
export const TARGET_35x35 = 35;
