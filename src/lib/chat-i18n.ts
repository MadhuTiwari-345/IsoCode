export type Lang = 'en' | 'hi' | 'gu'
export const LANGS: { code: Lang; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'gu', label: 'ગુજરાતી' },
]

type Dict = Record<string, string>
const en: Dict = {
  priceNote: 'Prices are indicative. The final price is confirmed in writing by your sales advisor.',
  noDiscount: 'I am not able to discuss discounts or a final price. Your sales advisor will go through the exact figures with you in person.',
  human: 'Talk to a person',
  humanDone: 'Of course. {exec} will contact you shortly, and has your conversation so far.',
  humanNoExec: 'Of course. A sales advisor will contact you shortly and will have your conversation so far.',
  greet: 'Welcome. I can answer questions about our Ahmedabad homes and arrange a site visit. Which language would you prefer?',
  askRegister: 'Wonderful. So that I can reserve a visit and let a sales advisor follow up, may I have your name and mobile number?',
  askBhk: 'Thank you, {name}. Which home are you looking for?',
  askBudget: 'And what budget feels comfortable?',
  recommend: 'Based on this, I would suggest {project} in {locality}. {price}',
  recommendAlt: 'It is also worth seeing {project}.',
  askVisit: 'Would you like to see it in person? A visit takes about an hour, and a sales advisor will walk you through.',
  pickSlot: 'These times are open for {project}. Please choose one.',
  noSlots: 'There are no open visit times right now. A sales advisor will call you shortly to arrange one.',
  slotTaken: 'That time was just taken. Here are the times that are still open.',
  booked: 'Your visit is confirmed for {when} at {project}. {exec} will be your point of contact. A pin to the site and reminders (one day and two hours before) are on your confirmation page.',
  fallback: 'I do not have that detail in my fact sheet, so I will not guess. I have noted your question for {exec}. Is there anything else I can help with?',
  fallbackNoExec: 'I do not have that detail in my fact sheet, so I will not guess. A sales advisor will confirm it for you.',
  bhk2: '2 BHK', bhk3: '3 BHK',
  b1: 'Under ₹75 lakh', b2: '₹75 lakh to ₹95 lakh', b3: '₹95 lakh to ₹1.2 crore',
  yesVisit: 'Book a site visit', price: 'Price details', amenities: 'Amenities', possession: 'Possession', rera: 'RERA details', other: 'See the other project',
  name: 'Your name', phone: 'Mobile number', consent: 'I agree to be contacted about this enquiry, and that my details are processed as described in the privacy notice (DPDP Act 2023).',
  wa: 'Send me confirmations and reminders on WhatsApp.', start: 'Continue', inputPh: 'Ask about price, location, possession…', send: 'Send',
  errName: 'Please enter your name.', errPhone: 'Please enter a valid 10-digit mobile number.', errConsent: 'Consent is needed to continue.',
}
const hi: Dict = {
  priceNote: 'कीमतें सांकेतिक हैं। अंतिम कीमत आपके सेल्स सलाहकार लिखित में बताएँगे।',
  noDiscount: 'मैं छूट या अंतिम कीमत पर बात नहीं कर सकता। सही आँकड़े आपके सेल्स सलाहकार आपसे मिलकर बताएँगे।',
  human: 'किसी व्यक्ति से बात करें',
  humanDone: 'ज़रूर। {exec} जल्द ही आपसे संपर्क करेंगे और उनके पास अब तक की बातचीत है।',
  humanNoExec: 'ज़रूर। सेल्स सलाहकार जल्द ही आपसे संपर्क करेंगे और उनके पास अब तक की बातचीत होगी।',
  greet: 'स्वागत है। मैं अहमदाबाद के हमारे घरों के बारे में जानकारी दे सकता हूँ और साइट विज़िट तय कर सकता हूँ। आप किस भाषा में बात करना चाहेंगे?',
  askRegister: 'बहुत बढ़िया। विज़िट बुक करने और सेल्स सलाहकार के संपर्क के लिए कृपया अपना नाम और मोबाइल नंबर बताएँ।',
  askBhk: 'धन्यवाद, {name}। आप कौन सा घर देख रहे हैं?',
  askBudget: 'आपका आरामदायक बजट क्या है?',
  recommend: 'इसके आधार पर मैं {locality} में {project} सुझाऊँगा। {price}',
  recommendAlt: '{project} भी देखने लायक है।',
  askVisit: 'क्या आप इसे खुद देखना चाहेंगे? विज़िट लगभग एक घंटे की होती है और सेल्स सलाहकार आपको घुमाएँगे।',
  pickSlot: '{project} के लिए ये समय खाली हैं। कृपया एक चुनें।',
  noSlots: 'अभी कोई विज़िट समय खाली नहीं है। सेल्स सलाहकार जल्द ही आपको कॉल करेंगे।',
  slotTaken: 'वह समय अभी भर गया। ये समय अभी भी खाली हैं।',
  booked: 'आपकी विज़िट {project} में {when} के लिए पक्की है। {exec} आपके संपर्क व्यक्ति होंगे। साइट का लोकेशन पिन और रिमाइंडर (एक दिन और दो घंटे पहले) पुष्टि पृष्ठ पर हैं।',
  fallback: 'यह जानकारी मेरी फैक्ट शीट में नहीं है, इसलिए मैं अंदाज़ा नहीं लगाऊँगा। मैंने आपका प्रश्न {exec} के लिए नोट कर लिया है। और कुछ पूछना है?',
  fallbackNoExec: 'यह जानकारी मेरी फैक्ट शीट में नहीं है, इसलिए मैं अंदाज़ा नहीं लगाऊँगा। सेल्स सलाहकार आपको बताएँगे।',
  bhk2: '2 BHK', bhk3: '3 BHK',
  b1: '₹75 लाख से कम', b2: '₹75 लाख से ₹95 लाख', b3: '₹95 लाख से ₹1.2 करोड़',
  yesVisit: 'साइट विज़िट बुक करें', price: 'कीमत', amenities: 'सुविधाएँ', possession: 'कब्ज़ा', rera: 'RERA जानकारी', other: 'दूसरा प्रोजेक्ट देखें',
  name: 'आपका नाम', phone: 'मोबाइल नंबर', consent: 'मैं इस पूछताछ के लिए संपर्क किए जाने और अपनी जानकारी गोपनीयता नोटिस (DPDP अधिनियम 2023) के अनुसार प्रयोग किए जाने से सहमत हूँ।',
  wa: 'पुष्टि और रिमाइंडर मुझे WhatsApp पर भेजें।', start: 'आगे बढ़ें', inputPh: 'कीमत, लोकेशन, कब्ज़ा के बारे में पूछें…', send: 'भेजें',
  errName: 'कृपया अपना नाम लिखें।', errPhone: 'कृपया 10 अंकों का सही मोबाइल नंबर लिखें।', errConsent: 'आगे बढ़ने के लिए सहमति ज़रूरी है।',
}
const gu: Dict = {
  priceNote: 'કિંમતો સૂચક છે. અંતિમ કિંમત તમારા સેલ્સ સલાહકાર લેખિતમાં જણાવશે.',
  noDiscount: 'હું ડિસ્કાઉન્ટ કે અંતિમ કિંમત વિશે વાત કરી શકતો નથી. ચોક્કસ આંકડા તમારા સેલ્સ સલાહકાર રૂબરૂ જણાવશે.',
  human: 'કોઈ વ્યક્તિ સાથે વાત કરો',
  humanDone: 'ચોક્કસ. {exec} ટૂંક સમયમાં તમારો સંપર્ક કરશે અને તેમની પાસે અત્યાર સુધીની વાતચીત છે.',
  humanNoExec: 'ચોક્કસ. સેલ્સ સલાહકાર ટૂંક સમયમાં સંપર્ક કરશે અને તેમની પાસે અત્યાર સુધીની વાતચીત હશે.',
  greet: 'સ્વાગત છે. હું અમદાવાદમાં અમારા ઘરો વિશે માહિતી આપી શકું છું અને સાઇટ વિઝિટ ગોઠવી શકું છું. તમે કઈ ભાષામાં વાત કરવા માંગો છો?',
  askRegister: 'સરસ. વિઝિટ બુક કરવા અને સેલ્સ સલાહકાર સંપર્ક કરી શકે તે માટે કૃપા કરીને તમારું નામ અને મોબાઇલ નંબર આપો.',
  askBhk: 'આભાર, {name}. તમે કેવું ઘર શોધી રહ્યા છો?',
  askBudget: 'તમારું અનુકૂળ બજેટ કેટલું છે?',
  recommend: 'આના આધારે હું {locality} માં {project} સૂચવીશ. {price}',
  recommendAlt: '{project} પણ જોવા જેવો છે.',
  askVisit: 'શું તમે રૂબરૂ જોવા માંગો છો? વિઝિટ લગભગ એક કલાકની હોય છે અને સેલ્સ સલાહકાર તમને બતાવશે.',
  pickSlot: '{project} માટે આ સમય ખાલી છે. કૃપા કરીને એક પસંદ કરો.',
  noSlots: 'હાલ કોઈ વિઝિટ સમય ખાલી નથી. સેલ્સ સલાહકાર ટૂંક સમયમાં તમને કૉલ કરશે.',
  slotTaken: 'એ સમય હમણાં જ ભરાઈ ગયો. આ સમય હજુ ખાલી છે.',
  booked: 'તમારી વિઝિટ {project} માં {when} માટે પાક્કી છે. {exec} તમારા સંપર્ક વ્યક્તિ રહેશે. સાઇટનો લોકેશન પિન અને રિમાઇન્ડર (એક દિવસ અને બે કલાક પહેલાં) કન્ફર્મેશન પેજ પર છે.',
  fallback: 'આ માહિતી મારી ફેક્ટ શીટમાં નથી, તેથી હું અંદાજ નહીં લગાવું. મેં તમારો પ્રશ્ન {exec} માટે નોંધી લીધો છે. બીજું કંઈ પૂછવું છે?',
  fallbackNoExec: 'આ માહિતી મારી ફેક્ટ શીટમાં નથી, તેથી હું અંદાજ નહીં લગાવું. સેલ્સ સલાહકાર તમને જણાવશે.',
  bhk2: '2 BHK', bhk3: '3 BHK',
  b1: '₹75 લાખથી ઓછું', b2: '₹75 લાખથી ₹95 લાખ', b3: '₹95 લાખથી ₹1.2 કરોડ',
  yesVisit: 'સાઇટ વિઝિટ બુક કરો', price: 'કિંમત', amenities: 'સુવિધાઓ', possession: 'કબજો', rera: 'RERA માહિતી', other: 'બીજો પ્રોજેક્ટ જુઓ',
  name: 'તમારું નામ', phone: 'મોબાઇલ નંબર', consent: 'હું આ પૂછપરછ માટે સંપર્ક થવા અને મારી વિગતો ગોપનીયતા નોટિસ (DPDP અધિનિયમ 2023) મુજબ વપરાવા માટે સંમત છું.',
  wa: 'કન્ફર્મેશન અને રિમાઇન્ડર મને WhatsApp પર મોકલો.', start: 'આગળ વધો', inputPh: 'કિંમત, લોકેશન, કબજા વિશે પૂછો…', send: 'મોકલો',
  errName: 'કૃપા કરીને તમારું નામ લખો.', errPhone: 'કૃપા કરીને 10 અંકનો સાચો મોબાઇલ નંબર લખો.', errConsent: 'આગળ વધવા સંમતિ જરૂરી છે.',
}
export const DISCOUNT_RE = /discount|offer|negotiat|final price|best price|bargain|छूट|डिस्काउंट|ऑफर|ડિસ્કાઉન્ટ|છૂટ|ઓફર/i
const D = { en, hi, gu }
export function t(lang: Lang, key: string, vars: Record<string, string | number> = {}) {
  let s = (D[lang] ?? en)[key] ?? en[key] ?? key
  for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v))
  return s
}

/** Keyword -> fact-sheet topic, across English, Hinglish, Hindi and Gujarati. */
export const TOPIC_KEYWORDS: Record<string, string[]> = {
  price: ['price', 'cost', 'rate', 'budget', 'kitna', 'kimat', 'kimmat', 'कीमत', 'दाम', 'भाव', 'કિંમત', 'ભાવ', 'किंमत'],
  configs: ['size', 'sq ft', 'sqft', 'carpet', 'area', 'bhk', 'साइज', 'क्षेत्रफल', 'સાઇઝ', 'ચો.ફૂટ'],
  possession: ['possession', 'handover', 'kabza', 'kabzo', 'कब्ज़ा', 'कब्जा', 'કબજો'],
  amenities: ['amenit', 'pool', 'gym', 'club', 'garden', 'facility', 'सुविधा', 'सुविधाएँ', 'સુવિધા'],
  location: ['location', 'where', 'address', 'near', 'metro', 'school', 'hospital', 'distance', 'लोकेशन', 'कहाँ', 'पता', 'લોકેશન', 'ક્યાં', 'સરનામું'],
  rera: ['rera', 'approval', 'registered', 'legal', 'रेरा', 'રેરા'],
  payment: ['loan', 'emi', 'payment', 'plan', 'bank', 'finance', 'लोन', 'भुगतान', 'લોન', 'ચુકવણી'],
  parking: ['parking', 'park', 'पार्किंग', 'પાર્કિંગ'],
}
export function detectTopic(text: string): string | null {
  const s = text.toLowerCase()
  for (const [topic, words] of Object.entries(TOPIC_KEYWORDS)) if (words.some((w) => s.includes(w))) return topic
  return null
}
