const express = require('express');
const router = express.Router();
const Patient = require('../models/patient');

router.post('/patients', async (req, res) => {
  try {
    const { name, age, gender, illnessDuration } = req.body;
    if (!name || !age || !gender || !illnessDuration) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newPatient = new Patient({
      name,
      age,
      gender,
      chemicalExposure: req.body.chemicalExposure,  
      illnessDuration,
      familyHistory: req.body.familyHistory,        
    });

    await newPatient.save();
    res.status(201).json({ message: 'Patient record saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Error saving patient record', error: error.message });
  }
});

router.get('/patients', async (req, res) => {
    try {
      const patients = await Patient.find();  
  
      res.status(200).json(patients); 
    } catch (error) {
      console.error('Error fetching patient records:', error);
      res.status(500).json({ message: 'Error fetching patient records', error: error.message }); 
    }
  });
  

module.exports = router;

