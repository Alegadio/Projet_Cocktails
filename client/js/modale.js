// Ouvrir la modale pour ajouter un nouvel élément
export const ouvrirModaleAjouter = () => {
    
    const modal = new bootstrap.Modal(document.getElementById('modalAjouter'));
    modal.show();
};

export const ouvrirModaleModifier = (listeCocktails, id) => { 
    console.log('ID passed to ouvrirModaleModifier:', id);
    console.log('lista:', listeCocktails);

    const cocktail = listeCocktails.find(c => String(c.getId()) === String(id));
    
    if (!cocktail) {
        console.log(cocktail);
        console.error('Cocktail not found');
        return;
    }

    document.getElementById('id').value = cocktail.getId(); 
    document.getElementById('nom').value = cocktail.getNom();
    document.getElementById('type').value = cocktail.getType();
    document.getElementById('ingredients').value = cocktail.getIngredients();
    document.getElementById('prix').value = cocktail.getPrix();
    document.getElementById('image').value = cocktail.getImage();

    const modal = new bootstrap.Modal(document.getElementById('modalAjouter'));
    modal.show();
    
};

// Reset form
export function resetForm() {
    const btnAjouter = document.getElementById('btnAjouter');
    
    document.getElementById('nom').value = '';
    document.getElementById('type').value = '';
    document.getElementById('ingredients').value = '';
    document.getElementById('prix').value = '';
    document.getElementById('image').value = '';
    btnAjouter.textContent = 'Enregistrer';
    btnAjouter.dataset.mode = 'add';
    btnAjouter.dataset.id = '';
}




