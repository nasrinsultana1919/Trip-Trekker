// DOM Elements
const destinationSelect = document.getElementById("destination-select");
const cardsContainer = document.querySelector(".destination-cards");
const planOutput = document.getElementById("plan-output");
const hotelOutput = document.getElementById("hotel-output");
const bookNowBtn = document.getElementById("book-now");
const saveBtn = document.getElementById("save-plan");
const clearBtn = document.getElementById("clear-plan");
const contactForm = document.getElementById("contact-form");
const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input");

let currentDestination = "";

// Function to create cards and options dynamically
function populateDestinations(filteredList = destinations) {
  cardsContainer.innerHTML = "";
  destinationSelect.innerHTML = '<option value="">--Choose--</option>';

  filteredList.forEach(dest => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.setAttribute("data-id", dest.id);

    card.innerHTML = `
      <img src="${dest.img}" alt="${dest.name}" />
      <p>${dest.name}</p>
    `;

    card.addEventListener("click", () => {
      destinationSelect.value = dest.id;
      highlightSelectedCard(dest.id);
      handleDestinationChange();
    });

    cardsContainer.appendChild(card);

    const option = document.createElement("option");
    option.value = dest.id;
    option.textContent = dest.name;
    destinationSelect.appendChild(option);
  });

  const saved = localStorage.getItem("savedDestination");
  if (saved && destinations.some(d => d.id === saved)) {
    destinationSelect.value = saved;
    highlightSelectedCard(saved);
    handleDestinationChange();
  }
}

// Fade-in animation
function fadeInElement(el) {
  el.classList.remove("fade-in");
  void el.offsetWidth;
  el.classList.add("fade-in");
}

// Highlight selected card
function highlightSelectedCard(destId) {
  document.querySelectorAll(".card").forEach(card => {
    card.classList.toggle("selected", card.getAttribute("data-id") === destId);
  });
}

// Handle dropdown or card click
function handleDestinationChange() {
  const destId = destinationSelect.value;
  currentDestination = destId;

  if (destId) {
    const dest = destinations.find(d => d.id === destId);
    planOutput.textContent = `Great! Here's your travel plan for ${dest.name}.`;
    hotelOutput.textContent = `Available hotels and flights for ${dest.name}.`;
    bookNowBtn.style.display = "inline-block";
    bookNowBtn.disabled = false;
  } else {
    planOutput.textContent = "Select a destination to see your plan.";
    hotelOutput.textContent = "Select a destination first.";
    bookNowBtn.style.display = "none";
    bookNowBtn.disabled = true;
  }

  fadeInElement(planOutput);
  fadeInElement(hotelOutput);
}

// Search feature
searchBtn?.addEventListener("click", () => {
  const searchTerm = searchInput?.value.toLowerCase().trim();
  const filtered = destinations.filter(dest => dest.name.toLowerCase().includes(searchTerm));
  populateDestinations(filtered);
});

// Event listeners
destinationSelect.addEventListener("change", () => {
  highlightSelectedCard(destinationSelect.value);
  handleDestinationChange();
});

saveBtn.addEventListener("click", () => {
  if (currentDestination) {
    localStorage.setItem("savedDestination", currentDestination);
    const dest = destinations.find(d => d.id === currentDestination);
    alert(`Your travel plan for ${dest.name} has been saved!`);
  } else {
    alert("Please select a destination first.");
  }
});

clearBtn.addEventListener("click", () => {
  destinationSelect.value = "";
  currentDestination = "";
  localStorage.removeItem("savedDestination");
  document.querySelectorAll(".card").forEach(card => card.classList.remove("selected"));
  planOutput.textContent = "Select a destination to see your plan.";
  hotelOutput.textContent = "Select a destination first.";
  bookNowBtn.style.display = "none";
  bookNowBtn.disabled = true;
  populateDestinations();
});

bookNowBtn.addEventListener("click", () => {
  if (currentDestination) {
    const dest = destinations.find(d => d.id === currentDestination);
    alert(`Redirecting you to book your trip to ${dest.name}...`);
    bookNowBtn.disabled = true;
    setTimeout(() => {
      bookNowBtn.disabled = false;
    }, 1000);
  }
});

contactForm.addEventListener("submit", e => {
  e.preventDefault();
  alert("Thanks for reaching out! We'll get back to you soon.");
  contactForm.reset();
});
// Save travel details form data to localStorage
document.getElementById('travel-details-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const startDate = document.getElementById('start-date').value;
  const endDate = document.getElementById('end-date').value;
  const activities = document.getElementById('activities').value.trim();
  const preferences = document.getElementById('preferences').value.trim();

  if (!startDate || !endDate) {
    alert('Please select both start and end dates.');
    return;
  }
  if (new Date(startDate) > new Date(endDate)) {
    alert('Start date cannot be after end date.');
    return;
  }

  const travelDetails = { startDate, endDate, activities, preferences };
  localStorage.setItem('travelDetails', JSON.stringify(travelDetails));

  alert('Travel details saved!');

  // Optionally update plan output on page
  document.getElementById('plan-output').innerText = 
    `Travel from ${startDate} to ${endDate}.\nActivities: ${activities || 'None'}.\nPreferences: ${preferences || 'None'}.`;
});

// Save selected destination to localStorage
document.getElementById('destination-select').addEventListener('change', function() {
  const selectedDestination = this.value;
  if (selectedDestination) {
    localStorage.setItem('selectedDestination', selectedDestination);
    alert(`Destination "${selectedDestination}" saved!`);
  }
});

// Add a button to go to the "cart" page below your #plan section (or wherever you prefer)
const planSection = document.getElementById('plan');
const reviewCartButton = document.createElement('a');
reviewCartButton.href = 'cart.html'; // Make sure this page exists!
reviewCartButton.textContent = 'Review Your Travel Cart';
reviewCartButton.style.cssText = `
  display: inline-block;
  background-color: #004aad;
  color: white;
  padding: 14px 30px;
  border-radius: 20px;
  font-weight: 700;
  margin-top: 20px;
  text-decoration: none;
  user-select: none;
`;
planSection.appendChild(reviewCartButton);
// Initialize
populateDestinations();