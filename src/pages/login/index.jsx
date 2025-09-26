import React, { useState, useEffect, useCallback, useRef } from 'react';
import { colors } from '../../theme';
import { TextDefault, Box, SwalCustomStyles } from '../../stylesAppDefault';
import { Container, Input, Button, LogoImg, ButtonVisibility } from './styles';
import { db } from '../../firebaseConnection';
import { ref, onValue } from 'firebase/database';
import Swal from 'sweetalert2';
import Logomarca from '../../images/logomarca.png';
import { AiFillEyeInvisible } from 'react-icons/ai';
import { IoMdEye } from 'react-icons/io';

const Login = ({ nextHome, onSuccess }) => {
  // compat: prefer nextHome; se não vier, usa onSuccess
  const goHome = useCallback(
    (token) => {
      const fn = typeof nextHome === 'function' ? nextHome : onSuccess;
      if (typeof fn === 'function') fn(token);
      else console.warn('nextHome/onSuccess ausente no App.jsx — verifique a prop passada.');
    },
    [nextHome, onSuccess]
  );

  const [accessKey, setAccessKey] = useState('');
  const [passwordDataBase, setPasswordDataBase] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const unsubRef = useRef(null);

  const togglePasswordVisibility = () => setShowPassword((v) => !v);

  const handleSubmit = (e) => {
    e?.preventDefault?.();
    if (isChecking) return; // evita spam

    setIsChecking(true);
    Swal.fire({
      title: 'Verificando...',
      text: 'Aguarde um instante',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();

        // pequena simulação para UX; remova se usar validação real
        setTimeout(() => {
          Swal.close();

          const accessKeyTrimmed = String(accessKey || '').trim();
          const passwordDataBaseTrimmed = String(passwordDataBase || '').trim();

          if (accessKeyTrimmed && accessKeyTrimmed === passwordDataBaseTrimmed) {
            goHome('true'); // passa um token “opaque”; o App decide como persistir
          } else {
            Swal.fire({
              title: 'Ops!',
              text: 'Chave de acesso inválida!',
              icon: 'error',
              showConfirmButton: false,
              timer: 2000,
              customClass: {
                popup: 'swal-custom-popup',
                title: 'swal-custom-title',
                htmlContainer: 'swal-custom-text',
                confirmButton: 'swal-custom-confirm',
                cancelButton: 'swal-custom-cancel',
              },
            });
          }
          setIsChecking(false);
        }, 800);
      },
      customClass: {
        popup: 'swal-custom-popup',
        title: 'swal-custom-title',
        htmlContainer: 'swal-custom-text',
        confirmButton: 'swal-custom-confirm',
        cancelButton: 'swal-custom-cancel',
      },
    });
  };

  useEffect(() => {
    const passwordRef = ref(db, 'chaveAccess');
    const unsubscribe = onValue(passwordRef, (snapshot) => {
      const data = snapshot.val();
      setPasswordDataBase(data ? String(data) : '');
    });
    unsubRef.current = unsubscribe;
    return () => unsubRef.current && unsubRef.current();
  }, []);

  return (
    <Container>
      <SwalCustomStyles />

      <Box
        width="500px"
        height="400px"
        justify="space-around"
        align="center"
        direction="column"
        color={colors.yellow}
      >
        <LogoImg
          src={Logomarca}
          alt="Fleet Solutions"
          $bottom="20px"
          $width="70%"
        />

        <Box width="70%" direction="column" justify="center" align="center">
          <Box align="center" justify="center" height="auto" width="100%" direction="row" bottomSpace="50px">
            <form onSubmit={handleSubmit} style={{ display: 'flex', width: '100%' }}>
              <Input
                placeholder="Chave de Acesso"
                value={accessKey}
                type={showPassword ? 'text' : 'password'}
                onChange={(e) => setAccessKey(e.target.value)}
                autoComplete="current-password"
                aria-label="Chave de Acesso"
                disabled={isChecking}
              />
              <ButtonVisibility
                type="button"
                aria-label={showPassword ? 'Ocultar chave' : 'Mostrar chave'}
                onClick={togglePasswordVisibility}
                title={showPassword ? 'Ocultar' : 'Mostrar'}
                disabled={isChecking}
              >
                {showPassword ? <IoMdEye color={colors.orange} /> : <AiFillEyeInvisible color={colors.orange} />}
              </ButtonVisibility>
            </form>
          </Box>

          <Button color={colors.orange} onClick={handleSubmit} type="button" disabled={isChecking}>
            <TextDefault weight="bold">Entrar</TextDefault>
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
