import { $_getElement, localStorage, mapCountriesDataToLi, IGlobalCountriesData } from './index.js';

const cardsContainer: HTMLUListElement = $_getElement<HTMLUListElement>(".cards__container");
const clearBtn: HTMLButtonElement = $_getElement<HTMLButtonElement>("#clearBtn");
const dashboardData: IGlobalCountriesData = JSON.parse(localStorage.getItem('globalCountriesData'));

if (dashboardData.length > 0) {
  mapCountriesDataToLi(dashboardData);
} else {
  cardsContainer.innerHTML = "NO DATA FOUND";
}

clearBtn.addEventListener('click', () => {
  cardsContainer.innerHTML = "";
  localStorage.removeItem('globalCountriesData');
});

