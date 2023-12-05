const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

// initially variables need.....

let oldTab = userTab;
const API_KEY = "5ddf0f487bfdbd6456e7c861b59a4343";
oldTab.classList.add("current-tab");

function switchTab(newTab) {
    if (newTab != oldTab) {
        oldTab.classList.remove("current-tab");
        oldTab = newTab;
        oldTab.classList.add("current-tab");


        if (!searchForm.classList.contains("active")) {
            //agar search form me active component nhi hai it means it is invisible..so that we make it visible by adding active component and removing active from user tab 
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else {
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            // ab mai user tab yaani your weather waale tab pr aa gye hai..then ab weather show krna pdega,your weather me 2 chiz hai ek location access ko grant krni hai aur dusri hmare current session me agr koi local storage(coordinate) store hogi to usko fetch krke weather information mil jayegi
            getfromSessionStorage();
        }
    }
}
searchTab.addEventListener('click',() => {
    switchTab(searchTab);
});
userTab.addEventListener('click',() => {
    switchTab(userTab);
});
// checking if coordinate already present in session storage

function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        // agar local coordinates nhi milte hai tb grant access container pr jayengge....
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);

    }    

}

async function fetchUserWeatherInfo(coordinates){
    const {lat,lon} = coordinates;
    // make grant access waali container invisible..
    grantAccessContainer.classList.remove("active");
    // make loader visible...
    loadingScreen.classList.add("active");

        // API CALL...
        try{
            const response = await fetch( `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
            const data = await response.json();

            loadingScreen.classList.remove("active");
            userInfoContainer.classList.add("active");
            renderWeatherInfo(data);
        }

        catch(err){
            loadingScreen.classList.remove("active");
            console.log("An error occur")
        }

}

function renderWeatherInfo(data){
    // firstly we have to fetch the elements

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
   const desc = document.querySelector("[data-weatherDesc]");
   const weatherIcon = document.querySelector("[data-weatherIcon]");
   const temp = document.querySelector("[data-temp]");
   const windspeed = document.querySelector("[data-windspeed]");
   const humidity = document.querySelector("[data-humidity]");
   const cloudiness = document.querySelector("[data-cloudiness]");
//    fetch values from weatherInfo object and put it UI elements

cityName.innerText = data?.name;
countryIcon.src =  `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
desc.innerText = data?.weather?.[0]?.description;
weatherIcon.src =  `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
temp.innerText = `${data?.main?.temp} °C`;
windspeed.innerText = `${data?.wind?.speed} m/s` ;
humidity.innerText = `${data?.main?.humidity} %`;
cloudiness.innerText = `${data?.clouds?.all} %`;


}

//  now ab baari aati hai grant location krke location ko access krne ki jb hme current session storage se koi bhi coordinates nhi milta hai...

function getLocation(){
   try{
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
   }
   
    catch(error){
        alert(error);
    }
   
}

function showPosition(position){
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(user-Coordinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener('click',getLocation);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit",(e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "")
    return;
    else 
        fetchSearchWeatherInfo(cityName);   
        
    
})

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    grantAccessContainer.classList.remove("active");
    userInfoContainer.classList.remove("active");

    try{
        // API CALL...
        const response = await fetch( `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(error){
        alert("An Error occur");
    }
}
