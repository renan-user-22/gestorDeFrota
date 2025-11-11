// src/components/fleet-settings/users-actions/list-users/index.jsx
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { MdAdd, MdEdit, MdManageAccounts, MdVisibility, MdDeleteOutline } from 'react-icons/md';
import { IoClose } from 'react-icons/io5';
import { BiSolidUserCircle } from 'react-icons/bi';
import CreateUsers from '../create-users';

import { db } from '../../../../firebaseConnection';
import { ref, onValue, push, set, update, get } from 'firebase/database';

import { Box, TextDefault } from '../../../../stylesAppDefault';
import { colors } from '../../../../theme';
import {
  SweetAlertStyles,
  ModalAreaTotalDisplay, ModalAreaInfo,
  DefaultButton, Button,
  TableWrapper, Table, THead, TBody, TR, TH, TD,
  HeaderText, TableText,
  Actions, IconButton,
  Backdrop, CargoModal, ModalHeader, CloseIconBtn,
  TabsBar, TabButton, Divider, FormGrid, Label,
  TextInput, SelectInput, Option, FieldGroup,
  ButtonsRow, ButtonsRowStart, ScrollableList,
  CargoRow, CargoMain, Muted, Inline, EditInlineButton,
} from './styles';

const UserList = ({ closeModalListMotorista, empresaId, empresaNome }) => {
  const [listaUsuarios, setListaUsuarios] = useState([]);
  const [modalAddUsuario, setModalAddUsuario] = useState(false);

  const [showCargoModal, setShowCargoModal] = useState(false);
  const [cargoTab, setCargoTab] = useState('novo');

  const [cargoNome, setCargoNome] = useState('');
  const [tipoAcesso, setTipoAcesso] = useState('motorista');
  const [salvandoCargo, setSalvandoCargo] = useState(false);

  const [cargos, setCargos] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editNome, setEditNome] = useState('');
  const [editTipo, setEditTipo] = useState('motorista');

  const cargoById = (id) => cargos.find((c) => c.id === id) || null;

  useEffect(() => {
    if (!empresaId) return;
    const usersRef = ref(db, `fleetBusiness/${empresaId}/users`);
    const unsub = onValue(usersRef, (snap) => {
      const data = snap.val();
      setListaUsuarios(Array.isArray(data) ? data.filter((u) => u && u.nome) : []);
    });
    return () => { try { unsub && unsub(); } catch { } };
  }, [empresaId]);

  useEffect(() => {
    if (!empresaId) return;
    const cargosRef = ref(db, `fleetBusiness/${empresaId}/cargos`);
    const off = onValue(cargosRef, (snap) => {
      const val = snap.val() || {};
      setCargos(Object.keys(val).map((k) => ({ id: k, ...val[k] })));
    });
    return () => { try { off && off(); } catch { } };
  }, [empresaId]);

  const abrirGerenciarCargos = () => { setCargoTab('novo'); setShowCargoModal(true); };

  const salvarCargo = async () => {
    const nome = (cargoNome || '').trim();
    if (!empresaId) return Swal.fire('Erro', 'Empresa inválida.', 'error');
    if (!nome) return Swal.fire('Atenção', 'Informe o nome do cargo.', 'warning');
    try {
      setSalvandoCargo(true);
      const novoRef = push(ref(db, `fleetBusiness/${empresaId}/cargos`));
      await set(novoRef, { nome, tipoAcesso: tipoAcesso === 'gestor' ? 'gestor' : 'motorista' });
      Swal.fire('Sucesso', 'Cargo salvo com sucesso.', 'success');
      setCargoNome(''); setTipoAcesso('motorista'); setCargoTab('lista');
    } finally { setSalvandoCargo(false); }
  };

  const startEdit = (c) => { setEditId(c.id); setEditNome(c.nome || ''); setEditTipo(c.tipoAcesso || 'motorista'); };
  const cancelEdit = () => { setEditId(null); setEditNome(''); setEditTipo('motorista'); };
  const salvarEdicao = async () => {
    if (!empresaId || !editId) return;
    const nome = (editNome || '').trim();
    if (!nome) return Swal.fire('Atenção', 'Informe o nome do cargo.', 'warning');
    await update(ref(db, `fleetBusiness/${empresaId}/cargos/${editId}`), {
      nome, tipoAcesso: editTipo === 'gestor' ? 'gestor' : 'motorista',
    });
    Swal.fire('Sucesso', 'Cargo atualizado com sucesso.', 'success');
    cancelEdit();
  };

  const editarUsuario = (u) => Swal.fire('Em breve', `Edição do usuário "${u?.nome}" em desenvolvimento.`, 'info');

  // Substitua a função atual por esta
  const verDetalhesUsuario = (usuario) => {
    const cargoAtual = cargoById(usuario?.cargoId);
    const isMotorista =
      (usuario?.tipoAcesso && String(usuario.tipoAcesso).toLowerCase() === 'motorista') ||
      (cargoAtual?.tipoAcesso && String(cargoAtual.tipoAcesso).toLowerCase() === 'motorista');

    // helper: verificar se valor é válido
    const has = (v) => {
      if (v === undefined || v === null) return false;
      const s = String(v).trim();
      return s !== '' && s !== '—';
    };

    const rows = [];
    const pushRow = (label, value) => { if (has(value)) rows.push([label, value]); };

    // Nome completo
    const fullName = `${usuario?.nome ?? ''} ${usuario?.sobrenome ?? ''}`.trim();

    // Horário (somente se houver pelo menos um)
    const hIni = (usuario?.horarioEntrada || '').trim();
    const hFim = (usuario?.horarioSaida || '').trim();
    let horario = '';
    if (hIni && hFim) horario = `${hIni} a ${hFim}`;
    else if (hIni) horario = hIni;
    else if (hFim) horario = hFim;

    // Data formatada
    let criadoEm = '';
    if (has(usuario?.criadoEm)) {
      const d = new Date(usuario.criadoEm);
      if (!isNaN(d.getTime())) {
        const dia = String(d.getDate()).padStart(2, '0');
        const mes = String(d.getMonth() + 1).padStart(2, '0');
        const ano = d.getFullYear();
        const hora = String(d.getHours()).padStart(2, '0');
        const min = String(d.getMinutes()).padStart(2, '0');
        criadoEm = `${dia}/${mes}/${ano} ${hora}:${min}`;
      }
    }

    // Campos gerais
    pushRow('Matrícula', usuario?.matricula);
    pushRow('Nome', fullName);
    pushRow('CPF', usuario?.cpf);
    pushRow('Contato', usuario?.contato);
    pushRow('Email', usuario?.email);
    pushRow('Base', usuario?.base);
    pushRow('Status', usuario?.status);
    pushRow('Cargo', cargoAtual?.nome);
    pushRow('Tipo de acesso', cargoAtual?.tipoAcesso || usuario?.tipoAcesso);
    pushRow('Horário', horario);

    // CNH — só se for motorista e houver valor
    if (isMotorista) {
      pushRow('CNH', usuario?.cnhNumero);
      pushRow('Validade CNH', usuario?.cnhValidade);
      pushRow('Categoria CNH', usuario?.cnhCategoria);
      pushRow('Primeira Habilitação', usuario?.cnhPrimeiraHab);
    }

    // Outros
    pushRow('Observações', usuario?.obs);
    pushRow('Criado em', criadoEm);

    // Gera HTML com apenas as linhas válidas
    const html = `
    <div class="user-details">
      ${rows.map(([k, v]) => `
        <div class="row"><strong>${k}:</strong><span>${v}</span></div>
      `).join('')}
    </div>
  `;

    Swal.fire({
      title: 'Detalhes do usuário',
      html,
      confirmButtonText: 'Fechar',
      customClass: {
        popup: 'swal-custom-popup',
        title: 'swal-custom-title',
        htmlContainer: 'swal-custom-html',
        confirmButton: 'swal-custom-confirm',
        cancelButton: 'swal-custom-cancel',
      },
    });
  };

  const excluirUsuarioPorIndex = async (index) => {
    const usersRef = ref(db, `fleetBusiness/${empresaId}/users`);
    const snap = await get(usersRef);
    if (!snap.exists()) return;
    let arr = snap.val();
    arr = Array.isArray(arr) ? arr : Object.values(arr || {});
    arr.splice(index, 1);
    await set(usersRef, arr);
  };

  const confirmarExclusao = async (usuario, index) => {
    const nome = (usuario?.nome || 'Usuário').trim();
    const { isConfirmed } = await Swal.fire({
      title: `Excluir ${nome}?`,
      text: `Esta ação não poderá ser desfeita.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar',
      customClass: {
        popup: 'swal-custom-popup',
        title: 'swal-custom-title',
        htmlContainer: 'swal-custom-html',
        confirmButton: 'swal-custom-confirm',
        cancelButton: 'swal-custom-cancel',
      },
    });
    if (isConfirmed) {
      await excluirUsuarioPorIndex(index);
      await Swal.fire({
        title: 'Excluído!',
        text: `${nome} foi removido com sucesso.`,
        icon: 'success',
        confirmButtonText: 'OK',
        customClass: {
          popup: 'swal-custom-popup',
          title: 'swal-custom-title',
          htmlContainer: 'swal-custom-html',
          confirmButton: 'swal-custom-confirm',
        },
      });
    }
  };

  return (
    <ModalAreaTotalDisplay>
      <SweetAlertStyles />
      <ModalAreaInfo>
        <Box color={colors.black} width="100%" topSpace="10px" direction="column" align="center">
          <Box width="95%" justify="space-between" align="center" topSpace="10px" paddingTop="10px" paddingLeft="20px" paddingRight="20px">
            <Box direction="row" align="center">
              <BiSolidUserCircle size="27px" color={colors.silver} />
              <TextDefault left="10px" color={colors.silver} weight="bold" size="17px">
                Usuários da empresa {empresaNome}
              </TextDefault>
            </Box>
            <Button onClick={closeModalListMotorista} $color="transparent">
              <IoClose size="30px" color={colors.silver} />
            </Button>
          </Box>

          <Box width="95%" height="1px" radius="1px" color={colors.silver} topSpace="20px" />

          <Box direction="row" align="center" width="95%">
            <DefaultButton $width="170px" onClick={() => setModalAddUsuario(true)}>
              <MdAdd size="20px" color={colors.silver} />
              <TextDefault color={colors.silver} size="14px" left="5px">Novo Usuário</TextDefault>
            </DefaultButton>

            <DefaultButton $width="240px" onClick={abrirGerenciarCargos}>
              <MdManageAccounts size="20px" color={colors.silver} />
              <TextDefault color={colors.silver} size="14px" left="5px">Gerenciar Cargos</TextDefault>
            </DefaultButton>
          </Box>
        </Box>

        {/* Tabela */}
        {listaUsuarios.length === 0 ? (
          <TextDefault top="10px" color={colors.silver}>Nenhum usuário cadastrado.</TextDefault>
        ) : (
          <TableWrapper>
            <Table>
              <THead>
                <TR>
                  {['Matrícula', 'Senha', 'Nome', 'Sobrenome', 'CPF', 'Telefone', 'Cargo', 'Base', 'Status', 'Ações'].map((h) => (
                    <TH key={h}><HeaderText size="12px" color={colors.silver}>{h}</HeaderText></TH>
                  ))}
                </TR>
              </THead>
              <TBody>
                {listaUsuarios.map((u, idx) => {
                  const cargoAtual = cargoById(u?.cargoId);
                  return (
                    <TR key={u?.matricula ?? idx}>
                      <TD><TableText size="12px">{u?.matricula || '—'}</TableText></TD>
                      <TD><TableText size="12px">{u?.senha || '—'}</TableText></TD>
                      <TD><TableText size="12px">{u?.nome || '—'}</TableText></TD>
                      <TD><TableText size="12px">{u?.sobrenome || '—'}</TableText></TD>
                      <TD><TableText size="12px">{u?.cpf || '—'}</TableText></TD>
                      <TD><TableText size="12px">{u?.contato || '—'}</TableText></TD>
                      <TD><TableText size="12px">{cargoAtual ? cargoAtual.nome : '—'}</TableText></TD>
                      <TD><TableText size="12px">{u?.base || 'Matriz'}</TableText></TD>
                      <TD><TableText size="12px">{u?.status || '—'}</TableText></TD>
                      <TD>
                        <Actions>
                          <IconButton onClick={() => editarUsuario(u, idx)} aria-label="Editar usuário" title="Editar">
                            <MdEdit size={18} />
                          </IconButton>
                          <IconButton onClick={() => verDetalhesUsuario(u)} aria-label="Visualizar detalhes" title="Visualizar">
                            <MdVisibility size={18} />
                          </IconButton>
                          <IconButton onClick={() => confirmarExclusao(u, idx)} aria-label="Excluir usuário" title="Excluir">
                            <MdDeleteOutline size={18} />
                          </IconButton>
                        </Actions>
                      </TD>
                    </TR>
                  );
                })}
              </TBody>
            </Table>
          </TableWrapper>
        )}

        {/* Modal: Create user */}
        {modalAddUsuario && (
          <CreateUsers
            closeModalAddMotorista={() => setModalAddUsuario(false)}
            empresaIdProp={empresaId}
            empresaNome={empresaNome}
          />
        )}

        {/* Modal: Cargos */}
        {showCargoModal && (
          <Backdrop onClick={() => setShowCargoModal(false)}>
            <CargoModal onClick={(e) => e.stopPropagation()}>
              <ModalHeader>
                <TextDefault color={colors.silver} weight="bold" size="16px">Gerenciamento de Cargos</TextDefault>
                <CloseIconBtn onClick={() => setShowCargoModal(false)} aria-label="Fechar modal">
                  <IoClose size={24} color={colors.silver} />
                </CloseIconBtn>
              </ModalHeader>

              <TabsBar>
                <TabButton $active={cargoTab === 'novo'} onClick={() => setCargoTab('novo')}>Novo Cargo</TabButton>
                <TabButton $active={cargoTab === 'lista'} onClick={() => setCargoTab('lista')}>Cargos Cadastrados</TabButton>
              </TabsBar>

              <Divider />

              {cargoTab === 'novo' && (
                <FormGrid>
                  <Label>Nome do cargo</Label>
                  <TextInput value={cargoNome} onChange={(e) => setCargoNome(e.target.value)} placeholder="Ex.: Supervisor de Operações" />
                  <Label>Tipo de acesso</Label>
                  <SelectInput value={tipoAcesso} onChange={(e) => setTipoAcesso(e.target.value)}>
                    <Option value="motorista">Motorista</Option>
                    <Option value="gestor">Gestor</Option>
                  </SelectInput>
                  <ButtonsRow>
                    <Button onClick={() => setShowCargoModal(false)} $color={colors.black}>Cancelar</Button>
                    <Button onClick={salvarCargo} $width="120px">{salvandoCargo ? 'Salvando...' : 'Salvar'}</Button>
                  </ButtonsRow>
                </FormGrid>
              )}

              {cargoTab === 'lista' && (
                <ScrollableList>
                  {cargos.length === 0 ? (
                    <TextDefault color={colors.silver} size="13px">Nenhum cargo cadastrado.</TextDefault>
                  ) : (
                    cargos.map((c) => (
                      <CargoRow key={c.id}>
                        <CargoMain>
                          {editId === c.id ? (
                            <>
                              <FieldGroup>
                                <Label>Nome do cargo</Label>
                                <TextInput value={editNome} onChange={(e) => setEditNome(e.target.value)} />
                              </FieldGroup>
                              <FieldGroup>
                                <Label>Tipo de acesso</Label>
                                <SelectInput value={editTipo} onChange={(e) => setEditTipo(e.target.value)}>
                                  <Option value="motorista">Motorista</Option>
                                  <Option value="gestor">Gestor</Option>
                                </SelectInput>
                              </FieldGroup>
                              <ButtonsRowStart>
                                <Button onClick={cancelEdit} $color={colors.black}>Cancelar</Button>
                                <Button onClick={salvarEdicao} $width="110px">Salvar</Button>
                              </ButtonsRowStart>
                            </>
                          ) : (
                            <>
                              <TextDefault color={colors.silver} size="13px">{c.nome}</TextDefault>
                              <Muted>Tipo: {c.tipoAcesso}</Muted>
                            </>
                          )}
                        </CargoMain>

                        <Inline>
                          {editId === c.id ? null : (
                            <EditInlineButton onClick={() => startEdit(c)} title="Editar cargo">
                              <MdEdit size={18} color={colors.silver} />
                            </EditInlineButton>
                          )}
                        </Inline>
                      </CargoRow>
                    ))
                  )}
                </ScrollableList>
              )}
            </CargoModal>
          </Backdrop>
        )}
      </ModalAreaInfo>
    </ModalAreaTotalDisplay>
  );
};

export default UserList;
