import {cocktail} from '../models/Cocktail.js'

export let listeObjetsCocktails = new Array();

//lecture duu fichier XML avec AJAX et recuperation des données en forme de liste d'objets de la classe cocktail
export const chargerCocktailsAJAX = () =>{
    $.ajax({
        type: "GET",
        url: "/cocktails",       
        dataType: 'xml'
    }).done(reponse => {        
        const cocktailsDOM = reponse.getElementsByTagName("cocktail");
        creerObjetsListeCocktails(cocktailsDOM);               
    }).fail(e => {
        console.log("Erreur lors de la récupération des cocktails");
    });
}

export let creerObjetsListeCocktails = (listeCocktailsDOM) =>{
    for (let unCocktailDOM of listeCocktailsDOM) {
        let id = parseInt(unCocktailDOM.getElementsByTagName("id")[0].textContent);
        let nom = unCocktailDOM.getElementsByTagName("nom")[0].textContent;
        let type = unCocktailDOM.getElementsByTagName("type")[0].textContent;
        let prix = parseFloat(unCocktailDOM.getElementsByTagName("prix")[0].textContent);
        let image = unCocktailDOM.getElementsByTagName("image")[0].textContent;

        // Recupere tous les ingredients dans une seule liste
        let ingredients = Array.from(unCocktailDOM.getElementsByTagName("ingredients"))
            .map(ingredient => ingredient.textContent.trim());

        // crée un nouveau cocktail avec les données lues et l'ajoute dans la liste
        let unCocktail = new cocktail(id, nom, type, ingredients, prix, image);
        listeObjetsCocktails.push(unCocktail);
    }    
}

//Ajouter un cocktail avec xml et la classe cocktail
export const ajouterCocktail = (element) => {
    console.log("cocktail en ajouterCocktail:", element);
    
    const xmlBody = `
        <cocktail>
            <id>${element.getId()}</id>
            <nom>${element.getNom()}</nom>
            <type>${element.getType()}</type>
            ${element.getIngredients().map(ing => `<ingredients>${ing}</ingredients>`).join('')}
            <prix>${element.getPrix()}</prix>
            <image>${element.getImage()}</image>
        </cocktail>
    `;
    console.log("xmlBody: ", xmlBody);
    return $.ajax({
        url: '/cocktails',
        method: 'POST',
        contentType: 'application/xml', 
        data: xmlBody.trim(), 
        success: (response) => {           
            const parser = new DOMParser();
            const xmlResponse = parser.parseFromString(response, "application/xml");
            return xmlResponse;
        },
        error: (jqXHR, textStatus, errorThrown) => {
            console.error("Erreur lors de l'ajout:", textStatus, errorThrown);
        }
    });
};

// Modifier un élément
export const modifier = (id, element) => {
    
        const xmlBody = `
        <cocktail>
            <id>${element.getId()}</id>
            <nom>${element.getNom()}</nom>
            <type>${element.getType()}</type>
            ${element.getIngredients().map(ing => `<ingredients>${ing}</ingredients>`).join('')}
            <prix>${element.getPrix()}</prix>
            <image>${element.getImage()}</image>
        </cocktail>
    `;
    
    return $.ajax({
        url: `/cocktails/${id}`,
        method: 'PUT',
        contentType: 'application/xml', 
        data: xmlBody.trim(), 
        success: (response) => {            
            const parser = new DOMParser();
            const xmlResponse = parser.parseFromString(response, "application/xml");
            return xmlResponse;
        },
        error: (jqXHR, textStatus, errorThrown) => {
            console.error("Erreur lors de l'ajout:", textStatus, errorThrown);
        }
    });    
       
};

// Supprimer un élément
export const supprimer = (id) => {
    return $.ajax({
        url: `/cocktails/${id}`,  
        method: 'DELETE',
        contentType: 'application/xml',  
        success: (response) => {            
            const parser = new DOMParser();
            const xmlResponse = parser.parseFromString(response, "application/xml");
            return xmlResponse; 
        },
        error: (jqXHR, textStatus, errorThrown) => {
            console.error("Erreur lors de la suppression:", textStatus, errorThrown);
        }
    });
};