// Quality Monitoring System
class QualityMonitor {
  constructor() {
    this.metrics = {
      naming: require('./metrics/naming-convention'),
      fields: require('./metrics/field-validation'),
      relationships: require('./metrics/relationship-integrity'),
      performance: require('./metrics/performance-score')
    };
    this.thresholds = {
      critical: 0.9,
      warning: 0.7,
      info: 0.5
    };
  }

  async check(schema, type = 'doctype') {
    const report = {
      timestamp: new Date().toISOString(),
      type,
      scores: {},
      issues: [],
      suggestions: []
    };

    // Run all metrics
    for (const [name, metric] of Object.entries(this.metrics)) {
      try {
        const result = await metric.check(schema, type);
        report.scores[name] = result.score;
        
        if (result.issues) {
          report.issues.push(...result.issues.map(issue => ({
            metric: name,
            ...issue
          })));
        }
        
        if (result.suggestions) {
          report.suggestions.push(...result.suggestions.map(suggestion => ({
            metric: name,
            ...suggestion
          })));
        }
      } catch (error) {
        console.error(`Metric error for ${name}:`, error);
        report.scores[name] = 0;
        report.issues.push({
          metric: name,
          severity: 'error',
          message: error.message
        });
      }
    }

    // Calculate overall score
    const scores = Object.values(report.scores);
    report.overallScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    
    // Determine status
    if (report.overallScore >= this.thresholds.critical) {
      report.status = 'excellent';
    } else if (report.overallScore >= this.thresholds.warning) {
      report.status = 'good';
    } else if (report.overallScore >= this.thresholds.info) {
      report.status = 'needs-improvement';
    } else {
      report.status = 'poor';
    }

    return report;
  }

  checkRealtime(data, callback) {
    // Implement real-time checking for WebSocket
    const partialReport = {
      timestamp: new Date().toISOString(),
      partial: true,
      checks: []
    };

    // Quick checks only
    if (data.field) {
      const fieldCheck = this.metrics.fields.quickCheck(data.field);
      partialReport.checks.push(fieldCheck);
    }

    callback(partialReport);
  }

  getStatus() {
    return {
      metrics: Object.keys(this.metrics).length,
      thresholds: this.thresholds
    };
  }
}

module.exports = { QualityMonitor };
