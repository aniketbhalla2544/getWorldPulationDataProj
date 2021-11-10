interface IApiDataObject {
  population: number,
  country_name: string,
  ranking: number,
  world_share: number
}

interface ICountryDataObject {
  worldRank: number
  countryName: string
  population: number
  worldShare: number
}

export type IGlobalCountriesData = ICountryDataObject[];

export const localStorage: Storage = window.localStorage;

export const $_getElement = <T>(query: string): T => {
  return document.querySelector(query) as unknown as T;
}

const countryInputForm = $_getElement<HTMLFormElement>('#populationForm');
const countryNameInput = $_getElement<HTMLInputElement>('#populationInput');
const cardsContainer = $_getElement<HTMLUListElement>('.cards__container');

let globalCountriesData: IGlobalCountriesData = JSON.parse(localStorage.getItem('globalCountriesData')) ?? [];

const addDataToLocalStorage: () => void = () => {
  localStorage.setItem('globalCountriesData', JSON.stringify(globalCountriesData));
}

const doesCountryNameAlreadyExist = (name: string): boolean => {
  const arr: IGlobalCountriesData = globalCountriesData.filter((data: ICountryDataObject) => {
    return <string>data.countryName.toLowerCase() === <string>name.toLowerCase()
  });
  return (arr.length < 1) ? false : true;
}

const addToglobalCountriesData = (data: ICountryDataObject): void => {
  globalCountriesData = [...globalCountriesData, data];
}

const capitalizeTheWord = (word: string): string => {
  word = word.trim().toLowerCase();
  const characterArray: string[] = word.split("");
  characterArray[0] = characterArray[0].toUpperCase();
  return characterArray.join('');
}

export const mapCountriesDataToLi = (data: IGlobalCountriesData): void => {
  data.map((data: ICountryDataObject, index: number) => {
    if (index === 0) cardsContainer.innerHTML = "";
    const countryCard: string = `
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
}

globalCountriesData && mapCountriesDataToLi(globalCountriesData);

countryInputForm.addEventListener('submit', async (e: Event) => {
  e.preventDefault();
  const countryName: string = countryNameInput.value;
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
  } else {
    alert("Invalid input");
  }
});


const fetchCountryDataFromAPI  = async (countryName: string): Promise<ICountryDataObject> => {
  countryName = capitalizeTheWord(countryName);
  const response = await fetch(`https://world-population.p.rapidapi.com/population?country_name=${countryName}`, {
    "method": "GET",
    "headers": {
      "x-rapidapi-host": "world-population.p.rapidapi.com",
      "x-rapidapi-key": "7f54fccc8fmsha43c07715b78734p1dc6e3jsn02550d4fbd3f"
    }
  });
  const data = await response.json();
  if (!data.ok) return null;

  const { body: { population, country_name, ranking, world_share } }: { body: IApiDataObject}  = data;

  return {
    worldRank: ranking,
    countryName: country_name,
    population: Number(population.toFixed(2)),
    worldShare: world_share
  }
}