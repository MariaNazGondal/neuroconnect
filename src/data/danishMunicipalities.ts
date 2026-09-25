export interface KommuneInfo {
  name: string;
  region: 'Hovedstaden' | 'Sjælland' | 'Syddanmark' | 'Midtjylland' | 'Nordjylland';
  lat: number;
  lng: number;
}

export const DANISH_KOMMUNER: KommuneInfo[] = [
  // Prominent / common areas for immigrant families & major cities
  { name: 'København', region: 'Hovedstaden', lat: 55.6761, lng: 12.5683 },
  { name: 'Aarhus', region: 'Midtjylland', lat: 56.1629, lng: 10.2039 },
  { name: 'Albertslund', region: 'Hovedstaden', lat: 55.6567, lng: 12.3582 },
  { name: 'Odense', region: 'Syddanmark', lat: 55.4038, lng: 10.4024 },
  { name: 'Aalborg', region: 'Nordjylland', lat: 57.0488, lng: 9.9217 },
  { name: 'Frederiksberg', region: 'Hovedstaden', lat: 55.6791, lng: 12.5346 },
  { name: 'Gladsaxe', region: 'Hovedstaden', lat: 55.7483, lng: 12.4828 },
  { name: 'Høje-Taastrup', region: 'Hovedstaden', lat: 55.6508, lng: 12.2747 },
  { name: 'Hvidovre', region: 'Hovedstaden', lat: 55.6425, lng: 12.4789 },
  { name: 'Rødovre', region: 'Hovedstaden', lat: 55.6811, lng: 12.4556 },
  { name: 'Brøndby', region: 'Hovedstaden', lat: 55.6528, lng: 12.4178 },
  { name: 'Ballerup', region: 'Hovedstaden', lat: 55.7317, lng: 12.3633 },
  { name: 'Herlev', region: 'Hovedstaden', lat: 55.7236, lng: 12.4403 },
  { name: 'Gentofte', region: 'Hovedstaden', lat: 55.7533, lng: 12.5517 },
  { name: 'Lyngby-Taarbæk', region: 'Hovedstaden', lat: 55.7708, lng: 12.5028 },
  { name: 'Roskilde', region: 'Sjælland', lat: 55.6415, lng: 12.0803 },
  { name: 'Vejle', region: 'Syddanmark', lat: 55.7093, lng: 9.5357 },
  { name: 'Esbjerg', region: 'Syddanmark', lat: 55.4676, lng: 8.4519 },
  { name: 'Kolding', region: 'Syddanmark', lat: 55.4959, lng: 9.4731 },
  { name: 'Horsens', region: 'Midtjylland', lat: 55.8607, lng: 9.8503 },
  { name: 'Randers', region: 'Midtjylland', lat: 56.4607, lng: 10.0364 },
  { name: 'Silkeborg', region: 'Midtjylland', lat: 56.1697, lng: 9.5451 },
  { name: 'Helsingør', region: 'Hovedstaden', lat: 56.0361, lng: 12.6136 },
  { name: 'Hillerød', region: 'Hovedstaden', lat: 55.9278, lng: 12.3008 },
  { name: 'Greve', region: 'Sjælland', lat: 55.5842, lng: 12.2981 },
  { name: 'Køge', region: 'Sjælland', lat: 55.4583, lng: 12.1822 },
  { name: 'Slagelse', region: 'Sjælland', lat: 55.4028, lng: 11.3547 },
  { name: 'Holbæk', region: 'Sjælland', lat: 55.7175, lng: 11.7167 },
  { name: 'Næstved', region: 'Sjælland', lat: 55.2300, lng: 11.7611 },
  { name: 'Sønderborg', region: 'Syddanmark', lat: 54.9138, lng: 9.7922 },
  { name: 'Viborg', region: 'Midtjylland', lat: 56.4531, lng: 9.4020 },
  { name: 'Herning', region: 'Midtjylland', lat: 56.1393, lng: 8.9738 },
  { name: 'Fredericia', region: 'Syddanmark', lat: 55.5658, lng: 9.7533 },
  { name: 'Hjørring', region: 'Nordjylland', lat: 57.4642, lng: 9.9839 },
  { name: 'Frederikshavn', region: 'Nordjylland', lat: 57.4408, lng: 10.5367 },
  { name: 'Furesø', region: 'Hovedstaden', lat: 55.7950, lng: 12.3789 },
  { name: 'Rudersdal', region: 'Hovedstaden', lat: 55.8317, lng: 12.4939 },
  { name: 'Egedal', region: 'Hovedstaden', lat: 55.7667, lng: 12.2167 },
  { name: 'Tårnby', region: 'Hovedstaden', lat: 55.6292, lng: 12.6078 },
  { name: 'Dragør', region: 'Hovedstaden', lat: 55.5933, lng: 12.6739 },
  { name: 'Ishøj', region: 'Hovedstaden', lat: 55.6158, lng: 12.3556 },
  { name: 'Vallensbæk', region: 'Hovedstaden', lat: 55.6358, lng: 12.3872 },
  { name: 'Bornholm', region: 'Hovedstaden', lat: 55.1300, lng: 14.9100 }
];

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'da', name: 'Danish', native: 'Dansk', flag: '🇩🇰' },
  { code: 'ar', name: 'Arabic', native: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  { code: 'uk', name: 'Ukrainian', native: 'Українська', flag: '🇺🇦' },
  { code: 'tr', name: 'Turkish', native: 'Türkçe', flag: '🇹🇷' },
  { code: 'so', name: 'Somali', native: 'Soomaali', flag: '🇸🇴' },
  { code: 'pl', name: 'Polish', native: 'Polski', flag: '🇵🇱' },
  { code: 'fa', name: 'Persian/Dari', native: 'فارسی', flag: '🇮🇷', dir: 'rtl' },
  { code: 'ur', name: 'Urdu', native: 'اردو', flag: '🇵🇰', dir: 'rtl' },
  { code: 'es', name: 'Spanish', native: 'Español', flag: '🇪🇸' }
];
