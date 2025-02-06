import { defineStore } from 'pinia';
import axios from 'axios';

export const usePatientStore = defineStore('usePatientStore', () => {
  // Form data structure
  const formData = reactive({
    lastname: '',
    firstname: '',
    dateOfBirth: '',
    zipCode: '',
    city: '',
    phoneNumber: '',
    accept: false,
  });

  const errorMessage = ref('');
  const isSubmitting = ref(false);

  // Getter for form data
  const getFormData = computed(() => formData);

  // Getter for error messages
  const getErrorMessage = computed(() => errorMessage.value);

  // Reset form to initial state
  const resetForm = () => {
    formData.lastname = '';
    formData.firstname = '';
    formData.dateOfBirth = '';
    formData.zipCode = '';
    formData.city = '';
    formData.phoneNumber = '';
    formData.accept = false;
  };

  // Form submission action
  const submitForm = async (data) => {
    try {
      isSubmitting.value = true;


      console.log('data',data);
      // Effectuer l'appel à l'API avec Axios
      //const response = await axios.post("https://localhost:8000/api/api/care-types", data);

      //console.log('Form submission response:', response);





      // Example: Add your API call logic here
      // const response = await api.submitForm(data);

      // On success, reset the form
      resetForm();
    } catch (error) {
      // Handle error
      console.error('Form submission failed:', error);
      errorMessage.value = 'Une erreur est survenue lors de l\'envoi du formulaire.';
    } finally {
      isSubmitting.value = false;
    }
  };

  return {
    formData,
    errorMessage,
    isSubmitting,
    resetForm,
    getFormData,   // Exposed getter for form data
    getErrorMessage,  // Exposed getter for error messages
    submitForm,
  };
});

