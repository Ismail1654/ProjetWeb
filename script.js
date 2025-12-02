document.addEventListener('DOMContentLoaded', () => {

    // ----------------------------------------------------------------------
    // 1. SÉLECTEURS DU FORMULAIRE DE CRÉATION DE QUIZ
    // ----------------------------------------------------------------------

    const blocAjoutQuestion = document.getElementById('bloc-ajout-question');
    const boutonOuvrirAjout = document.getElementById('bouton-ouvrir-ajout');
    const typeQuestionSelect = document.getElementById('type-question');
    const optionsQCM = document.getElementById('options-qcm');
    const correctionEcole = document.getElementById('correction-ecole');
    const conteneurOptions = document.getElementById('conteneur-options');
    const boutonAjouterOption = document.getElementById('bouton-ajouter-option');
    const listeQuestionsExistantes = document.getElementById('liste-questions-existantes');
    const boutonEnregistrerQuestion = document.getElementById('bouton-enregistrer-question');

    let questionsDuQuiz = [];
    let questionCounter = 0;


    // ----------------------------------------------------------------------
    // 2. FONCTIONS PRINCIPALES
    // ----------------------------------------------------------------------

    // Afficher / cacher les champs selon le type de question
    const toggleOptions = () => {
        const type = typeQuestionSelect.value;

        if (type === 'QCM') {
            optionsQCM.style.display = 'block';
            correctionEcole.style.display = 'block';

            document.querySelector('#correction-ecole input[name="bonne_reponse"]').placeholder =
                "Texte de la bonne réponse (QCM)";
        } else {
            optionsQCM.style.display = 'none';
            document.querySelector('#correction-ecole input[name="bonne_reponse"]').placeholder =
                "Réponse attendue (libre)";
        }
    };


    // Ajouter une option de QCM
    const ajouterOptionQCM = () => {
        const index = conteneurOptions.children.length + 1;

        const input = document.createElement('input');
        input.type = 'text';
        input.name = `option_${index}`;
        input.placeholder = `Option ${index}`;
        input.required = true;

        conteneurOptions.appendChild(input);
    };


    // Enregistrer une question dans le tableau
    const enregistrerQuestion = () => {
        const enonce = document.getElementById('enonce').value;
        const type = typeQuestionSelect.value;

        if (!enonce) {
            alert("Veuillez saisir l'énoncé.");
            return;
        }

        questionCounter++;

        let question = {
            id: questionCounter,
            enonce: enonce,
            type: type,
            points: document.querySelector('#correction-ecole input[name="points"]').value || 1,
            bonne_reponse: document.querySelector('#correction-ecole input[name="bonne_reponse"]').value
        };

        if (type === 'QCM') {
            const options = Array.from(conteneurOptions.querySelectorAll('input[type="text"]'))
                .map(input => input.value.trim())
                .filter(val => val !== '');

            if (options.length < 2) {
                alert("Un QCM doit avoir au moins 2 options.");
                questionCounter--;
                return;
            }

            question.options = options;
        }

        questionsDuQuiz.push(question);
        afficherQuestion(question);

        // Reset formulaire
        document.getElementById('enonce').value = "";
        document.querySelector('#correction-ecole input[name="bonne_reponse"]').value = "";
        document.querySelector('#correction-ecole input[name="points"]').value = "";

        conteneurOptions.innerHTML = `
            <input type="text" name="option_1" placeholder="Option 1" required>
            <input type="text" name="option_2" placeholder="Option 2" required>
        `;

        blocAjoutQuestion.style.display = 'none';
        boutonOuvrirAjout.style.display = 'block';
    };


    // Afficher une question dans le DOM
    const afficherQuestion = (question) => {

        const messageVide = listeQuestionsExistantes.querySelector('.message-vide');
        if (messageVide) messageVide.remove();

        const div = document.createElement('div');
        div.className = 'item-question';
        div.dataset.id = question.id;

        let html = `
            <h4>Question N°${question.id} (${question.type})</h4>
            <p>${question.enonce}</p>
        `;

        if (question.type === 'QCM') {
            html += `
                <small>Options: ${question.options.join(' | ')}</small>
                <p class="correction">Bonne réponse : <strong>${question.bonne_reponse}</strong> | Points : ${question.points}</p>
            `;
        } else {
            html += `
                <p class="correction">Réponse attendue : <strong>${question.bonne_reponse}</strong> | Points : ${question.points}</p>
            `;
        }

        html += `<button class="btn-supprimer" data-id="${question.id}">Supprimer</button>`;

        div.innerHTML = html;
        listeQuestionsExistantes.appendChild(div);
    };


    // Supprimer une question
    const supprimerQuestion = (id) => {
        questionsDuQuiz = questionsDuQuiz.filter(q => q.id !== parseInt(id));

        const element = listeQuestionsExistantes.querySelector(`[data-id="${id}"]`);
        if (element) element.remove();

        if (questionsDuQuiz.length === 0) {
            listeQuestionsExistantes.innerHTML =
                '<p class="message-vide">Aucune question ajoutée pour le moment.</p>';
        }
    };


    // ----------------------------------------------------------------------
    // 3. ÉCOUTEURS D'ÉVÉNEMENTS
    // ----------------------------------------------------------------------

    if (boutonOuvrirAjout) {
        boutonOuvrirAjout.addEventListener('click', () => {
            blocAjoutQuestion.style.display = 'block';
            boutonOuvrirAjout.style.display = 'none';
            toggleOptions();
        });
    }

    if (boutonAjouterOption) {
        boutonAjouterOption.addEventListener('click', ajouterOptionQCM);
    }

    if (typeQuestionSelect) {
        typeQuestionSelect.addEventListener('change', toggleOptions);
    }

    if (boutonEnregistrerQuestion) {
        boutonEnregistrerQuestion.addEventListener('click', enregistrerQuestion);
    }

    if (listeQuestionsExistantes) {
        listeQuestionsExistantes.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-supprimer')) {
                supprimerQuestion(e.target.dataset.id);
            }
        });
    }

    // Soumission finale du quiz
    const formCreationQuiz = document.querySelector('.formulaire-creation-quiz');

    if (formCreationQuiz) {
        formCreationQuiz.addEventListener('submit', (e) => {
            if (questionsDuQuiz.length === 0) {
                e.preventDefault();
                alert("Ajoutez au moins une question avant d’envoyer le quiz.");
                return;
            }

            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = 'questions_data';
            input.value = JSON.stringify(questionsDuQuiz);

            formCreationQuiz.appendChild(input);

            alert("Quiz prêt à être envoyé !");
        });
    }


    // Initialisation
    toggleOptions();
});
