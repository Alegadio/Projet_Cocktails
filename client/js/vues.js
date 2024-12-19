import { afficherPage, genererPagination } from './pagination.js';
import {listeObjetsCocktails} from './requetes.js';

// Fonction pour afficher la liste des cocktails dans le DOM avec alternance de couleur de fond
export const lister = (cocktails) => {
    let listeCocktails = `<div class="row row-col-4">`;    
// Parcourir la liste et générer le HTML pour chaque élément
    cocktails.forEach((cocktail) => {
       listeCocktails += cocktail.afficher();
    });
    listeCocktails +=  "</div>";
    document.querySelector("#contenu").innerHTML = listeCocktails;      
};

// affichage selon attribut choisi
export const listerCocktails = (attribut) =>{    
    if(attribut === 'tri-id'){
        listeObjetsCocktails.sort((a, b) => a.getId() - b.getId());        
    }else if (attribut === 'tri-nom') {
        listeObjetsCocktails.sort((a, b) => a.getNom().localeCompare(b.getNom()));       
    }else if (attribut === 'tri-prix') {
        listeObjetsCocktails.sort((a, b) => a.getPrix() - b.getPrix());
    }
   afficherCocktailsParPagination(listeObjetsCocktails);     
}

//filtre et affichage des cocktails selon le type
export const listerCategorie = (categ) =>{
    let listeFiltre = [];

    if (categ === 'alcoolise') {        
        listeFiltre = listeObjetsCocktails.filter(cocktail => 
            cocktail.getType().toLowerCase() === 'alcoolisé'
        );
    } else if (categ === 'sans-alcool') {       
        listeFiltre = listeObjetsCocktails.filter(cocktail => 
            cocktail.getType().toLowerCase() === 'sans alcool'
        );
    } else {        
        listeFiltre = listeObjetsCocktails;
    }
    if (listeFiltre.length === 0) {        
        const container = document.querySelector("#contenu");
        container.innerHTML = `
            <div class="text-center mt-5">
                <h4 class="text-muted">Aucun cocktail trouvé pour cette catégorie.</h4>
            </div>
        `;
        document.querySelector('#pagination').innerHTML = '';
    } else {        
        afficherCocktailsParPagination(listeFiltre);
    }
};

export const chercher = (ingredient) =>{  

    const cocktailsAvecIng = listeObjetsCocktails.filter(cocktail =>
        cocktail.getIngredients() &&
        cocktail.getIngredients().some(ing =>
            ing.toLowerCase() === ingredient.toLowerCase()
        )
    );  

    afficherCocktailsParPagination(cocktailsAvecIng);
}     

//creation dynamique du select selon le type du cocktail
export const createFilterSelect = () => {
    const selectElement = document.getElementById("categorie");
    
    //Recuper les tous les types de cocktails a partir de listeObjetsCocktails 
    const types = [...new Set(listeObjetsCocktails.map(cocktail => cocktail.getType()))];  // Get unique types

    types.forEach(type => {
        const option = document.createElement("option");
        option.value = type;
        option.textContent = type;
        selectElement.appendChild(option);
    });
};

//creation dynamique du select selon l'ingredient' du cocktail
export const createFilterSelectIng = () => {
    const selectElement = document.getElementById("categ_Ing");  
    
    // Recuperations des ingredients
    const allIngredients = listeObjetsCocktails
        .map(cocktail => cocktail.getIngredients())  
        .flat();

    //Filtre vers ingredients non repetés
    const uniqueIngredients = [...new Set(allIngredients)];

    //crée une option per ingredient
    uniqueIngredients.forEach(ingredient => {
        const option = document.createElement("option");
        option.value = ingredient;
        option.textContent = ingredient;
        selectElement.appendChild(option);
    });
};

export const afficherCocktailsParPagination = (listeCocktails) => {
    // Pagination
    const nbCocktailsPage = 5;
    let pageCourante = 1;
    const liste = listeCocktails || listeObjetsCocktails;
  
    // Afficher la première page de la liste
    afficherPage(liste, pageCourante, nbCocktailsPage, lister);
  
    // Générer les boutons de pagination
    genererPagination(
      liste,
      nbCocktailsPage,
      afficherPage,
      lister,
      pageCourante,
      afficherCocktailsParPagination
    );
  };
 