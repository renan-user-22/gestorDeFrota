import React, { useState, useEffect } from 'react';
import { colors } from '../../theme'; // Lembrando de importar o tema para usar as cores
import { TextDefault, Box } from '../../stylesAppDefault';
import { Container, Input, Button, LogoImg, ButtonVisibility } from './styles';
import { db } from '../../firebaseConnection';
import { ref, onValue } from "firebase/database"; // importe isso no topo
import Swal from 'sweetalert2';
import Logomarca from '../../images/logomarca.png';
import { AiFillEyeInvisible } from "react-icons/ai";
import { IoMdEye } from "react-icons/io";

const Login = ({ nextHome }) => {

  const [accessKey, setAccessKey] = useState('');
  const [passwordDataBase, setPasswordDataBase] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      // Se a tecla pressionada for "Enter", chama a função de envio do formulário
      handleLogin(event);
    }
  };

  const handleLogin = () => {
    Swal.fire({
      title: 'Verificando...',
      text: 'Aguarde um instante',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();

        setTimeout(() => {
          Swal.close();

          // Garantir que ambas as variáveis sejam strings
          const accessKeyTrimmed = String(accessKey).trim();
          const passwordDataBaseTrimmed = String(passwordDataBase).trim();

          if (accessKeyTrimmed === passwordDataBaseTrimmed) {
            nextHome();
          } else {
            // Erro
            Swal.fire({
              title: 'Ops!',
              text: 'Chave de acesso inválida!',
              icon: 'error',
              showConfirmButton: false,
              timer: 2000
            });
          }
        }, 1500); // Tempo de “verificação”
      }
    });
  };

  useEffect(() => {
    const passwordRef = ref(db, "chaveAccess");
    onValue(passwordRef, (snapshot) => {
      const data = snapshot.val();
      // Garantir que o valor de "chaveAccess" seja uma string
      setPasswordDataBase(data ? String(data) : ""); // Caso seja undefined ou null, fica vazio
    });
  }, []);

  return (
    <Container>
      <Box
        width={'500px'}
        height={'400px'}
        radius={'20px'}
        justify={'center'}
        align={'center'}
        direction={'column'}
        color='#eebe2c'
      >
        <LogoImg src={Logomarca} bottom={'20px'} />

        <Box align={'center'} justify={'center'} height={'auto'} width={'100%'} direction={'row'} bottomSpace={'20px'}>
          <Input
            placeholder="Chave de Acesso"
            value={accessKey}
            type={showPassword ? "text" : "password"}
            onChange={(e) => setAccessKey(e.target.value)}
            onKeyDown={handleKeyPress}
          />

          <ButtonVisibility onClick={togglePasswordVisibility}>
            {showPassword ? <IoMdEye color={colors.orange} /> : <AiFillEyeInvisible color={colors.orange} />}
          </ButtonVisibility>
        </Box>


        <Button color={colors.orange} onClick={() => handleLogin()}>Entrar</Button>
      </Box>
    </Container>
  );
};

export default Login;
