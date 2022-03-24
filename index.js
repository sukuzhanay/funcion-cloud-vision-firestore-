const vision = require('@google-cloud/vision');
const Storage = require('@google-cloud/storage');
const Firestore = require('@google-cloud/firestore');

const client = new vision.ImageAnnotatorClient();

exports.dniemieAnalysis = async (event, context) => {
    console.log(`Event: ${JSON.stringify(event)}`);

    const filename = event.name;
    const filebucket = event.bucket;

    console.log(`Nuevo Dni-nie ${filename} in ${filebucket}`);

    const request = {
        image: { source: { imageUri: `gs://${filebucket}/${filename}` } },
        features: [
            { type: 'LABEL_DETECTION' },
            { type: 'IMAGE_PROPERTIES' },
            { type: 'SAFE_SEARCH_DETECTION' }
        ]
    };

    // Llamamos a la Api de Cloud Vision
    const [response] = await client.annotateImage(request);
    console.log(`Datos en crudo de Cloud Vision: ${filename}: ${JSON.stringify(response)}`);

    if (response.error === null) {
        // ordeno y mapeo las entidades
        const labels = response.labelAnnotations
            .sort((ann1, ann2) => ann2.score - ann1.score)
            .map(ann => ann.description)
        console.log(`Labels: ${labels.join(', ')}`);

        //  Determino si es segura la img ("adult", "spoof", "violence", "racy")
        const safeSearch = response.safeSearchAnnotation;
        const isSafe = ["adult", "spoof", "violence", "racy"].every(k => 
            !['LIKELY', 'VERY_LIKELY'].includes(safeSearch[k]));
        console.log(`Safe? ${isSafe}`);

        // Capturo del color dominante
        const color = response.imagePropertiesAnnotation.dominantColors.colors
            .sort((c1, c2) => c2.score - c1.score)[0].color;
        const colorHex = decColorToHex(color.red, color.green, color.blue);
        console.log(`Colors: ${colorHex}`);

        // Si todod correcto, guardo en bbdd 
        if (isSafe) {
            const pictureStore = new Firestore().collection('dnies-nies');
            const doc = pictureStore.doc(filename);
            await doc.set({
                entidades: labels,
                colorDominante: colorHex,
                creado: Firestore.Timestamp.now()
            }, {merge: true});

            console.log("Guardado satisfactoriamente en la BBDD");
        }
    } else {
        throw new Error(`error: code ${response.error.code}, message: "${response.error.message}"`);
    }
};

function decColorToHex(r, g, b) {
    return '#' + Number(r).toString(16).padStart(2, '0') + 
                 Number(g).toString(16).padStart(2, '0') + 
                 Number(b).toString(16).padStart(2, '0');
}