const axios = require('axios');
const logger = require('../utils/logger');

class NHTSAService {
  constructor() {
    this.baseUrl = process.env.NHTSA_API_URL || 'https://vpic.nhtsa.dot.gov/api';
  }

  async getMakes() {
    try {
      const response = await axios.get(`${this.baseUrl}/vehicles/getallmakes?format=json`);
      return response.data.Results.map(make => make.Make_Name);
    } catch (error) {
      logger.error('Error fetching makes from NHTSA:', error);
      throw error;
    }
  }

  async getModels(make, year) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/vehicles/getmodelsformakeyear/make/${make}/modelyear/${year}?format=json`
      );
      return response.data.Results.map(model => model.Model_Name);
    } catch (error) {
      logger.error(`Error fetching models for make ${make} and year ${year} from NHTSA:`, error);
      throw error;
    }
  }

  async getYears(make, model) {
    try {
      // NHTSA API typically provides data from 1995 onwards
      const currentYear = new Date().getFullYear() + 1; // Include next year's models
      const years = [];
      
      for (let year = currentYear; year >= 1995; year--) {
        const response = await axios.get(
          `${this.baseUrl}/vehicles/getmodelsformakeyear/make/${make}/modelyear/${year}?format=json`
        );
        
        if (response.data.Results.some(result => result.Model_Name === model)) {
          years.push(year);
        }
      }
      
      return years;
    } catch (error) {
      logger.error(`Error fetching years for make ${make} and model ${model} from NHTSA:`, error);
      throw error;
    }
  }

  async validateVehicle(make, model, year) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/vehicles/getmodelsformakeyear/make/${make}/modelyear/${year}?format=json`
      );
      return response.data.Results.some(result => result.Model_Name === model);
    } catch (error) {
      logger.error(`Error validating vehicle (${make} ${model} ${year}) with NHTSA:`, error);
      throw error;
    }
  }
}

module.exports = new NHTSAService();
