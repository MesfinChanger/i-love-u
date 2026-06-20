/**
 * @fileOverview Comprehensive global data for the Prosperity Revolution.
 * Includes ISO countries, world languages, global currencies, and hierarchical locations.
 */

export const COUNTRIES = [
  { code: 'AF', name: 'Afghanistan', phoneCode: '+93' }, { code: 'AX', name: 'Åland Islands', phoneCode: '+358' }, { code: 'AL', name: 'Albania', phoneCode: '+355' },
  { code: 'DZ', name: 'Algeria', phoneCode: '+213' }, { code: 'AS', name: 'American Samoa', phoneCode: '+1' }, { code: 'AD', name: 'Andorra', phoneCode: '+376' },
  { code: 'AO', name: 'Angola', phoneCode: '+244' }, { code: 'AI', name: 'Anguilla', phoneCode: '+1' }, { code: 'AQ', name: 'Antarctica', phoneCode: '+672' },
  { code: 'AG', name: 'Antigua and Barbuda', phoneCode: '+1' }, { code: 'AR', name: 'Argentina', phoneCode: '+54' }, { code: 'AM', name: 'Armenia', phoneCode: '+374' },
  { code: 'AW', name: 'Aruba', phoneCode: '+297' }, { code: 'AU', name: 'Australia', phoneCode: '+61' }, { code: 'AT', name: 'Austria', phoneCode: '+43' },
  { code: 'AZ', name: 'Azerbaijan', phoneCode: '+994' }, { code: 'BS', name: 'Bahamas', phoneCode: '+1' }, { code: 'BH', name: 'Bahrain', phoneCode: '+973' },
  { code: 'BD', name: 'Bangladesh', phoneCode: '+880' }, { code: 'BB', name: 'Barbados', phoneCode: '+1' }, { code: 'BY', name: 'Belarus', phoneCode: '+375' },
  { code: 'BE', name: 'Belgium', phoneCode: '+32' }, { code: 'BZ', name: 'Belize', phoneCode: '+501' }, { code: 'BJ', name: 'Benin', phoneCode: '+229' },
  { code: 'BM', name: 'Bermuda', phoneCode: '+1' }, { code: 'BT', name: 'Bhutan', phoneCode: '+975' }, { code: 'BO', name: 'Bolivia', phoneCode: '+591' },
  { code: 'BA', name: 'Bosnia and Herzegovina', phoneCode: '+387' }, { code: 'BW', name: 'Botswana', phoneCode: '+267' }, { code: 'BR', name: 'Brazil', phoneCode: '+55' },
  { code: 'BN', name: 'Brunei Darussalam', phoneCode: '+673' }, { code: 'BG', name: 'Bulgaria', phoneCode: '+359' }, { code: 'BF', name: 'Burkina Faso', phoneCode: '+226' },
  { code: 'BI', name: 'Burundi', phoneCode: '+257' }, { code: 'KH', name: 'Cambodia', phoneCode: '+855' }, { code: 'CM', name: 'Cameroon', phoneCode: '+237' },
  { code: 'CA', name: 'Canada', phoneCode: '+1' }, { code: 'CV', name: 'Cape Verde', phoneCode: '+238' }, { code: 'KY', name: 'Cayman Islands', phoneCode: '+1' },
  { code: 'CF', name: 'Central African Republic', phoneCode: '+236' }, { code: 'TD', name: 'Chad', phoneCode: '+235' }, { code: 'CL', name: 'Chile', phoneCode: '+56' },
  { code: 'CN', name: 'China', phoneCode: '+86' }, { code: 'CO', name: 'Colombia', phoneCode: '+57' }, { code: 'KM', name: 'Comoros', phoneCode: '+269' },
  { code: 'CG', name: 'Congo', phoneCode: '+242' }, { code: 'CD', name: 'Congo, Democratic Republic', phoneCode: '+243' }, { code: 'CR', name: 'Costa Rica', phoneCode: '+506' },
  { code: 'CI', name: 'Côte d\'Ivoire', phoneCode: '+225' }, { code: 'HR', name: 'Croatia', phoneCode: '+385' }, { code: 'CU', name: 'Cuba', phoneCode: '+53' },
  { code: 'CY', name: 'Cyprus', phoneCode: '+357' }, { code: 'CZ', name: 'Czech Republic', phoneCode: '+420' }, { code: 'DK', name: 'Denmark', phoneCode: '+45' },
  { code: 'DJ', name: 'Djibouti', phoneCode: '+253' }, { code: 'DM', name: 'Dominica', phoneCode: '+1' }, { code: 'DO', name: 'Dominican Republic', phoneCode: '+1' },
  { code: 'EC', name: 'Ecuador', phoneCode: '+593' }, { code: 'EG', name: 'Egypt', phoneCode: '+20' }, { code: 'SV', name: 'El Salvador', phoneCode: '+503' },
  { code: 'GQ', name: 'Equatorial Guinea', phoneCode: '+240' }, { code: 'ER', name: 'Eritrea', phoneCode: '+291' }, { code: 'EE', name: 'Estonia', phoneCode: '+372' },
  { code: 'ET', name: 'Ethiopia', phoneCode: '+251' }, { code: 'FJ', name: 'Fiji', phoneCode: '+679' }, { code: 'FI', name: 'Finland', phoneCode: '+358' },
  { code: 'FR', name: 'France', phoneCode: '+33' }, { code: 'GA', name: 'Gabon', phoneCode: '+241' }, { code: 'GM', name: 'Gambia', phoneCode: '+220' },
  { code: 'GE', name: 'Georgia', phoneCode: '+995' }, { code: 'DE', name: 'Germany', phoneCode: '+49' }, { code: 'GH', name: 'Ghana', phoneCode: '+233' },
  { code: 'GR', name: 'Greece', phoneCode: '+30' }, { code: 'GD', name: 'Grenada', phoneCode: '+1' }, { code: 'GT', name: 'Guatemala', phoneCode: '+502' },
  { code: 'GN', name: 'Guinea', phoneCode: '+224' }, { code: 'GW', name: 'Guinea-Bissau', phoneCode: '+245' }, { code: 'GY', name: 'Guyana', phoneCode: '+592' },
  { code: 'HT', name: 'Haiti', phoneCode: '+509' }, { code: 'HN', name: 'Honduras', phoneCode: '+504' }, { code: 'HK', name: 'Hong Kong', phoneCode: '+852' },
  { code: 'HU', name: 'Hungary', phoneCode: '+36' }, { code: 'IS', name: 'Iceland', phoneCode: '+354' }, { code: 'IN', name: 'India', phoneCode: '+91' },
  { code: 'ID', name: 'Indonesia', phoneCode: '+62' }, { code: 'IR', name: 'Iran', phoneCode: '+98' }, { code: 'IQ', name: 'Iraq', phoneCode: '+964' },
  { code: 'IE', name: 'Ireland', phoneCode: '+353' }, { code: 'IL', name: 'Israel', phoneCode: '+972' }, { code: 'IT', name: 'Italy', phoneCode: '+39' },
  { code: 'JM', name: 'Jamaica', phoneCode: '+1' }, { code: 'JP', name: 'Japan', phoneCode: '+81' }, { code: 'JO', name: 'Jordan', phoneCode: '+962' },
  { code: 'KZ', name: 'Kazakhstan', phoneCode: '+7' }, { code: 'KE', name: 'Kenya', phoneCode: '+254' }, { code: 'KI', name: 'Kiribati', phoneCode: '+686' },
  { code: 'KP', name: 'Korea, North', phoneCode: '+850' }, { code: 'KR', name: 'Korea, South', phoneCode: '+82' }, { code: 'KW', name: 'Kuwait', phoneCode: '+965' },
  { code: 'KG', name: 'Kyrgyzstan', phoneCode: '+996' }, { code: 'LA', name: 'Laos', phoneCode: '+856' }, { code: 'LV', name: 'Latvia', phoneCode: '+371' },
  { code: 'LB', name: 'Lebanon', phoneCode: '+961' }, { code: 'LS', name: 'Lesotho', phoneCode: '+266' }, { code: 'LR', name: 'Liberia', phoneCode: '+231' },
  { code: 'LY', name: 'Libya', phoneCode: '+218' }, { code: 'LI', name: 'Liechtenstein', phoneCode: '+423' }, { code: 'LT', name: 'Lithuania', phoneCode: '+370' },
  { code: 'LU', name: 'Luxembourg', phoneCode: '+352' }, { code: 'MO', name: 'Macao', phoneCode: '+853' }, { code: 'MK', name: 'Macedonia', phoneCode: '+389' },
  { code: 'MG', name: 'Madagascar', phoneCode: '+261' }, { code: 'MW', name: 'Malawi', phoneCode: '+265' }, { code: 'MY', name: 'Malaysia', phoneCode: '+60' },
  { code: 'MV', name: 'Maldives', phoneCode: '+960' }, { code: 'ML', name: 'Mali', phoneCode: '+223' }, { code: 'MT', name: 'Malta', phoneCode: '+356' },
  { code: 'MH', name: 'Marshall Islands', phoneCode: '+692' }, { code: 'MQ', name: 'Martinique', phoneCode: '+596' }, { code: 'MR', name: 'Mauritania', phoneCode: '+222' },
  { code: 'MU', name: 'Mauritius', phoneCode: '+230' }, { code: 'MX', name: 'Mexico', phoneCode: '+52' }, { code: 'FM', name: 'Micronesia', phoneCode: '+691' },
  { code: 'MD', name: 'Moldova', phoneCode: '+373' }, { code: 'MC', name: 'Monaco', phoneCode: '+377' }, { code: 'MN', name: 'Mongolia', phoneCode: '+976' },
  { code: 'ME', name: 'Montenegro', phoneCode: '+382' }, { code: 'MS', name: 'Montserrat', phoneCode: '+1' }, { code: 'MA', name: 'Morocco', phoneCode: '+212' },
  { code: 'MZ', name: 'Mozambique', phoneCode: '+258' }, { code: 'MM', name: 'Myanmar', phoneCode: '+95' }, { code: 'NA', name: 'Namibia', phoneCode: '+264' },
  { code: 'NR', name: 'Nauru', phoneCode: '+674' }, { code: 'NP', name: 'Nepal', phoneCode: '+977' }, { code: 'NL', name: 'Netherlands', phoneCode: '+31' },
  { code: 'NZ', name: 'New Zealand', phoneCode: '+64' }, { code: 'NI', name: 'Nicaragua', phoneCode: '+505' }, { code: 'NE', name: 'Niger', phoneCode: '+227' },
  { code: 'NG', name: 'Nigeria', phoneCode: '+234' }, { code: 'NO', name: 'Norway', phoneCode: '+47' }, { code: 'OM', name: 'Oman', phoneCode: '+968' },
  { code: 'PK', name: 'Pakistan', phoneCode: '+92' }, { code: 'PW', name: 'Palau', phoneCode: '+680' }, { code: 'PS', name: 'Palestine', phoneCode: '+970' },
  { code: 'PA', name: 'Panama', phoneCode: '+507' }, { code: 'PG', name: 'Papua New Guinea', phoneCode: '+675' }, { code: 'PY', name: 'Paraguay', phoneCode: '+595' },
  { code: 'PE', name: 'Peru', phoneCode: '+51' }, { code: 'PH', name: 'Philippines', phoneCode: '+63' }, { code: 'PL', name: 'Poland', phoneCode: '+48' },
  { code: 'PT', name: 'Portugal', phoneCode: '+351' }, { code: 'PR', name: 'Puerto Rico', phoneCode: '+1' }, { code: 'QA', name: 'Qatar', phoneCode: '+974' },
  { code: 'RE', name: 'Réunion', phoneCode: '+262' }, { code: 'RO', name: 'Romania', phoneCode: '+40' }, { code: 'RU', name: 'Russian Federation', phoneCode: '+7' },
  { code: 'RW', name: 'Rwanda', phoneCode: '+250' }, { code: 'KN', name: 'Saint Kitts and Nevis', phoneCode: '+1' }, { code: 'LC', name: 'Saint Lucia', phoneCode: '+1' },
  { code: 'VC', name: 'Saint Vincent and the Grenadines', phoneCode: '+1' }, { code: 'WS', name: 'Samoa', phoneCode: '+685' }, { code: 'SM', name: 'San Marino', phoneCode: '+378' },
  { code: 'ST', name: 'Sao Tome and Principe', phoneCode: '+239' }, { code: 'SA', name: 'Saudi Arabia', phoneCode: '+966' }, { code: 'SN', name: 'Senegal', phoneCode: '+221' },
  { code: 'RS', name: 'Serbia', phoneCode: '+381' }, { code: 'SC', name: 'Seychelles', phoneCode: '+248' }, { code: 'SL', name: 'Sierra Leone', phoneCode: '+232' },
  { code: 'SG', name: 'Singapore', phoneCode: '+65' }, { code: 'SK', name: 'Slovakia', phoneCode: '+421' }, { code: 'SI', name: 'Slovenia', phoneCode: '+386' },
  { code: 'SB', name: 'Solomon Islands', phoneCode: '+677' }, { code: 'SO', name: 'Somalia', phoneCode: '+252' }, { code: 'ZA', name: 'South Africa', phoneCode: '+27' },
  { code: 'ES', name: 'Spain', phoneCode: '+34' }, { code: 'LK', name: 'Sri Lanka', phoneCode: '+94' }, { code: 'SD', name: 'Sudan', phoneCode: '+249' },
  { code: 'SR', name: 'Suriname', phoneCode: '+597' }, { code: 'SZ', name: 'Swaziland', phoneCode: '+268' }, { code: 'SE', name: 'Sweden', phoneCode: '+46' },
  { code: 'CH', name: 'Switzerland', phoneCode: '+41' }, { code: 'SY', name: 'Syria', phoneCode: '+963' }, { code: 'TW', name: 'Taiwan', phoneCode: '+886' },
  { code: 'TJ', name: 'Tajikistan', phoneCode: '+992' }, { code: 'TZ', name: 'Tanzania', phoneCode: '+255' }, { code: 'TH', name: 'Thailand', phoneCode: '+66' },
  { code: 'TL', name: 'Timor-Leste', phoneCode: '+670' }, { code: 'TG', name: 'Togo', phoneCode: '+228' }, { code: 'TK', name: 'Tokelau', phoneCode: '+690' },
  { code: 'TO', name: 'Tonga', phoneCode: '+676' }, { code: 'TT', name: 'Trinidad and Tobago', phoneCode: '+1' }, { code: 'TN', name: 'Tunisia', phoneCode: '+216' },
  { code: 'TR', name: 'Turkey', phoneCode: '+90' }, { code: 'TM', name: 'Turkmenistan', phoneCode: '+993' }, { code: 'TV', name: 'Tuvalu', phoneCode: '+688' },
  { code: 'UG', name: 'Uganda', phoneCode: '+256' }, { code: 'UA', name: 'Ukraine', phoneCode: '+380' }, { code: 'AE', name: 'United Arab Emirates', phoneCode: '+971' },
  { code: 'GB', name: 'United Kingdom', phoneCode: '+44' }, { code: 'US', name: 'United States', phoneCode: '+1' }, { code: 'UY', name: 'Uruguay', phoneCode: '+598' },
  { code: 'UZ', name: 'Uzbekistan', phoneCode: '+998' }, { code: 'VU', name: 'Vanuatu', phoneCode: '+678' }, { code: 'VE', name: 'Venezuela', phoneCode: '+58' },
  { code: 'VN', name: 'Vietnam', phoneCode: '+84' }, { code: 'VG', name: 'Virgin Islands, British', phoneCode: '+1' }, { code: 'VI', name: 'Virgin Islands, U.S.', phoneCode: '+1' },
  { code: 'YE', name: 'Yemen', phoneCode: '+967' }, { code: 'ZM', name: 'Zambia', phoneCode: '+260' }, { code: 'ZW', name: 'Zimbabwe', phoneCode: '+263' }
];

export const WORLD_LOCATIONS: Record<string, { states: { name: string, cities: string[] }[] }> = {
  'ET': { 
    states: [
      { name: 'Addis Ababa', cities: ['Addis Ketema Wereda', 'Akaki Kality Wereda', 'Arada Wereda', 'Bole Wereda', 'Gullele Wereda', 'Kirkos Wereda', 'Kolfe Keranio Wereda', 'Lideta Wereda', 'Nifas Silk-Lafto Wereda', 'Yeka Wereda', 'Lemi Kura Wereda'] },
      { name: 'Amhara', cities: ['Bahir Dar', 'Gondar', 'Dessie', 'Debre Birhan', 'Kombolcha', 'Debre Markos', 'Lalibela', 'Sekota', 'Woldiya', 'Motta', 'Enjibara', 'Debre Tabor', 'Kobo', 'Showra Robit', 'Injibara', 'Bure', 'Finote Selam'] },
      { name: 'Oromia', cities: ['Adama', 'Jimma', 'Bishoftu', 'Shashemene', 'Burayu', 'Nekemte', 'Asella', 'Goba', 'Sebeta', 'Ambo', 'Chiro', 'Dukem', 'Metu', 'Waliso', 'Fiche', 'Gimbi', 'Dembi Dolo', 'Robe', 'Bale Robe', 'Shambu', 'Bedele', 'Agaro'] },
      { name: 'Tigray', cities: ['Mekele', 'Adigrat', 'Shire (Inda Selassie)', 'Axum', 'Humera', 'Alamata', 'Wukro', 'Adwa', 'Maychew', 'Sheraro', 'Abiy Addi', 'Adua', 'Edaga Hamus'] },
      { name: 'Sidama', cities: ['Hawassa', 'Yirgalem', 'Aleta Wendo', 'Leku', 'Benza', 'Daye', 'Hula', 'Irgalem', 'Chuko', 'Dara', 'Wensho'] },
      { name: 'SNNPR', cities: ['Arba Minch', 'Hosanna', 'Dilla', 'Sodo (Wolaita)', 'Butajira', 'Jinka', 'Sawla', 'Bonga', 'Mizan Teferi', 'Worabe', 'Tercha', 'Durame', 'Karati', 'Gidole'] },
      { name: 'Somali', cities: ['Jijiga', 'Gode', 'Degahabur', 'Kebri Dahar', 'Kebridahar', 'Shilavo', 'Warder', 'Shinile', 'Fik', 'Hargele'] },
      { name: 'Afar', cities: ['Semera', 'Asaita', 'Logia', 'Dubti', 'Chifra', 'Gewane', 'Awash Sebat Kilo', 'Ewa', 'Mille'] },
      { name: 'Gambela', cities: ['Gambela City', 'Itang', 'Pugnido', 'Abobo', 'Lare', 'Jore'] },
      { name: 'Benishangul-Gumuz', cities: ['Assosa', 'Kamashi', 'Gilgel Beles', 'Bambasi', 'Mendi', 'Bulen'] },
      { name: 'Harari', cities: ['Harar City', 'Amir-Nur Wereda', 'Abadir Wereda', 'Shenkor Wereda'] },
      { name: 'Dire Dawa', cities: ['Dire Dawa City', 'Gurgura Wereda'] }
    ]
  },
  'US': { 
    states: [
      { name: 'Alabama', cities: ['Birmingham', 'Montgomery', 'Mobile', 'Huntsville', 'Tuscaloosa', 'Hoover', 'Dothan', 'Auburn', 'Decatur', 'Madison'] },
      { name: 'Alaska', cities: ['Anchorage', 'Fairbanks', 'Juneau', 'Sitka', 'Ketchikan', 'Wasilla', 'Kenai', 'Kodiak', 'Bethel', 'Palmer'] },
      { name: 'Arizona', cities: ['Phoenix', 'Tucson', 'Mesa', 'Chandler', 'Scottsdale', 'Glendale', 'Gilbert', 'Tempe', 'Peoria', 'Surprise'] },
      { name: 'Arkansas', cities: ['Little Rock', 'Fort Smith', 'Fayetteville', 'Springdale', 'Jonesboro', 'Rogers', 'Conway', 'North Little Rock', 'Bentonville', 'Hot Springs'] },
      { name: 'California', cities: ['Los Angeles', 'San Diego', 'San Jose', 'San Francisco', 'Fresno', 'Sacramento', 'Long Beach', 'Oakland', 'Bakersfield', 'Anaheim', 'Irvine', 'Riverside'] },
      { name: 'Colorado', cities: ['Denver', 'Colorado Springs', 'Aurora', 'Fort Collins', 'Lakewood', 'Thornton', 'Arvada', 'Westminster', 'Pueblo', 'Boulder'] },
      { name: 'Connecticut', cities: ['Bridgeport', 'New Haven', 'Stamford', 'Hartford', 'Waterbury', 'Norwalk', 'Danbury', 'New Britain', 'West Hartford', 'Greenwich'] },
      { name: 'Delaware', cities: ['Wilmington', 'Dover', 'Newark', 'Middletown', 'Smyrna', 'Milford', 'Seaford', 'Georgetown', 'Elsmere', 'New Castle'] },
      { name: 'Florida', cities: ['Jacksonville', 'Miami', 'Tampa', 'Orlando', 'St. Petersburg', 'Hialeah', 'Tallahassee', 'Fort Lauderdale', 'Port St. Lucie', 'Cape Coral', 'Pembroke Pines'] },
      { name: 'Georgia', cities: ['Atlanta', 'Augusta', 'Columbus', 'Macon', 'Savannah', 'Athens', 'Sandy Springs', 'South Fulton', 'Roswell', 'Johns Creek'] },
      { name: 'Hawaii', cities: ['Honolulu', 'East Honolulu', 'Pearl City', 'Hilo', 'Kailua', 'Waipahu', 'Kaneohe', 'Mililani Town', 'Kahului', 'Ewa Gentry'] },
      { name: 'Idaho', cities: ['Boise', 'Meridian', 'Nampa', 'Idaho Falls', 'Caldwell', 'Pocatello', 'Coeur d\'Alene', 'Twin Falls', 'Post Falls', 'Eagle'] },
      { name: 'Illinois', cities: ['Chicago', 'Aurora', 'Joliet', 'Naperville', 'Rockford', 'Springfield', 'Elgin', 'Peoria', 'Champaign', 'Waukegan'] },
      { name: 'Indiana', cities: ['Indianapolis', 'Fort Wayne', 'Evansville', 'South Bend', 'Carmel', 'Fishers', 'Bloomington', 'Hammond', 'Gary', 'Lafayette'] },
      { name: 'Iowa', cities: ['Des Moines', 'Cedar Rapids', 'Davenport', 'Sioux City', 'Iowa City', 'Waterloo', 'Ames', 'West Des Moines', 'Council Bluffs', 'Ankeny'] },
      { name: 'Kansas', cities: ['Wichita', 'Overland Park', 'Kansas City', 'Olathe', 'Topeka', 'Lawrence', 'Shawnee', 'Lenexa', 'Manhattan', 'Salina'] },
      { name: 'Kentucky', cities: ['Louisville', 'Lexington', 'Bowling Green', 'Owensboro', 'Covington', 'Hopkinsville', 'Richmond', 'Florence', 'Georgetown', 'Henderson'] },
      { name: 'Louisiana', cities: ['New Orleans', 'Baton Rouge', 'Shreveport', 'Metairie', 'Lafayette', 'Lake Charles', 'Kenner', 'Bossier City', 'Monroe', 'Alexandria'] },
      { name: 'Maine', cities: ['Portland', 'Lewiston', 'Bangor', 'South Portland', 'Auburn', 'Biddeford', 'Augusta', 'Saco', 'Westbrook', 'Waterville'] },
      { name: 'Maryland', cities: ['Baltimore', 'Columbia', 'Germantown', 'Silver Spring', 'Waldorf', 'Frederick', 'Ellicott City', 'Glen Burnie', 'Gaithersburg', 'Rockville'] },
      { name: 'Massachusetts', cities: ['Boston', 'Worcester', 'Springfield', 'Cambridge', 'Lowell', 'Brockton', 'Quincy', 'Lynn', 'New Bedford', 'Fall River'] },
      { name: 'Michigan', cities: ['Detroit', 'Grand Rapids', 'Warren', 'Sterling Heights', 'Ann Arbor', 'Lansing', 'Flint', 'Dearborn', 'Livonia', 'Troy'] },
      { name: 'Minnesota', cities: ['Minneapolis', 'Saint Paul', 'Rochester', 'Duluth', 'Bloomington', 'Brooklyn Park', 'Plymouth', 'Woodbury', 'Maple Grove', 'Blaine'] },
      { name: 'Mississippi', cities: ['Jackson', 'Gulfport', 'Southaven', 'Biloxi', 'Hattiesburg', 'Olive Branch', 'Tupelo', 'Meridian', 'Clinton', 'Madison'] },
      { name: 'Missouri', cities: ['Kansas City', 'Saint Louis', 'Springfield', 'Independence', 'Columbia', 'Lee\'s Summit', "O'Fallon", 'St. Joseph', 'St. Charles', 'Blue Springs'] },
      { name: 'Montana', cities: ['Billings', 'Missoula', 'Great Falls', 'Bozeman', 'Butte', 'Helena', 'Kalispell', 'Havre', 'Anaconda', 'Miles City'] },
      { name: 'Nebraska', cities: ['Omaha', 'Lincoln', 'Bellevue', 'Grand Island', 'Kearney', 'Fremont', 'Hastings', 'Norfolk', 'North Platte', 'Columbus'] },
      { name: 'Nevada', cities: ['Las Vegas', 'Henderson', 'Reno', 'North Las Vegas', 'Sparks', 'Carson City', 'Fernley', 'Elko', 'Mesquite', 'Boulder City'] },
      { name: 'New Hampshire', cities: ['Manchester', 'Nashua', 'Concord', 'Derry', 'Dover', 'Rochester', 'Salem', 'Merrimack', 'Hudson', 'Londonderry'] },
      { name: 'New Jersey', cities: ['Newark', 'Jersey City', 'Paterson', 'Elizabeth', 'Lakewood', 'Edison', 'Woodbridge', 'Toms River', 'Hamilton', 'Trenton'] },
      { name: 'New Mexico', cities: ['Albuquerque', 'Las Cruces', 'Rio Rancho', 'Santa Fe', 'Roswell', 'Farmington', 'South Valley', 'Clovis', 'Hypbs', 'Alamogordo'] },
      { name: 'New York', cities: ['New York City', 'Buffalo', 'Rochester', 'Yonkers', 'Syracuse', 'Albany', 'New Rochelle', 'Mount Vernon', 'Schenectady', 'Utica'] },
      { name: 'North Carolina', cities: ['Charlotte', 'Raleigh', 'Greensboro', 'Durham', 'Winston-Salem', 'Fayetteville', 'Cary', 'Wilmington', 'High Point', 'Concord'] },
      { name: 'North Dakota', cities: ['Fargo', 'Bismarck', 'Grand Forks', 'Minot', 'West Fargo', 'Williston', 'Dickinson', 'Mandat', 'Jamestown', 'Wahpeton'] },
      { name: 'Ohio', cities: ['Columbus', 'Cleveland', 'Cincinnati', 'Toledo', 'Akron', 'Dayton', 'Parma', 'Canton', 'Youngstown', 'Lorain'] },
      { name: 'Oklahoma', cities: ['Oklahoma City', 'Tulsa', 'Norman', 'Broken Arrow', 'Edmond', 'Lawton', 'Moore', 'Midwest City', 'Enid', 'Stillwater'] },
      { name: 'Oregon', cities: [
        'Portland', 'Salem', 'Eugene', 'Gresham', 'Hillsboro', 'Beaverton', 'Bend', 'Medford', 'Springfield', 'Corvallis',
        'Albany', 'Tigard', 'Lake Oswego', 'Keizer', 'Grants Pass', 'Oregon City', 'McMinnville', 'Redmond', 'Tualatin', 'West Linn',
        'Woodburn', 'Newberg', 'Roseburg', 'Forest Grove', 'Wilsonville', 'Klamath Falls', 'Ashland', 'Milwaukie', 'Sherwood', 'Central Point',
        'Hermiston', 'Canby', 'Lebanon', 'Dallas', 'Troutdale', 'Happy Valley', 'Clackamas', 'Sunnyside', 'Oak Grove', 'Gladstone',
        'Damascus', 'Boring', 'Estacada', 'Molalla', 'Coos Bay', 'Pendleton', 'St. Helens', 'The Dalles', 'Baker City', 'Ontario', 
        'Astoria', 'Prineville', 'Lincoln City', 'Sandy', 'Independence', 'Monmouth', 'Cottage Grove', 'Madras', 'Seaside', 
        'Junction City', 'Brookings', 'Silverton', 'Talent', 'Phoenix', 'Sweet Home', 'Stayton'
      ] },
      { name: 'Pennsylvania', cities: ['Philadelphia', 'Pittsburgh', 'Allentown', 'Erie', 'Reading', 'Scranton', 'Bethlehem', 'Lancaster', 'Harrisburg', 'Altoona'] },
      { name: 'Rhode Island', cities: ['Providence', 'Cranston', 'Warwick', 'Pawtucket', 'East Providence', 'Woonsocket', 'Cumberland', 'Coventry', 'North Providence', 'South Kingstown'] },
      { name: 'South Carolina', cities: ['Charleston', 'Columbia', 'North Charleston', 'Mount Pleasant', 'Rock Hill', 'Greenville', 'Summerville', 'Goose Creek', 'Greer', 'Sumter'] },
      { name: 'South Dakota', cities: ['Sioux Falls', 'Rapid City', 'Aberdeen', 'Brookings', 'Watertown', 'Mitchell', 'Yankton', 'Pierre', 'Huron', 'Spearfish'] },
      { name: 'Tennessee', cities: ['Nashville', 'Memphis', 'Knoxville', 'Chattanooga', 'Clarksville', 'Murfreesboro', 'Franklin', 'Jackson', 'Johnson City', 'Bartlett'] },
      { name: 'Texas', cities: ['Houston', 'San Antonio', 'Dallas', 'Austin', 'Fort Worth', 'El Paso', 'Arlington', 'Corpus Christi', 'Plano', 'Lubbock', 'Laredo', 'Irving'] },
      { name: 'Utah', cities: ['Salt Lake City', 'West Valley City', 'West Jordan', 'Provo', 'Orem', 'Sandy', 'St. George', 'Ogden', 'Layton', 'South Jordan'] },
      { name: 'Vermont', cities: ['Burlington', 'South Burlington', 'Rutland', 'Barre', 'Montpelier', 'Winooski', 'St. Albans', 'Newport', 'Vergennes', 'Bennington'] },
      { name: 'Virginia', cities: ['Virginia Beach', 'Norfolk', 'Chesapeake', 'Richmond', 'Newport News', 'Alexandria', 'Hampton', 'Roanoke', 'Portsmouth', 'Suffolk'] },
      { name: 'Washington', cities: ['Seattle', 'Spokane', 'Tacoma', 'Vancouver', 'Bellevue', 'Kent', 'Everett', 'Renton', 'Spokane Valley', 'Federal Way'] },
      { name: 'West Virginia', cities: ['Charleston', 'Huntington', 'Morgantown', 'Parkersburg', 'Wheeling', 'Weirton', 'Fairmont', 'Martinsburg', 'Beckley', 'Clarksburg'] },
      { name: 'Wisconsin', cities: ['Milwaukee', 'Madison', 'Green Bay', 'Kenosha', 'Racine', 'Appleton', 'Waukesha', 'Eau Claire', 'Oshkosh', 'Janesville'] },
      { name: 'Wyoming', cities: ['Cheyenne', 'Casper', 'Laramie', 'Gillette', 'Rock Springs', 'Sheridan', 'Green River', 'Evanston', 'Riverton', 'Jackson'] }
    ]
  },
  'NG': { 
    states: [
      { name: 'Lagos', cities: ['Ikeja', 'Lekki', 'Ikorodu', 'Epe', 'Badagry', 'Surulere', 'Agege', 'Mushin', 'Victoria Island', 'Ajah', 'Yaba', 'Alimosho', 'Oshodi', 'Apapa'] },
      { name: 'Abuja', cities: ['Garki', 'Wuse', 'Asokoro', 'Maitama', 'Kuje', 'Gwagwalada', 'Bwari', 'Abaji', 'Karu', 'Nyanya', 'Kubwa'] },
      { name: 'Kano', cities: ['Kano City', 'Wudil', 'Gwarzo', 'Bichi', 'Gaya', 'Rano', 'Dambatta', 'Minjibir', 'Gezawa', 'Tofa'] },
      { name: 'Rivers', cities: ['Port Harcourt', 'Obio-Akpor', 'Bonny', 'Eleme', 'Okrika', 'Degema', 'Ahoada', 'Omoku', 'Oyigbo'] },
      { name: 'Oyo', cities: ['Ibadan', 'Ogbomosho', 'Oyo Town', 'Iseyin', 'Saki', 'Eruwa', 'Lanlate', 'Kisi'] }
    ]
  },
  'KE': { 
    states: [
      { name: 'Nairobi', cities: ['Westlands', 'Dagoretti', 'Kasarani', 'Kibra', 'Langata', 'Embakasi', 'Makadara', 'Mathare', 'Parklands', 'Karen', 'Runda', 'Lavington', 'Eastleigh'] },
      { name: 'Mombasa', cities: ['Island', 'Changamwe', 'Likoni', 'Kisauni', 'Nyali', 'Jomvu', 'Mvita', 'Tudor', 'Bamburi', 'Shanzu'] },
      { name: 'Kisumu', cities: ['Kisumu Central', 'Kisumu West', 'Nyakach', 'Muhoroni', 'Seme', 'Kisumu East', 'Nyang\'ande', 'Maseno'] },
      { name: 'Kiambu', cities: ['Thika', 'Kiambu Town', 'Limuru', 'Kikuyu', 'Ruiru', 'Karuri', 'Githunguri', 'Gatundu'] },
      { name: 'Nakuru', cities: ['Nakuru City', 'Naivasha', 'Molo', 'Gilgil', 'Njoro', 'Subukia', 'Bahati', 'Rongai'] }
    ]
  },
  'IN': { 
    states: [
      { name: 'Maharashtra', cities: ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Thane', 'Aurangabad', 'Solapur', 'Amravati', 'Navi Mumbai', 'Kolhapur', 'Akola', 'Latur'] },
      { name: 'Karnataka', cities: ['Bengaluru', 'Mysuru', 'Hubballi', 'Mangaluru', 'Belagavi', 'Kalaburagi', 'Ballari', 'Vijayapura', 'Shivamogga', 'Tumakuru'] },
      { name: 'Delhi', cities: ['New Delhi', 'Old Delhi', 'Dwarka', 'Rohini', 'Saket', 'Vasant Kunj', 'Janakpuri', 'Laxmi Nagar', 'Connaught Place', 'Karol Bagh'] },
      { name: 'Tamil Nadu', cities: ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tiruppur', 'Erode', 'Vellore', 'Thoothukudi', 'Nagercoil'] },
      { name: 'West Bengal', cities: ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Maheshtala', 'Rajpur Sonarpur', 'Gopalpur', 'Bhatpara', 'Panihati'] }
    ]
  },
  'GB': { 
    states: [
      { name: 'England', cities: ['London', 'Birmingham', 'Manchester', 'Liverpool', 'Leeds', 'Sheffield', 'Bristol', 'Newcastle', 'Nottingham', 'Leicester', 'Southampton', 'Reading', 'Oxford', 'Cambridge'] },
      { name: 'Scotland', cities: ['Glasgow', 'Edinburgh', 'Aberdeen', 'Dundee', 'Inverness', 'Perth', 'Stirling', 'Paisley', 'East Kilbride', 'Livingston'] },
      { name: 'Wales', cities: ['Cardiff', 'Swansea', 'Newport', 'Wrexham', 'Barry', 'Neath', 'Bridgend', 'Llanelli', 'Merthyr Tydfil'] },
      { name: 'Northern Ireland', cities: ['Belfast', 'Derry', 'Lisburn', 'Newry', 'Newtownabbey', 'Bangor', 'Castlereagh', 'Ballymena', 'Coleraine'] }
    ]
  },
  'CA': { 
    states: [
      { name: 'Ontario', cities: ['Toronto', 'Ottawa', 'Mississauga', 'Hamilton', 'Brampton', 'London', 'Markham', 'Vaughan', 'Kitchener', 'Windsor', 'Oakville', 'Burlington'] },
      { name: 'Quebec', cities: ['Montreal', 'Quebec City', 'Laval', 'Gatineau', 'Longueuil', 'Sherbrooke', 'Saguenay', 'Levis', 'Trois-Rivières', 'Terrebonne'] },
      { name: 'British Columbia', cities: ['Vancouver', 'Victoria', 'Surrey', 'Burnaby', 'Richmond', 'Kelowna', 'Abbotsford', 'Coquitlam', 'Nanaimo', 'Kamloops'] },
      { name: 'Alberta', cities: ['Calgary', 'Edmonton', 'Red Deer', 'Lethbridge', 'St. Albert', 'Medicine Hat', 'Grande Prairie', 'Airdrie'] }
    ]
  },
  'BR': { 
    states: [
      { name: 'São Paulo', cities: ['São Paulo City', 'Campinas', 'Guarulhos', 'Santo André', 'São Bernardo do Campo', 'Osasco', 'Ribeirão Preto', 'Sorocaba', 'Santos', 'São José dos Campos'] },
      { name: 'Rio de Janeiro', cities: ['Rio de Janeiro City', 'Niterói', 'São Gonçalo', 'Duque de Caxias', 'Nova Iguaçu', 'Belford Roxo', 'Camppos dos Goytacazes', 'São João de Meriti'] },
      { name: 'Minas Gerais', cities: ['Belo Horizonte', 'Uberlândia', 'Contagem', 'Juiz de Fora', 'Betim', 'Montes Claros', 'Ribeirão das Neves', 'Uberaba'] },
      { name: 'Bahia', cities: ['Salvador', 'Feira de Santana', 'Vitória da Conquista', 'Camaçari', 'Itabuna', 'Juazeiro', 'Ilhéus', 'Lauro de Freitas'] }
    ]
  },
  'DEFAULT': {
    states: [
      { name: 'Capital Region', cities: ['Main City', 'North District', 'South District', 'Central Wereda', 'Sub-City Alpha', 'Sub-City Beta'] },
      { name: 'Coastal Region', cities: ['Port Village', 'Beach Town', 'Island District', 'Shoreline Wereda', 'Marina Bay', 'Seaside Village'] },
      { name: 'Rural Region', cities: ['Agricultural Village', 'Mountain District', 'Forest Wereda', 'Highland Village', 'River Valley', 'Green Pastures'] }
    ]
  }
};

export const LANGUAGES = [
  'Afrikaans', 'Albanian', 'Amharic', 'Arabic', 'Armenian', 'Azerbaijani', 'Basque', 'Belarusian', 'Bengali', 'Bosnian',
  'Bulgarian', 'Catalan', 'Cebuano', 'Chichewa', 'Chinese (Simplified)', 'Chinese (Traditional)', 'Corsican', 'Croatian',
  'Czech', 'Danish', 'Dutch', 'English', 'Esperanto', 'Estonian', 'Filipino', 'Finnish', 'French', 'Frisian', 'Galician',
  'Georgian', 'German', 'Greek', 'Gujarati', 'Haitian Creole', 'Hausa', 'Hawaiian', 'Hebrew', 'Hindi', 'Hmong', 'Hungarian',
  'Icelandic', 'Igbo', 'Indonesian', 'Irish', 'Italian', 'Japanese', 'Javanese', 'Kannada', 'Kazakh', 'Khmer', 'Kinyarwanda',
  'Korean', 'Kurdish (Kurmanji)', 'Kyrgyz', 'Lao', 'Latin', 'Latvian', 'Lithuanian', 'Luxembourgish', 'Malagasy', 'Malay',
  'Malayalam', 'Maltese', 'Maori', 'Marathi', 'Mongolian', 'Myanmar (Burmese)', 'Nepali', 'Norwegian', 'Odia (Oriya)',
  'Pashto', 'Persian', 'Polish', 'Portuguese', 'Punjabi', 'Romanian', 'Russian', 'Samoan', 'Scots Gaelic', 'Serbian',
  'Sesotho', 'Shona', 'Sindhi', 'Sinhala', 'Slovak', 'Slovenian', 'Somali', 'Spanish', 'Sundanese', 'Swahili', 'Swedish',
  'Tajik', 'Tamil', 'Tatar', 'Telugu', 'Thai', 'Turkish', 'Turkmen', 'Ukrainian', 'Urdu', 'Uyghur', 'Uzbek', 'Vietnamese',
  'Welsh', 'Xhosa', 'Yiddish', 'Yoruba', 'Zulu'
];

export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
  { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah' },
  { code: 'MXN', symbol: '$', name: 'Mexican Peso' },
  { code: 'TRY', symbol: '₺', name: 'Turkish Lira' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal' }
];
