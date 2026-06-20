/**
 * @fileOverview Comprehensive global data for the Prosperity Revolution.
 * Includes ISO countries, world languages, global currencies, and hierarchical locations.
 */

export const COUNTRIES = [
  { code: 'AF', name: 'Afghanistan' }, { code: 'AX', name: 'Åland Islands' }, { code: 'AL', name: 'Albania' },
  { code: 'DZ', name: 'Algeria' }, { code: 'AS', name: 'American Samoa' }, { code: 'AD', name: 'Andorra' },
  { code: 'AO', name: 'Angola' }, { code: 'AI', name: 'Anguilla' }, { code: 'AQ', name: 'Antarctica' },
  { code: 'AG', name: 'Antigua and Barbuda' }, { code: 'AR', name: 'Argentina' }, { code: 'AM', name: 'Armenia' },
  { code: 'AW', name: 'Aruba' }, { code: 'AU', name: 'Australia' }, { code: 'AT', name: 'Austria' },
  { code: 'AZ', name: 'Azerbaijan' }, { code: 'BS', name: 'Bahamas' }, { code: 'BH', name: 'Bahrain' },
  { code: 'BD', name: 'Bangladesh' }, { code: 'BB', name: 'Barbados' }, { code: 'BY', name: 'Belarus' },
  { code: 'BE', name: 'Belgium' }, { code: 'BZ', name: 'Belize' }, { code: 'BJ', name: 'Benin' },
  { code: 'BM', name: 'Bermuda' }, { code: 'BT', name: 'Bhutan' }, { code: 'BO', name: 'Bolivia' },
  { code: 'BA', name: 'Bosnia and Herzegovina' }, { code: 'BW', name: 'Botswana' }, { code: 'BR', name: 'Brazil' },
  { code: 'BN', name: 'Brunei Darussalam' }, { code: 'BG', name: 'Bulgaria' }, { code: 'BF', name: 'Burkina Faso' },
  { code: 'BI', name: 'Burundi' }, { code: 'KH', name: 'Cambodia' }, { code: 'CM', name: 'Cameroon' },
  { code: 'CA', name: 'Canada' }, { code: 'CV', name: 'Cape Verde' }, { code: 'KY', name: 'Cayman Islands' },
  { code: 'CF', name: 'Central African Republic' }, { code: 'TD', name: 'Chad' }, { code: 'CL', name: 'Chile' },
  { code: 'CN', name: 'China' }, { code: 'CO', name: 'Colombia' }, { code: 'KM', name: 'Comoros' },
  { code: 'CG', name: 'Congo' }, { code: 'CD', name: 'Congo, Democratic Republic' }, { code: 'CR', name: 'Costa Rica' },
  { code: 'CI', name: 'Côte d\'Ivoire' }, { code: 'HR', name: 'Croatia' }, { code: 'CU', name: 'Cuba' },
  { code: 'CY', name: 'Cyprus' }, { code: 'CZ', name: 'Czech Republic' }, { code: 'DK', name: 'Denmark' },
  { code: 'DJ', name: 'Djibouti' }, { code: 'DM', name: 'Dominica' }, { code: 'DO', name: 'Dominican Republic' },
  { code: 'EC', name: 'Ecuador' }, { code: 'EG', name: 'Egypt' }, { code: 'SV', name: 'El Salvador' },
  { code: 'GQ', name: 'Equatorial Guinea' }, { code: 'ER', name: 'Eritrea' }, { code: 'EE', name: 'Estonia' },
  { code: 'ET', name: 'Ethiopia' }, { code: 'FJ', name: 'Fiji' }, { code: 'FI', name: 'Finland' },
  { code: 'FR', name: 'France' }, { code: 'GA', name: 'Gabon' }, { code: 'GM', name: 'Gambia' },
  { code: 'GE', name: 'Georgia' }, { code: 'DE', name: 'Germany' }, { code: 'GH', name: 'Ghana' },
  { code: 'GR', name: 'Greece' }, { code: 'GD', name: 'Grenada' }, { code: 'GT', name: 'Guatemala' },
  { code: 'GN', name: 'Guinea' }, { code: 'GW', name: 'Guinea-Bissau' }, { code: 'GY', name: 'Guyana' },
  { code: 'HT', name: 'Haiti' }, { code: 'HN', name: 'Honduras' }, { code: 'HK', name: 'Hong Kong' },
  { code: 'HU', name: 'Hungary' }, { code: 'IS', name: 'Iceland' }, { code: 'IN', name: 'India' },
  { code: 'ID', name: 'Indonesia' }, { code: 'IR', name: 'Iran' }, { code: 'IQ', name: 'Iraq' },
  { code: 'IE', name: 'Ireland' }, { code: 'IL', name: 'Israel' }, { code: 'IT', name: 'Italy' },
  { code: 'JM', name: 'Jamaica' }, { code: 'JP', name: 'Japan' }, { code: 'JO', name: 'Jordan' },
  { code: 'KZ', name: 'Kazakhstan' }, { code: 'KE', name: 'Kenya' }, { code: 'KI', name: 'Kiribati' },
  { code: 'KP', name: 'Korea, North' }, { code: 'KR', name: 'Korea, South' }, { code: 'KW', name: 'Kuwait' },
  { code: 'KG', name: 'Kyrgyzstan' }, { code: 'LA', name: 'Laos' }, { code: 'LV', name: 'Latvia' },
  { code: 'LB', name: 'Lebanon' }, { code: 'LS', name: 'Lesotho' }, { code: 'LR', name: 'Liberia' },
  { code: 'LY', name: 'Libya' }, { code: 'LI', name: 'Liechtenstein' }, { code: 'LT', name: 'Lithuania' },
  { code: 'LU', name: 'Luxembourg' }, { code: 'MO', name: 'Macao' }, { code: 'MK', name: 'Macedonia' },
  { code: 'MG', name: 'Madagascar' }, { code: 'MW', name: 'Malawi' }, { code: 'MY', name: 'Malaysia' },
  { code: 'MV', name: 'Maldives' }, { code: 'ML', name: 'Mali' }, { code: 'MT', name: 'Malta' },
  { code: 'MH', name: 'Marshall Islands' }, { code: 'MQ', name: 'Martinique' }, { code: 'MR', name: 'Mauritania' },
  { code: 'MU', name: 'Mauritius' }, { code: 'MX', name: 'Mexico' }, { code: 'FM', name: 'Micronesia' },
  { code: 'MD', name: 'Moldova' }, { code: 'MC', name: 'Monaco' }, { code: 'MN', name: 'Mongolia' },
  { code: 'ME', name: 'Montenegro' }, { code: 'MS', name: 'Montserrat' }, { code: 'MA', name: 'Morocco' },
  { code: 'MZ', name: 'Mozambique' }, { code: 'MM', name: 'Myanmar' }, { code: 'NA', name: 'Namibia' },
  { code: 'NR', name: 'Nauru' }, { code: 'NP', name: 'Nepal' }, { code: 'NL', name: 'Netherlands' },
  { code: 'NZ', name: 'New Zealand' }, { code: 'NI', name: 'Nicaragua' }, { code: 'NE', name: 'Niger' },
  { code: 'NG', name: 'Nigeria' }, { code: 'NO', name: 'Norway' }, { code: 'OM', name: 'Oman' },
  { code: 'PK', name: 'Pakistan' }, { code: 'PW', name: 'Palau' }, { code: 'PS', name: 'Palestine' },
  { code: 'PA', name: 'Panama' }, { code: 'PG', name: 'Papua New Guinea' }, { code: 'PY', name: 'Paraguay' },
  { code: 'PE', name: 'Peru' }, { code: 'PH', name: 'Philippines' }, { code: 'PL', name: 'Poland' },
  { code: 'PT', name: 'Portugal' }, { code: 'PR', name: 'Puerto Rico' }, { code: 'QA', name: 'Qatar' },
  { code: 'RE', name: 'Réunion' }, { code: 'RO', name: 'Romania' }, { code: 'RU', name: 'Russian Federation' },
  { code: 'RW', name: 'Rwanda' }, { code: 'KN', name: 'Saint Kitts and Nevis' }, { code: 'LC', name: 'Saint Lucia' },
  { code: 'VC', name: 'Saint Vincent and the Grenadines' }, { code: 'WS', name: 'Samoa' }, { code: 'SM', name: 'San Marino' },
  { code: 'ST', name: 'Sao Tome and Principe' }, { code: 'SA', name: 'Saudi Arabia' }, { code: 'SN', name: 'Senegal' },
  { code: 'RS', name: 'Serbia' }, { code: 'SC', name: 'Seychelles' }, { code: 'SL', name: 'Sierra Leone' },
  { code: 'SG', name: 'Singapore' }, { code: 'SK', name: 'Slovakia' }, { code: 'SI', name: 'Slovenia' },
  { code: 'SB', name: 'Solomon Islands' }, { code: 'SO', name: 'Somalia' }, { code: 'ZA', name: 'South Africa' },
  { code: 'ES', name: 'Spain' }, { code: 'LK', name: 'Sri Lanka' }, { code: 'SD', name: 'Sudan' },
  { code: 'SR', name: 'Suriname' }, { code: 'SZ', name: 'Swaziland' }, { code: 'SE', name: 'Sweden' },
  { code: 'CH', name: 'Switzerland' }, { code: 'SY', name: 'Syria' }, { code: 'TW', name: 'Taiwan' },
  { code: 'TJ', name: 'Tajikistan' }, { code: 'TZ', name: 'Tanzania' }, { code: 'TZ', name: 'Tanzania' },
  { code: 'TH', name: 'Thailand' }, { code: 'TL', name: 'Timor-Leste' }, { code: 'TG', name: 'Togo' },
  { code: 'TK', name: 'Tokelau' }, { code: 'TO', name: 'Tonga' }, { code: 'TT', name: 'Trinidad and Tobago' },
  { code: 'TN', name: 'Tunisia' }, { code: 'TR', name: 'Turkey' }, { code: 'TM', name: 'Turkmenistan' },
  { code: 'TV', name: 'Tuvalu' }, { code: 'UG', name: 'Uganda' }, { code: 'UA', name: 'Ukraine' },
  { code: 'AE', name: 'United Arab Emirates' }, { code: 'GB', name: 'United Kingdom' }, { code: 'US', name: 'United States' },
  { code: 'UY', name: 'Uruguay' }, { code: 'UZ', name: 'Uzbekistan' }, { code: 'VU', name: 'Vanuatu' },
  { code: 'VE', name: 'Venezuela' }, { code: 'VN', name: 'Vietnam' }, { code: 'VG', name: 'Virgin Islands, British' },
  { code: 'VI', name: 'Virgin Islands, U.S.' }, { code: 'YE', name: 'Yemen' }, { code: 'ZM', name: 'Zambia' },
  { code: 'ZW', name: 'Zimbabwe' }
];

export const WORLD_LOCATIONS: Record<string, { states: { name: string, cities: string[] }[] }> = {
  'ET': { // Ethiopia - High-resolution administrative data
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
  'US': { // All 50 United States with robust city lists
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
      { name: 'New Mexico', cities: ['Albuquerque', 'Las Cruces', 'Rio Rancho', 'Santa Fe', 'Roswell', 'Farmington', 'South Valley', 'Clovis', 'Hobbs', 'Alamogordo'] },
      { name: 'New York', cities: ['New York City', 'Buffalo', 'Rochester', 'Yonkers', 'Syracuse', 'Albany', 'New Rochelle', 'Mount Vernon', 'Schenectady', 'Utica'] },
      { name: 'North Carolina', cities: ['Charlotte', 'Raleigh', 'Greensboro', 'Durham', 'Winston-Salem', 'Fayetteville', 'Cary', 'Wilmington', 'High Point', 'Concord'] },
      { name: 'North Dakota', cities: ['Fargo', 'Bismarck', 'Grand Forks', 'Minot', 'West Fargo', 'Williston', 'Dickinson', 'Mandat', 'Jamestown', 'Wahpeton'] },
      { name: 'Ohio', cities: ['Columbus', 'Cleveland', 'Cincinnati', 'Toledo', 'Akron', 'Dayton', 'Parma', 'Canton', 'Youngstown', 'Lorain'] },
      { name: 'Oklahoma', cities: ['Oklahoma City', 'Tulsa', 'Norman', 'Broken Arrow', 'Edmond', 'Lawton', 'Moore', 'Midwest City', 'Enid', 'Stillwater'] },
      { name: 'Oregon', cities: ['Portland', 'Salem', 'Eugene', 'Gresham', 'Hillsboro', 'Beaverton', 'Bend', 'Medford', 'Springfield', 'Corvallis'] },
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
  'NG': { // Nigeria
    states: [
      { name: 'Lagos', cities: ['Ikeja', 'Lekki', 'Ikorodu', 'Epe', 'Badagry', 'Surulere', 'Agege', 'Mushin', 'Victoria Island', 'Ajah', 'Yaba', 'Alimosho', 'Oshodi', 'Apapa'] },
      { name: 'Abuja', cities: ['Garki', 'Wuse', 'Asokoro', 'Maitama', 'Kuje', 'Gwagwalada', 'Bwari', 'Abaji', 'Karu', 'Nyanya', 'Kubwa'] },
      { name: 'Kano', cities: ['Kano City', 'Wudil', 'Gwarzo', 'Bichi', 'Gaya', 'Rano', 'Dambatta', 'Minjibir', 'Gezawa', 'Tofa'] },
      { name: 'Rivers', cities: ['Port Harcourt', 'Obio-Akpor', 'Bonny', 'Eleme', 'Okrika', 'Degema', 'Ahoada', 'Omoku', 'Oyigbo'] },
      { name: 'Oyo', cities: ['Ibadan', 'Ogbomosho', 'Oyo Town', 'Iseyin', 'Saki', 'Eruwa', 'Lanlate', 'Kisi'] }
    ]
  },
  'KE': { // Kenya
    states: [
      { name: 'Nairobi', cities: ['Westlands', 'Dagoretti', 'Kasarani', 'Kibra', 'Langata', 'Embakasi', 'Makadara', 'Mathare', 'Parklands', 'Karen', 'Runda', 'Lavington', 'Eastleigh'] },
      { name: 'Mombasa', cities: ['Island', 'Changamwe', 'Likoni', 'Kisauni', 'Nyali', 'Jomvu', 'Mvita', 'Tudor', 'Bamburi', 'Shanzu'] },
      { name: 'Kisumu', cities: ['Kisumu Central', 'Kisumu West', 'Nyakach', 'Muhoroni', 'Seme', 'Kisumu East', 'Nyang\'ande', 'Maseno'] },
      { name: 'Kiambu', cities: ['Thika', 'Kiambu Town', 'Limuru', 'Kikuyu', 'Ruiru', 'Karuri', 'Githunguri', 'Gatundu'] },
      { name: 'Nakuru', cities: ['Nakuru City', 'Naivasha', 'Molo', 'Gilgil', 'Njoro', 'Subukia', 'Bahati', 'Rongai'] }
    ]
  },
  'IN': { // India
    states: [
      { name: 'Maharashtra', cities: ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Thane', 'Aurangabad', 'Solapur', 'Amravati', 'Navi Mumbai', 'Kolhapur', 'Akola', 'Latur'] },
      { name: 'Karnataka', cities: ['Bengaluru', 'Mysuru', 'Hubballi', 'Mangaluru', 'Belagavi', 'Kalaburagi', 'Ballari', 'Vijayapura', 'Shivamogga', 'Tumakuru'] },
      { name: 'Delhi', cities: ['New Delhi', 'Old Delhi', 'Dwarka', 'Rohini', 'Saket', 'Vasant Kunj', 'Janakpuri', 'Laxmi Nagar', 'Connaught Place', 'Karol Bagh'] },
      { name: 'Tamil Nadu', cities: ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tiruppur', 'Erode', 'Vellore', 'Thoothukudi', 'Nagercoil'] },
      { name: 'West Bengal', cities: ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Maheshtala', 'Rajpur Sonarpur', 'Gopalpur', 'Bhatpara', 'Panihati'] }
    ]
  },
  'GB': { // United Kingdom
    states: [
      { name: 'England', cities: ['London', 'Birmingham', 'Manchester', 'Liverpool', 'Leeds', 'Sheffield', 'Bristol', 'Newcastle', 'Nottingham', 'Leicester', 'Southampton', 'Reading', 'Oxford', 'Cambridge'] },
      { name: 'Scotland', cities: ['Glasgow', 'Edinburgh', 'Aberdeen', 'Dundee', 'Inverness', 'Perth', 'Stirling', 'Paisley', 'East Kilbride', 'Livingston'] },
      { name: 'Wales', cities: ['Cardiff', 'Swansea', 'Newport', 'Wrexham', 'Barry', 'Neath', 'Bridgend', 'Llanelli', 'Merthyr Tydfil'] },
      { name: 'Northern Ireland', cities: ['Belfast', 'Derry', 'Lisburn', 'Newry', 'Newtownabbey', 'Bangor', 'Castlereagh', 'Ballymena', 'Coleraine'] }
    ]
  },
  'CA': { // Canada
    states: [
      { name: 'Ontario', cities: ['Toronto', 'Ottawa', 'Mississauga', 'Hamilton', 'Brampton', 'London', 'Markham', 'Vaughan', 'Kitchener', 'Windsor', 'Oakville', 'Burlington'] },
      { name: 'Quebec', cities: ['Montreal', 'Quebec City', 'Laval', 'Gatineau', 'Longueuil', 'Sherbrooke', 'Saguenay', 'Levis', 'Trois-Rivières', 'Terrebonne'] },
      { name: 'British Columbia', cities: ['Vancouver', 'Victoria', 'Surrey', 'Burnaby', 'Richmond', 'Kelowna', 'Abbotsford', 'Coquitlam', 'Nanaimo', 'Kamloops'] },
      { name: 'Alberta', cities: ['Calgary', 'Edmonton', 'Red Deer', 'Lethbridge', 'St. Albert', 'Medicine Hat', 'Grande Prairie', 'Airdrie'] }
    ]
  },
  'BR': { // Brazil
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
