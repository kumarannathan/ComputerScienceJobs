import { useState } from 'react';

interface AlertPreferences {
  email: string;
  keywords: string[];
  location: string;
  salary: string;
  frequency: 'daily' | 'weekly';
}

export default function JobAlerts() {
  const [email, setEmail] = useState('');
  const [keyword, setKeyword] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleAddKeyword = () => {
    if (keyword && !keywords.includes(keyword)) {
      setKeywords([...keywords, keyword]);
      setKeyword('');
    }
  };

  const handleRemoveKeyword = (keywordToRemove: string) => {
    setKeywords(keywords.filter(k => k !== keywordToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const preferences: AlertPreferences = {
      email,
      keywords,
      location,
      salary,
      frequency
    };

    // Store preferences in localStorage
    localStorage.setItem('jobAlertPreferences', JSON.stringify(preferences));
    
    // Here we'll add the API call to subscribe to alerts
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      });

      if (response.ok) {
        setIsSubscribed(true);
      }
    } catch (error) {
      console.error('Error subscribing to alerts:', error);
    }
  };

  return (
    <div className="job-alerts">
      <h2>Set Up Job Alerts</h2>
      <p>Get notified when new jobs match your preferences</p>
      
      {isSubscribed ? (
        <div className="success-message">
          Successfully subscribed to job alerts! You'll receive notifications at {email}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="alerts-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="keyword">Keywords</label>
            <div className="keyword-input">
              <input
                type="text"
                id="keyword"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Add keywords (e.g., React, Python)"
              />
              <button type="button" onClick={handleAddKeyword}>Add</button>
            </div>
            <div className="keywords-list">
              {keywords.map((k) => (
                <span key={k} className="keyword-tag">
                  {k}
                  <button type="button" onClick={() => handleRemoveKeyword(k)}>&times;</button>
                </span>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter location (optional)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="salary">Minimum Salary</label>
            <input
              type="text"
              id="salary"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="Enter minimum salary (optional)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="frequency">Alert Frequency</label>
            <select
              id="frequency"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as 'daily' | 'weekly')}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>

          <button type="submit" className="submit-button">
            Subscribe to Job Alerts
          </button>
        </form>
      )}
    </div>
  );
} 