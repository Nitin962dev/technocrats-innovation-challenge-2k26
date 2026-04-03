import { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('en'); // 'en' or 'hi'

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'en' ? 'hi' : 'en'));
  };

  const translations = {
    en: {
      app_name: 'HerShield',
      sos_button: 'SOS',
      sos_active: 'ACTIVE',
      sos_press_prompt: 'Press for 3 seconds',
      current_location: 'Current Location',
      alert_family: 'Message sent to Family (Mom)',
      alert_hospital: 'Nearby Hospital notified',
      alert_police: 'Alert to nearby Police Station',
      national_emergency: 'National Emergency Numbers',
      safe_route: 'Safe Route',
      fake_call: 'Fake Call System',
      evidence: 'Evidence',
      timer: 'Safety Timer',
      login_title: 'Verify Identity',
      login_subtitle: 'Aadhaar + Mobile Link Verification',
      send_otp: 'Send OTP',
      verify_otp: 'Verify & Login',
      digilocker: 'DigiLocker Identity',
      police_dispatch: 'Police Dispatched! Arriving in',
      dispatch_eta: '2 mins'
    },
    hi: {
      app_name: 'हरशील्ड (HerShield)',
      sos_button: 'एसओएस (SOS)',
      sos_active: 'सक्रिय (ACTIVE)',
      sos_press_prompt: '3 सेकंड तक दबाएं',
      current_location: 'वर्तमान स्थान',
      alert_family: 'परिवार (मां) को संदेश भेजा गया',
      alert_hospital: 'नजदीकी अस्पताल को सूचित किया गया',
      alert_police: 'नजदीकी पुलिस स्टेशन को अलर्ट',
      national_emergency: 'राष्ट्रीय आपातकालीन नंबर',
      safe_route: 'सुरक्षित मार्ग',
      fake_call: 'फेक कॉल सिस्टम',
      evidence: 'प्रमाण (Evidence)',
      timer: 'सुरक्षा टाइमर',
      login_title: 'पहचान सत्यापित करें',
      login_subtitle: 'आधार + मोबाइल लिंक सत्यापन',
      send_otp: 'ओटीपी भेजें',
      verify_otp: 'सत्यापित करें और लॉगिन करें',
      digilocker: 'डिजीलॉकर पहचान',
      police_dispatch: 'पुलिस रवाना! पहुंच रही है:',
      dispatch_eta: '2 मिनट'
    }
  };

  const t = (key) => {
    return translations[lang][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
