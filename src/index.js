import './css/styles.css';
import debounce from 'lodash.debounce';
import  API from './fetchCountries'
import Notiflix from 'notiflix';

const refs = {
    searchInput: document.querySelector('#search-box'),
    countryInfo: document.querySelector(".country-info"),
    countryList:document.querySelector(".country-list"),
};

refs.searchInput.addEventListener('input', debounce(onSearch, 300));

function onSearch (e) {
    e.preventDefault();      
    API.fetchCountries(refs.searchInput.value.trim())         
        .then(country => { 
            console.log(country);
            if (country.length > 10) {                
                onFetchWarning()
            };
                        
            if(country.length ===1) {            
                createCountryInfo(country[0]);
            };
                        
            if (country.length >= 2 ) {                
                refs.countryInfo.innerHTML = " ";
                createCountryList(country[0]);
              return  country.reduce((markup, country) => createCountryList(country) + markup, "");              
            };
          
        })  
        .then((markup) => {            
            (updateCountryList(markup));
            
            if (markup === undefined) {
                refs.countryList.innerHTML = "";               
            };
        })
        .catch((error) => {  
            onFetchError(error);  
            console.log("error");
        });        
};

function updateCountryList(markup) {     
    refs.countryList.innerHTML = markup;    
};

function createCountryList({ flags, name }) {    
    return`<ul class="list">
                <li class="list-item">
                    <img src="${flags.png}" alt="flag" width="30" height="30"> 
                    <h1>${name.official}</h1> 
                </li> 
            </ul>`; 
};
function createCountryInfo({ name, flags, capital, population, languages}) { 
    const allLanguage = Object.values(languages).join( ',  ' )   
    const markup = `<ul class="list">
                <li class="list-item">
                    <img src="${flags.png}" alt="flag" width="30" height="30"> 
                    <h1>${name.official}</h1> 
                </li>               
                <li><span>Capital: </span>${capital}</li>
                <li><span>Population: </span>${population}</li>
                <li><span>Languages: </span>${allLanguage}</li>
            </ul>`;    
    refs.countryInfo.innerHTML = markup;        
};
function onFetchWarning() {
    Notiflix.Notify.warning('Too many matches found. Please enter a more specific name.');
};
function onFetchError(error) {
    Notiflix.Notify.failure('Oops, there is no country with that name');
};

