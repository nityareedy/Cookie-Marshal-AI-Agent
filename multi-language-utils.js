/**
 * Multi-Language Cookie Detection Utilities
 * Enhances detection across different languages and cultures
 * SAFE ENHANCEMENT - No breaking changes to existing code
 */

class MultiLanguageDetector {
  constructor() {
    // Comprehensive language patterns for cookie consent
    this.languagePatterns = {
      // English
      'en': {
        cookie: ['cookie', 'cookies'],
        consent: ['consent', 'agree', 'accept', 'allow', 'approve'],
        reject: ['reject', 'decline', 'deny', 'refuse', 'dismiss', 'close', 'no thanks'],
        privacy: ['privacy', 'data protection', 'personal data'],
        manage: ['manage', 'customize', 'preferences', 'settings', 'options'],
        necessary: ['necessary', 'essential', 'required', 'functional', 'strictly necessary']
      },
      
      // German
      'de': {
        cookie: ['cookie', 'cookies', 'kekse'],
        consent: ['zustimmung', 'einverständnis', 'akzeptieren', 'erlauben', 'zustimmen', 'ja'],
        reject: ['ablehnen', 'verweigern', 'nein', 'schließen', 'nein danke'],
        privacy: ['datenschutz', 'privatsphäre', 'personenbezogene daten'],
        manage: ['verwalten', 'anpassen', 'einstellungen', 'optionen', 'präferenzen'],
        necessary: ['notwendig', 'erforderlich', 'wesentlich', 'funktional']
      },
      
      // French
      'fr': {
        cookie: ['cookie', 'cookies', 'témoin', 'témoins'],
        consent: ['consentement', 'accord', 'accepter', 'autoriser', 'oui'],
        reject: ['refuser', 'rejeter', 'décliner', 'fermer', 'non merci'],
        privacy: ['confidentialité', 'vie privée', 'données personnelles'],
        manage: ['gérer', 'personnaliser', 'préférences', 'paramètres', 'options'],
        necessary: ['nécessaire', 'essentiel', 'requis', 'fonctionnel']
      },
      
      // Spanish
      'es': {
        cookie: ['cookie', 'cookies', 'galleta', 'galletas'],
        consent: ['consentimiento', 'aceptar', 'permitir', 'autorizar', 'sí'],
        reject: ['rechazar', 'denegar', 'declinar', 'cerrar', 'no gracias'],
        privacy: ['privacidad', 'protección de datos', 'datos personales'],
        manage: ['gestionar', 'personalizar', 'preferencias', 'configuración', 'opciones'],
        necessary: ['necesario', 'esencial', 'requerido', 'funcional']
      },
      
      // Italian
      'it': {
        cookie: ['cookie', 'cookies', 'biscotto', 'biscotti'],
        consent: ['consenso', 'accettare', 'permettere', 'autorizzare', 'sì'],
        reject: ['rifiutare', 'negare', 'declinare', 'chiudere', 'no grazie'],
        privacy: ['privacy', 'riservatezza', 'protezione dati', 'dati personali'],
        manage: ['gestire', 'personalizzare', 'preferenze', 'impostazioni', 'opzioni'],
        necessary: ['necessario', 'essenziale', 'richiesto', 'funzionale']
      },
      
      // Dutch
      'nl': {
        cookie: ['cookie', 'cookies', 'koekje', 'koekjes'],
        consent: ['toestemming', 'akkoord', 'accepteren', 'toestaan', 'ja'],
        reject: ['weigeren', 'afwijzen', 'sluiten', 'nee bedankt'],
        privacy: ['privacy', 'gegevensbescherming', 'persoonlijke gegevens'],
        manage: ['beheren', 'aanpassen', 'voorkeuren', 'instellingen', 'opties'],
        necessary: ['noodzakelijk', 'essentieel', 'vereist', 'functioneel']
      },
      
      // Portuguese
      'pt': {
        cookie: ['cookie', 'cookies', 'biscoito', 'biscoitos'],
        consent: ['consentimento', 'aceitar', 'permitir', 'autorizar', 'sim'],
        reject: ['rejeitar', 'negar', 'recusar', 'fechar', 'não obrigado'],
        privacy: ['privacidade', 'proteção de dados', 'dados pessoais'],
        manage: ['gerenciar', 'personalizar', 'preferências', 'configurações', 'opções'],
        necessary: ['necessário', 'essencial', 'requerido', 'funcional']
      },
      
      // Polish
      'pl': {
        cookie: ['cookie', 'cookies', 'ciasteczko', 'ciasteczka'],
        consent: ['zgoda', 'akceptować', 'pozwolić', 'tak'],
        reject: ['odrzucić', 'odmówić', 'zamknąć', 'nie dziękuję'],
        privacy: ['prywatność', 'ochrona danych', 'dane osobowe'],
        manage: ['zarządzać', 'dostosować', 'preferencje', 'ustawienia', 'opcje'],
        necessary: ['konieczne', 'niezbędne', 'wymagane', 'funkcjonalne']
      }
    };
    
    // Auto-detect page language
    this.detectedLanguage = this.detectPageLanguage();
    
    // Cultural preferences for button styles
    this.culturalPatterns = {
      'de': { formal: true, explicitReject: true },
      'fr': { formal: true, politeness: true },
      'en': { casual: true, directReject: true },
      'es': { warm: true, familyFriendly: true },
      'it': { expressive: true, gestural: true }
    };
  }

  /**
   * Detect the language of the current page
   * SAFE: Read-only operation, no DOM modification
   */
  detectPageLanguage() {
    // Method 1: HTML lang attribute
    const htmlLang = document.documentElement.lang;
    if (htmlLang && this.languagePatterns[htmlLang.substr(0, 2)]) {
      return htmlLang.substr(0, 2);
    }
    
    // Method 2: Meta tags
    const metaLang = document.querySelector('meta[http-equiv="content-language"]');
    if (metaLang && metaLang.content) {
      const lang = metaLang.content.substr(0, 2);
      if (this.languagePatterns[lang]) {
        return lang;
      }
    }
    
    // Method 3: Content analysis (sample text)
    const bodyText = document.body.textContent.toLowerCase().substr(0, 1000);
    return this.detectLanguageFromText(bodyText);
  }

  /**
   * Detect language from text content
   * SAFE: Text analysis only
   */
  detectLanguageFromText(text) {
    const scores = {};
    
    // Score each language based on keyword matches
    for (const [lang, patterns] of Object.entries(this.languagePatterns)) {
      scores[lang] = 0;
      
      // Check for language-specific words
      Object.values(patterns).flat().forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        const matches = text.match(regex);
        if (matches) {
          scores[lang] += matches.length;
        }
      });
    }
    
    // Return language with highest score, default to English
    const bestMatch = Object.entries(scores).reduce((best, [lang, score]) => 
      score > best.score ? { lang, score } : best, { lang: 'en', score: 0 });
    
    return bestMatch.lang;
  }

  /**
   * Enhanced cookie content detection with multi-language support
   * SAFE: Extends existing detection without breaking it
   */
  containsCookieContent(text, element = null) {
    if (!text) return false;
    
    const normalizedText = text.toLowerCase().trim();
    const detectedLang = this.detectedLanguage;
    
    // Get patterns for detected language + English fallback
    const patterns = this.languagePatterns[detectedLang] || this.languagePatterns['en'];
    const englishPatterns = this.languagePatterns['en'];
    
    // Check primary language patterns
    const hasKeywords = Object.values(patterns).flat().some(keyword =>
      normalizedText.includes(keyword.toLowerCase())
    );
    
    // Check English patterns as fallback
    const hasEnglishKeywords = Object.values(englishPatterns).flat().some(keyword =>
      normalizedText.includes(keyword.toLowerCase())
    );
    
    // Additional context checks for better accuracy
    let contextScore = 0;
    
    // Look for GDPR/legal references
    if (/gdpr|rgpd|dsgvo|rodo/.test(normalizedText)) contextScore += 2;
    
    // Look for consent management frameworks
    if (/onetrust|cookiebot|trustarc|didomi/.test(normalizedText)) contextScore += 3;
    
    // Look for privacy policy links
    if (element) {
      const links = element.querySelectorAll('a[href*="privacy"], a[href*="datenschutz"], a[href*="confidentialite"]');
      if (links.length > 0) contextScore += 2;
    }
    
    return (hasKeywords || hasEnglishKeywords) && contextScore >= 1;
  }

  /**
   * Enhanced button analysis with cultural awareness
   * SAFE: Extends existing button scoring
   */
  calculateMultiLanguageRejectScore(text, button) {
    const normalizedText = text.toLowerCase().trim();
    const detectedLang = this.detectedLanguage;
    const patterns = this.languagePatterns[detectedLang] || this.languagePatterns['en'];
    
    let score = 0;
    
    // Primary language reject patterns
    patterns.reject.forEach(rejectWord => {
      if (normalizedText.includes(rejectWord.toLowerCase())) {
        score += 3; // Higher confidence for native language
      }
    });
    
    // English fallback (many sites use English buttons)
    this.languagePatterns['en'].reject.forEach(rejectWord => {
      if (normalizedText.includes(rejectWord.toLowerCase())) {
        score += 2;
      }
    });
    
    // Cultural adjustments
    const cultural = this.culturalPatterns[detectedLang];
    if (cultural) {
      // German/formal languages prefer explicit rejection
      if (cultural.formal && /alle.*(ablehnen|reject)/i.test(normalizedText)) {
        score += 2;
      }
      
      // Some cultures prefer polite rejection
      if (cultural.politeness && /(non.merci|no.thanks)/i.test(normalizedText)) {
        score += 1;
      }
    }
    
    // Visual cues (button styling)
    if (button) {
      const style = window.getComputedStyle(button);
      const isSecondary = this.isSecondaryButton(style);
      if (isSecondary) score += 1;
    }
    
    return Math.min(score, 10); // Cap at 10
  }

  /**
   * Detect if button has secondary/reject styling
   * SAFE: Read-only style analysis
   */
  isSecondaryButton(style) {
    const bgColor = style.backgroundColor;
    const border = style.border;
    const color = style.color;
    
    // Common secondary button patterns
    return (
      bgColor === 'transparent' ||
      border.includes('1px') ||
      color.includes('rgb(128') || // Grayish text
      style.textDecoration === 'underline'
    );
  }

  /**
   * Get all patterns for current language
   * SAFE: Read-only data access
   */
  getCurrentLanguagePatterns() {
    return this.languagePatterns[this.detectedLanguage] || this.languagePatterns['en'];
  }

  /**
   * Get language-specific selectors
   * SAFE: Static selector generation
   */
  getLanguageSpecificSelectors() {
    const patterns = this.getCurrentLanguagePatterns();
    const selectors = [];
    
    // Generate attribute selectors for each language pattern
    Object.values(patterns).flat().forEach(keyword => {
      selectors.push(`[aria-label*="${keyword}" i]`);
      selectors.push(`[title*="${keyword}" i]`);
      selectors.push(`[alt*="${keyword}" i]`);
    });
    
    return selectors;
  }

  /**
   * Enhanced framework detection with language awareness
   * SAFE: Extends existing detection
   */
  detectLocalizedFramework(element) {
    const text = element.textContent?.toLowerCase() || '';
    const detectedLang = this.detectedLanguage;
    
    // Framework-specific language patterns
    const frameworkLanguageMarkers = {
      'cookiebot': {
        'en': ['powered by cookiebot', 'cookiebot consent'],
        'de': ['bereitgestellt von cookiebot', 'cookiebot einwilligung'],
        'fr': ['propulsé par cookiebot', 'consentement cookiebot']
      },
      'onetrust': {
        'en': ['onetrust consent', 'powered by onetrust'],
        'de': ['onetrust zustimmung', 'bereitgestellt von onetrust'],
        'fr': ['consentement onetrust', 'propulsé par onetrust']
      }
    };
    
    for (const [framework, languages] of Object.entries(frameworkLanguageMarkers)) {
      const markers = languages[detectedLang] || languages['en'] || [];
      
      for (const marker of markers) {
        if (text.includes(marker)) {
          return {
            framework,
            language: detectedLang,
            confidence: 0.9
          };
        }
      }
    }
    
    return null;
  }

  /**
   * Get statistics about language detection
   * SAFE: Read-only analytics
   */
  getLanguageStats() {
    return {
      detectedLanguage: this.detectedLanguage,
      supportedLanguages: Object.keys(this.languagePatterns),
      totalPatterns: Object.values(this.languagePatterns).reduce(
        (total, patterns) => total + Object.values(patterns).flat().length, 0
      ),
      culturalAdjustments: this.culturalPatterns[this.detectedLanguage] || null
    };
  }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.MultiLanguageDetector = MultiLanguageDetector;
}

console.log('🌍 Multi-Language Detection utilities loaded'); 