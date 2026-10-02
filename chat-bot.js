const apiKey = "26e788ffd6bd4b55b7075ad15857246a"; // Your Geoapify API key

function sendMessage() {
  const input = document.getElementById("user-input");
  const message = input.value.trim();
  if (!message) return;

  addMessage("user", message);
  input.value = "";
  handleUserQuery(message.toLowerCase());
}

function addMessage(sender, text) {
  const chatBox = document.getElementById("chat-box");
  const messageDiv = document.createElement("div");
  messageDiv.className = sender === "user" ? "user-message" : "bot-message";
  messageDiv.innerText = text;
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function handleUserQuery(query) {
  if (query.includes("how can you help")) {
    const helpText = `
I can help you find:
🏨 Hotels  
🏥 Medical Stores  
✈ Airports  
🚌 Bus Stands  
🛍 Shopping Malls  
📍 Nearby Attractions  

You can also ask me:
🧳 "Make me a 5 day travel plan for Jaipur"  
🔍 "Find hotels near Delhi"  
🗺 "Show attractions near me"  
🛫 "Where is the nearest airport?"`;
    addMessage("bot", helpText);
    return;
  }

  // Updated itinerary detection with better regex
 const itineraryMatch = query.match(/(?:make|create)(?:.*?)(\d+)\s*day(?:s)?\s+travel\s+plan\s+for\s+(.+)/i);
  if (itineraryMatch) {
   const days = parseInt(itineraryMatch[1]);
   const city = itineraryMatch[2].trim();
    generateTravelPlan(city, days);
    return;
  }

  const categories = {
    hotel: ["accommodation.hotel"],
    medical: ["healthcare.pharmacy", "healthcare.hospital"],
    airport: ["airport.international", "airport"],
    bus: ["public_transport.bus"],
    mall: ["commercial.shopping_mall"],
    attraction: ["tourism.sights", "tourism.attraction"]
  };

  let selectedCategory = null;
  for (const [key, tags] of Object.entries(categories)) {
    if (query.includes(key)) {
      selectedCategory = tags;
      break;
    }
  }

  if (!selectedCategory) {
    addMessage("bot", "🤖 Sorry, I didn’t understand that. You can ask about hotels, malls, travel plans, etc.");
    return;
  }

  const locationMatch = query.match(/near\s+([a-z\s]+)/i);
  if (locationMatch && locationMatch[1]) {
    const locationName = locationMatch[1].trim();
    geocodeLocation(locationName, selectedCategory);
  } else {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchPlaces(latitude, longitude, selectedCategory);
      },
      () => {
        addMessage("bot", "📍 Please enable location services.");
      }
    );
  }
}

function geocodeLocation(location, categories) {
  const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(location)}&limit=1&apiKey=${apiKey}`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (data.features.length === 0) {
        addMessage("bot", `❌ Sorry, I couldn't find "${location}".`);
        return;
      }

      const { lat, lon } = data.features[0].properties;
      fetchPlaces(lat, lon, categories);
    })
    .catch(() => {
      addMessage("bot", "⚠ Failed to find location. Please try again.");
    });
}

function fetchPlaces(lat, lon, categories) {
  const url = `https://api.geoapify.com/v2/places?categories=${categories.join(",")}&filter=circle:${lon},${lat},3000&limit=5&apiKey=${apiKey}`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (!data.features || data.features.length === 0) {
        addMessage("bot", "📭 No places found nearby.");
        return;
      }

      const places = data.features.map((f) => `📍 ${f.properties.name || f.properties.address_line1}`);
      addMessage("bot", `Here are some options nearby:\n\n${places.join("\n")}`);
    })
    .catch(() => {
      addMessage("bot", "⚠ Failed to fetch places. Please try again.");
    });
}

function generateTravelPlan(city, days) {
  if (days < 1 || days > 10) {
    addMessage("bot", "⚠ Please choose a number of days between 1 and 10.");
    return;
  }

  const activities = [
    "🏰 Visit historical monuments",
    "🌆 Explore local neighborhoods",
    "🍛 Try regional cuisine",
    "🛍 Shop at local markets",
    "🎭 Attend a cultural show or museum",
    "🌳 Relax in a park or lakefront",
    "📸 Take scenic photos and post on Instagram",
    "🚶 Take a guided walking tour",
    "🕌 Visit temples or spiritual sites",
    "🚴‍♂ Go cycling or outdoor adventure"
  ];

  let plan =` 🧳 Here's your ${days}-day travel plan for 🌆 *${city}*:\n\n`;
  const usedActivities = new Set();

  for (let i = 1; i <= days; i++) {
    let selected = [];
    while (selected.length < 2) {
      const activity = activities[Math.floor(Math.random() * activities.length)];
      if (!usedActivities.has(activity) || days > 5) {
        selected.push(activity);
        usedActivities.add(activity);
      }
    }
    plan +=`🗓 Day ${i}:\n• ${selected[0]}\n• ${selected[1]}\n\n`;
  }

  addMessage("bot", plan);
}