/**
 * Cookie Marshal AI Agent - Injected Script
 * Runs in the main world context for advanced detection and manipulation
 */

(function() {
  'use strict';
  
  // Prevent multiple injections
  if (window.cookieBannerKillerInjected) {
    return;
  }
  window.cookieBannerKillerInjected = true;

  class InjectedBannerKiller {
    constructor() {
      this.originalMethods = {};
      this.interceptedEvents = new Set();
      // Add security measures
      this.securityMeasures = {
        // Randomize timing to avoid detection
        getRandomDelay: () => Math.random() * 1000 + 500,
        
        // Stealth mode - avoid detection by consent managers
        stealthMode: true,
        
        // Fingerprint resistance
        avoidFingerprinting: () => {
          // Randomize user agent characteristics
          Object.defineProperty(navigator, 'webdriver', {
            get: () => undefined
          });
        },
        
        // Advanced consent blocking
        blockConsentAPIs: () => {
          // Block common consent management APIs
          const blockedAPIs = [
            '__tcfapi', '__cmp', '__gpp', 'gtag', 'fbq',
            'dataLayer', '_gaq', 'ga', 'GoogleAnalyticsObject'
          ];
          
          blockedAPIs.forEach(api => {
            if (window[api]) {
              const original = window[api];
              window[api] = (...args) => {
                console.log(`🛡️ Blocked ${api} call:`, args);
                // Return appropriate response to avoid errors
                if (typeof args[args.length - 1] === 'function') {
                  args[args.length - 1](false, false);
                }
              };
            }
          });
        }
      };
      
      this.init();
    }

    init() {
      this.interceptConsent();
      this.interceptLocalStorage();
      this.interceptCookies();
      this.monitorGlobalVariables();
      console.log('🍪 Injected cookie banner killer loaded');
    }

    // Intercept common consent management methods
    interceptConsent() {
      // Common global consent variables to watch for
      const consentVars = [
        'gtag', 'dataLayer', 'GoogleAnalyticsObject',
        'OneTrust', 'Cookiebot', 'CookieConsent',
        'tarteaucitron', 'cookieconsent', 'CCM'
      ];

      consentVars.forEach(varName => {
        this.interceptGlobalVariable(varName);
      });

      // Intercept Google Analytics
      if (typeof gtag === 'function') {
        this.interceptGoogleAnalytics();
      }

      // Intercept dataLayer pushes
      if (window.dataLayer && Array.isArray(window.dataLayer)) {
        this.interceptDataLayer();
      }
    }

    interceptGoogleAnalytics() {
      const originalGtag = window.gtag;
      window.gtag = (...args) => {
        // Block consent-related gtag calls
        if (args[0] === 'consent' || args[0] === 'config') {
          console.log('🍪 Blocked gtag consent call:', args);
          return;
        }
        return originalGtag.apply(this, args);
      };
    }

    interceptDataLayer() {
      const originalPush = window.dataLayer.push;
      window.dataLayer.push = (data) => {
        // Block consent-related dataLayer pushes
        if (data && (data.event === 'gtm.consent' || data.consent_state)) {
          console.log('🍪 Blocked dataLayer consent push:', data);
          return;
        }
        return originalPush.call(window.dataLayer, data);
      };
    }

    interceptGlobalVariable(varName) {
      if (window[varName]) {
        try {
          // If it's an object, wrap its methods
          if (typeof window[varName] === 'object') {
            this.wrapObjectMethods(window[varName], varName);
          }
        } catch (e) {
          // Some objects might not be wrappable
        }
      }

      // Set up property watcher for future assignments
      this.watchProperty(window, varName);
    }

    wrapObjectMethods(obj, objName) {
      if (!obj || typeof obj !== 'object') return;

      Object.getOwnPropertyNames(obj).forEach(prop => {
        if (typeof obj[prop] === 'function') {
          const originalMethod = obj[prop];
          obj[prop] = (...args) => {
            // Log consent-related method calls
            if (prop.toLowerCase().includes('consent') || 
                prop.toLowerCase().includes('accept') || 
                prop.toLowerCase().includes('reject')) {
              console.log(`🍪 Intercepted ${objName}.${prop}:`, args);
            }
            return originalMethod.apply(obj, args);
          };
        }
      });
    }

    watchProperty(obj, prop) {
      let value = obj[prop];
      
      Object.defineProperty(obj, prop, {
        get() {
          return value;
        },
        set(newValue) {
          console.log(`🍪 Global variable ${prop} set to:`, newValue);
          value = newValue;
          
          // If it's a consent-related object, wrap it
          if (newValue && typeof newValue === 'object' && 
              prop.toLowerCase().includes('consent')) {
            this.wrapObjectMethods(newValue, prop);
          }
        },
        configurable: true,
        enumerable: true
      });
    }

    // Intercept localStorage/sessionStorage for consent storage
    interceptLocalStorage() {
      const storages = ['localStorage', 'sessionStorage'];
      
      storages.forEach(storageName => {
        if (!window[storageName]) return;
        
        const originalSetItem = window[storageName].setItem;
        window[storageName].setItem = (key, value) => {
          // Block consent-related storage
          if (this.isConsentKey(key)) {
            console.log(`🍪 Blocked ${storageName} consent key:`, key, value);
            return;
          }
          return originalSetItem.call(window[storageName], key, value);
        };
      });
    }

    // Intercept document.cookie for consent cookies
    interceptCookies() {
      try {
        // Check if already intercepted by our extension
        if (document._cookieIntercepted) {
          console.log('🍪 Cookie already intercepted, skipping redefinition');
          return;
        }
        
        const originalCookieDescriptor = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie') ||
                                       Object.getOwnPropertyDescriptor(HTMLDocument.prototype, 'cookie');
        
        // Only proceed if cookie property is configurable
        if (!originalCookieDescriptor || !originalCookieDescriptor.configurable) {
          console.log('🍪 Cookie property not configurable, using alternative blocking method');
          return this.interceptCookiesAlternative();
        }
        
        Object.defineProperty(document, 'cookie', {
          get() {
            return originalCookieDescriptor.get.call(this);
          },
          set(value) {
            // Block consent-related cookies
            if (this.isConsentCookie && this.isConsentCookie(value)) {
              console.log('🍪 Blocked consent cookie:', value);
              return;
            }
            return originalCookieDescriptor.set.call(this, value);
          },
          configurable: true
        });
        
        // Mark as intercepted to prevent duplicate attempts
        document._cookieIntercepted = true;
        console.log('🍪 Cookie interception successfully activated');
        
      } catch (error) {
        console.log('🍪 Cookie interception failed, using alternative method:', error.message);
        this.interceptCookiesAlternative();
      }
    }
    
    // Alternative cookie blocking method for when redefinition fails
    interceptCookiesAlternative() {
      // Monitor document.cookie writes through MutationObserver if available
      const observer = new MutationObserver(() => {
        // Check for new consent-related cookies periodically
        const cookies = document.cookie.split(';');
        cookies.forEach(cookie => {
          const [name] = cookie.trim().split('=');
          if (this.isConsentKey(name)) {
            console.log('🍪 Detected consent cookie (monitoring mode):', name);
          }
        });
      });
      
      // Start observing if document is available
      if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
      } else {
        document.addEventListener('DOMContentLoaded', () => {
          observer.observe(document.body, { childList: true, subtree: true });
        });
      }
    }

    isConsentKey(key) {
      const consentKeywords = [
        'consent', 'cookie-consent', 'gdpr', 'ccpa', 'privacy-consent',
        'analytics-consent', 'tracking-consent', 'marketing-consent', 'functional-consent',
        'onetrust', 'cookiebot', 'quantcast', 'trustarc', 'didomi'
      ];
      
      // More specific matching - key must contain full consent-related terms
      return consentKeywords.some(keyword => 
        key.toLowerCase().includes(keyword)
      ) && key.length > 5; // Avoid blocking very short keys
    }

    isConsentCookie(cookieString) {
      const consentPatterns = [
        /consent.*=/i, /gdpr.*=/i, /ccpa.*=/i, /privacy.*=/i,
        /analytics.*consent/i, /tracking.*consent/i, /marketing.*consent/i,
        /onetrust/i, /cookiebot/i, /quantcast/i, /trustarc/i, /didomi/i
      ];
      
      // Only block cookies that clearly match consent patterns
      return consentPatterns.some(pattern => 
        pattern.test(cookieString)
      ) && cookieString.length > 10; // Avoid blocking very short cookies
    }

    // Monitor for new global variables that might be consent-related
    monitorGlobalVariables() {
      const observer = new MutationObserver(() => {
        this.checkForNewConsentVariables();
      });
      
      observer.observe(document.documentElement, {
        childList: true,
        subtree: true
      });

      // Also check periodically
      setInterval(() => {
        this.checkForNewConsentVariables();
      }, 5000);
    }

    checkForNewConsentVariables() {
      const globalVars = Object.keys(window);
      const consentKeywords = ['consent', 'cookie', 'gdpr', 'privacy'];
      
      globalVars.forEach(varName => {
        if (consentKeywords.some(keyword => 
            varName.toLowerCase().includes(keyword)) &&
            !this.interceptedEvents.has(varName)) {
          
          this.interceptedEvents.add(varName);
          this.interceptGlobalVariable(varName);
          console.log('🍪 New consent variable detected:', varName);
        }
      });
    }

    // Utility method to reject all known consent mechanisms
    rejectAllConsent() {
      const rejectMethods = [
        // OneTrust
        () => window.OneTrust?.RejectAll?.(),
        () => window.OneTrust?.Close?.(),
        
        // Cookiebot
        () => window.Cookiebot?.reject?.(),
        () => window.CookieConsent?.reject?.(),
        
        // TrustArc
        () => window.truste?.eu?.bindMap?.toggledivs?.call(),
        
        // Quantcast
        () => window.__cmp?.('setVendorConsents', false),
        
        // Custom implementations
        () => {
          // Try to find and click reject buttons in common frameworks
          const rejectSelectors = [
            '[data-accept-action="reject"]',
            '[data-consent="reject"]',
            '.ot-pc-refuse-all-handler',
            '#CybotCookiebotDialogBodyButtonDecline',
            '.cc-dismiss',
            '[id*="reject" i]'
          ];
          
          rejectSelectors.forEach(selector => {
            const button = document.querySelector(selector);
            if (button && button.offsetParent) {
              button.click();
              console.log('🍪 Clicked reject button:', selector);
            }
          });
        }
      ];

      rejectMethods.forEach((method, index) => {
        try {
          method();
        } catch (e) {
          // Method not available or failed
        }
      });
    }
  }

  // Initialize the injected banner killer
  const injectedKiller = new InjectedBannerKiller();

  // Expose utility function to content script
  window.cookieBannerKillerRejectAll = () => {
    injectedKiller.rejectAllConsent();
  };

  // Auto-reject after a short delay to let consent managers initialize
  setTimeout(() => {
    injectedKiller.rejectAllConsent();
  }, 2000);

  // Advanced Consent Management System (CMS) Blocking
  const advancedCMSBlocker = {
    // Block popular CMS providers
    blockConsentManagers: () => {
      const cmsProviders = [
        'cookiebot', 'onetrust', 'trustarc', 'cookiepro', 'quantcast',
        'didomi', 'usercentrics', 'cookiefirst', 'termly', 'iubenda',
        'cookieyes', 'complianz', 'borlabs', 'cookielawinfo', 'wpcc'
      ];

      cmsProviders.forEach(provider => {
        // Block script loading
        const scripts = document.querySelectorAll(`script[src*="${provider}"]`);
        scripts.forEach(script => {
          script.remove();
          console.log(`🚫 Blocked ${provider} consent script`);
        });

        // Block global objects
        if (window[provider]) {
          window[provider] = undefined;
          delete window[provider];
        }

        // Block common variations
        const variations = [provider.toUpperCase(), provider + 'API', provider + '_api'];
        variations.forEach(variation => {
          if (window[variation]) {
            window[variation] = undefined;
            delete window[variation];
          }
        });
      });
    },

    // Block consent-related localStorage/sessionStorage
    blockConsentStorage: () => {
      const originalSetItem = Storage.prototype.setItem;
      const originalGetItem = Storage.prototype.getItem;

      Storage.prototype.setItem = function(key, value) {
        // More specific consent key patterns
        const consentKeys = ['consent', 'cookie-consent', 'gdpr-consent', 'privacy-consent', 'tracking-consent', 'analytics-consent'];
        const isConsentKey = consentKeys.some(keyword => key.toLowerCase().includes(keyword)) && key.length > 8;
        
        if (isConsentKey) {
          console.log(`🚫 Blocked consent storage: ${key}`);
          return;
        }
        return originalSetItem.call(this, key, value);
      };

      Storage.prototype.getItem = function(key) {
        // More specific consent key patterns
        const consentKeys = ['consent', 'cookie-consent', 'gdpr-consent', 'privacy-consent', 'tracking-consent'];
        const isConsentKey = consentKeys.some(keyword => key.toLowerCase().includes(keyword)) && key.length > 8;
        
        if (isConsentKey) {
          console.log(`🚫 Blocked consent storage read: ${key}`);
          return null;
        }
        return originalGetItem.call(this, key);
      };
    },

    // Block consent-related cookies
    blockConsentCookies: () => {
      // Skip if already intercepted by main class
      if (document._cookieIntercepted) {
        console.log('🍪 Cookie already intercepted by main class, skipping duplicate');
        return;
      }
      
      try {
        const originalCookieDescriptor = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie') ||
                                       Object.getOwnPropertyDescriptor(HTMLDocument.prototype, 'cookie');

        if (originalCookieDescriptor && originalCookieDescriptor.configurable) {
          Object.defineProperty(document, 'cookie', {
            get() {
              return originalCookieDescriptor.get.call(this);
            },
            set(value) {
              // More specific consent cookie patterns
              const consentCookies = ['consent=', 'cookie-consent=', 'gdpr=', 'privacy=', 'tracking=', 'analytics='];
              const cookieName = value.split('=')[0].toLowerCase();
              
              const isConsentCookie = consentCookies.some(keyword => 
                cookieName.includes(keyword.replace('=', '')) || value.toLowerCase().includes(keyword)
              ) && value.length > 15;
              
              if (isConsentCookie) {
                console.log(`🚫 Blocked consent cookie: ${cookieName}`);
                return;
              }
              
              return originalCookieDescriptor.set.call(this, value);
            },
            configurable: true
          });
          
          // Mark as intercepted
          document._cookieIntercepted = true;
          console.log('🍪 Advanced cookie blocking activated');
        } else {
          console.log('🍪 Cookie property not configurable for advanced blocking');
        }
      } catch (error) {
        console.log('🍪 Advanced cookie blocking failed:', error.message);
      }
    },

    // Block consent-related network requests
    blockConsentRequests: () => {
      const originalFetch = window.fetch;
      const originalXHROpen = XMLHttpRequest.prototype.open;

      // Block fetch requests
      window.fetch = function(url, options) {
        if (typeof url === 'string') {
          // More specific consent URL patterns
          const consentProviders = ['cookiebot.com', 'onetrust.com', 'trustarc.com', 'quantcast.com', 'didomi.io'];
          const consentPaths = ['/consent/', '/cookie/', '/gdpr/', '/privacy/'];
          
          const isConsentRequest = consentProviders.some(provider => url.includes(provider)) ||
                                 consentPaths.some(path => url.includes(path));
          
          if (isConsentRequest) {
            console.log(`🚫 Blocked consent fetch request: ${url}`);
            return Promise.reject(new Error('Consent request blocked'));
          }
        }
        return originalFetch.apply(this, arguments);
      };

      // Block XMLHttpRequest
      XMLHttpRequest.prototype.open = function(method, url) {
        if (typeof url === 'string') {
          // More specific consent URL patterns
          const consentProviders = ['cookiebot.com', 'onetrust.com', 'trustarc.com', 'quantcast.com'];
          const consentPaths = ['/consent/', '/cookie/', '/gdpr/', '/privacy/'];
          
          const isConsentRequest = consentProviders.some(provider => url.includes(provider)) ||
                                 consentPaths.some(path => url.includes(path));
          
          if (isConsentRequest) {
            console.log(`🚫 Blocked consent XHR request: ${url}`);
            return;
          }
        }
        return originalXHROpen.apply(this, arguments);
      };
    },

    // Block dynamic script injection
    blockDynamicScripts: () => {
      const originalAppendChild = Element.prototype.appendChild;
      const originalInsertBefore = Element.prototype.insertBefore;

      Element.prototype.appendChild = function(child) {
        if (child.tagName === 'SCRIPT' && child.src) {
          const consentScripts = ['consent', 'cookie', 'gdpr', 'privacy', 'tracking'];
          if (consentScripts.some(keyword => child.src.toLowerCase().includes(keyword))) {
            console.log(`🚫 Blocked dynamic consent script: ${child.src}`);
            return child;
          }
        }
        return originalAppendChild.call(this, child);
      };

      Element.prototype.insertBefore = function(newNode, referenceNode) {
        if (newNode.tagName === 'SCRIPT' && newNode.src) {
          const consentScripts = ['consent', 'cookie', 'gdpr', 'privacy', 'tracking'];
          if (consentScripts.some(keyword => newNode.src.toLowerCase().includes(keyword))) {
            console.log(`🚫 Blocked dynamic consent script insertion: ${newNode.src}`);
            return newNode;
          }
        }
        return originalInsertBefore.call(this, newNode, referenceNode);
      };
    },

    // Create fake consent APIs to prevent errors
    createFakeAPIs: () => {
      // Common consent management APIs
      const fakeAPIs = {
        // Google Consent Mode
        gtag: () => console.log('🎭 Fake gtag called'),
        
        // OneTrust
        OneTrust: {
          NoticeApi: {
            Initialized: {
              then: (callback) => callback()
            }
          }
        },
        
        // Cookiebot
        Cookiebot: {
          consent: {
            marketing: false,
            analytics: false,
            preferences: false,
            necessary: true
          }
        },
        
        // TrustArc
        truste: {
          eu: {
            bindMap: () => {},
            clickListener: () => {}
          }
        },
        
        // Quantcast
        __tcfapi: (command, version, callback) => {
          if (callback) {
            callback({}, true);
          }
        },
        
        // IAB TCF
        __cmp: (command, parameter, callback) => {
          if (callback) {
            callback({}, true);
          }
        }
      };

      Object.keys(fakeAPIs).forEach(api => {
        if (!window[api]) {
          window[api] = fakeAPIs[api];
          console.log(`🎭 Created fake API: ${api}`);
        }
      });
    },

    // Monitor and block consent-related events
    blockConsentEvents: () => {
      const originalAddEventListener = EventTarget.prototype.addEventListener;
      
      EventTarget.prototype.addEventListener = function(type, listener, options) {
        const consentEvents = ['consent', 'cookie', 'gdpr', 'privacy'];
        if (consentEvents.some(keyword => type.toLowerCase().includes(keyword))) {
          console.log(`🚫 Blocked consent event listener: ${type}`);
          return;
        }
        return originalAddEventListener.call(this, type, listener, options);
      };
    },

    // Block consent-related CSS that might hide content
    blockConsentCSS: () => {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(node => {
              if (node.tagName === 'STYLE' || node.tagName === 'LINK') {
                const content = node.textContent || node.href || '';
                if (content.includes('consent') || content.includes('cookie') || content.includes('gdpr')) {
                  console.log('🚫 Blocked consent-related CSS');
                  node.remove();
                }
              }
            });
          }
        });
      });

      observer.observe(document.head, { childList: true, subtree: true });
    }
  };

  // Activate all advanced blocking mechanisms
  const activateAdvancedBlocking = () => {
    console.log('🛡️ Activating advanced consent blocking...');
    
    advancedCMSBlocker.blockConsentManagers();
    advancedCMSBlocker.blockConsentStorage();
    advancedCMSBlocker.blockConsentCookies();
    advancedCMSBlocker.blockConsentRequests();
    advancedCMSBlocker.blockDynamicScripts();
    advancedCMSBlocker.createFakeAPIs();
    advancedCMSBlocker.blockConsentEvents();
    advancedCMSBlocker.blockConsentCSS();
    
    console.log('✅ Advanced consent blocking activated');
  };

  // Track activation state to prevent infinite loops
  let activationCount = 0;
  const maxActivations = 3; // Limit to 3 activations max
  let isActivated = false;
  
  const limitedActivateAdvancedBlocking = () => {
    if (isActivated || activationCount >= maxActivations) {
      console.log('🛡️ Advanced blocking already activated or max attempts reached');
      return;
    }
    
    activationCount++;
    console.log(`🛡️ Activating advanced consent blocking (attempt ${activationCount}/${maxActivations})...`);
    
    advancedCMSBlocker.blockConsentManagers();
    advancedCMSBlocker.blockConsentStorage();
    advancedCMSBlocker.blockConsentCookies();
    advancedCMSBlocker.blockConsentRequests();
    advancedCMSBlocker.blockDynamicScripts();
    advancedCMSBlocker.createFakeAPIs();
    advancedCMSBlocker.blockConsentEvents();
    advancedCMSBlocker.blockConsentCSS();
    
    isActivated = true;
    console.log('✅ Advanced consent blocking activated');
  };

  // Activate immediately
  limitedActivateAdvancedBlocking();
  
  // Activate on DOM ready if not already done
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      if (!isActivated) {
        setTimeout(limitedActivateAdvancedBlocking, 1000);
      }
    });
  }

  // Re-activate only a few times with increasing delays to catch late-loading scripts
  const retryDelays = [3000, 8000, 15000]; // 3s, 8s, 15s
  retryDelays.forEach((delay, index) => {
    setTimeout(() => {
      if (activationCount < maxActivations) {
        limitedActivateAdvancedBlocking();
      }
    }, delay);
  });

})(); 