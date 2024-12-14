document.addEventListener('DOMContentLoaded', () => {
    require("dotenv").config();
    const quoteElement = document.querySelector('#quote');
    const authorElement = document.querySelector('#author');
    const refreshButton = document.querySelector('#refresh-btn');
  
    // Function to fetch a random fact (quote)
    const fetchRandomFact = () => {
      quoteElement.textContent = 'Loading fact...';
      authorElement.textContent = '';
      
      fetch('https://api.api-ninjas.com/v1/quotes', {
        
        headers: {
          'X-Api-Key': process.env.API_KEY, // Replace with your API key
        },
      })
        .then(response => response.json())
        .then(data => {
          if (data.length === 0) {
            quoteElement.textContent = 'No facts available at the moment.';
            return;
          }
          
          const randomFact = data[0];
          console.log("random fact:", randomFact)
          quoteElement.textContent = `"${randomFact.quote}"`;
          authorElement.textContent = `- ${randomFact.author}`;
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
  