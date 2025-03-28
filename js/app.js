document.addEventListener('DOMContentLoaded', function() {
  const uuidOutput = document.getElementById('uuid-output');
  const copyBtn = document.getElementById('copy-btn');
  const generateBtn = document.getElementById('generate-btn');
  const historyList = document.getElementById('history-list');

  const MAX_HISTORY = 10;

  let uuidHistory = [];
  try {
    const storedHistory = localStorage.getItem('uuidHistory');
    if (storedHistory) {
      uuidHistory = JSON.parse(storedHistory);
    }
  } catch (error) {
    console.error('Error loading history from localStorage:', error);
  }

  function updateHistoryDisplay() {
    historyList.innerHTML = '';
    
    if (uuidHistory.length === 0) {
      const emptyItem = document.createElement('li');
      emptyItem.textContent = 'No UUIDs generated yet';
      emptyItem.className = 'history-item empty';
      historyList.appendChild(emptyItem);
      return;
    }
    
    for (const uuid of uuidHistory) {
      const historyItem = document.createElement('li');
      historyItem.className = 'history-item';
      historyItem.textContent = uuid;
      historyItem.addEventListener('click', () => {
        uuidOutput.textContent = uuid;
        navigator.clipboard.writeText(uuid).catch(err => {
          console.error('Failed to copy:', err);
        });
        
        const originalText = historyItem.textContent;
        historyItem.textContent = 'Copied!';
        setTimeout(() => {
          historyItem.textContent = originalText;
        }, 1000);
      });
      historyList.appendChild(historyItem);
    }
  }

  // Generate a UUIDv4 (random)
  function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  function uuidv1() {
    const now = new Date();
    const timestamp = now.getTime();
    const timeHex = timestamp.toString(16).padStart(12, '0');
    
    const clockseq = Math.floor(Math.random() * 16384); // 14 bits
    const clockHex = clockseq.toString(16).padStart(4, '0');
    
    const nodePart = Array.from({length: 12}, () => 
      Math.floor(Math.random() * 16).toString(16)).join('');
    
    const timeLow = timeHex.slice(-8);
    const timeMid = timeHex.slice(-12, -8);
    const timeHighAndVersion = '1' + timeHex.slice(-15, -12);
    const clockSeqHighAndReserved = (parseInt(clockHex.slice(0, 2), 16) & 0x3f | 0x80).toString(16);
    const clockSeqLow = clockHex.slice(-2);
    
    return `${timeLow}-${timeMid}-${timeHighAndVersion}-${clockSeqHighAndReserved}${clockSeqLow}-${nodePart}`;
  }

  function uuidv7() {
    const timestamp = Date.now();
    
    const timeHex = timestamp.toString(16).padStart(12, '0');
    
    const randomPart1 = Math.floor(Math.random() * 16).toString(16);
    const randomPart2 = (Math.floor(Math.random() * 4) | 8).toString(16); // Variant bits
    const randomPart3 = Array.from({length: 16}, () => 
      Math.floor(Math.random() * 16).toString(16)).join('');
    
    const p1 = timeHex.slice(-8);
    const p2 = timeHex.slice(-12, -8);
    const p3 = '7' + timeHex.slice(0, 3);
    const p4 = randomPart1 + randomPart2 + randomPart3.slice(0, 2);
    const p5 = randomPart3.slice(2);
    
    return `${p1}-${p2}-${p3}-${p4}-${p5}`;
  }

  function formatUuid(uuid) {
    const displayFormat = document.querySelector('input[name="display-format"]:checked').value;
    
    switch(displayFormat) {
      case 'no-hyphens':
        return uuid.replace(/-/g, '');
      case 'braces':
        return `{${uuid}}`;
      case 'standard':
      default:
        return uuid;
    }
  }

  function generateUuid() {
    console.log('Generating UUID...');
    const uuidType = document.querySelector('input[name="uuid-format"]:checked').value;
    console.log('UUID type selected:', uuidType);
    
    let rawUuid;
    switch(uuidType) {
      case 'v1':
        rawUuid = uuidv1();
        break;
      case 'v7':
        rawUuid = uuidv7();
        break;
      case 'v4':
      default:
        rawUuid = uuidv4();
    }
    
    console.log('Raw UUID generated:', rawUuid);
    const formattedUuid = formatUuid(rawUuid);
    console.log('Formatted UUID:', formattedUuid);
    
    uuidOutput.textContent = formattedUuid;
    console.log('UUID output updated');
    
    if (uuidHistory.includes(formattedUuid)) {
      uuidHistory = uuidHistory.filter(u => u !== formattedUuid);
    }
    
    uuidHistory.unshift(formattedUuid);
    
    if (uuidHistory.length > MAX_HISTORY) {
      uuidHistory = uuidHistory.slice(0, MAX_HISTORY);
    }
    
    try {
      localStorage.setItem('uuidHistory', JSON.stringify(uuidHistory));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
    
    updateHistoryDisplay();
  }

  function copyToClipboard() {
    const uuid = uuidOutput.textContent;
    if (uuid && uuid !== 'Click generate to create a UUID') {
      navigator.clipboard.writeText(uuid).then(() => {
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
        setTimeout(() => {
          copyBtn.innerHTML = originalText;
        }, 1000);
      }).catch(err => {
        console.error('Failed to copy:', err);
      });
    }
  }

  generateBtn.addEventListener('click', generateUuid);
  copyBtn.addEventListener('click', copyToClipboard);

  document.querySelectorAll('input[name="display-format"]').forEach(radio => {
    radio.addEventListener('change', () => {
      if (uuidOutput.textContent !== 'Click generate to create a UUID') {
        const currentUuid = uuidOutput.textContent.replace(/[{}]/g, '');
        uuidOutput.textContent = formatUuid(currentUuid);
      }
    });
  });

  updateHistoryDisplay();

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then(registration => {
          console.log('ServiceWorker registration successful');
        })
        .catch(error => {
          console.error('ServiceWorker registration failed:', error);
        });
    });
  }
  
  generateUuid();
}); 