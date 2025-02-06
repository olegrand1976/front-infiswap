import { defineStore } from 'pinia';

export const useReplacementDataStore = defineStore('replacement', {
  state: () => ({
    formDataByDate: [], // Tableau pour stocker formData par date
  }),

  actions: {
    // Récupérer formData pour une date donnée
    getFormDataForDate(date) {
      let formData = this.formDataByDate.find((data) => data.currentDate === date);
      if (!formData) {
        // Si formData pour cette date n'existe pas, on le crée
        formData = {
          currentDate: date,
          formData: {
            startDate: '',
            endDate: '',
            replacement: [],
          },
        };
        this.formDataByDate.push(formData);
      }
      return formData.formData;
    },

    // Mettre à jour le formData pour une date donnée
    updateFormDataForDate(date, newFormData) {
      const index = this.formDataByDate.findIndex((data) => data.currentDate === date);
      if (index > -1) {
        this.formDataByDate[index].formData = { ...newFormData };
      } else {
        this.formDataByDate.push({
          currentDate: date,
          formData: { ...newFormData },
        });
      }
    },
  },
});