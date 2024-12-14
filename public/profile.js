document.addEventListener('DOMContentLoaded', () => {
  const quoteElement = document.querySelector('#quote');
  const authorElement = document.querySelector('#author');
  const refreshButton = document.querySelector('#refresh-btn');
  const spinner = document.querySelector('#spinner');

  if (!quoteElement || !authorElement || !refreshButton || !spinner) {
    console.error('One or more DOM elements not found.');
    return;
  }

  const fetchRandomFact = () => {
    console.log('Fetching a random fact...');
    quoteElement.textContent = 'Loading fact...';
    authorElement.textContent = '';
    refreshButton.disabled = true; // Disable button during fetch
    spinner.style.display = 'block'; // Show spinner

    fetch('/api/random-fact')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (!data || !data.quote) {
          quoteElement.textContent = 'No facts available at the moment.';
          return;
        }
        quoteElement.textContent = `"${data.quote}"`;
        authorElement.textContent = `- ${data.author || 'Unknown'}`;
      })
      .catch(error => {
        console.error('Error fetching fact:', error);
        quoteElement.textContent = 'Failed to load fact. Please try again later.';
        authorElement.textContent = '';
      })
      .finally(() => {
        refreshButton.disabled = false; // Re-enable button
        spinner.style.display = 'none'; // Hide spinner
        console.log('Fetch complete');
      });
  };

  fetchRandomFact(); // Initial fetch
  refreshButton.addEventListener('click', fetchRandomFact); // Refresh button
});
