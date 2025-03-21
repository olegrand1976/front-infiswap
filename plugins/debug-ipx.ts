export default defineNuxtPlugin(() => {
  // Exécuté uniquement côté client
  if (process.client) {
    console.log('Configuration IPX:', useRuntimeConfig().public.image);
    
    // Test d'accès à une image (remplacer par une image réelle de votre projet)
    const testImage = new Image();
    testImage.onload = () => console.log('✅ Image test chargée avec succès');
    testImage.onerror = () => console.error('❌ Erreur lors du chargement de l\'image test');
    testImage.src = '/_ipx/w_100,h_100/logo.png';
  }
})