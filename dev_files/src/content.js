function highlightScamSentences(element, scamSentences) {
    const text = element.textContent;
    const sentences = text.split(/(?<=[.!?])\s+/);
  
    const highlightedSentences = sentences.map(sentence => {
      if (scamSentences.some(scamSentence => sentence.includes(scamSentence))) {
        return `<span style="background-color: red;">${sentence}</span>`;
      }
      return sentence;
    });
  
    const highlightedText = highlightedSentences.join(' ');
  
    element.innerHTML = highlightedText;
  }
  
  function processTextElements() {
    const elements = document.getElementsByTagName('*');
    const textElements = Array.from(elements).filter(element =>
      element.childNodes.length === 1 && element.childNodes[0].nodeType === Node.TEXT_NODE
    );
  
    const minLength = 20; // Minimum length of sentences to consider
  
    const sentences = textElements
      .flatMap(element => element.textContent.split(/(?<=[.!?])\s+/))
      .filter(sentence => sentence.trim().length >= minLength)
      .slice(0, 100);
  
    const scamSentences = [];
  
    const promises = sentences.map(sentence => {
      const message = {
        action: 'classify',
        text: sentence,
      };
  
      console.log('Sending message to service worker:', message);
  
      return new Promise((resolve) => {
        chrome.runtime.sendMessage(message, (response) => {
          if (chrome.runtime.lastError) {
            console.error('Error sending message:', chrome.runtime.lastError);
            resolve();
            return;
          }
  
          console.log('Received response from service worker:', response);
  
          if (response && response[0].label === 'SCAM') {
            scamSentences.push(sentence);
          }
  
          resolve();
        });
      });
    });
  
    Promise.all(promises).then(() => {
      textElements.forEach(element => {
        highlightScamSentences(element, scamSentences);
      });
    });
  }
  
  processTextElements();