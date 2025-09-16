let MostrarSenha = document.getElementById("VerSenha");
let Senha = document.getElementById("senha");
const userAgent = navigator.userAgent;
let trava = false;

MostrarSenha.addEventListener("click", () => {
    Senha.type = Senha.type === "password" ? "text" : "password";
});

function Atividade(Titulo, Atividade) {
    const div = document.createElement("div");
    div.className = "Notificacao";
    // Estilo inline pra toasts com tema roxo neon
    div.style.cssText = `
        background: linear-gradient(135deg, rgba(161, 0, 255, 0.3), rgba(255, 0, 255, 0.3), rgba(75, 0, 130, 0.3));
        border: 2px solid #a100ff;
        box-shadow: 0 0 10px #a100ff, 0 0 20px rgba(161, 0, 255, 0.5);
        border-radius: 10px;
        padding: 15px;
        color: #e6e6fa;
        font-family: 'Orbitron', sans-serif;
        animation: neonPulse 2s infinite alternate, sumir 1.5s ease 2.5s;
        transition: transform 0.3s ease;
    `;

    const h1 = document.createElement("h1");
    h1.textContent = Titulo;
    h1.style.cssText = `
        font-size: 18px;
        color: #ff00ff;
        text-shadow: 0 0 5px #a100ff;
        margin-bottom: 10px;
    `;

    const p = document.createElement("p");
    p.textContent = Atividade;
    p.style.cssText = `
        font-size: 14px;
        color: #e6e6fa;
        text-shadow: 0 0 3px #a100ff;
    `;

    div.appendChild(h1);
    div.appendChild(p);

    const article = document.getElementById("TamanhoN");
    article.appendChild(div);

    setTimeout(() => {
        div.style.animation = "sumir 1.5s ease";
        div.addEventListener("animationstart", () => {
            setTimeout(() => {
                const interval = setInterval(() => {
                    const currentScroll = article.scrollTop;
                    const targetScroll = article.scrollHeight;
                    const distance = targetScroll - currentScroll;

                    article.scrollTop += distance * 0.4;

                    if (distance < 1) {
                        clearInterval(interval);
                    }
                }, 16);
            }, 200);
        });

        div.addEventListener("animationend", () => {
            div.remove();
        });
    }, 2500);
}

// Animação neon pros toasts
const style = document.createElement("style");
style.textContent = `
    @keyframes neonPulse {
        0% { box-shadow: 0 0 10px #a100ff, 0 0 20px rgba(161, 0, 255, 0.5); }
        100% { box-shadow: 0 0 15px #ff00ff, 0 0 30px rgba(255, 0, 255, 0.7); }
    }
`;
document.head.appendChild(style);

document.getElementById('Enviar').addEventListener('submit', (e) => {
    e.preventDefault();

    if (trava) return;
    trava = true;

    const options = {
        TEMPO_MIN: 60, // Tempo mínimo padrão em segundos
        TEMPO_MAX: 120, // Tempo máximo padrão em segundos
        ACCURACY: 80, // Porcentagem de acerto padrão (60-100)
        TASK_TYPES: ['Normal', 'Expirada'], // Tipos de tarefas padrão (exclui Rascunho)
        LOGIN_URL: 'https://sedintegracoes.educacao.sp.gov.br/credenciais/api/LoginCompletoToken',
        LOGIN_DATA: {
            user: document.getElementById('ra').value,
            senha: document.getElementById('senha').value,
        },
        ENABLE_SUBMISSION: true,
    };

    function makeRequest(url, method = 'GET', headers = {}, body = null) {
        const options = {
            method,
            headers: {
                'User-Agent': navigator.userAgent,
                'Content-Type': 'application/json',
                ...headers,
            },
        };
        if (body) {
            options.body = JSON.stringify(body);
        }

        return fetch(url, options)
            .then(res => {
                if (!res.ok) throw new Error(`❌ HTTP ${method} ${url} => ${res.status}`);
                return res.json();
            });
    }

    function loginRequest() {
        const headers = {
            Accept: 'application/json, text/plain, */*',
            'User-Agent': navigator.userAgent,
            'Ocp-Apim-Subscription-Key': '2b03c1db3884488795f79c37c069381a',
        };

        makeRequest(options.LOGIN_URL, 'POST', headers, options.LOGIN_DATA)
            .then(data => {
                console.log('✅ Login bem-sucedido:', data);
                Atividade('SALA-DO-FUTURO', 'Logado com sucesso!');
                Atividade('D3stroyer SP ETC', 'Atenção: o script não faz redações e atividades em rascunho!');
                Atividade('D3stroyer SP ETC', 'Configurando opções...');
                showConfigModal(data.token); // Abre a telinha de configuração
            })
            .catch(error => {
                Atividade('SALA-DO-FUTURO', 'ERRO! Não foi possível logar!');
                setTimeout(() => {
                    trava = false;
                }, 2000);
            });
    }

    // Nova função para mostrar a telinha de configuração
    function showConfigModal(token) {
        // Criar o modal
        const modal = document.createElement("div");
        modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, rgba(161, 0, 255, 0.8), rgba(75, 0, 130, 0.8));
            padding: 20px;
            border-radius: 15px;
            box-shadow: 0 0 20px #a100ff;
            color: #e6e6fa;
            font-family: 'Orbitron', sans-serif;
            z-index: 1000;
            width: 80%;
            max-width: 400px;
            text-align: center;
        `;

        const title = document.createElement("h2");
        title.textContent = "Configurar D3stroyer SP ETC";
        title.style.textShadow = "0 0 5px #ff00ff";
        modal.appendChild(title);

        // Tempo mínimo
        const minTimeLabel = document.createElement("label");
        minTimeLabel.textContent = "Tempo Mínimo (segundos):";
        minTimeLabel.style.display = "block";
        minTimeLabel.style.marginBottom = "5px";
        const minTimeInput = document.createElement("input");
        minTimeInput.type = "number";
        minTimeInput.value = options.TEMPO_MIN;
        minTimeInput.min = "30";
        minTimeInput.style.marginBottom = "10px";
        modal.appendChild(minTimeLabel);
        modal.appendChild(minTimeInput);

        // Tempo máximo
        const maxTimeLabel = document.createElement("label");
        maxTimeLabel.textContent = "Tempo Máximo (segundos):";
        maxTimeLabel.style.display = "block";
        maxTimeLabel.style.marginBottom = "5px";
        const maxTimeInput = document.createElement("input");
        maxTimeInput.type = "number";
        maxTimeInput.value = options.TEMPO_MAX;
        maxTimeInput.min = "60";
        maxTimeInput.style.marginBottom = "10px";
        modal.appendChild(maxTimeLabel);
        modal.appendChild(maxTimeInput);

        // Porcentagem de acerto
        const accuracyLabel = document.createElement("label");
        accuracyLabel.textContent = "Porcentagem de Acerto (60-100%):";
        accuracyLabel.style.display = "block";
        accuracyLabel.style.marginBottom = "5px";
        const accuracyInput = document.createElement("input");
        accuracyInput.type = "number";
        accuracyInput.value = options.ACCURACY;
        accuracyInput.min = "60";
        accuracyInput.max = "100";
        accuracyInput.style.marginBottom = "10px";
        modal.appendChild(accuracyLabel);
        modal.appendChild(accuracyInput);

        // Tipos de tarefas
        const typesLabel = document.createElement("label");
        typesLabel.textContent = "Selecionar Tipos de Atividades:";
        typesLabel.style.display = "block";
        typesLabel.style.marginBottom = "5px";
        modal.appendChild(typesLabel);

        const types = ['Normal', 'Expirada', 'Rascunho'];
        types.forEach(type => {
            const checkboxLabel = document.createElement("label");
            checkboxLabel.style.display = "block";
            checkboxLabel.style.marginBottom = "5px";

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.value = type;
            checkbox.checked = options.TASK_TYPES.includes(type);

            checkboxLabel.appendChild(checkbox);
            checkboxLabel.appendChild(document.createTextNode(type));
            modal.appendChild(checkboxLabel);
        });

        // Botão de confirmar
        const confirmButton = document.createElement("button");
        confirmButton.textContent = "Iniciar Atividades";
        confirmButton.style.background = "#ff00ff";
        confirmButton.style.border = "none";
        confirmButton.style.padding = "10px 20px";
        confirmButton.style.color = "#e6e6fa";
        confirmButton.style.borderRadius = "8px";
        confirmButton.style.cursor = "pointer";
        confirmButton.style.marginTop = "15px";
        confirmButton.addEventListener("click", () => {
            options.TEMPO_MIN = parseInt(minTimeInput.value) || 60;
            options.TEMPO_MAX = parseInt(maxTimeInput.value) || 120;
            options.ACCURACY = parseInt(accuracyInput.value) || 80;
            options.TASK_TYPES = Array.from(modal.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);
            document.body.removeChild(modal);
            sendRequest(token);
        });
        modal.appendChild(confirmButton);

        document.body.appendChild(modal);
    }

    function sendRequest(token) {
        const url = 'https://edusp-api.ip.tv/registration/edusp/token';
        const headers = {
            'x-api-realm': 'edusp',
            'x-api-platform': 'webclient',
            'User-Agent': navigator.userAgent,
            Host: 'edusp-api.ip.tv',
        };

        makeRequest(url, 'POST', headers, { token })
            .then(data => {
                console.log('✅ Informações do Aluno:', data);
                fetchUserRooms(data.auth_token);
            })
            .catch(error => {
                console.error('❌ Erro na requisição:', error);
                trava = false;
            });
    }

    function fetchUserRooms(token) {
        const url = 'https://edusp-api.ip.tv/room/user?list_all=true&with_cards=true';
        const headers = { 'User-Agent': navigator.userAgent, 'x-api-key': token };

        makeRequest(url, 'GET', headers)
            .then(data => {
                console.log('✅ Salas do usuário:', data);
                if (data.rooms && data.rooms.length > 0) {
                    const roomName = data.rooms[0].name;
                    fetchTasks(token, roomName);
                } else {
                    console.warn('⚠️ Nenhuma sala encontrada..');
                }
            })
            .catch(error => {
                console.error('❌ Erro na requisição de salas:', error);
                trava = false;
            });
    }

    function fetchTasks(token, room) {
        const urls = [
            {
                label: 'Rascunho',
                url: `https://edusp-api.ip.tv/tms/task/todo?expired_only=false&filter_expired=true&with_answer=true&publication_target=${room}&answer_statuses=draft&with_apply_moment=true`,
            },
            {
                label: 'Expirada',
                url: `https://edusp-api.ip.tv/tms/task/todo?expired_only=true&filter_expired=false&with_answer=true&publication_target=${room}&answer_statuses=pending&with_apply_moment=true`,
            },
            {
                label: 'Normal',
                url: `https://edusp-api.ip.tv/tms/task/todo?expired_only=false&filter_expired=true&with_answer=true&publication_target=${room}&answer_statuses=pending&with_apply_moment=false`,
            },
        ].filter(({ label }) => options.TASK_TYPES.includes(label)); // Filtra pelos tipos selecionados

        const optionsReq = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': navigator.userAgent,
                'x-api-key': token,
            },
        };

        const requests = urls.map(({ label, url }) =>
            fetch(url, optionsReq)
                .then(response => {
                    if (!response.ok) throw new Error(`❌ Erro na ${label}: ${response.statusText}`);
                    return response.json();
                })
                .then(data => ({ label, data }))
                .catch(error => {
                    console.error(`❌ Erro na ${label}:`, error);
                    trava = false;
                    return null;
                })
        );

        Promise.all(requests).then(results => {
            results.forEach(result => {
                if (result) {
                    console.log(`✅ ${result.label} - Atividades encontradas:`, result.data);
                }
            });

            results.forEach(result => {
                if (result && result.data.length > 0) {
                    loadTasks(result.data, token, room, result.label);
                }
            });
        });
    }

    // OBS ELE NAO FAZ AS RASCUNHO E NEM REDACAO EXPIRADA
    function loadTasks(data, token, room, tipo) {
        if (tipo === "Rascunho") {
            console.log(`⚠️ Ignorado: Tipo "${tipo}" - Nenhuma tarefa será processada.`);
            return;
        }
        const isRedacao = task =>
            task.tags.some(t => t.toLowerCase().includes("redacao")) ||
            task.title.toLowerCase().includes("redação");

        if (tipo === "Expirada") {
            data = data.filter(task => !isRedacao(task));
            console.log(`⚠️ Ignorado: Tipo "${tipo}" - Nenhuma Redação será processada.`);
        }
        if (!data || data.length === 0) {
            Atividade('TAREFA-SP', '🚫 Nenhuma atividade disponível');
        }
        const redacaoTasks = data.filter(task =>
            task.tags.some(t => t.toLowerCase().includes("redacao"))
        );

        const outrasTasks = data.filter(task =>
            !task.tags.some(t => t.toLowerCase().includes("redacao"))
        );

        const orderedTasks = [...redacaoTasks, ...outrasTasks];
        let redacaoLogFeito = false;
        let houveEnvio = false;
        const promises = orderedTasks.map(task => {
            const taskId = task.id;
            const taskTitle = task.title;

            const url = `https://edusp-api.ip.tv/tms/task/${taskId}/apply?preview_mode=false`;
            const headers = {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'x-api-realm': 'edusp',
                'x-api-platform': 'webclient',
                'User-Agent': navigator.userAgent,
                'x-api-key': token,
            };

            return fetch(url, { method: 'GET', headers })
                .then(response => {
                    if (!response.ok) throw new Error(`Erro HTTP! Status: ${response.status}`);
                    return response.json();
                })
                .then(details => {
                    const answersData = {};

                    details.questions.forEach(question => {
                        const questionId = question.id;
                        let answer = {};

                        if (question.type === 'info') return;

                        if (question.type === 'media') {
                            answer = { status: 'error', message: 'Type=media system require url' };
                        } else if (question.options && typeof question.options === 'object') {
                            const options = Object.values(question.options);
                            const correctIndex = Math.floor(Math.random() * options.length);

                            options.forEach((_, i) => {
                                answer[i] = i === correctIndex;
                            });
                        }

                        answersData[questionId] = {
                            question_id: questionId,
                            question_type: question.type,
                            answer,
                        };
                    });

                    const contemRedacao = isRedacao(task);

                    if (contemRedacao) {
                        if (!redacaoLogFeito) {
                            log('REDACAO PAULISTA');
                            redacaoLogFeito = true;
                        }
                        console.log(`✍️ Redação: ${taskTitle}`);
                        console.log('⚠️ Auto-Redacao', 'Manutencao');
                    } else {
                        Atividade('TAREFA-SP', `Fazendo atividade: ${taskTitle}`);
                        console.log(`📝 Tarefa: ${taskTitle}`);
                        console.log('⚠️ Respostas Fakes:', answersData);
                        if (options.ENABLE_SUBMISSION) {
                            submitAnswers(taskId, answersData, token, room, details.questions.length);
                        }
                        houveEnvio = true;
                    }
                })
                .catch(error => {
                    console.error(`❌ Erro ao buscar detalhes da tarefa: ${taskId}:`, error);
                    trava = false;
                });
        });

        Promise.all(promises).then(() => {
            if (houveEnvio) {
                log('TAREFAS CONCLUIDAS');
            }
        });
    }

    function delay(ms) {  
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function submitAnswers(taskId, answersData, token, room, numQuestions) {
        let request = {
            status: "submitted",
            accessed_on: "room",
            executed_on: room,
            answers: answersData,
        };

        const sendRequest = (method, url, data) => {
            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open(method, url);
                xhr.setRequestHeader("X-Api-Key", token);
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.onload = () => resolve(xhr);
                xhr.onerror = () => reject(new Error('Request failed'));
                xhr.send(data ? JSON.stringify(data) : null);
            });
        };

        const tempoRandom = Math.floor(Math.random() * (options.TEMPO_MAX - options.TEMPO_MIN + 1)) + options.TEMPO_MIN;
        console.log(`⏳ Aguardando ${tempoRandom} segundos e realizando a tarefa ID: ${taskId}...`);
        await delay(tempoRandom * 1000);

        try {
            const response = await sendRequest("POST", `https://edusp-api.ip.tv/tms/task/${taskId}/answer`, request);
            const response2 = JSON.parse(response.responseText);
            const task_idNew = response2.id;
            getCorrectAnswers(taskId, task_idNew, token, numQuestions);
        } catch (error) {
            console.error('❌ Erro ao enviar as respostas:', error);
            trava = false;
        }
    }

    function getCorrectAnswers(taskId, answerId, token, numQuestions) {
        const url = `https://edusp-api.ip.tv/tms/task/${taskId}/answer/${answerId}?with_task=true&with_genre=true&with_questions=true&with_assessed_skills=true`;
        const headers = {
            'User-Agent': navigator.userAgent,
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'x-api-realm': 'edusp',
            'x-api-platform': 'webclient',
            'x-api-key': token,
        };

        fetch(url, { method: 'GET', headers })
            .then(response => {
                if (!response.ok) throw new Error(`❌ Erro ao buscar respostas corretas! Status: ${response.status}`);
                return response.json();
            })
            .then(data => {
                console.log('📂 Respostas corretas recebidas:', data);
                putAnswer(data, taskId, answerId, token, numQuestions);
            })
            .catch(error => {
                console.error('❌ Erro ao buscar respostas corretas:', error);
                trava = false;
            });
    }

    function putAnswer(respostasAnteriores, taskId, answerId, token, numQuestions) {
        const url = `https://edusp-api.ip.tv/tms/task/${taskId}/answer/${answerId}`;
        const headers = {
            'User-Agent': navigator.userAgent,
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'x-api-realm': 'edusp',
            'x-api-platform': 'webclient',
            'x-api-key': token,
        };

        const answer = transformJson(respostasAnteriores, numQuestions);

        fetch(url, {
            method: 'PUT',
            headers,
            body: JSON.stringify(answer),
        })
            .then(response => {
                if (!response.ok) throw new Error(`❌ Erro ao enviar respostas corrigidas! Status: ${response.status}`);
                return response.json();
            })
            .then(data => {
                console.log('✅ Respostas corrigidas enviadas com sucesso:', data);
            })
            .catch(error => {
                console.error('❌ Erro ao enviar respostas corrigidas:', error);
                trava = false;
            });
    }

    function transformJson(jsonOriginal, numQuestions) {
        if (!jsonOriginal || !jsonOriginal.task || !jsonOriginal.task.questions) {
            throw new Error("Estrutura de dados inválida para transformação.");
        }

        let novoJson = {
            accessed_on: jsonOriginal.accessed_on,
            executed_on: jsonOriginal.executed_on,
            answers: {},
        };

        const numCorrect = Math.ceil((options.ACCURACY / 100) * numQuestions);
        let correctIndices = Array.from({length: numQuestions}, (_, i) => i);
        correctIndices = correctIndices.sort(() => Math.random() - 0.5).slice(0, numCorrect); // Seleciona aleatoriamente quais serão corretas

        let questionIndex = 0;
        for (let questionId in jsonOriginal.answers) {
            let questionData = jsonOriginal.answers[questionId];
            let taskQuestion = jsonOriginal.task.questions.find(q => q.id === parseInt(questionId));

            if (!taskQuestion) {
                console.warn(`Questão com ID ${questionId} não encontrada!`);
                continue;
            }

            let answerPayload = {
                question_id: questionData.question_id,
                question_type: taskQuestion.type,
                answer: null
            };

            const isCorrect = correctIndices.includes(questionIndex);
            questionIndex++;

            try {
                switch (taskQuestion.type) {
                    case "order-sentences":
                        if (taskQuestion.options && taskQuestion.options.sentences && Array.isArray(taskQuestion.options.sentences)) {
                            answerPayload.answer = isCorrect ? taskQuestion.options.sentences.map(sentence => sentence.value) : taskQuestion.options.sentences.map(sentence => sentence.value).reverse(); // Inverte para errado
                        }
                        break;
                    case "fill-words":
                        if (taskQuestion.options && taskQuestion.options.phrase && Array.isArray(taskQuestion.options.phrase)) {
                            answerPayload.answer = isCorrect ? taskQuestion.options.phrase.map(item => item.value).filter((_, index) => index % 2 !== 0) : taskQuestion.options.phrase.map(item => item.value).filter((_, index) => index % 2 === 0); // Inverte filtro para errado
                        }
                        break;
                    case "text_ai":
                        let cleanedAnswer = removeTags(taskQuestion.comment || '');
                        answerPayload.answer = isCorrect ? { "0": cleanedAnswer } : { "0": "Resposta errada intencional" }; // Resposta errada
                        break;
                    case "fill-letters":
                        if (taskQuestion.options && taskQuestion.options.answer !== undefined) {
                            answerPayload.answer = isCorrect ? taskQuestion.options.answer : "errado"; // String errada
                        }
                        break;
                    case "cloud":
                        if (taskQuestion.options && taskQuestion.options.ids && Array.isArray(taskQuestion.options.ids)) {
                            answerPayload.answer = isCorrect ? taskQuestion.options.ids : taskQuestion.options.ids.reverse(); // Inverte pra errado
                        }
                        break;
                    default:
                        if (taskQuestion.options && typeof taskQuestion.options === 'object') {
                            answerPayload.answer = Object.fromEntries(
                                Object.keys(taskQuestion.options).map(optionId => {
                                    const optionData = taskQuestion.options[optionId];
                                    const answerValue = (optionData && optionData.answer !== undefined) ? optionData.answer : false;
                                    return [optionId, isCorrect ? answerValue : !answerValue]; // Flip pra errado se não correto
                                })
                            );
                        }
                        break;
                }
                novoJson.answers[questionId] = answerPayload;
            } catch (err) {
                console.error(`Erro ao processar questão ID ${questionId}:`, err);
                trava = false;
                continue;
            }
        }
        return novoJson;
    }

    function removeTags(htmlString) {
        return htmlString.replace(/<[^>]*>?/gm, '');
    }

    function log(str) {
        console.log("===================================");
        console.log(`★ ✦ D3stroyer SP ETC - ${str} ✦ ★`);
        console.log("===================================");
    }

    setTimeout(() => {
        trava = false;
    }, 5000);

    // Iniciar o processo
    loginRequest();
});
