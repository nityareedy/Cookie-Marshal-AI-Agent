/**
 * Cookie Marshal AI Agent - Hybrid Coordinator
 * Intelligently chooses between rule-based and AI processing
 */

class HybridCoordinator {
  constructor(ruleBasedAgent, aiEngine) {
    this.ruleBasedAgent = ruleBasedAgent;
    this.aiEngine = aiEngine;
    this.siteComplexityCache = new Map();
    this.performanceStats = {
      ruleBasedWins: 0,
      aiWins: 0,
      totalProcessed: 0,
      averageTime: {
        ruleBased: 0,
        ai: 0
      }
    };
    
    // Decision thresholds
    this.thresholds = {
      lowComplexity: 0.3,
      highComplexity: 0.7,
      confidenceMinimum: 0.6,
      timeoutMs: 3000
    };
  }

  async processBanner(banner) {
    console.log('🤖 Starting Hybrid Processing...');
    const startTime = Date.now();
    
    try {
      // Step 1: Quick site complexity analysis
      const complexity = await this.analyzeSiteComplexity(banner);
      
      // Step 2: Decide processing strategy
      const strategy = this.decideStrategy(complexity);
      
      // Step 3: Execute strategy
      const result = await this.executeStrategy(strategy, banner, complexity);
      
      // Step 4: Learn from outcome
      await this.recordOutcome(strategy, result, Date.now() - startTime);
      
      console.log(`🏁 Hybrid processing complete: ${result.method} in ${Date.now() - startTime}ms`);
      return result;
      
    } catch (error) {
      console.error('❌ Hybrid processing failed:', error);
      // Emergency fallback to rule-based
      return await this.ruleBasedAgent.processBanner(banner);
    }
  }

  async analyzeSiteComplexity(banner) {
    const domain = window.location.hostname;
    
    // Check cache first
    if (this.siteComplexityCache.has(domain)) {
      return this.siteComplexityCache.get(domain);
    }

    const factors = {
      // Banner characteristics
      bannerSize: this.getBannerComplexity(banner),
      buttonComplexity: this.getButtonComplexity(banner),
      textComplexity: this.getTextComplexity(banner),
      
      // Site characteristics
      domComplexity: this.getDOMComplexity(),
      frameworkDetection: this.detectCookieFramework(banner),
      
      // Historical performance
      historicalDifficulty: await this.getHistoricalDifficulty(domain)
    };

    const complexity = this.calculateOverallComplexity(factors);
    
    // Cache result for 1 hour
    this.siteComplexityCache.set(domain, complexity);
    setTimeout(() => this.siteComplexityCache.delete(domain), 3600000);
    
    console.log(`📊 Site complexity analysis: ${Math.round(complexity.score * 100)}% (${complexity.level})`);
    
    return complexity;
  }

  getBannerComplexity(banner) {
    const rect = banner.getBoundingClientRect();
    const area = rect.width * rect.height;
    const elements = banner.querySelectorAll('*').length;
    const nesting = this.getMaxNestingDepth(banner);
    
    // Normalize scores
    const areaScore = Math.min(area / 500000, 1); // 500k px = max complexity
    const elementScore = Math.min(elements / 100, 1); // 100 elements = max
    const nestingScore = Math.min(nesting / 10, 1); // 10 levels = max
    
    return (areaScore + elementScore + nestingScore) / 3;
  }

  getButtonComplexity(banner) {
    const buttons = banner.querySelectorAll('button, a[role="button"], input[type="button"], [onclick]');
    const buttonCount = buttons.length;
    
    let totalTextComplexity = 0;
    let dynamicButtons = 0;
    let hiddenButtons = 0;
    
    buttons.forEach(button => {
      // Text complexity
      const text = button.textContent?.trim() || '';
      if (text.length > 50) totalTextComplexity += 1;
      
      // Dynamic behavior
      if (button.hasAttribute('onclick') || button.hasAttribute('data-action')) {
        dynamicButtons += 1;
      }
      
      // Hidden elements
      const style = getComputedStyle(button);
      if (style.display === 'none' || style.visibility === 'hidden') {
        hiddenButtons += 1;
      }
    });
    
    const countScore = Math.min(buttonCount / 10, 1);
    const textScore = Math.min(totalTextComplexity / buttonCount || 0, 1);
    const dynamicScore = dynamicButtons / buttonCount || 0;
    const hiddenScore = hiddenButtons / buttonCount || 0;
    
    return (countScore + textScore + dynamicScore + hiddenScore) / 4;
  }

  getTextComplexity(banner) {
    const text = banner.textContent || '';
    const wordCount = text.split(/\s+/).length;
    const languages = this.detectMultipleLanguages(text);
    const technicalTerms = this.countTechnicalTerms(text);
    
    const lengthScore = Math.min(wordCount / 200, 1);
    const languageScore = languages.length > 1 ? 0.5 : 0;
    const techScore = Math.min(technicalTerms / 20, 1);
    
    return (lengthScore + languageScore + techScore) / 3;
  }

  getDOMComplexity() {
    const totalElements = document.querySelectorAll('*').length;
    const iframes = document.querySelectorAll('iframe').length;
    const dynamicContent = document.querySelectorAll('[data-react], [ng-], [v-]').length;
    
    const sizeScore = Math.min(totalElements / 2000, 1);
    const iframeScore = Math.min(iframes / 10, 1);
    const dynamicScore = Math.min(dynamicContent / 100, 1);
    
    return (sizeScore + iframeScore + dynamicScore) / 3;
  }

  detectCookieFramework(banner) {
    const classes = (banner.className || '').toString();
    const id = (banner.id || '').toString();
    const attributes = Array.from(banner.attributes).map(attr => attr.name).join(' ');
    const text = (classes + ' ' + id + ' ' + attributes).toLowerCase();
    
    const frameworks = {
      'cookiebot': /cookiebot|cb-/,
      'onetrust': /onetrust|ot-/,
      'trustarc': /trustarc|truste/,
      'quantcast': /quantcast|qc-/,
      'didomi': /didomi|did-/,
      'consentmanager': /consentmanager|cm-/,
      'cookiefirst': /cookiefirst|cf-/,
      'cookielaw': /cookielaw|cl-/
    };
    
    for (const [framework, pattern] of Object.entries(frameworks)) {
      if (pattern.test(text)) {
        return {
          name: framework,
          complexity: this.getFrameworkComplexity(framework),
          detected: true
        };
      }
    }
    
    return { name: 'unknown', complexity: 0.5, detected: false };
  }

  getFrameworkComplexity(framework) {
    const complexityMap = {
      'cookiebot': 0.8, // Usually complex
      'onetrust': 0.9, // Very complex
      'trustarc': 0.7,
      'quantcast': 0.6,
      'didomi': 0.8,
      'consentmanager': 0.5,
      'cookiefirst': 0.4,
      'cookielaw': 0.3
    };
    
    return complexityMap[framework] || 0.5;
  }

  async getHistoricalDifficulty(domain) {
    try {
      const key = `difficulty_${domain}`;
      const stored = localStorage.getItem(key);
      
      if (stored) {
        const data = JSON.parse(stored);
        const recentAttempts = data.attempts.filter(
          attempt => Date.now() - attempt.timestamp < 7 * 24 * 60 * 60 * 1000 // 7 days
        );
        
        if (recentAttempts.length === 0) return 0.5;
        
        const successRate = recentAttempts.filter(a => a.success).length / recentAttempts.length;
        const avgAttempts = recentAttempts.reduce((sum, a) => sum + a.attempts, 0) / recentAttempts.length;
        
        // Higher difficulty if low success rate or many attempts needed
        return 1 - (successRate * 0.7) - Math.min(avgAttempts / 10, 0.3);
      }
    } catch (error) {
      console.warn('Failed to get historical difficulty:', error);
    }
    
    return 0.5; // Default neutral difficulty
  }

  calculateOverallComplexity(factors) {
    const weights = {
      bannerSize: 0.15,
      buttonComplexity: 0.25,
      textComplexity: 0.15,
      domComplexity: 0.15,
      frameworkDetection: 0.15,
      historicalDifficulty: 0.15
    };
    
    let totalScore = 0;
    let totalWeight = 0;
    
    for (const [factor, score] of Object.entries(factors)) {
      if (typeof score === 'number' && weights[factor]) {
        totalScore += score * weights[factor];
        totalWeight += weights[factor];
      } else if (score && score.complexity !== undefined) {
        totalScore += score.complexity * weights[factor];
        totalWeight += weights[factor];
      }
    }
    
    const finalScore = totalWeight > 0 ? totalScore / totalWeight : 0.5;
    
    let level;
    if (finalScore < this.thresholds.lowComplexity) {
      level = 'low';
    } else if (finalScore > this.thresholds.highComplexity) {
      level = 'high';
    } else {
      level = 'medium';
    }
    
    return {
      score: finalScore,
      level: level,
      factors: factors,
      recommendation: this.getRecommendation(finalScore)
    };
  }

  getRecommendation(complexityScore) {
    if (complexityScore < this.thresholds.lowComplexity) {
      return 'rule-based';
    } else if (complexityScore > this.thresholds.highComplexity) {
      return 'ai-primary';
    } else {
      return 'hybrid';
    }
  }

  decideStrategy(complexity) {
    // Safe check for AI engine availability
    if (!this.aiEngine || typeof this.aiEngine.getStatus !== 'function') {
      return {
        method: 'rule-based-only',
        reason: 'AI engine not available',
        confidence: 0.8
      };
    }
    
    const aiStatus = this.aiEngine.getStatus();
    
    // Always use rule-based if AI is not available
    if (!aiStatus.initialized) {
      return {
        method: 'rule-based-only',
        reason: 'AI not initialized',
        confidence: 0.8
      };
    }
    
    // Strategy based on complexity
    switch (complexity.recommendation) {
      case 'rule-based':
        return {
          method: 'rule-based-primary',
          reason: 'Low complexity site',
          confidence: 0.9,
          fallback: 'ai'
        };
        
      case 'ai-primary':
        return {
          method: 'ai-primary',
          reason: 'High complexity site',
          confidence: 0.8,
          fallback: 'rule-based'
        };
        
      case 'hybrid':
      default:
        return {
          method: 'parallel-evaluation',
          reason: 'Medium complexity - evaluate both',
          confidence: 0.85,
          timeout: 2000
        };
    }
  }

  async executeStrategy(strategy, banner, complexity) {
    console.log(`🎯 Executing strategy: ${strategy.method}`);
    
    switch (strategy.method) {
      case 'rule-based-only':
        return await this.executeRuleBasedOnly(banner);
        
      case 'rule-based-primary':
        return await this.executeRuleBasedWithFallback(banner, complexity);
        
      case 'ai-primary':
        return await this.executeAIPrimaryWithFallback(banner, complexity);
        
      case 'parallel-evaluation':
        return await this.executeParallelEvaluation(banner, complexity, strategy.timeout);
        
      default:
        console.warn('Unknown strategy, falling back to rule-based');
        return await this.executeRuleBasedOnly(banner);
    }
  }

  async executeRuleBasedOnly(banner) {
    const startTime = Date.now();
    const result = await this.ruleBasedAgent.processBanner(banner);
    
    return {
      ...result,
      method: 'rule-based-only',
      processingTime: Date.now() - startTime,
      confidence: result.confidence || 0.8
    };
  }

  async executeRuleBasedWithFallback(banner, complexity) {
    const startTime = Date.now();
    
    // Try rule-based first
    const ruleResult = await this.ruleBasedAgent.processBanner(banner);
    
    if (ruleResult.success && ruleResult.confidence > this.thresholds.confidenceMinimum) {
      return {
        ...ruleResult,
        method: 'rule-based-primary',
        processingTime: Date.now() - startTime,
        fallbackUsed: false
      };
    }
    
    // Fallback to AI if rule-based failed or low confidence
    console.log('🔄 Rule-based insufficient, trying AI fallback...');
    const aiResult = await this.aiEngine.processWithAI(banner, complexity);
    
    if (aiResult.confidence > ruleResult.confidence) {
      const enhancedResult = await this.enhanceRuleBasedWithAI(banner, ruleResult, aiResult);
      return {
        ...enhancedResult,
        method: 'rule-based-with-ai-fallback',
        processingTime: Date.now() - startTime,
        fallbackUsed: true
      };
    }
    
    return {
      ...ruleResult,
      method: 'rule-based-primary',
      processingTime: Date.now() - startTime,
      fallbackUsed: false,
      notes: 'AI fallback was not better'
    };
  }

  async executeAIPrimaryWithFallback(banner, complexity) {
    const startTime = Date.now();
    
    // Try AI first
    const aiResult = await this.aiEngine.processWithAI(banner, complexity);
    
    if (aiResult.useAI && aiResult.confidence > this.thresholds.confidenceMinimum) {
      const processedResult = await this.processWithAIGuidance(banner, aiResult);
      return {
        ...processedResult,
        method: 'ai-primary',
        processingTime: Date.now() - startTime,
        fallbackUsed: false
      };
    }
    
    // Fallback to rule-based
    console.log('🔄 AI insufficient, trying rule-based fallback...');
    const ruleResult = await this.ruleBasedAgent.processBanner(banner);
    
    return {
      ...ruleResult,
      method: 'ai-with-rule-fallback',
      processingTime: Date.now() - startTime,
      fallbackUsed: true
    };
  }

  async executeParallelEvaluation(banner, complexity, timeout) {
    const startTime = Date.now();
    
    console.log('⚡ Starting parallel evaluation...');
    
    try {
      // Run both approaches in parallel with timeout
      const [ruleResult, aiResult] = await Promise.race([
        Promise.all([
          this.ruleBasedAgent.processBanner(banner),
          this.aiEngine.processWithAI(banner, complexity)
        ]),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Parallel evaluation timeout')), timeout)
        )
      ]);
      
      // Choose best result
      const bestResult = this.chooseBestResult(ruleResult, aiResult);
      
      if (bestResult.source === 'ai') {
        const processedResult = await this.processWithAIGuidance(banner, aiResult);
        return {
          ...processedResult,
          method: 'parallel-ai-won',
          processingTime: Date.now() - startTime,
          alternativeResult: ruleResult
        };
      } else {
        return {
          ...ruleResult,
          method: 'parallel-rule-won',
          processingTime: Date.now() - startTime,
          alternativeResult: aiResult
        };
      }
      
    } catch (error) {
      console.warn('⚠️ Parallel evaluation failed:', error);
      // Emergency fallback
      const ruleResult = await this.ruleBasedAgent.processBanner(banner);
      return {
        ...ruleResult,
        method: 'parallel-fallback',
        processingTime: Date.now() - startTime
      };
    }
  }

  chooseBestResult(ruleResult, aiResult) {
    // Compare confidence levels
    const ruleConfidence = ruleResult.confidence || 0.5;
    const aiConfidence = aiResult.confidence || 0.5;
    
    // Bias towards rule-based if similar confidence (speed advantage)
    const confidenceDiff = aiConfidence - ruleConfidence;
    const significantDifference = 0.2;
    
    if (confidenceDiff > significantDifference) {
      return { source: 'ai', result: aiResult };
    } else {
      return { source: 'rule-based', result: ruleResult };
    }
  }

  async enhanceRuleBasedWithAI(banner, ruleResult, aiResult) {
    // Use AI insights to improve rule-based result
    if (aiResult.buttonAnalysis && aiResult.buttonAnalysis.bestRejectButton) {
      // Use AI-identified button if rule-based didn't find one
      const aiButton = aiResult.buttonAnalysis.bestRejectButton.element;
      
      if (aiButton && !ruleResult.buttonClicked) {
        console.log('🔗 Using AI-identified button for rule-based processing');
        await this.ruleBasedAgent.clickButton(aiButton);
        
        return {
          ...ruleResult,
          success: true,
          buttonClicked: true,
          enhancedWithAI: true,
          confidence: Math.min((ruleResult.confidence + aiResult.confidence) / 2, 0.95)
        };
      }
    }
    
    return ruleResult;
  }

  async processWithAIGuidance(banner, aiResult) {
    // Process banner using AI-provided guidance
    let success = false;
    let method = 'ai-guided';
    
    if (aiResult.buttonAnalysis && aiResult.buttonAnalysis.bestRejectButton) {
      const button = aiResult.buttonAnalysis.bestRejectButton.element;
      const result = await this.ruleBasedAgent.clickButton(button);
      success = result.success;
      method = 'ai-button-selection';
    }
    
    if (!success && aiResult.strategy) {
      // Use AI-recommended strategy
      const strategyResult = await this.executeAIStrategy(banner, aiResult.strategy);
      success = strategyResult.success;
      method = 'ai-strategy-execution';
    }

    // REMOVED: No fallback hiding - return actual result
    if (!success) {
      console.log('❌ AI guidance failed to find safe reject button');
    }
    
    return {
      success: success,
      method: method,
      confidence: success ? aiResult.confidence : 0,
      aiAnalysis: aiResult
    };
  }

  async executeAIStrategy(banner, strategy) {
    // Execute specific strategy recommended by AI
    switch (strategy.action) {
      case 'aggressive_clicking':
        return await this.ruleBasedAgent.tryMultipleButtons(banner);
        
      case 'conservative_hiding':
        // REMOVED: No more hiding fallback
        console.log('❌ Conservative hiding disabled - attempting button click only');
        return await this.ruleBasedAgent.findAndClickRejectButton(banner);
        
      case 'hybrid_approach':
        return await this.ruleBasedAgent.processBanner(banner);
        
      default:
        return await this.ruleBasedAgent.processBanner(banner);
    }
  }

  async recordOutcome(strategy, result, processingTime) {
    this.performanceStats.totalProcessed++;
    
    // Update method-specific stats
    if (result.method.includes('rule-based')) {
      this.performanceStats.averageTime.ruleBased = 
        (this.performanceStats.averageTime.ruleBased + processingTime) / 2;
      
      if (result.success) {
        this.performanceStats.ruleBasedWins++;
      }
    }
    
    if (result.method.includes('ai')) {
      this.performanceStats.averageTime.ai = 
        (this.performanceStats.averageTime.ai + processingTime) / 2;
      
      if (result.success) {
        this.performanceStats.aiWins++;
      }
    }
    
    // Store historical difficulty for domain
    const domain = window.location.hostname;
    const key = `difficulty_${domain}`;
    
    try {
      const stored = localStorage.getItem(key) || '{"attempts": []}';
      const data = JSON.parse(stored);
      
      data.attempts.push({
        timestamp: Date.now(),
        success: result.success,
        method: result.method,
        attempts: 1, // Could be enhanced to track multiple attempts
        confidence: result.confidence,
        processingTime: processingTime
      });
      
      // Keep only recent attempts (last 50)
      data.attempts = data.attempts.slice(-50);
      
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to record outcome:', error);
    }
    
    // Learn from experience
    if (this.aiEngine.isInitialized) {
      await this.aiEngine.learnFromOutcome(
        strategy,
        result.method,
        result,
        result.method.includes('ai') ? 'ai' : 'rule-based'
      );
    }
  }

  // Helper methods
  getMaxNestingDepth(element, depth = 0) {
    let maxDepth = depth;
    
    for (const child of element.children) {
      const childDepth = this.getMaxNestingDepth(child, depth + 1);
      maxDepth = Math.max(maxDepth, childDepth);
    }
    
    return maxDepth;
  }

  detectMultipleLanguages(text) {
    const languages = [];
    const lowerText = text.toLowerCase();
    
    if (/\b(cookie|accept|reject|privacy|consent)\b/.test(lowerText)) languages.push('en');
    if (/\b(cookie|akzeptieren|ablehnen|datenschutz)\b/.test(lowerText)) languages.push('de');
    if (/\b(cookie|accepter|refuser|confidentialité)\b/.test(lowerText)) languages.push('fr');
    if (/\b(cookie|aceptar|rechazar|privacidad)\b/.test(lowerText)) languages.push('es');
    
    return languages;
  }

  countTechnicalTerms(text) {
    const techTerms = [
      'gdpr', 'ccpa', 'analytics', 'tracking', 'pixels', 'beacons',
      'javascript', 'localStorage', 'sessionStorage', 'fingerprinting',
      'third-party', 'first-party', 'targeting', 'personalization'
    ];
    
    const lowerText = text.toLowerCase();
    return techTerms.filter(term => lowerText.includes(term)).length;
  }

  getPerformanceStats() {
    const total = this.performanceStats.totalProcessed;
    
    return {
      totalProcessed: total,
      ruleBasedSuccessRate: total > 0 ? this.performanceStats.ruleBasedWins / total : 0,
      aiSuccessRate: total > 0 ? this.performanceStats.aiWins / total : 0,
      averageProcessingTime: this.performanceStats.averageTime,
      sitesInCache: this.siteComplexityCache.size
    };
  }

  reset() {
    this.siteComplexityCache.clear();
    this.performanceStats = {
      ruleBasedWins: 0,
      aiWins: 0,
      totalProcessed: 0,
      averageTime: {
        ruleBased: 0,
        ai: 0
      }
    };
  }
}

// Export for use in content script
window.HybridCoordinator = HybridCoordinator; 