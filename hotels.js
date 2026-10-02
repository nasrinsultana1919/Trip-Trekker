const apiKey = '52080020361c4f9ebc797b12037adaf1'; // Your Geoapify API key

async function searchHotels() {
  const city = document.getElementById('cityInput').value.trim();
  if (!city) {
    alert("Please enter a city name.");
    return;
  }

  // Step 1: Get coordinates for the city
  const geocodeUrl = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(city)}&limit=1&apiKey=${apiKey}`;

  try {
    const geoRes = await fetch(geocodeUrl);
    const geoData = await geoRes.json();

    if (!geoData.features.length) {
      alert("City not found.");
      return;
    }

    const { lat, lon } = geoData.features[0].properties;

    // Step 2: Fetch nearby hotels
    const placesUrl = `https://api.geoapify.com/v2/places?categories=accommodation.hotel&filter=circle:${lon},${lat},5000&limit=10&apiKey=${apiKey}`;
    const placesRes = await fetch(placesUrl);
    const placesData = await placesRes.json();

    const container = document.getElementById('hotelsContainer');
    container.innerHTML = '';

    placesData.features.forEach(place => {
      const hotel = place.properties;
      const website = hotel.website || hotel.url || "#";

      const hotelCard = document.createElement('div');
      hotelCard.className = 'hotel-card';

      hotelCard.innerHTML = `
        <img src="https://source.unsplash.com/400x200/?hotel,${encodeURIComponent(hotel.name)}" alt="${hotel.name}" />
        <div class="hotel-info">
          <h3>${hotel.name}</h3>
          <p>${hotel.address_line1 || hotel.city || 'Address not available'}</p>
          <p class="rating">★★★★☆</p>
          <a href="${website}" target="_blank" class="hotel-link" ${website === "#" ? "onclick='return false;'" : ""}>Visit Website</a>
          <button class="book-btn" onclick="openBookingModal('${hotel.name}')">Book Now</button>
        </div>
      `;

      container.appendChild(hotelCard);
    });
  } catch (err) {
    console.error("Error fetching hotels:", err);
    alert("Something went wrong. Please try again later.");
  }
}

// Handle modal open
function openBookingModal(hotelName) {
  const form = document.getElementById("bookingForm");
  form.reset();
  document.getElementById("confirmationMessage").style.display = "none";
  document.getElementById("bookingModal").style.display = "block";
  form.dataset.hotel = hotelName;
}

// Close modal
function closeModal() {
  document.getElementById("bookingModal").style.display = "none";
}

// Handle booking submission
function submitBooking(event) {
  event.preventDefault();

  const form = document.getElementById("bookingForm");
  const name = form.guestName.value.trim();
  const email = form.guestEmail.value.trim();
  const checkIn = form.checkIn.value;
  const checkOut = form.checkOut.value;
  const guests = form.guests.value;
  const hotel = form.dataset.hotel;

  if (!name || !email || !checkIn || !checkOut || !guests) {
    alert("Please fill in all fields.");
    return;
  }

  const confirmationMessage = document.getElementById("confirmationMessage");
  confirmationMessage.innerText = `Booking confirmed at ${hotel} for ${name} (${guests} guest${guests > 1 ? 's' : ''}) from ${checkIn} to ${checkOut}.`;
  confirmationMessage.style.display = "block";
}