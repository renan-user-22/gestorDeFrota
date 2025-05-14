import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';

const ListaMultas = () => {
  const [multas, setMultas] = useState([]);

  useEffect(() => {
    const db = getDatabase();
    const empresasRef = ref(db, 'empresas');

    onValue(empresasRef, (snapshot) => {
      const data = snapshot.val();
      const listaMultas = [];

      if (data) {
        Object.keys(data).forEach((empresaId) => {
          const empresa = data[empresaId];

          if (empresa.multas) {
            Object.keys(empresa.multas).forEach((multaId) => {
              const multa = empresa.multas[multaId];
              listaMultas.push({
                ...multa,
                id: multaId,
                empresaId,
                nomeEmpresa: empresa.nome || 'Empresa sem nome'
              });
            });
          }
        });
      }

      setMultas(listaMultas);
    });
  }, []);

  return (
    <div>
      <h2>Lista de Multas</h2>
      {multas.length === 0 ? (
        <p>Nenhuma multa encontrada.</p>
      ) : (
        <ul>
          {multas.map((multa) => (
            <li key={multa.id}>
              <strong>Empresa:</strong> {multa.nomeEmpresa}<br />
              <strong>Placa:</strong> {multa.placaVeiculo}<br />
              <strong>Data da Infração:</strong> {multa.dataInfracao}<br />
              <strong>Status:</strong> {multa.status}<br />
              <strong>Valor:</strong> {multa.valorMulta}
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ListaMultas;
