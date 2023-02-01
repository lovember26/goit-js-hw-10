import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import fetchCountries from './fetchCountries';
const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const list = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
input.addEventListener('input', debounce(onInputSearch, DEBOUNCE_DELAY));

function onInputSearch(e) {
  list.innerHTML = '';

  countryInfo.innerHTML = '';
  const inputValue = e.target.value.trim();

  if (inputValue === '') return;
  fetchCountries(inputValue).then(data => {
    createMarkUp(data);
  });
}

function createMarkUp(data) {
  if (data.status === 404) {
    Notiflix.Notify.failure('Oops, there is no country with that name');
  } else if (data.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  } else if (data.length > 1 && data.length <= 10) {
    data.map(country => {
      createList(country.name, country.flags);
    });
  } else createCountryCard(data[0]);
}

function createList(name, flags) {
  list.insertAdjacentHTML(
    'beforeend',
    `<li><img src="${flags.svg}" width=60><h2>${name.official}<h2><li>`
  );
}

function createCountryCard(country) {
  if (!country) return;
  const languages = Object.values(country.languages).join(', ');
  countryInfo.insertAdjacentHTML(
    'beforeend',
    `<div><img src="${country.flags.svg}" width=30><h2>${country.name.official}<h2><h3>Capital: ${country.capital}<h3><h3>Population: ${country.population}<h3><h3>Languages: ${languages}<h3><div>`
  );
}
