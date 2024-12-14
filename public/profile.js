document.addEventListener('DOMContentLoaded', () => {
    const quoteElement = document.querySelector('#quote');
    const authorElement = document.querySelector('#author');
    const refreshButton = document.querySelector('#refresh-btn');
  
    // Function to fetch a random fact (quote) from the server
    const fetchRandomFact = () => {
      quoteElement.textContent = 'Loading fact...';
      authorElement.textContent = '';
      
      fetch('/api/random-fact')  // Endpoint on your server
        .then(response => response.json())
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
        });
    };

    // Initial fetch on page load
    fetchRandomFact();

    // Refresh button click event to fetch new fact
    refreshButton.addEventListener('click', fetchRandomFact);
});
