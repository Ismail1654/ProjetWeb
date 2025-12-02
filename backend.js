app.post('/login', (req, res) => {
    // Étape 2: Récupérer et vérifier les données
    const email = req.body.email;
    const password = req.body.password;
    
    // ... (Votre code pour lire les utilisateurs dans vos fichiers ordonnés) ...
    
    // Étape 3: Rediriger l'utilisateur
    if (connexion_est_valide) {
        // En fonction du rôle (Admin, École, Simple Utilisateur)
        const role = trouver_role_utilisateur(email);
        
        if (role === 'Admin') {
            res.redirect('/dashboard_admin'); // URL de votre Dashboard Admin
        } else if (role === 'École' || role === 'Entreprise') {
            res.redirect('/dashboard_proprietaire'); // URL du Dashboard Propriétaire
        } else {
            res.redirect('/dashboard_utilisateur'); // URL du Dashboard Simple Utilisateur
        }
    } else {
        // En cas d'échec
        res.send('Identifiants incorrects.'); 
    }
});