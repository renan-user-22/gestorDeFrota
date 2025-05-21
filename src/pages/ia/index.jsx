import React, { useState, useEffect, useRef } from 'react';

// Imagens
import Icon from '../../images/iconLogo.png';

// Banco de dados e conexões:
import { callOpenAiApi, responderPergunta } from '../../apiService';
import { ref, get } from "firebase/database";
import { db } from '../../firebaseConnection';

// Ícones
import { FaUserAstronaut } from "react-icons/fa";
import { BiSolidMessageSquareEdit } from "react-icons/bi";
import { FaCircleArrowUp } from "react-icons/fa6";

// Estilos
import { colors } from '../../theme';
import { Box, TextDefault } from '../../stylesAppDefault';
import {
  Container,
  ButtonDefault,
  BoxList,
  BoxLarge,
  InputDefault,
} from './styles';

const Ia = () => {
  const conversationEndRef = useRef(null);
  const [conversation, setConversation] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingText, setTypingText] = useState('');
  const [infoDemanda, setInfoDemanda] = useState('');
  const [isUserTyping, setIsUserTyping] = useState(false);

  const handleChange = (e) => {
    setInfoDemanda(e.target.value);
    setIsUserTyping(e.target.value.length > 0);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      searchDemand();
    }
  };

  const deletChat = () => {
    setConversation([]);
  };

  const checkKeywords = (question, keywords) =>
    keywords.some(kw => question.toLowerCase().includes(kw.toLowerCase()));


  const handleCustomQueries = async (question) => {
    const snapshot = await get(ref(db, 'empresas'));
    const empresas = snapshot.val();

    if (!empresas) return null;

    const lowerQuestion = question.toLowerCase();
    let response = '';

    const matchEmpresa = (empresa) => {
      const dados = [];

      if (checkKeywords(lowerQuestion, ['empresa', 'empresas', 'nome da empresa'])) {
        dados.push(`📌 Empresa: ${empresa.nome}`);
      }

      if (checkKeywords(lowerQuestion, ['responsável', 'responsavel', 'gestor'])) {
        dados.push(`👨‍💼 Responsável: ${empresa.responsavelEmpresa}`);
        dados.push(`🚗 Responsável pela Frota: ${empresa.responsavelFrota}`);
      }

      if (checkKeywords(lowerQuestion, ['telefone', 'contato'])) {
        dados.push(`📞 Tel. Empresa: ${empresa.telefoneEmpresa}`);
        dados.push(`📱 Tel. Frota: ${empresa.telefoneFrota}`);
      }

      if (checkKeywords(lowerQuestion, ['motorista', 'motoristas', 'condutor'])) {
        if (empresa.motoristas) {
          Object.values(empresa.motoristas).forEach((m, i) => {
            dados.push(`🧍 Motorista ${i + 1}: ${m.nome}, CPF: ${m.cpf}, CNH: ${m.cnh}`);
          });
        }
      }

      if (checkKeywords(lowerQuestion, ['veículo', 'veiculos', 'carro', 'placa'])) {
        if (empresa.veiculos) {
          Object.values(empresa.veiculos).forEach((v, i) => {
            dados.push(`🚘 Veículo ${i + 1}: ${v.marca} ${v.modelo}, Placa: ${v.placa}`);
          });
        }
      }

      if (checkKeywords(lowerQuestion, ['multa', 'multas', 'infrações', 'infracao'])) {
        if (empresa.multas) {
          Object.values(empresa.multas).forEach((m, i) => {
            dados.push(`⚠️ Multa ${i + 1}: ${m.gravidade} em ${m.dataInfracao} - ${m.valorMulta} (Motorista: ${m.nomeMotorista})`);
          });
        }
      }

      return dados.length > 0 ? dados.join('\n') : null;
    };

    // Agrega dados de todas empresas
    Object.values(empresas).forEach(empresa => {
      const dadosEmpresa = matchEmpresa(empresa);
      if (dadosEmpresa) {
        response += `\n\n🏢 ${empresa.nome}\n${dadosEmpresa}`;
      }
    });

    return response.trim() ? response.trim() : null;
  };

  const simulateTyping = (text, callback) => {
    let index = 0;
    setTypingText('');
    setIsTyping(true);

    const interval = setInterval(() => {
      setTypingText(prev => text.slice(0, index + 1));
      index++;

      if (index > text.length - 1) {
        clearInterval(interval);
        setIsTyping(false);
        if (callback) callback();
      }
    }, 30);
  };

  const searchDemand = async () => {
    if (!infoDemanda.trim()) return;

    const userMessage = {
      role: "user",
      content: infoDemanda
    };

    setConversation(prev => [...prev, { text: infoDemanda, from: 'user' }]);
    setInfoDemanda('');
    setIsTyping(true);

    try {
      // 1. Perguntas customizadas no Firebase
      const customResponse = await handleCustomQueries(infoDemanda);
      if (customResponse) {
        simulateTyping(customResponse, () => {
          setConversation(prev => [...prev, { text: customResponse, from: 'ai' }]);
        });
        return;
      }

      // 2. Perguntas contextuais com responderPergunta
      const respostaInteligente = await responderPergunta(infoDemanda, db);
      if (respostaInteligente && respostaInteligente !== 'desconhecido') {
        simulateTyping(respostaInteligente, () => {
          setConversation(prev => [...prev, { text: respostaInteligente, from: 'ai' }]);
        });
        return;
      }

      // 3. Busca por scripts no Firebase
      const snapshot = await get(ref(db, 'scripts'));
      const scripts = snapshot.val();

      let matches = [];

      if (scripts) {
        matches = Object.values(scripts).filter(script =>
          script.palavrasChave?.some(palavra =>
            infoDemanda.toLowerCase().includes(palavra.toLowerCase())
          )
        );
      }

      if (matches.length > 0) {
        const resposta = matches.map(script =>
          `✅ ${script.titulo}\nFila: ${script.fila}\nNúmero: ${script.numero}`
        ).join('\n\n');

        simulateTyping(resposta, () => {
          setConversation(prev => [...prev, { text: resposta, from: 'ai' }]);
        });

        return;
      }

      // 4. Se nada encontrado, chamar OpenAI
      const response = await callOpenAiApi([userMessage]);
      const reply = response.choices[0].message.content;

      simulateTyping(reply, () => {
        setConversation(prev => [...prev, { text: reply, from: 'ai' }]);
      });

    } catch (error) {
      console.error("Erro ao buscar demanda:", error);
      setConversation(prev => [...prev, { text: "Erro ao buscar resposta.", from: 'ai' }]);
      setIsTyping(false);
    }
  };

  // Mensagem inicial da IA
  useEffect(() => {
    const welcomeMessage = "Olá, em que posso ajudar?";
    simulateTyping(welcomeMessage, () => {
      setConversation([{ text: welcomeMessage, from: 'ai' }]);
    });
  }, []);

  // Scroll automático para o fim da conversa
  useEffect(() => {
    if (conversationEndRef.current) {
      conversationEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation, typingText]);

  return (
    <Container>
      <Box
        flex="0.2"
        color="transparent"
        width="94%"
        height="auto"
        direction="row"
        justify="space-between"
        align="center"
      >
        <ButtonDefault onClick={deletChat}>
          <BiSolidMessageSquareEdit size="25px" color={colors.silver} />
          <TextDefault weight="bold" align="left" left="10px">
            Novo chat
          </TextDefault>
        </ButtonDefault>
      </Box>

      <BoxList
        flex="1"
        color="transparent"
        width={'100%'}
        height="auto"
        direction="row"
        justify="center"
        align="flex-start"
      >
        <BoxLarge
          flex="none"
          color={'transparent'}
          height="100%"
          direction="column"
          justify="flex-start"
          align="flex-start"
        >
          {conversation.map((item, index) => (
            <Box
              key={index}
              width="100%"
              display="flex"
              justify={item.from === 'user' ? 'flex-end' : 'flex-start'}
            >
              <TextDefault
                color={colors.silver}
                size="18px"
                weight="normal"
                bottom="30px"
                align={item.from === 'user' ? 'right' : 'left'}
              >
                {item.from === 'user' ? (
                  <FaUserAstronaut size={'25px'} />
                ) : (
                  <img
                    src={Icon}
                    alt="IA"
                    style={{ width: 25, height: 25, borderRadius: 50 }}
                  />
                )}
                {' '} - {item.text}
              </TextDefault>
            </Box>
          ))}


          {isTyping && (
            <TextDefault color={colors.silver} size="15px" weight="bold" align="left">
              {typingText}
            </TextDefault>
          )}

          <div ref={conversationEndRef} />
        </BoxLarge>
      </BoxList>

      <Box
        flex="0.2"
        color="transparent"
        width="80%"
        height="auto"
        direction="row"
        justify="center"
        align="center"
      >
        <BoxLarge
          flex="none"
          color={colors.black}
          height="auto"
          direction="row"
          justify="space-between"
          align="center"
          radius="30px"
        >
          <InputDefault
            type="text"
            placeholder="Digite o que precisar sobre A Fleet"
            value={infoDemanda}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            style={{ backgroundColor: isUserTyping ? colors.black : 'initial' }}
          />
          <ButtonDefault onClick={searchDemand}>
            <FaCircleArrowUp size="30px" color={colors.darkGray} />
          </ButtonDefault>
        </BoxLarge>
      </Box>
    </Container>
  );
};
export default Ia;
