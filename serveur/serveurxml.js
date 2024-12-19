import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import http from 'http';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import xml2js from 'xml2js'; // Import xml2js pour parser XML 

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const PORT = 3000;
const HOTE = 'localhost'; 
const filePath = path.join(__dirname, 'donnes', 'cocktails.xml');
const IndexPath = path.join(__dirname, 'client', 'index.html');

const serveur = http.createServer(app);


app.use(express.static(path.resolve(__dirname, '../client')));


app.use(cors());
app.use(express.text({ type: 'application/xml' })); 

// Routes
app.get('/', (req, res) => {
    res.sendFile(IndexPath);
});

// fonction pour convertir XML a javaScript objet
const parseXML = (xml) => {
    return new Promise((resolve, reject) => {
        xml2js.parseString(xml, { explicitArray: false }, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

// fonction pour convertir javascript objet a XML
const buildXML = (obj) => {
    const builder = new xml2js.Builder();
    return builder.buildObject(obj);
};

// Recupere liste de cocktails
app.get('/cocktails', (req, res) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Erreur de lecture du fichier:', err);  
            return res.status(500).send('Erreur de lecture du fichier');
        }
        res.set('Content-Type', 'application/xml'); 
        res.send(data); 
    });
});

// Ajouter nouveau cocktail
app.post('/cocktails', (req, res) => {
    const xmlData = req.body;

    parseXML(xmlData).then((result) => {
        const newCocktail = result.cocktail;

        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                return res.status(500).send('Erreur de lecture du fichier');
            }

            //parse données
            parseXML(data).then((parsedData) => {                
                const cocktails = parsedData.listeCocktails.cocktail || [];               
                cocktails.push(newCocktail);

                // construir et ecrire xml dans le fichier
                const updatedXML = buildXML({ listeCocktails: { cocktail: cocktails } });

                fs.writeFile(filePath, updatedXML, (err) => {
                    if (err) {
                        return res.status(500).json({ error: 'Erreur lors de l\'ecriture des donnees' });
                    }
                    res.status(201).send(updatedXML); // Respond avec le XML a jour
                });
            });
        });
    }).catch((err) => {
        res.status(400).send('format XML non valide');
    });
});

// Modifier un cocktail
app.put('/cocktails/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const xmlData = req.body;
    console.log("xmlData: ", xmlData);
    parseXML(xmlData).then((result) => {
        const modifiedCocktail = result.cocktail;

        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                return res.status(500).json({ error: 'Erreur de lecture du fichier' });
            }

            parseXML(data).then((parsedData) => {                
                let cocktails = parsedData.listeCocktails.cocktail || [];                
                const index = cocktails.findIndex((cocktail) => String(cocktail.id) === String(id));
                
                if (index === -1) {
                    return res.status(404).json({ error: 'Cocktail non trouvé' });
                }
                
                // mettre a jour les données du cocktail
                cocktails[index] = { ...cocktails[index], ...modifiedCocktail, id };
                
                const updatedXML = buildXML({ listeCocktails: { cocktail: cocktails } });

                fs.writeFile(filePath, updatedXML, (err) => {
                    if (err) {
                        return res.status(500).json({ error: 'Erreur lors de l\'ecriture des donnees' });
                    }
                    res.send(updatedXML); 
                });
            });
        });
    }).catch((err) => {
        res.status(400).send('format XML non valide');
    });
});

// Delete a cocktail
app.delete('/cocktails/:id', (req, res) => {
    const id = parseInt(req.params.id);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur de lecture du fichier' });
        }

        parseXML(data).then((parsedData) => {
            let cocktails = parsedData.listeCocktails.cocktail || [];
            const updatedCocktails = cocktails.filter((cocktail) => String(cocktail.id) !== String(id));

            // Build XML and write it back to the file
            const updatedXML = buildXML({ listeCocktails: { cocktail: updatedCocktails } });

            fs.writeFile(filePath, updatedXML, (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Erreur lors de la suppression' });
                }
                res.send(updatedXML); // Respond with the updated XML
            });
        });
    });
});

// Start the server
serveur.listen(PORT, HOTE, () => {    
    console.log(`Serveur lancé sur http://${HOTE}:${PORT}`);
});
