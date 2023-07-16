window.addEventListener('DOMContentLoaded', () => {
    // Make an AJAX request to retrieve the data
    fetch('/users')
      .then(response => response.json())
      .then(data => {
        // Process the retrieved data as needed
        const htmlContent = generateHTML(data);
  
        // Insert the generated HTML content into the list
        const dataList = document.getElementById('dataList');
        dataList.innerHTML = htmlContent;
      })
      .catch(error => console.log('Error:', error));
  });
  
  // Function to generate the HTML content with the data
  function generateHTML(data) {
    let html = '';
  
    // Iterate over the data and create list items
    data.forEach(item => {
      html += `<li>${item.column1} - ${item.column2}</li>`;
    });
  
    return html;
  }
  