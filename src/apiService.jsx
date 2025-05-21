// services/apiService.js
import axios from 'axios';
import { getDatabase, ref, get } from 'firebase/database';

const apiKey = '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';

// Armazena o nome da última empresa mencionada
let contexto = {
    ultimaEmpresa: null
};

// Faz chamada à OpenAI com mensagens
export const callOpenAiApi = async (messages) => {
    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-4',
            messages
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            }
        });

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('Erro na API OpenAI:', error);
        throw error;
    }
};

// Função para buscar todos os dados do Firebase
export const buscarTodosOsDados = async () => {
    const db = getDatabase();
    const dbRef = ref(db);

    try {
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
            return snapshot.val();
        } else {
            return null;
        }
    } catch (error) {
        console.error('Erro ao buscar dados do Firebase:', error);
        throw error;
    }
};

export const responderPergunta = async (pergunta, db) => {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, 'empresas'));
    if (!snapshot.exists()) return 'Não há empresas cadastradas.';

    const dados = { empresas: snapshot.val() };

    // 🔎 Identifica empresa mencionada
    const empresaSelecionada = Object.entries(dados.empresas).find(([id, e]) =>
        pergunta.toLowerCase().includes((e.nome || "").toLowerCase())
    );

    if (!empresaSelecionada) {
        return 'Por favor, especifique a empresa para que eu possa ajudar.';
    }

    const [empresaId, empresa] = empresaSelecionada;

    // 🔎 Identifica motorista (se houver)
    const motoristaEncontrado = empresa.motoristas
        ? Object.entries(empresa.motoristas).find(([id, m]) =>
            pergunta.toLowerCase().includes((m.nome || "").toLowerCase())
        )
        : null;

    // 🔎 Identifica se a pergunta quer sobre multas ou veículos específicos
    const querMultas = pergunta.toLowerCase().includes("multa");
    const querVeiculo = pergunta.toLowerCase().includes("veiculo") || pergunta.toLowerCase().includes("placa");

    // 🔁 Filtra os dados para enviar somente o necessário
    const empresaFiltrada = {
        nome: empresa.nome,
        telefoneEmpresa: empresa.telefoneEmpresa,
        telefoneFrota: empresa.telefoneFrota,
        responsavelEmpresa: empresa.responsavelEmpresa,
        responsavelFrota: empresa.responsavelFrota,
        cnpj: empresa.cnpj,
        address: empresa.address
    };

    if (motoristaEncontrado) {
        const [id, motorista] = motoristaEncontrado;
        empresaFiltrada.motoristas = {
            [id]: motorista
        };

        // Inclui multas e veículos do motorista se for o caso
        if (querMultas && empresa.multas) {
            const multasFiltradas = Object.entries(empresa.multas).filter(
                ([_, multa]) => multa.motoristaId === id
            );
            if (multasFiltradas.length > 0) {
                empresaFiltrada.multas = Object.fromEntries(multasFiltradas);
            }
        }

        if (querVeiculo && empresa.veiculos) {
            const veiculosFiltrados = Object.entries(empresa.veiculos).filter(([_, v]) =>
                Object.values(empresa.multas || {}).some(
                    multa => multa.motoristaId === id && multa.veiculoId === _
                )
            );
            if (veiculosFiltrados.length > 0) {
                empresaFiltrada.veiculos = Object.fromEntries(veiculosFiltrados);
            }
        }
    }

    // 📦 Monta dados finais
    const dadosParaEnviar = {
        empresas: {
            [empresaId]: empresaFiltrada
        }
    };

    // 🧠 PROMPT
    const messages = [
        {
            role: 'system',
            content: `Você é um assistente de gestão de frotas. Receberá dados sobre empresas, motoristas, veículos e multas.
Responda de forma **precisa e única**, trazendo **somente as informações solicitadas**. Não invente nada.`
        },
        {
            role: 'user',
            content: `Aqui estão os dados do sistema:\n${JSON.stringify(dadosParaEnviar)}`
        },
        {
            role: 'user',
            content: `Minha pergunta é: "${pergunta}". Responda com objetividade e apenas com a informação pedida.`
        }
    ];

    const respostaApi = await callOpenAiApi(messages);
    return respostaApi.choices[0].message.content;
};




