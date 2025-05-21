import React, { useEffect, useState } from 'react';
import { db } from '../../firebaseConnection';
import { ref, onValue } from 'firebase/database';

import { FaChartBar, FaFileInvoiceDollar, FaClipboardCheck } from 'react-icons/fa';

// Recharts
import {
  PieChart, Pie, Cell, Legend, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';

// Estilos
import {
  Container,
  ListaEmpresasWrapper,
  InfoGrid,
  InfoCard,
  ChartsWrapper,
} from './styles';
import { TextDefault, Box } from '../../stylesAppDefault';
import { colors } from '../../theme';

const Dashboard = () => {
  const [empresas, setEmpresas] = useState({});
  const [metrics, setMetrics] = useState({
    totalEmpresas: 0,
    totalVeiculos: 0,
    totalMotoristas: 0,
    totalMultas: 0,
  });
  const [pieData, setPieData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [statusMultasData, setStatusMultasData] = useState([]);
  const [economiaPorEmpresa, setEconomiaPorEmpresa] = useState([]);
  const [economiaReal, setEconomiaReal] = useState([]);
  const [tipoVeiculoPorEmpresa, setTipoVeiculoPorEmpresa] = useState([]);
  const [tipoVeiculoTotal, setTipoVeiculoTotal] = useState([]);

  useEffect(() => {
    const empresasRef = ref(db, 'empresas');
    return onValue(empresasRef, snapshot => {
      const data = snapshot.val() || {};
      setEmpresas(data);
    });
  }, []);

  useEffect(() => {
    const lista = Object.values(empresas);
    const totalEmpresas = lista.length;

    let totalVeiculos = 0;
    let totalMotoristas = 0;
    let totalMultas = 0;
    const bairroCount = {};
    const statusCount = {};
    const economiaEmpresa = {};
    const economiaRealPorEmpresa = {};
    const tipoVeiculoPorEmpresaMap = {};
    const tipoVeiculoCount = {};

    lista.forEach(e => {
      const veiculos = e.veiculos || {};
      const motoristas = e.motoristas || {};
      const multas = e.multas || {};

      totalVeiculos += Object.keys(veiculos).length;
      totalMotoristas += Object.keys(motoristas).length;
      totalMultas += Object.keys(multas).length;

      const bairro = e.address?.bairro || '-';
      bairroCount[bairro] = (bairroCount[bairro] || 0) + 1;

      Object.values(multas).forEach(multa => {
        const status = multa.status;
        const valor = Number(multa.valorMulta) || 0;
        const valorPago = Number(multa.valorPago) || 0;

        statusCount[status] = (statusCount[status] || 0) + 1;

        if (!economiaEmpresa[e.nome]) economiaEmpresa[e.nome] = 0;
        economiaEmpresa[e.nome] += valor - valorPago;

        if (["pago_40", "pago_20_recurso"].includes(status)) {
          if (!economiaRealPorEmpresa[e.nome]) economiaRealPorEmpresa[e.nome] = 0;
          economiaRealPorEmpresa[e.nome] += valor - valorPago;
        }
      });

      Object.values(veiculos).forEach(v => {
        const tipo = v.tipo || '-';
        tipoVeiculoCount[tipo] = (tipoVeiculoCount[tipo] || 0) + 1;
        if (!tipoVeiculoPorEmpresaMap[e.nome]) tipoVeiculoPorEmpresaMap[e.nome] = {};
        tipoVeiculoPorEmpresaMap[e.nome][tipo] = (tipoVeiculoPorEmpresaMap[e.nome][tipo] || 0) + 1;
      });
    });

    setMetrics({ totalEmpresas, totalVeiculos, totalMotoristas, totalMultas });

    setPieData(Object.entries(bairroCount).map(
      ([bairro, count]) => ({ name: bairro, value: count })
    ));

    setBarData([
      { name: 'Empresas', total: totalEmpresas },
      { name: 'Veículos', total: totalVeiculos },
      { name: 'Motoristas', total: totalMotoristas },
      { name: 'Multas', total: totalMultas },
    ]);

    setStatusMultasData(Object.entries(statusCount).map(([status, qtd]) => ({ name: status, qtd })));

    setEconomiaPorEmpresa(Object.entries(economiaEmpresa).map(([empresa, economia]) => ({ name: empresa, economia })));

    setEconomiaReal(Object.entries(economiaRealPorEmpresa).map(([empresa, economia]) => ({ name: empresa, economia })));

    setTipoVeiculoPorEmpresa(Object.entries(tipoVeiculoPorEmpresaMap).map(([empresa, tipos]) => ({ name: empresa, ...tipos })));

    setTipoVeiculoTotal(Object.entries(tipoVeiculoCount).map(([tipo, qtd]) => ({ name: tipo, qtd })));

  }, [empresas]);

  const COLORS = [colors.orange, colors.red, colors.green, colors.blue];

  return (
    <Container>
      <ListaEmpresasWrapper>

        <Box
          width={'95%'}
          height={'65px'}
          radius={'10px'}
          direction={'row'}
          color={colors.black}
          topSpace={'10px'}
          bottomSpace={'10px'}
          align={'center'}
          justify={'space-between'}
          paddingTop={'20px'}
          paddingBottom={'20px'}
        >
          <Box leftSpace={'20px'}>
            <FaChartBar size={'27px'} color={colors.silver} />
            <TextDefault left={'10px'} color={colors.silver} weight={'bold'} size={'20px'}>Fleet Solutions - Dashboard</TextDefault>
          </Box>
        </Box>

        <InfoGrid>
          <InfoCard>
            <TextDefault weight="bold">Empresas</TextDefault>
            <TextDefault size="20px">{metrics.totalEmpresas}</TextDefault>
          </InfoCard>
          <InfoCard>
            <TextDefault weight="bold">Veículos</TextDefault>
            <TextDefault size="20px">{metrics.totalVeiculos}</TextDefault>
          </InfoCard>
          <InfoCard>
            <TextDefault weight="bold">Motoristas</TextDefault>
            <TextDefault size="20px">{metrics.totalMotoristas}</TextDefault>
          </InfoCard>
          <InfoCard>
            <TextDefault weight="bold">Multas</TextDefault>
            <TextDefault size="20px">{metrics.totalMultas}</TextDefault>
          </InfoCard>
        </InfoGrid>

        <TextDefault size="20px" weight="bold" color={colors.silver} top={'50px'} bottom={'20px'}>
          Informações de Multas e Resultados ou algum título legal
        </TextDefault>

        <Box
          direction={'row'}
          justify={'space-around'}
          width={'98%'}
          align={'center'}
        >

          <ChartsWrapper>
            <div>
              <TextDefault weight="bold" align="center" color={colors.black}>Multas por Status</TextDefault>
              <BarChart width={350} height={250} data={statusMultasData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="qtd" fill={colors.orange} />
              </BarChart>
            </div>
          </ChartsWrapper>

          <ChartsWrapper>
            <div>
              <TextDefault weight="bold" align="center" color={colors.black}>Probabilidade de Economia</TextDefault>
              <BarChart width={350} height={250} data={economiaPorEmpresa}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="economia" fill={colors.green} />
              </BarChart>
            </div>
          </ChartsWrapper>

          <ChartsWrapper>
            <div>
              <TextDefault weight="bold" align="center" color={colors.black}>Economia Real (Pago)</TextDefault>
              <BarChart width={350} height={250} data={economiaReal}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="economia" fill={colors.blue} />
              </BarChart>
            </div>

            <TextDefault align={'center'} size="20px" weight="bold" color={'green'} top={'50px'} bottom={'20px'}>
              Nossos clientes já economizaram R$ 0,00 reais
            </TextDefault>

          </ChartsWrapper>




        </Box>

        <TextDefault size="21px" weight="bold" color={colors.silver} top={'50px'} bottom={'20px'}>
          Relatórios de Empresas
        </TextDefault>

        <Box
          direction={'row'}
          justify={'space-around'}
          width={'100%'}
          align={'center'}
        >
          <ChartsWrapper>
            <div>
              <TextDefault weight="bold" align="center" color={colors.black}>Empresas por Regiões</TextDefault>
              <PieChart width={250} height={300}>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </div>
          </ChartsWrapper>

          <ChartsWrapper>
            <Box direction={'column'} justify={'center'} align={'center'}>
              <TextDefault weight="bold" align="center" color={colors.black}>Totais por Tipo</TextDefault>
              <BarChart width={350} height={300} data={barData} margin={{ top: 20, right: 30, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" />
              </BarChart>
            </Box>

          </ChartsWrapper>

          <ChartsWrapper>
            <div>
              <TextDefault weight="bold" align="center" color={colors.black}>Total por Tipo de Veículo</TextDefault>
              <BarChart width={400} height={300} data={tipoVeiculoTotal}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="qtd" fill={colors.red} />
              </BarChart>
            </div>
          </ChartsWrapper>
        </Box>

      </ListaEmpresasWrapper>
    </Container>
  );
};

export default Dashboard;
