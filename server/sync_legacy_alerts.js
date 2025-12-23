require('dotenv').config();
const mongoose = require('mongoose');

// On charge explicitement tous les modèles pour éviter les erreurs de population
require('./models/User');
require('./models/Sensor');
require('./models/Measures');
require('./models/Alert');

const Alert = mongoose.model('Alert');
const Measure = mongoose.model('Measures');

async function sync() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Synchronizing legacy alerts...");

        const allMeasures = await Measure.find().populate('sensorID');
        let created = 0;

        for (const m of allMeasures) {
            let shouldTrigger = false;
            if (m.type === 'temperature' && (m.value > 30 || m.value < 5)) shouldTrigger = true;
            if (m.type === 'humidity' && m.value > 80) shouldTrigger = true;
            if (m.type === 'airPollution' && m.value > 50) shouldTrigger = true;

            if (shouldTrigger) {
                const existing = await Alert.findOne({ measureID: m._id });
                if (!existing) {
                    await Alert.create({
                        measureID: m._id,
                        type: m.type,
                        value: m.value,
                        location: m.sensorID?.location || 'Unknown',
                        status: 'unresolved',
                        createdAt: m.creationDate || new Date()
                    });
                    created++;
                }
            }
        }

        console.log(`Sync complete. Created ${created} new alerts.`);
        process.exit(0);
    } catch (err) {
        console.error("Critical error during sync:", err);
        process.exit(1);
    }
}

sync();
