const mongoose = require("mongoose");

const MeasuresSchema = new mongoose.Schema({
    type: String,
    creationDate: Date,
    sensorID: { type: mongoose.Schema.Types.ObjectId, ref: "Sensor" },
    value: Number
});

// Middleware pour déclencher des alertes automatiquement
MeasuresSchema.post('save', async function (doc) {
    let shouldTrigger = false;
    const val = doc.value;
    const type = doc.type;

    if (type === 'temperature' && (val > 30 || val < 5)) shouldTrigger = true;
    if (type === 'humidity' && val > 80) shouldTrigger = true;
    if (type === 'airPollution' && val > 50) shouldTrigger = true;

    if (shouldTrigger) {
        console.log(`[ALERT] Seuil dépassé pour ${type}: ${val}. Création de l'alerte...`);
        try {
            const Alert = mongoose.model('Alert');
            const Sensor = mongoose.model('Sensor');

            // On récupère le capteur pour avoir la localisation
            const sensor = await Sensor.findById(doc.sensorID);

            await Alert.create({
                measureID: doc._id,
                type: type,
                value: val,
                location: sensor?.location || 'Unknown',
                status: 'unresolved',
                createdAt: new Date()
            });
            console.log(`[ALERT] Alerte créée avec succès pour ${type} à ${sensor?.location}`);
        } catch (err) {
            console.error("[ALERT ERROR] Impossible de créer l'alerte:", err.message);
        }
    }
});

module.exports = mongoose.model("Measures", MeasuresSchema, 'Measures');
