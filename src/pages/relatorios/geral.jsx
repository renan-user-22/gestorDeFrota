import React, { useEffect, useState } from 'react';
import { db } from '../../firebaseConnection';
import { ref, onValue } from 'firebase/database';
import { colors } from '../../theme';
import { TextDefault, Box } from '../../stylesAppDefault';
import {
    ListaEmpresasWrapper,
    InfoGrid,
    InfoCard
} from './styles';

import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
    BarChart, XAxis, YAxis, Bar, LineChart, Line
} from 'recharts';

const Geral = () => {

    const [metrics, setMetrics] = useState({
        totalEmpresas: 0,
        totalVeiculos: 0,
        totalMotoristas: 0,
        totalMultas: 0,
    });



    return (
        <ListaEmpresasWrapper>

            <InfoGrid>
                <InfoCard>
                    <TextDefault color={colors.silver} size={'15px'}>Empresas</TextDefault>
                    <TextDefault color={colors.silver} size={'20px'}>{metrics.totalEmpresas}</TextDefault>
                </InfoCard>
                <InfoCard>
                    <TextDefault color={colors.silver} size={'15px'}>Veículos</TextDefault>
                    <TextDefault color={colors.silver} size={'20px'}>{metrics.totalVeiculos}</TextDefault>
                </InfoCard>
                <InfoCard>
                    <TextDefault color={colors.silver} size={'15px'}>Motoristas</TextDefault>
                    <TextDefault color={colors.silver} size={'20px'}>{metrics.totalMotoristas}</TextDefault>
                </InfoCard>
                <InfoCard>
                    <TextDefault color={colors.silver} size={'15px'}>Multas</TextDefault>
                    <TextDefault color={colors.silver} size={'20px'}>{metrics.totalMultas}</TextDefault>
                </InfoCard>
            </InfoGrid>


            <Box width={'100%'} direction={'row'} topSpace={'20px'}>
                <Box flex={'1'}>
                    <TextDefault color={colors.silver} size={'15px'} left={'15px'}>Veículos por tipo:</TextDefault>

                </Box>

                <Box flex={'1'}>
                    <TextDefault color={colors.silver} size={'15px'}> Licenciamento dos Veículos (Ano):</TextDefault>

                </Box>
            </Box>

            <Box width={'100%'} direction={'row'} topSpace={'20px'}>
                <Box flex={'1'}>
                    <TextDefault color={colors.silver} size={'15px'} left={'15px'}>Infrações por tipo (Gravíssima, Grave, Média, Leve):</TextDefault>

                </Box>

                <Box flex={'2'}>
                    <TextDefault color={colors.silver} size={'15px'}> Multas por Status:</TextDefault>

                </Box>
            </Box>

        </ListaEmpresasWrapper>
    );
}

export default Geral;