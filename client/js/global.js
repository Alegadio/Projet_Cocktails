/*Auteur:
Alejandra Garcia Diosa*/ 

import { cocktail } from '../models/Cocktail.js';
import { lister, listerCategorie, chercher, listerCocktails, createFilterSelect, createFilterSelectIng,  afficherCocktailsParPagination } from './vues.js';
import { ouvrirModaleAjouter, ouvrirModaleModifier, resetForm } from './modale.js';
import { chargerCocktailsAJAX, ajouterCocktail, modifier, supprimer, listeObjetsCocktails } from './requetes.js';
import { afficherToast, hideToast } from './notifications_.js';

document.addEventListener('DOMContentLoaded', async () => {
    let liste = await chargerCocktailsAJAX();

    
    

    $(document).ajaxStop(() =>{
        createFilterSelect();
        createFilterSelectIng()
        afficherCocktailsParPagination(liste);

        
        const selectMenu = document.getElementById('trier-cocktails');
        selectMenu.addEventListener('change', (event) => {
        const selectedValue = event.target.value;
            listerCocktails(selectedValue);
        });

       const selectCateg = document.getElementById('categorie');
        selectCateg.addEventListener('change', (event) => {
        const selectedValue = event.target.value;
                listerCategorie(selectedValue);
        });

        //eventlisterner pour afficher des cocktails avec un ingredient determine
        const selectCategIng = document.getElementById('categ_Ing');
        selectCategIng.addEventListener('change', (event) => {
        const selectedValue = event.target.value;
            console.log(selectedValue);
                chercher(selectedValue);
        });

    });

    const btnAjouter = document.getElementById('btnAjouter'); 
    
    //on ouvre la modale avec event listener
    document.getElementById('btnModalAjouter').addEventListener('click', () => {        
        ouvrirModaleAjouter();
        resetForm();
    });        

    // on determine la fonction du bouton si c'est ajouter ou modifier
    btnAjouter.addEventListener('click', async (event) => {
        //pour validation
        const form = document.querySelector('.needs-validation');
    
        // Validation avec HTML5 
        if (!form.checkValidity()) {
            event.preventDefault(); 
            event.stopPropagation();
            form.classList.add('was-validated');
            return;
        }    
        
        form.classList.remove('was-validated');
        
        //on recupere les données entrées pour l'ajout du cocktail 
        const nom = document.getElementById('nom').value.trim();
        const type = document.getElementById('type').value;
        const ingredients = document
            .getElementById('ingredients')
            .value.trim()
            .split(',')
            .map((ing) => ing.trim());
        const prix = parseFloat(document.getElementById('prix').value);
        const image = document.getElementById('image').value.trim();
    
        if (!isValidURL(image)) {
            alert('Veuillez fournir une URL valide pour l\'image.');
            return;
        }
    
        // Determine modalite (ajouter ou modifier)
        const mode = btnAjouter.dataset.mode || 'add';
        const id = btnAjouter.dataset.id || listeObjetsCocktails.length + 1;
              
        let nouveauCocktail = new cocktail(id, nom, type, ingredients, prix, image);
    
        if (mode === 'add') {
            const reponse = await ajouterCocktail(nouveauCocktail);
            if (reponse) {
                listeObjetsCocktails.push(new cocktail(
                    reponse.getId(),
                    reponse.getNom(),
                    reponse.getType(),
                    reponse.getIngredients(),
                    reponse.getPrix(),
                    reponse.getImage()
                ));
                alert('Cocktail ajouté avec succès!');
                afficherCocktailsParPagination(listeObjetsCocktails);
                resetForm();
            } else {
                console.error('Erreur lors de l’ajout du cocktail.');
            }
        } else if (mode === 'modify') {
            const reponse = await modifier(id, nouveauCocktail);
            if (reponse) {
                const index = listeObjetsCocktails.findIndex((c) => c.getId() === parseInt(id));
                if (index !== -1) {
                    const ancienCocktail = listeObjetsCocktails[index];
                    
                    ancienCocktail.setNom(nouveauCocktail.getNom());
                    ancienCocktail.setType(nouveauCocktail.getType());
                    ancienCocktail.setIngredients(nouveauCocktail.getIngredients());
                    ancienCocktail.setPrix(nouveauCocktail.getPrix());
                    ancienCocktail.setImage(nouveauCocktail.getImage());

                    alert('Cocktail modifié avec succès!');
                    afficherCocktailsParPagination(listeObjetsCocktails);
                    resetForm();
                }                    
            } else {
                console.error('Erreur lors de la modification du cocktail.');
            }
        }    

        const modal = bootstrap.Modal.getInstance(document.getElementById('modalAjouter'));
        modal.hide(); 
    });    

    // Supression d'un element
    document.getElementById('contenu').addEventListener('click', (e) => {
        if (e.target.classList.contains('bi-trash')) {
            const id = e.target.dataset.id;
            afficherToast(
                'Êtes-vous sûr de vouloir supprimer cet élément ?',
                'warning',
                'Confirmation',
                true,
                async () => {
                    try{
                      const reponse = await supprimer(id);
                      const index = listeObjetsCocktails.findIndex(c => c.getId() === parseInt(id));

                        if (index !== -1) {
                            listeObjetsCocktails.splice(index, 1);                                                
                            alert('Cocktail supprimé avec succès!');
                            afficherCocktailsParPagination(listeObjetsCocktails);
                        } else {
                            console.warn(`Cocktail avec id: ${id} non trouvé dans la liste.`);
                        }  
                    }catch (erreur) {
                        console.error('Erreur lors de la suppression:', erreur.message);
                    }                    
                });
        } else if (e.target.classList.contains('bi-pencil-square')) {
            const id = e.target.dataset.id;
            ouvrirModaleModifier(listeObjetsCocktails, id);

            btnAjouter.textContent = 'Modifier';
            btnAjouter.dataset.mode = 'modify';
            btnAjouter.dataset.id = id;
        }
    });
    
    
    
});
//function pour validation d'url
function isValidURL(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}