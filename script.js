const apiKey = "1433e1c158mshe6bb1df65713484p15d804jsn2bfdcb293bfe";
const apiUrl = "https://wft-geo-db.p.rapidapi.com/v1/geo/cities";
const resultsContainer = document.getElementById("results");
const filterButton = document.getElementById("filterButton");
const randomButton = document.getElementById("randomButton");

function getCountryCodesByContinent(continent) {
  const continentCountries = {
    AF: ["DZ", "AO", "BJ", "BW", "BF", "BI", "CM", "CV", "CF", "TD", "KM", "CG", "CD", "DJ", "EG", "GQ", "ER", "SZ", "ET", "GA", "GM", "GH", "GN", "GW", "CI", "KE", "LS", "LR", "LY", "MG", "MW", "ML", "MR", "MU", "MA", "MZ", "NA", "NE", "NG", "RW", "ST", "SN", "SC", "SL", "SO", "ZA", "SS", "SD", "TZ", "TG", "TN", "UG", "ZM", "ZW"],
    AS: ["AF", "AM", "AZ", "BH", "BD", "BT", "BN", "KH", "CN", "CY", "GE", "IN", "ID", "IR", "IQ", "IL", "JP", "JO", "KZ", "KW", "KG", "LA", "LB", "MY", "MV", "MN", "MM", "NP", "OM", "PK", "PH", "QA", "SA", "SG", "KR", "LK", "SY", "TW", "TJ", "TH", "TL", "TR", "TM", "AE", "UZ", "VN", "YE"],
    EU: ["AL", "AD", "AT", "BY", "BE", "BA", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IS", "IE", "IT", "LV", "LI", "LT", "LU", "MT", "MC", "ME", "NL", "MK", "NO", "PL", "PT", "RO", "RU", "SM", "RS", "SK", "SI", "ES", "SE", "CH", "UA", "GB", "VA"],
    NA: ["AG", "BS", "BB", "BZ", "CA", "CR", "CU", "DM", "DO", "SV", "GD", "GT", "HT", "HN", "JM", "MX", "NI", "PA", "KN", "LC", "VC", "TT", "US"],
    SA: ["AR", "BO", "BR", "CL", "CO", "EC", "GY", "PY", "PE", "SR", "UY", "VE"],
    OC: ["AU", "FJ", "KI", "MH", "FM", "NR", "NZ", "PW", "PG", "WS", "SB", "TO", "TV", "VU"],
  };
  return continentCountries[continent] || [];
}

async function fetchCities(params = "") {
  const response = await fetch(`${apiUrl}?${params}`, {
    headers: {
      "X-RapidAPI-Key": apiKey,
      "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
    },
  });
  if (response.ok) {
    const data = await response.json();
    return data.data;
  } else {
    throw new Error("Failed to fetch destinations.");
  }
}

function createDestinationCard(destination) {
  const card = document.createElement("div");
  card.className = "destination";
  card.innerHTML = `
    <h2>${destination.city}, ${destination.country}</h2>
    <p>Region: ${destination.region || "N/A"}</p>
    <p>Population: ${destination.population || "N/A"}</p>
  `;
  resultsContainer.appendChild(card);
}

filterButton.addEventListener("click", async () => {
  const continent = document.getElementById("continent").value;
  const type = document.getElementById("type").value;
  const budget = document.getElementById("budget").value;
  let params = "limit=10";

  if (continent) {
    const countryCodes = getCountryCodesByContinent(continent);
    if (countryCodes.length) {
      params += `&countryIds=${countryCodes.join(",")}`;
    }
  }

  resultsContainer.innerHTML = "Loading destinations...";
  try {
    const destinations = await fetchCities(params);
    resultsContainer.innerHTML = "";
    if (destinations.length) {
      destinations.forEach(createDestinationCard);
    } else {
      resultsContainer.innerHTML = "No destinations found.";
    }
  } catch (error) {
    resultsContainer.innerHTML = error.message;
  }
});
