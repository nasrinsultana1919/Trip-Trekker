const attractionsData = [
  {
    title: "Eiffel Tower, Paris",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    description: "The iconic iron lattice tower in Paris, France, offering breathtaking views of the city and a rich history since 1889.",
    link: "https://www.toureiffel.paris/en"
  },
  {
    title: "Great Wall of China",
    image: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=80",
    description: "A magnificent series of ancient walls stretching over 13,000 miles, built to protect Chinese states and empires.",
    link: "https://www.travelchinaguide.com/china_great_wall/"
  },
  {
    title: "Grand Canyon, USA",
    image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=800&q=80",
    description: "A natural wonder carved by the Colorado River, offering stunning views and hiking opportunities in Arizona.",
    link: "https://www.nps.gov/grca/index.htm"
  },
  {
    title: "Machu Picchu, Peru",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
    description: "The ancient Incan city set high in the Andes Mountains, famous for its archaeological significance and breathtaking scenery.",
    link: "https://www.peru.travel/en-us/what-to-do/machu-picchu"
  },
  {
    title: "Kerala Backwaters",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    description: "A network of serene canals and lakes offering unique houseboat experiences surrounded by lush greenery.",
    link: "https://www.keralatourism.org/kerala-backwaters"
  },
  {
    title: "Varanasi, Uttar Pradesh",
    image: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80",
    description: "One of the oldest living cities in the world, known for its spiritual significance and the sacred Ganges River.",
    link: "https://www.incredibleindia.org/content/incredible-india-v2/en/destinations/varanasi.html"
  },
  {
    title: "Goa Beaches",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    description: "Famous for its golden sandy beaches, vibrant nightlife, and Portuguese heritage.",
    link: "https://www.goa-tourism.com/"
  }
];

function loadAttractions() {
  const container = document.getElementById('attractions');
  container.innerHTML = ''; // Clear previous content if any
  attractionsData.forEach(attraction => {
    const card = document.createElement('div');
    card.className = 'card';

    card.innerHTML = `
      <img src="${attraction.image}" alt="${attraction.title}" />
      <div class="card-content">
        <h3>${attraction.title}</h3>
        <p>${attraction.description}</p>
        <a href="${attraction.link}" target="_blank" rel="noopener noreferrer" class="learn-more">Learn More</a>
      </div>
    `;

    container.appendChild(card);
  });
}

window.onload = loadAttractions;