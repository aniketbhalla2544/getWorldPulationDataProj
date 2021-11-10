import { $_getElement, localStorage, mapCountriesDataToLi } from './index.js';

const cardsContainer = $_getElement<HTMLUListElement>(".cards__container");
const clearBtn = $_getElement<HTMLButtonElement>("#clearBtn");
const dashboardData = JSON.parse(localStorage.getItem('globalCountriesData'));

if (dashboardData.length > 0) {
  mapCountriesDataToLi(dashboardData);
} else {
  cardsContainer.innerHTML = "NO DATA FOUND";
}

clearBtn.addEventListener('click', () => {
  cardsContainer.innerHTML = "";
  localStorage.removeItem('globalCountriesData');
});

