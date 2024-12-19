export class cocktail{
    #id;
    #nom;
    #type;
    #ingredients;
    #prix;
    #image;

    constructor(id, nom, type, ingredients, prix, image){
        this.#id = id;
        this.#nom = nom;
        this.#type = type;
        this.#ingredients = ingredients;
        this.#prix = prix;
        this.#image = image;
    }
//Getters
    getId(){
        return this.#id;
    }
    getNom(){
        return this.#nom;
    }
    getType(){
        return this.#type;
    }
    getIngredients(){
        return this.#ingredients;
    }
    getPrix(){
        return this.#prix;
    }
    getImage(){
        return this.#image;
    }
//Setters
    setId(id){
        this.#id = id;
    }
    setNom(nom){
        this.#nom = nom;
    }
    setType(type){
        this.#type = type;
    }

    setIngredients(ingredients){
        this.#ingredients = ingredients;
    }

    setPrix(prix){
        this.#prix = prix;
    }

    setImage(image){
        this.#image = image;
    }

    afficher (){
        const backgroundClass = this.#id % 2 === 0 ? 'bg-light': 'bg-success text-white';
        return `
             <div class="card ${backgroundClass} card-horizontal col-12">
                    <img class="card-img" src="${this.#image}" alt="${this.#nom}">
                    <div class="card-body">
                        <h5 class="card-title">${this.#id} - ${this.#nom}</h5>
                        <p class="card-text">Type: ${this.#type}</p>
                        <p class="card-text">Ingrédients: ${this.#ingredients.join(", ")}</p>
                        <p class="card-text">Prix: $${this.#prix.toFixed(2)}</p>                        
                    </div>
                    <div class="buttons">
                        <button class="btn btn-outline-primary btn-modifier" data-id="${this.#id}" id="${this.#id}" style="background-color: white">
                             <i class="bi bi-pencil-square" data-id="${this.#id}"></i> 
                        </button>
                        <button class="btn btn-outline-danger btn-supprimer" data-id="${this.#id}">
                             <i class="bi bi-trash" data-id="${this.#id}"></i>
                        </button>
                    </div>
             </div>    
        `
    }
}


