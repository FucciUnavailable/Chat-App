import('node-fetch').then(({ default: fetch }) => {
    const express = require('express');
    const app = express();
    require("dotenv").config()
    const API_KEY = process.env.API_KEY;
  
    // Define the fetchApi function after the import
    function fetchApi() {
      app.get('/api/random-fact', async (req, res) => {
        try {
          const response = await fetch('https://api.api-ninjas.com/v1/quotes', {
            headers: {
              'X-Api-Key': API_KEY,
            },
          });
  
          const data = await response.json();
  
          if (data.length === 0) {
            return res.json({ quote: 'No facts available at the moment.' });
          }
  
          const randomFact = data[0]; // Get the first quote
          res.json({
            quote: randomFact.quote,
            author: randomFact.author,
          });
        } catch (error) {
          console.error('Error fetching fact:', error);
          res.status(500).json({ quote: 'Failed to load fact. Please try again later.' });
        }
      });
  
      // Export the fetchApi function
      module.exports = fetchApi;
    }
  
    // Initialize the fetchApi function to set up the route
    fetchApi();
  }).catch(err => {
    console.error('Error loading fetch module:', err);
  });
  