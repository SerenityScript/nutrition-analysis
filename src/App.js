import { useState, useEffect } from "react";
import { Nutrition } from "./Nutrition";
import { LoaderPage } from './Loader/LoaderPage';
import video from './food.mp4';
import './App.css';
import Swal from "sweetalert2";

function App() {
  const [mySearch, setMySearch] = useState('');
  const [wordSubmitted, setWordSubmitted] = useState('');
  const [myNutrition, setMyNutrition] = useState(null);
  const [stateLoader, setStateLoader] = useState(false);

  const APP_ID = "f5850c55";
  const APP_KEY = "6c7cc7fdbc9e876ad958e2ffb96f9aaf	";
  const APP_URL = "https://api.edamam.com/api/nutrition-details"

  const fetchData = async (ingr) => {
    setStateLoader(true);

    const response = await fetch(`${APP_URL}?app_id=${APP_ID}&app_key=${APP_KEY}`, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ingr: ingr })
    })

    if(response.ok) {
      const data = await response.json();
      setMyNutrition(data);
    } else {
      Swal.fire({
        title: "Try Again!",
        text: "Example: 3 avocados, 1 teaspoon chia, 10ml coconut oil",
        imageUrl: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D",
        imageWidth: 400,
        imageHeight: 300,
        imageAlt: "Custom image"
      });
    }
    setStateLoader(false);
  }

  const myRecipeSearch = (e) => {
    setMySearch(e.target.value);
  }

  const finalSearch = (e) => {
    e.preventDefault();
    setWordSubmitted(mySearch);
  }


  useEffect(() => {
    if (wordSubmitted !== '') {
      let ingr = wordSubmitted.split(/[,,;,\n,\r]/);
      fetchData(ingr);
    }
  }, [wordSubmitted])

  return (
    <div className="App">
      <video autoPlay muted loop>
        <source src={video} type="video/mp4" />
      </video>
      {stateLoader && <LoaderPage />}

      <div className="Content">
        <h1>Nutrition Analysis</h1>

        <form onSubmit={finalSearch}>
          <input
            placeholder="Enter ingredients, exp: 1 kiwi, 1 teaspoon chia..."
            onChange={myRecipeSearch}
            value={mySearch}
          />
        
          <div className="Buttons">
            <button type="submit" className="neu-button" disabled={stateLoader}>Search</button>
            <button className="neu-button" onClick={() => {
              setMySearch("");
              setMyNutrition(null);
            }}>Clear</button>
          </div>
        </form>
      
        <h2>Your ingredients: {mySearch} </h2>
        <hr />
        {
          myNutrition && <div className="TotalScore">
            <h3>Calories: {myNutrition.calories} kcal</h3>
            <h3>Carbs: {myNutrition.totalNutrients.CHOCDF.quantity.toFixed(1)} g</h3>
            <h3>Fat: {myNutrition.totalNutrients.FAT.quantity.toFixed(1)} g</h3>
            <h3>Protein: {myNutrition.totalNutrients.PROCNT.quantity.toFixed(1)} g</h3>
          </div>
        }
        
        {
          myNutrition && Object.values(myNutrition.totalNutrients)
            .map(({ label, quantity, unit }) =>
              <Nutrition
                label={label}
                quantity={quantity}
                unit={unit}
                key={label}
              />
            )
        }
      </div>
    </div>
  );
}

export default App;
