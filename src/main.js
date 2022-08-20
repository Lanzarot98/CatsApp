const api = axios.create({
    baseURL: 'https://api.thecatapi.com/v1/',
});
api.defaults.headers.common['X-API-KEY'] = 'f9a90a1a-136d-4fa3-a79c-5f1e7f425d98'


// puedo colocar los query parameters de esta manera también
const API_URL_RANDOM = [
    'https://api.thecatapi.com/v1/images/search',
    '?',
    'limit=2',
    // '&order=Desc',
    // '&api_key=f9a90a1a-136d-4fa3-a79c-5f1e7f425d98',
].join('');

// puedo usar headers de autorización entonces puedo borrar el APIKey de la URL
const API_URL_FAVORITES = 'https://api.thecatapi.com/v1/favourites';
const API_URL_DELETE_FAVORITES = (id) => `https://api.thecatapi.com/v1/favourites/${id}`;
const API_URL_UPLOAD = `https://api.thecatapi.com/v1/images/upload`;


const randomCatsError = document.querySelector('#randomCatsError');
const rechargeButton = document.querySelector('#rechargeButton');
const uploadPhotoButton = document.querySelector('#uploadPhoto');

// esto es con sintaxis de async await
const loadRandomCats = async() => {
    
    const res = await fetch(API_URL_RANDOM); // llamado asíncrono = await
    const data = await res.json();
    console.log('Random');
    console.log(data);

    if(res.status !== 200) {
        randomCatsError.innerHTML = "There is an error: " + res.status; 
    } else {
        const img1 = document.querySelector('#img1');
        const img2 = document.querySelector('#img2');
        const saveButton1 = document.querySelector('#saveButton1');
        const saveButton2 = document.querySelector('#saveButton2');
        saveButton1.onclick = () => saveFavoriteCat([data[0].id]);
        saveButton2.onclick = () => saveFavoriteCat([data[1].id]);
        img1.src = data[0].url;
        img2.src = data[1].url;
    }
}

const loadFavoritesCats = async() => {

    const res = await fetch(API_URL_FAVORITES, {
        method: 'GET',
        headers: {
            'X-API-KEY': 'f9a90a1a-136d-4fa3-a79c-5f1e7f425d98',
        },
    }); 

    const data = await res.json();
    console.log('Favorites');
    console.log(data);
    
    if(res.status !== 200) {
        randomCatsError.innerHTML = "There is an error: " + res.status + data.message; 
    } else {

        const section = document.getElementById('favoritesCats');
        section.innerHTML = "";
        const h2 = document.createElement('h2');
        const h2Text = document.createTextNode('Favorites Cats');
        h2.appendChild(h2Text);
        section.appendChild(h2);

        data.forEach((cat) => {
            const article = document.createElement('article');
            const img = document.createElement('img');
            const btn = document.createElement('button');
            const btnText = document.createTextNode('Delete cat from favorites');

            img.src = cat.image.url;
            btn.appendChild(btnText);
            btn.onclick = () => deleteFavoriteCat(cat.id);
            article.appendChild(img);
            article.appendChild(btn);

            section.appendChild(article);
            
        });
    }
}

const saveFavoriteCat = async(id) => {
    // con axios me ahorro muchas lineas de código que si uso fetch
    const {data, status} = await api.post('favourites', {
        image_id: `${id}`,
    });


    // const res = await fetch(API_URL_FAVORITES, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'X-API-KEY': 'f9a90a1a-136d-4fa3-a79c-5f1e7f425d98',
    //     },
    //     body: JSON.stringify({ // traducir el formato a JSON y así el lenguaje pueda entender, para que así puedan hablar el mismo idioma.
    //         image_id: `${id}`,
    //     }),
    // });
    // const data = await res.json();

    console.log('Save');

    if(status !==200) {
        randomCatsError.innerHTML = "There is an error: " + status + data.message; 
    } else {
        console.log('Cat save to favorites');
        loadFavoritesCats();
    }
}

const deleteFavoriteCat = async (id) => {
    const res = await fetch(API_URL_DELETE_FAVORITES(id), {
        method: 'DELETE',
        headers: {
            'X-API-KEY': 'f9a90a1a-136d-4fa3-a79c-5f1e7f425d98',
        }
    });
    const data = await res.json();

    if(res.status !==200) {
        randomCatsError.innerHTML = "There is an error: " + res.status + data.message; 
    } else {
        console.log('Cat delete from favorites');
        loadFavoritesCats();
    }
}

const uploadCatPhoto = async () => {
    const form = document.querySelector('#uploadingForm');
    const formData = new FormData(form);
    console.log(formData.get('file'));

    const res = await fetch(API_URL_UPLOAD, {
        method: 'POST',
        headers: {
            // 'Content-Type': 'multipart/form-data',
            'X-API-KEY': 'f9a90a1a-136d-4fa3-a79c-5f1e7f425d98',
        },
        body: formData,
    });
    const data = await res.json();
    
    
    if(res.status !==201) {
        randomCatsError.innerHTML = "There is an error: you must select photos about cats";
    } else {
        randomCatsError.innerHTML = "";
        console.log('Cat uploaded');
        console.log({data});
        console.log(data.url);
        saveFavoriteCat(data.id);
    }
}

const previewImage = () => {
    const file = document.getElementById("file").files;
    console.log(file);
    if (file.length > 0) {
      const fileReader = new FileReader();
  
      fileReader.onload = function(e) {
        document.getElementById("preview").setAttribute("src", e.target.result);
      };
      fileReader.readAsDataURL(file[0]);
    }
}

rechargeButton.onclick = loadRandomCats;
uploadPhotoButton.onclick = uploadCatPhoto;

loadRandomCats();
loadFavoritesCats();








// saveFavoritesCats();

// esto con sintaxis de promesas:
// fetch(URL)
//     .then((res) => res.json())
//     .then((data) => {
//         const img = document.querySelector('img');
//         img.src = data[0].url;
//     })