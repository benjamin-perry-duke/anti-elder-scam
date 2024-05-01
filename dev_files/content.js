function highlightFraudText() {
    const fraudKeywords = ['fraud', 'scam', 'phishing', 'hoax', 'fake']; // Add more keywords as needed
    const elements = document.getElementsByTagName('*');
  
    for (const element of elements) {
      if (element.childNodes.length === 1 && element.childNodes[0].nodeType === Node.TEXT_NODE) {
        const text = element.textContent.toLowerCase();
        for (const keyword of fraudKeywords) {
          if (text.includes(keyword)) {
            element.style.backgroundColor = 'yellow';
            break;
          }
        }
      }
    }
  }
  
  highlightFraudText();
// Test comment