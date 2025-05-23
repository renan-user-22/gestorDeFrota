import React, { useEffect, useState } from 'react';
import { db } from '../../firebaseConnection';
import { ref, onValue } from 'firebase/database';

//Icones
import { FaChartBar } from 'react-icons/fa';

//Bibliotecas:
import { motion } from 'framer-motion';
import dayjs from 'dayjs';

// Recharts
import {
  PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer, Line, LineChart,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ScatterChart, Scatter
} from 'recharts';

// Estilos
import {
  Container,
  ListaEmpresasWrapper,
  InfoGrid,
  InfoCard,
  ChartsWrapper,
  Button,
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
  const [licenciamentoPorAno, setLicenciamentoPorAno] = useState([]);
  const [multasPorGravidade, setMultasPorGravidade] = useState([]);
  const [multasPorMesEmpresa, setMultasPorMesEmpresa] = useState([]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;

      if (!data) return null;

      // Nome principal (empresa, tipo, status, etc.)
      const nomePrincipal = data.name;

      const infosSecundarias = Object.entries(data).filter(
        ([key]) => key !== 'name'
      ).map(([key, value]) => {
        let label = '';
        let valorFormatado = value;

        switch (key) {
          case 'qtd':
          case 'total':
          case 'value':
            label = 'Quantidade';
            break;
          case 'economia':
            label = 'Economia';
            valorFormatado = Number(value).toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            });
            break;
          default:
            label = key.charAt(0).toUpperCase() + key.slice(1);
        }

        return (
          <p key={key} style={{ margin: 0 }}>
            {`${label}: ${valorFormatado}`}
          </p>
        );
      });

      return (
        <div style={{ background: '#fff', padding: 10, border: '1px solid #ccc' }}>
          <strong style={{ display: 'block', marginBottom: 5 }}>{nomePrincipal}</strong>
          {infosSecundarias}
        </div>
      );
    }

    return null;
  };





  const getTotalEconomiaReal = () => {
    const total = economiaReal.reduce((acc, curr) => acc + curr.economia, 0);
    return total.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  useEffect(() => {
    const mesesNome = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June',
      'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'
    ];

    const nomesEmpresas = Object.values(empresas).map(e => e.nome);

    // Inicializa a base com todos os meses e todas as empresas zeradas
    const estruturaInicial = mesesNome.map(mes => {
      const base = { name: mes };
      nomesEmpresas.forEach(nomeEmpresa => {
        base[nomeEmpresa] = 0;
      });
      return base;
    });

    const dadosAcumulados = [...estruturaInicial];

    // Percorre todas as multas e soma nas respectivas posições
    Object.values(empresas).forEach(e => {
      const nomeEmpresa = e.nome;
      const multas = e.multas || {};

      Object.values(multas).forEach(m => {
        const data = m.dataInfracao;
        const [dia, mes, ano] = (data || '').split('/');

        if (mes) {
          const indiceMes = parseInt(mes) - 1;
          const nomeMes = mesesNome[indiceMes] || 'Indefinido';

          const mesObj = dadosAcumulados.find(item => item.name === nomeMes);
          if (mesObj) {
            mesObj[nomeEmpresa] += 1;
          }
        }
      });
    });

    setMultasPorMesEmpresa(dadosAcumulados);
  }, [empresas]);


  useEffect(() => {
    const gravidadeCount = {};

    Object.values(empresas).forEach(e => {
      const multas = e.multas || {};
      Object.values(multas).forEach(m => {
        const gravidade = m.gravidade || 'Não Informado';
        gravidadeCount[gravidade] = (gravidadeCount[gravidade] || 0) + 1;
      });
    });

    setMultasPorGravidade(
      Object.entries(gravidadeCount).map(([gravidade, qtd]) => ({ name: gravidade, qtd }))
    );
  }, [empresas]);

  useEffect(() => {
    const empresasRef = ref(db, 'empresas');
    return onValue(empresasRef, snapshot => {
      const data = snapshot.val() || {};
      setEmpresas(data);
    });
  }, []);

  useEffect(() => {
    const licenciamentoCount = {};

    Object.values(empresas).forEach(e => {
      const veiculos = e.veiculos || {};
      Object.values(veiculos).forEach(v => {
        const anoLicenciamento = v.licenciamento || 'Desconhecido';
        licenciamentoCount[anoLicenciamento] = (licenciamentoCount[anoLicenciamento] || 0) + 1;
      });
    });

    setLicenciamentoPorAno(
      Object.entries(licenciamentoCount).map(([ano, qtd]) => ({ name: ano, qtd }))
    );
  }, [empresas]);

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

        if (["Pago_40", "Pago_20", "Pago_20_Recurso"].includes(status)) {
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

    setEconomiaPorEmpresa(
      Object.entries(economiaEmpresa).map(([empresa, economia]) => {
        const nomeResumido = empresa.split(' ').slice(0, 2).join(' ');
        return { name: nomeResumido, economia };
      })
    );

    setEconomiaReal(Object.entries(economiaRealPorEmpresa).map(([empresa, economia]) => ({ name: empresa, economia })));

    setTipoVeiculoPorEmpresa(Object.entries(tipoVeiculoPorEmpresaMap).map(([empresa, tipos]) => ({ name: empresa, ...tipos })));

    setTipoVeiculoTotal(Object.entries(tipoVeiculoCount).map(([tipo, qtd]) => ({ name: tipo, qtd })));

  }, [empresas]);

  const COLORS = [
    colors.yellow,
    colors.orange,
    colors.darkGray,
    colors.green,
    'blue',
    'red',
    'purple',
    'teal'
  ];

  return (
    <Container>
      <ListaEmpresasWrapper>

        <Box
          width={'98%'}
          height={'65px'}
          radius={'10px'}
          direction={'row'}
          color={colors.black}
          topSpace={'10px'}
          bottomSpace={'10px'}
          align={'flex-start'}
          justify={'flex-start'}
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
            <TextDefault color={colors.black} weight="bold">Empresas</TextDefault>
            <TextDefault color={colors.black} size={'20px'}>{metrics.totalEmpresas}</TextDefault>
          </InfoCard>
          <InfoCard>
            <TextDefault color={colors.black} weight="bold">Veículos</TextDefault>
            <TextDefault color={colors.black} size={'20px'}>{metrics.totalVeiculos}</TextDefault>
          </InfoCard>
          <InfoCard>
            <TextDefault color={colors.black} weight="bold">Motoristas</TextDefault>
            <TextDefault color={colors.black} size={'20px'}>{metrics.totalMotoristas}</TextDefault>
          </InfoCard>
          <InfoCard>
            <TextDefault color={colors.black} weight="bold">Multas</TextDefault>
            <TextDefault color={colors.black} size={'20px'}>{metrics.totalMultas}</TextDefault>
          </InfoCard>
        </InfoGrid>

        <Box
          direction={'row'}
          justify={'flex-start'}
          width={'98%'}
          align={'center'}
        >

          <Box direction={'column'} height={'500px'} flex={'1'}>
            <ChartsWrapper flex={'1'} height={'100%'}>
              <TextDefault weight="bold" align="center" color={colors.black}>
                Totais por Tipo de Veículo:
              </TextDefault>
              <Box width={'100%'} height={'100%'} justify={'flex-start'} align={'flex-end'}>
                <ResponsiveContainer width="100%" height="97%">
                  <BarChart data={tipoVeiculoTotal}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="qtd" fill={colors.darkGray} radius={[10, 10, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </ChartsWrapper>
          </Box>


          <Box direction={'column'} height={'490px'} flex={'1'}>
            <ChartsWrapper flex={'1'} height={'100%'}>
              <TextDefault bottom={'15px'} weight={'bold'} color={colors.black}>
                Previsão de Economia:
              </TextDefault>
              <Box width={'100%'} height={'100%'} justify={'flex-start'} align={'flex-end'}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={economiaPorEmpresa}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={false} />
                    <Tooltip content={<CustomTooltip />} />

                    <Bar
                      dataKey="economia"
                      fill="blue"
                      radius={[10, 10, 0, 0]}
                      label={{ position: 'top', formatter: (v) => `R$ ${v.toFixed(2)}` }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </ChartsWrapper>
          </Box>


          <Box direction={'column'} height={'500px'} flex={'1.2'}>
            <ChartsWrapper flex={'1'} height={'80%'}>
              <TextDefault bottom={'15px'} weight={'bold'} color={colors.black}>
                Economia Real (R$):
              </TextDefault>
              <Box height={'100%'} width={'100%'} justify={'center'} align={'flex-end'}>
                <ResponsiveContainer width="100%" height="90%">
                  <BarChart
                    layout="vertical"
                    data={economiaReal}
                    margin={{ top: 5, right: 20, left: -30, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis
                      dataKey="name"
                      type="category"
                      tick={false} // 👉 Remove os nomes do eixo Y
                      axisLine={false} // 👉 Remove a linha do eixo (opcional)
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="economia" fill="green" radius={[0, 10, 10, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </ChartsWrapper>

            <ChartsWrapper flex={'0.2'} height={'20%'}>
              <TextDefault bottom={'15px'} weight={'bold'} color={colors.black}>
                Nossos clientes já economizaram:
              </TextDefault>
              <Box>
                <TextDefault size={'25px'} weight={'bold'} color={'green'}>
                  {getTotalEconomiaReal()}
                </TextDefault>
              </Box>
            </ChartsWrapper>
          </Box>


        </Box>


        <Box
          direction={'row'}
          justify={'flex-start'}
          width={'98%'}
          align={'center'}
        >

          <Box direction={'column'} height={'400px'} flex={'0.4'}>
            <ChartsWrapper flex={'1'} height={'100%'}>
              <TextDefault bottom={'15px'} weight={'bold'} color={colors.black}>
                Empresas por Regiões:
              </TextDefault>
              <Box width={'100%'} height={'100%'} justify={'center'} align={'flex-end'}>
                <ResponsiveContainer width="100%" height="90%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius="80%"
                      label
                    >
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend layout="vertical" verticalAlign="middle" align="right" />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </ChartsWrapper>
          </Box>

          <Box direction={'column'} height={'400px'} flex={'1'}>
            <ChartsWrapper flex={'1'} height={'100%'}>
              <TextDefault bottom={'15px'} weight={'bold'} color={colors.black}>
                Multas por Status:
              </TextDefault>
              <Box height={'100%'} width={'100%'} justify={'center'} align={'flex-end'}>
                <ResponsiveContainer width="100%" height="90%">
                  <BarChart data={statusMultasData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="qtd" fill={colors.yellow} radius={[10, 10, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </ChartsWrapper>
          </Box>

        </Box>

        <Box
          direction={'row'}
          justify={'flex-start'}
          width={'98%'}
          align={'center'}
        >
          <Box direction={'column'} height={'400px'} flex={'0.6'}>
            <ChartsWrapper flex={'1'} height={'100%'}>
              <TextDefault bottom={'15px'} weight={'bold'} color={colors.black}>
                Licenciamento dos Veículos (Ano):
              </TextDefault>
              <Box height={'100%'} width={'100%'} justify={'center'} align={'center'}>
                <ResponsiveContainer width="100%" height="90%">
                  <PieChart>
                    <Pie
                      data={licenciamentoPorAno}
                      dataKey="qtd"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius="80%"
                      label
                    >
                      {licenciamentoPorAno.map((entry, index) => {
                        const anoAtual = new Date().getFullYear();
                        const ano = parseInt(entry.name);

                        let color = '#ccc';

                        if (ano === anoAtual) {
                          color = '#237cf4'; // Verde (Ano atual)
                        } else if (ano === anoAtual - 1) {
                          color = '#FFD700'; // Amarelo (Ano anterior)
                        } else if (ano === anoAtual - 2) {
                          color = '#FFA500'; // Laranja (Dois anos antes)
                        } else {
                          color = '#FF0000'; // Vermelho (Três anos ou mais)
                        }

                        return <Cell key={`cell-${index}`} fill={color} />;
                      })}
                    </Pie>
                    <Tooltip />
                    <Legend layout="vertical" verticalAlign="middle" align="right" />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </ChartsWrapper>
          </Box>




          <Box direction={'column'} height={'400px'} flex={'1'}>
            <ChartsWrapper flex={'1'} height={'100%'}>
              <TextDefault bottom={'15px'} weight={'bold'} color={colors.black}>
                Quantidade de infrações por tipo (Gravíssima, Grave, Média, Leve):
              </TextDefault>
              <Box height={'100%'} width={'100%'} justify={'center'} align={'flex-end'}>
                <ResponsiveContainer width="100%" height="90%">
                  <BarChart data={multasPorGravidade}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="qtd" radius={[10, 10, 0, 0]}>
                      {multasPorGravidade.map((entry, index) => {
                        let color = '#ccc';

                        switch (entry.name) {
                          case 'Gravíssima':
                            color = '#FF0000';
                            break;
                          case 'Grave':
                            color = '#FFA500';
                            break;
                          case 'Média':
                            color = '#FFD700';
                            break;
                          case 'Leve':
                            color = '#87CEFA';
                            break;
                          default:
                            color = '#ccc';
                        }

                        return <Cell key={`cell-${index}`} fill={color} />;
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </ChartsWrapper>
          </Box>



          <Box direction={'column'} height={'400px'} flex={'0.7'}>
            <ChartsWrapper flex={'1'} height={'100%'}>
              <TextDefault bottom={'15px'} weight={'bold'} color={colors.black}>Opções:</TextDefault>
              <Box direction={'column'} height={'100%'} justify={'space-around'} align={'space-around'}>
                <Button>
                  <TextDefault align={'center'} color={colors.darkGray}>
                    Quantidade de AITs ainda dentro do prazo  Qtd.: XX
                  </TextDefault>
                </Button>

                <Button>
                  <TextDefault align={'center'} color={colors.darkGray}>
                    Prazos vencendo nos próximos 10 dias Qtd.: XX
                  </TextDefault>
                </Button>

                <Button>
                  <TextDefault align={'center'} color={colors.darkGray}>
                    Multas com prazos perdidos Qtd.: XX
                  </TextDefault>
                </Button>
              </Box>
            </ChartsWrapper>
          </Box>
        </Box>

        <Box
          direction={'row'}
          justify={'flex-start'}
          width={'98%'}
          align={'center'}
        >

          <Box direction={'column'} height={'500px'} flex={'1'}>
            <ChartsWrapper flex={'1'} height={'100%'}>
              <TextDefault bottom={'15px'} weight={'bold'} color={colors.black}>
                Evolução do número de multas por mês - Por Empresa
              </TextDefault>
              <Box height={'100%'} width={'100%'} align={'flex-end'}>
                <ResponsiveContainer width="100%" height="90%">
                  <LineChart
                    data={multasPorMesEmpresa}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />

                    {Object.values(empresas).map((empresa, index) => (
                      <Line
                        key={empresa.nome}
                        type="monotone"
                        dataKey={empresa.nome}
                        stroke={COLORS[index % COLORS.length]}
                        strokeWidth={2}
                        dot={{ r: 5 }}
                        activeDot={{ r: 8 }}
                      />
                    ))}
                  </LineChart>

                </ResponsiveContainer>
              </Box>
            </ChartsWrapper>
          </Box>

        </Box>

      </ListaEmpresasWrapper>
    </Container>
  );
};
export default Dashboard;