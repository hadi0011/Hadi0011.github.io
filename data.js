// Comprehensive Global Data (Fetched dynamically to ensure completeness)
window.globalCountriesData = [];
window.categorySubCats = {
    "Food & Beverage": ["Restaurant", "Cafe", "Fast Food", "Catering", "Bakery"],
    "Retail & Shopping": ["Electronics", "Fashion", "Groceries", "Home Goods", "Jewelry"],
    "Health & Medical": ["Doctors & Clinics", "Dentist", "Pharmacy", "Mental Health", "Hospital"],
    "Professional Services": ["Legal", "Accounting", "Marketing", "Translation", "Consulting"],
    "IT & Technology": ["App Development", "Web Design", "IT Support", "Cybersecurity", "Cloud Services"],
    "Finance & Exchange": ["Crypto Exchange", "Investment", "Insurance", "Banking", "Accounting"],
    "Travel & Hospitality": ["Hotel", "Flight Agency", "Tour Guide", "Visa Services", "Resort"],
    "Transportation": ["Taxi/Ride-hailing", "Car Rental", "Courier", "Freight", "Moving"],
    "Real Estate": ["Agent", "Property Management", "Short-term Rental", "Commercial"],
    "Education": ["Tutoring", "Online Courses", "Language School", "Test Prep"],
    "Home & Personal Services": ["Cleaning", "Repair", "Beauty & Salon", "Pet Care", "Plumbing"],
    "Sports & Fitness": ["Gym", "Yoga Studio", "Personal Trainer", "Martial Arts"],
    "Entertainment & Events": ["Event Planning", "Cinema", "Gaming", "Concerts"],
    "Beauty & Wellness": ["Spa", "Massage", "Skincare", "Hair Salon"],
    "Automotive": ["Car Dealer", "Auto Repair", "Car Wash", "Parts"],
    "Others": ["Custom Category"]
};

// Fetch ALL 250 countries from a reliable open-source database
fetch('https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/json/countries.json')
    .then(response => response.json())
    .then(data => {
        // Map the API data to our app's format
        window.globalCountriesData = data.map(country => ({
            name: country.name,
            continent: country.region, // e.g., Asia, Europe, Americas, Africa, Oceania
            phone: country.phone_code,
            iso2: country.iso2 // We need this for fetching cities later
        }));
        
        // Since fetch is async, we need to re-trigger the UI population
        if (typeof populateRegions === 'function') {
            populateRegions();
            populateCategories();
        }
    })
    .catch(error => console.error("Error loading countries:", error));

// Function to fetch cities dynamically based on country code
window.fetchCitiesForCountry = async function(iso2, targetSelectId) {
    const select = document.getElementById(targetSelectId);
    select.innerHTML = '<option value="">Loading cities...</option>';
    
    try {
        // Using a lightweight API to fetch cities for the specific country
        const response = await fetch(`https://countriesnow.space/api/v0.1/countries/cities`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ iso2: iso2 })
        });
        const data = await response.json();
        
        select.innerHTML = '<option value="">Select City...</option>';
        if(data.error === false && data.data) {
            // Sort cities alphabetically and add to dropdown
            data.data.sort().forEach(city => {
                select.innerHTML += `<option value="${city}">${city}</option>`;
            });
        } else {
            select.innerHTML = '<option value="">No cities found</option>';
        }
    } catch (error) {
        console.error("Error loading cities:", error);
        select.innerHTML = '<option value="">Error loading cities</option>';
    }
};
