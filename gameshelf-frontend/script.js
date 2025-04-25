fetch('/api/games')
  .then(response => response.json())
  .then(data => {
  })
  .catch(error => {
    console.error('Error fetching games:', error);
  });
