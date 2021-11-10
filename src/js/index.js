var _a;
export const localStorage = window.localStorage;
export const $_getElement = (query) => {
    return document.querySelector(query);
};
const countryInputForm = $_getElement('#populationForm');
const countryNameInput = $_getElement('#populationInput');
const cardsContainer = $_getElement('.cards__container');
let globalCountriesData = (_a = JSON.parse(localStorage.getItem('globalCountriesData'))) !== null && _a !== void 0 ? _a : [];
// left
const addDataToLocalStorage = () => {
    localStorage.setItem('globalCountriesData', JSON.stringify(globalCountriesData));
};
const doesCountryNameAlreadyExist = (name) => {
    const arr = globalCountriesData.filter((data) => {
        return data.countryName.toLowerCase() === name.toLowerCase();
    });
    return (arr.length < 1) ? false : true;
};
const addToglobalCountriesData = (data) => {
    globalCountriesData = [...globalCountriesData, data];
};
const capitalizeTheWord = (word) => {
    word = word.trim().toLowerCase();
    const characterArray = word.split("");
    characterArray[0] = characterArray[0].toUpperCase();
    return characterArray.join('');
};
export const mapCountriesDataToLi = (data) => {
    data.map((data, index) => {
        if (index === 0)
            cardsContainer.innerHTML = "";
        const countryCard = `
  <li class="card position-relative">
      <div class="card__rank position-absolute">${data.worldRank}</div>
      <p class="card__countryName text-center">${data.countryName}</p>
      <p class="text-center text-black-50 text-capitalize card__popText">population</p>
      <p class="card__population text-center mt-0">${data.population}</p>
      <p class="text-center text-black-50 text-capitalize">world share</p>
      <p class="card__worldShare text-center card__shareText mt-0">${data.worldShare}</p>
    </li>`;
        cardsContainer.innerHTML += countryCard;
    });
};
globalCountriesData && mapCountriesDataToLi(globalCountriesData);
countryInputForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const countryName = countryNameInput.value;
    countryNameInput.value = "";
    // if no country name in input
    if (!countryName) {
        alert("Invalid Input");
        return null;
    }
    if (globalCountriesData.length > 0 && doesCountryNameAlreadyExist(countryName)) {
        alert("Country name already exists. Try different country name.");
        return null;
    }
    const countryDataObj = await fetchCountryDataFromAPI(countryName);
    if (countryDataObj) {
        addToglobalCountriesData(countryDataObj);
        mapCountriesDataToLi(globalCountriesData);
        addDataToLocalStorage();
    }
    else {
        alert("Invalid input");
    }
});
const fetchCountryDataFromAPI = async (countryName) => {
    countryName = capitalizeTheWord(countryName);
    const response = await fetch(`https://world-population.p.rapidapi.com/population?country_name=${countryName}`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "world-population.p.rapidapi.com",
            "x-rapidapi-key": "7f54fccc8fmsha43c07715b78734p1dc6e3jsn02550d4fbd3f"
        }
    });
    const data = await response.json();
    if (!data.ok)
        return null;
    const { body: { population, country_name, ranking, world_share } } = data;
    return {
        worldRank: ranking,
        countryName: country_name,
        population: Number(population.toFixed(2)),
        worldShare: world_share
    };
};
