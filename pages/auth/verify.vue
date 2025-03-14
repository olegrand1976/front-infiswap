<template>
    <div>
        <h1>Vérification de votre email</h1>
        <div v-if="status === 'success'">
            <p>Votre email a été vérifié avec succès. Vous pouvez maintenant vous connecter.</p>
        </div>
        <div v-if="status === 'error'">
            <p>Le lien de vérification est invalide ou a expiré.</p>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            status: null,
        };
    },

    // async mounted() {
    //     const { id, hash } = this.$route.params;

    //     try {
    //         const response = await this.$axios.get(`/api/email/verify/${id}/${hash}`);

    //         if (response.status === 200) {
    //             this.status = 'success';
    //         } else {
    //             this.status = 'error';
    //         }
    //     }
    //     catch (error) {
    //         this.status = 'error';
    //     }
    // },

    async mounted() {
        const { id, hash, signature } = this.$route.query;

        // Récupérer le token depuis localStorage ou Vuex
        const token = localStorage.getItem('token'); // Ou this.$store.state.auth.token

        if (!token) {
            console.error('Token d\'authentification manquant');
            this.status = 'error';
            this.$router.push('/auth/login'); // Rediriger vers la page de connexion
            return;
        }

        try {
            const response = await this.$axios.post(
                'http://localhost:8094/api/email/verify',
                {
                    id,
                    hash,
                    signature,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Ajouter le token dans l'en-tête
                    },
                },
            );

            if (response.status === 200) {
                this.status = 'success';
                this.$router.push('/auth/verified'); // Redirection après succès
            }
            else {
                this.status = 'error';
            }
        }
        catch (error) {
            this.status = 'error';
            console.error('Erreur lors de la vérification de l\'e-mail :', error);
        }
    },

};
</script>

<style scoped>
h1 {
  text-align: center;
  color: #4CAF50;
}

div {
  text-align: center;
  margin-top: 20px;
}

p {
  font-size: 18px;
  color: #333;
}

.success {
  color: #4CAF50;
}

.error {
  color: #e7515a;
}
</style>
