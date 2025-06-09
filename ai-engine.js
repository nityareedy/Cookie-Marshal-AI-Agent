/**
 * Cookie Marshal AI Agent - AI Engine
 * Provides intelligent analysis and learning capabilities
 */

class AIEngine {
  constructor() {
    this.isInitialized = false;
    this.textClassifier = null;
    this.visualValidator = null;
    this.learningAgent = null;
    this.modelCache = new Map();
    
    // Configuration
    this.config = {
      enableTextClassification: true,
      enableVisualValidation: true,
      enableLearning: true,
      confidenceThreshold: 0.7,
      maxProcessingTime: 2000, // 2 seconds max
    };
  }

  async initialize() {
    if (this.isInitialized) return;
    
    console.log('🧠 Initializing AI Engine...');
    
    try {
      // Initialize components in parallel for speed
      await Promise.all([
        this.initializeTextClassifier(),
        this.initializeVisualValidator(),
        this.initializeLearningAgent()
      ]);
      
      this.isInitialized = true;
      console.log('✅ AI Engine initialized successfully');
    } catch (error) {
      console.error('❌ AI Engine initialization failed:', error);
      // Continue without AI - fallback to rule-based
    }
  }

  async initializeTextClassifier() {
    try {
      // Lightweight text classification using a simple neural network
      this.textClassifier = new TextClassifier();
      await this.textClassifier.loadModel();
      console.log('🔤 Text classifier ready');
    } catch (error) {
      console.warn('Text classifier failed to load:', error);
      this.config.enableTextClassification = false;
    }
  }

  async initializeVisualValidator() {
    try {
      this.visualValidator = new VisualValidator();
      await this.visualValidator.initialize();
      console.log('👁️ Visual validator ready');
    } catch (error) {
      console.warn('Visual validator failed to load:', error);
      this.config.enableVisualValidation = false;
    }
  }

  async initializeLearningAgent() {
    try {
      this.learningAgent = new QLearningAgent();
      await this.learningAgent.loadExperience();
      console.log('🎓 Learning agent ready');
    } catch (error) {
      console.warn('Learning agent failed to load:', error);
      this.config.enableLearning = false;
    }
  }

  // Main AI processing method
  async processWithAI(banner, context = {}) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const startTime = Date.now();
    const timeout = this.config.maxProcessingTime;

    try {
      // Race against timeout to ensure we don't block too long
      return await Promise.race([
        this.performAIAnalysis(banner, context),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('AI processing timeout')), timeout)
        )
      ]);
    } catch (error) {
      console.warn('AI processing failed, falling back to rules:', error);
      return {
        useAI: false,
        confidence: 0,
        reason: 'AI processing failed',
        processingTime: Date.now() - startTime
      };
    }
  }

  async performAIAnalysis(banner, context) {
    const analysis = {
      useAI: true,
      confidence: 0,
      strategy: null,
      buttonAnalysis: null,
      visualPrediction: null,
      processingTime: 0
    };

    const startTime = Date.now();

    // 1. Analyze buttons with AI text classification
    if (this.config.enableTextClassification) {
      const buttons = banner.querySelectorAll('button, a[role="button"], input[type="button"]');
      analysis.buttonAnalysis = await this.textClassifier.analyzeButtons(Array.from(buttons));
    }

    // 2. Get strategy recommendation from learning agent
    if (this.config.enableLearning && this.learningAgent) {
      const state = this.extractState(banner, context);
      analysis.strategy = await this.learningAgent.recommendStrategy(state);
    }

    // 3. Predict success likelihood
    if (this.config.enableVisualValidation) {
      analysis.visualPrediction = await this.visualValidator.predictSuccess(banner);
    }

    // 4. Calculate overall confidence
    analysis.confidence = this.calculateOverallConfidence(analysis);
    analysis.processingTime = Date.now() - startTime;

    console.log(`🧠 AI Analysis completed in ${analysis.processingTime}ms, confidence: ${Math.round(analysis.confidence * 100)}%`);

    return analysis;
  }

  calculateOverallConfidence(analysis) {
    let confidence = 0;
    let factors = 0;

    if (analysis.buttonAnalysis) {
      confidence += analysis.buttonAnalysis.confidence * 0.4;
      factors += 0.4;
    }

    if (analysis.strategy) {
      confidence += analysis.strategy.confidence * 0.3;
      factors += 0.3;
    }

    if (analysis.visualPrediction) {
      confidence += analysis.visualPrediction.confidence * 0.3;
      factors += 0.3;
    }

    return factors > 0 ? confidence / factors : 0;
  }

  extractState(banner, context) {
    // Extract features for learning agent
    return {
      domain: window.location.hostname,
      bannerSize: this.getBannerSize(banner),
      buttonCount: banner.querySelectorAll('button, a[role="button"]').length,
      textLength: banner.textContent?.length || 0,
      hasIframes: banner.querySelectorAll('iframe').length > 0,
      position: this.getBannerPosition(banner),
      framework: this.detectFramework(banner),
      language: this.detectLanguage(banner.textContent || ''),
      complexity: context.complexity || 0
    };
  }

  getBannerSize(banner) {
    const rect = banner.getBoundingClientRect();
    return {
      width: rect.width,
      height: rect.height,
      area: rect.width * rect.height
    };
  }

  getBannerPosition(banner) {
    const rect = banner.getBoundingClientRect();
    const vh = window.innerHeight;
    const vw = window.innerWidth;

    if (rect.top <= vh * 0.2) return 'top';
    if (rect.bottom >= vh * 0.8) return 'bottom';
    if (rect.left <= vw * 0.1 && rect.right >= vw * 0.9) return 'center';
    return 'side';
  }

  detectFramework(banner) {
    const classes = (banner.className || '').toString();
    const id = (banner.id || '').toString();
    
    const frameworks = ['cookiebot', 'onetrust', 'trustarc', 'quantcast', 'didomi'];
    
    for (const framework of frameworks) {
      if (classes.toLowerCase().includes(framework) || id.toLowerCase().includes(framework)) {
        return framework;
      }
    }
    
    return 'unknown';
  }

  detectLanguage(text) {
    // Simple language detection based on common words
    const lowerText = text.toLowerCase();
    
    if (/\b(cookie|accept|reject|privacy|consent)\b/.test(lowerText)) return 'en';
    if (/\b(cookie|akzeptieren|ablehnen|datenschutz)\b/.test(lowerText)) return 'de';
    if (/\b(cookie|accepter|refuser|confidentialité)\b/.test(lowerText)) return 'fr';
    if (/\b(cookie|aceptar|rechazar|privacidad)\b/.test(lowerText)) return 'es';
    if (/\b(cookie|accettare|rifiutare|privacy)\b/.test(lowerText)) return 'it';
    
    return 'unknown';
  }

  // Learn from outcomes to improve future decisions
  async learnFromOutcome(state, action, outcome, processingMethod) {
    if (!this.config.enableLearning || !this.learningAgent) return;

    const experience = {
      state: state,
      action: action,
      outcome: outcome,
      method: processingMethod, // 'rule-based' or 'ai'
      timestamp: Date.now(),
      success: outcome.success || false,
      confidence: outcome.confidence || 0
    };

    await this.learningAgent.recordExperience(experience);
  }

  // Get AI readiness status
  getStatus() {
    return {
      initialized: this.isInitialized,
      textClassifier: this.config.enableTextClassification,
      visualValidator: this.config.enableVisualValidation,
      learningAgent: this.config.enableLearning,
      modelsCached: this.modelCache.size
    };
  }
}

// Text Classification Component
class TextClassifier {
  constructor() {
    this.model = null;
    this.vocabulary = null;
    this.isReady = false;
  }

  async loadModel() {
    try {
      // Use a lightweight word embedding approach
      this.vocabulary = await this.loadVocabulary();
      this.model = await this.createModel();
      this.isReady = true;
    } catch (error) {
      console.error('Failed to load text classification model:', error);
      throw error;
    }
  }

  async loadVocabulary() {
    // Pre-defined vocabulary for cookie banner context
    return {
      // Reject words (high positive score)
      reject: ['reject', 'decline', 'deny', 'refuse', 'dismiss', 'no', 'cancel', 'close'],
      necessary: ['necessary', 'essential', 'required', 'basic', 'minimal', 'functional'],
      manage: ['manage', 'customize', 'preferences', 'settings', 'options', 'configure'],
      
      // Accept words (negative score)
      accept: ['accept', 'allow', 'agree', 'enable', 'yes', 'ok', 'continue', 'proceed'],
      all: ['all', 'everything', 'full', 'complete', 'total'],
      
      // Context words
      cookie: ['cookie', 'cookies', 'tracking', 'analytics', 'marketing', 'advertising'],
      privacy: ['privacy', 'data', 'gdpr', 'consent', 'personal', 'information']
    };
  }

  async createModel() {
    // Simple but effective rule-based model with scoring
    return {
      classify: (text) => {
        const lowerText = text.toLowerCase();
        let score = 0;
        let features = {};

        // Positive scoring (reject intent)
        this.vocabulary.reject.forEach(word => {
          if (lowerText.includes(word)) {
            score += 10;
            features[word] = true;
          }
        });

        this.vocabulary.necessary.forEach(word => {
          if (lowerText.includes(word)) {
            score += 8;
            features[word] = true;
          }
        });

        this.vocabulary.manage.forEach(word => {
          if (lowerText.includes(word)) {
            score += 6;
            features[word] = true;
          }
        });

        // Negative scoring (accept intent)
        this.vocabulary.accept.forEach(word => {
          if (lowerText.includes(word)) {
            score -= 5;
            features[word] = true;
          }
        });

        // Context boost
        const hasContext = this.vocabulary.cookie.some(word => lowerText.includes(word)) ||
                          this.vocabulary.privacy.some(word => lowerText.includes(word));
        
        if (hasContext) score *= 1.2;

        // Calculate confidence
        const confidence = Math.min(Math.abs(score) / 10, 1);
        
        return {
          intent: score > 0 ? 'reject' : score < 0 ? 'accept' : 'neutral',
          score: score,
          confidence: confidence,
          features: features
        };
      }
    };
  }

  async analyzeButtons(buttons) {
    if (!this.isReady) return null;

    const analyses = buttons.map(button => {
      const text = button.textContent?.trim() || '';
      const ariaLabel = button.getAttribute('aria-label') || '';
      const title = button.getAttribute('title') || '';
      const fullText = `${text} ${ariaLabel} ${title}`;

      const classification = this.model.classify(fullText);
      
      return {
        element: button,
        text: text,
        classification: classification,
        score: classification.score,
        confidence: classification.confidence,
        intent: classification.intent
      };
    });

    // Sort by rejection intent and confidence
    analyses.sort((a, b) => {
      if (a.intent === 'reject' && b.intent !== 'reject') return -1;
      if (b.intent === 'reject' && a.intent !== 'reject') return 1;
      return b.confidence - a.confidence;
    });

    return {
      buttons: analyses,
      bestRejectButton: analyses.find(a => a.intent === 'reject'),
      confidence: analyses.length > 0 ? analyses[0].confidence : 0,
      processingTime: Date.now()
    };
  }
}

// Visual Validation Component
class VisualValidator {
  constructor() {
    this.isReady = false;
  }

  async initialize() {
    // Simple visual validation using DOM-based heuristics
    // In a full implementation, this would use computer vision
    this.isReady = true;
  }

  async predictSuccess(banner) {
    if (!this.isReady) return null;

    // Analyze banner characteristics to predict success likelihood
    const features = this.extractVisualFeatures(banner);
    const prediction = this.predictSuccessLikelihood(features);

    return {
      likelihood: prediction.likelihood,
      confidence: prediction.confidence,
      features: features,
      reasoning: prediction.reasoning
    };
  }

  extractVisualFeatures(banner) {
    const rect = banner.getBoundingClientRect();
    const style = getComputedStyle(banner);
    
    return {
      size: {
        width: rect.width,
        height: rect.height,
        area: rect.width * rect.height
      },
      position: {
        top: rect.top,
        left: rect.left,
        zIndex: parseInt(style.zIndex) || 0
      },
      styling: {
        position: style.position,
        backgroundColor: style.backgroundColor,
        opacity: parseFloat(style.opacity) || 1
      },
      content: {
        buttonCount: banner.querySelectorAll('button, a[role="button"]').length,
        textLength: banner.textContent?.length || 0,
        hasImages: banner.querySelectorAll('img').length > 0,
        hasIframes: banner.querySelectorAll('iframe').length > 0
      }
    };
  }

  predictSuccessLikelihood(features) {
    let likelihood = 0.5; // Base likelihood
    let confidence = 0.5;
    let reasoning = [];

    // Size-based predictions
    if (features.size.area > 100000) { // Large banners
      likelihood += 0.2;
      reasoning.push('Large banner likely has clear reject options');
    }

    // Position-based predictions
    if (features.position.zIndex > 1000) {
      likelihood += 0.1;
      confidence += 0.1;
      reasoning.push('High z-index suggests dismissible overlay');
    }

    // Content-based predictions
    if (features.content.buttonCount >= 2) {
      likelihood += 0.2;
      confidence += 0.2;
      reasoning.push('Multiple buttons suggest choice options');
    }

    if (features.content.buttonCount === 1) {
      likelihood -= 0.1;
      reasoning.push('Single button might be accept-only');
    }

    // Styling-based predictions
    if (features.styling.position === 'fixed') {
      likelihood += 0.1;
      reasoning.push('Fixed positioning suggests overlay banner');
    }

    // Normalize values
    likelihood = Math.max(0, Math.min(1, likelihood));
    confidence = Math.max(0, Math.min(1, confidence));

    return {
      likelihood: likelihood,
      confidence: confidence,
      reasoning: reasoning
    };
  }

  async validateSuccess(beforeState, afterState) {
    // Compare DOM states to determine if banner was successfully removed
    const bannerStillExists = afterState.banner && 
                              afterState.banner.parentNode && 
                              this.isElementVisible(afterState.banner);

    const confidence = bannerStillExists ? 0.9 : 0.1;

    return {
      success: !bannerStillExists,
      confidence: confidence,
      method: 'dom-comparison',
      details: {
        bannerExists: bannerStillExists,
        elementsRemoved: beforeState.elementCount - afterState.elementCount
      }
    };
  }

  isElementVisible(element) {
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    
    return style.display !== 'none' && 
           style.visibility !== 'hidden' && 
           style.opacity !== '0' &&
           rect.width > 0 && 
           rect.height > 0;
  }
}

// Q-Learning Agent for Strategy Selection
class QLearningAgent {
  constructor() {
    this.qTable = new Map();
    this.experiences = [];
    this.config = {
      learningRate: 0.1,
      discountFactor: 0.95,
      epsilon: 0.1, // Exploration rate
      maxExperiences: 1000
    };
  }

  async loadExperience() {
    try {
      const stored = localStorage.getItem('cookieKiller_QLearning');
      if (stored) {
        const data = JSON.parse(stored);
        this.qTable = new Map(data.qTable || []);
        this.experiences = data.experiences || [];
        console.log(`🎓 Loaded ${this.qTable.size} Q-values and ${this.experiences.length} experiences`);
      }
    } catch (error) {
      console.warn('Failed to load Q-learning data:', error);
    }
  }

  async saveExperience() {
    try {
      const data = {
        qTable: Array.from(this.qTable.entries()),
        experiences: this.experiences.slice(-this.config.maxExperiences)
      };
      localStorage.setItem('cookieKiller_QLearning', JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save Q-learning data:', error);
    }
  }

  stateToString(state) {
    // Convert state object to string key for Q-table
    return `${state.framework}_${state.position}_${state.buttonCount}_${state.language}`;
  }

  getActions() {
    return [
      'rule_based_primary',
      'rule_based_fallback', 
      'ai_text_analysis',
      'ai_visual_analysis',
      'hybrid_approach',
      'aggressive_clicking',
      'conservative_hiding'
    ];
  }

  async recommendStrategy(state) {
    const stateKey = this.stateToString(state);
    const actions = this.getActions();
    
    // Epsilon-greedy action selection
    if (Math.random() < this.config.epsilon) {
      // Exploration: random action
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      return {
        action: randomAction,
        confidence: 0.3,
        method: 'exploration'
      };
    }

    // Exploitation: best known action
    let bestAction = actions[0];
    let bestValue = this.getQValue(stateKey, bestAction);

    for (const action of actions) {
      const qValue = this.getQValue(stateKey, action);
      if (qValue > bestValue) {
        bestValue = qValue;
        bestAction = action;
      }
    }

    return {
      action: bestAction,
      confidence: Math.min(0.9, Math.max(0.4, bestValue / 10)),
      method: 'exploitation',
      qValue: bestValue
    };
  }

  getQValue(state, action) {
    const key = `${state}_${action}`;
    return this.qTable.get(key) || 0;
  }

  setQValue(state, action, value) {
    const key = `${state}_${action}`;
    this.qTable.set(key, value);
  }

  async recordExperience(experience) {
    this.experiences.push(experience);
    
    // Update Q-values based on experience
    if (experience.state && experience.action) {
      const stateKey = this.stateToString(experience.state);
      const reward = this.calculateReward(experience);
      
      const currentQ = this.getQValue(stateKey, experience.action);
      const newQ = currentQ + this.config.learningRate * (reward - currentQ);
      
      this.setQValue(stateKey, experience.action, newQ);
      
      // Periodically save experience
      if (this.experiences.length % 10 === 0) {
        await this.saveExperience();
      }
    }
  }

  calculateReward(experience) {
    let reward = 0;

    // Success/failure
    if (experience.success) {
      reward += 10;
    } else {
      reward -= 5;
    }

    // Confidence bonus
    reward += (experience.confidence || 0) * 3;

    // Method efficiency bonus
    if (experience.method === 'rule-based' && experience.success) {
      reward += 2; // Bonus for efficient rule-based success
    }

    // Time penalty (encourage faster processing)
    const processingTime = experience.processingTime || 0;
    if (processingTime > 1000) {
      reward -= 1;
    }

    return reward;
  }

  getStats() {
    return {
      qTableSize: this.qTable.size,
      experienceCount: this.experiences.length,
      successRate: this.calculateSuccessRate(),
      topStrategies: this.getTopStrategies()
    };
  }

  calculateSuccessRate() {
    if (this.experiences.length === 0) return 0;
    
    const recentExperiences = this.experiences.slice(-100);
    const successes = recentExperiences.filter(exp => exp.success).length;
    return successes / recentExperiences.length;
  }

  getTopStrategies() {
    const strategies = {};
    
    for (const [key, value] of this.qTable.entries()) {
      const action = key.split('_').slice(-2).join('_');
      if (!strategies[action]) strategies[action] = [];
      strategies[action].push(value);
    }

    return Object.entries(strategies)
      .map(([action, values]) => ({
        action,
        avgValue: values.reduce((a, b) => a + b, 0) / values.length,
        count: values.length
      }))
      .sort((a, b) => b.avgValue - a.avgValue)
      .slice(0, 5);
  }
}

// Export for use in content script
window.AIEngine = AIEngine; 