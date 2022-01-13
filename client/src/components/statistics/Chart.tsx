import * as React from 'react';
import { PieChart, Pie, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Text,VStack } from "@chakra-ui/react";
import axios from "axios";
import { StatisticsHeader } from './StatisticsHeader';
import { useEffect, useState } from "react";
import { useParams } from 'react-router';

const data1 = [
    { name: 'Group A', value: 400 },
    { name: 'Group B', value: 300 },
    { name: 'Group C', value: 300 },
    { name: 'Group D', value: 200 },
  ];

  const data2 = [
    {
      name: 'Page A',
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: 'Page B',
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: 'Page C',
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: 'Page D',
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: 'Page E',
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: 'Page F',
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: 'Page G',
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

interface Pitanje {
  ime: string;
  id: number;
  tekst: string;
  id_tip_pitanja: number;
}

export default function Chart() {
  const { id }= useParams();
  const [pitanje, setPitanje] = useState<Pitanje>();
  const [pitanja, setPitanja] = useState<Pitanje[]>([]);

  const getUserData = () => {
    console.log(id);
    const url = "http://localhost:9000/statistics/" + id;
    console.log(url);
    axios.get(url).then((response) => {
      console.log(response.data);
      setPitanja(response.data);
    });

  };

  // treba dohvatit
  useEffect(() => getUserData(), []);

  return (
    <div>
    <StatisticsHeader />
    <VStack
    align="center" minW={{base: "100vw",md: "400px",}}
    w="full" maxW={{ base: "100vw",  md: "1000px", }}
    minH={{base: "100vh", md: "400px", }}
    h="full" maxH={{ base: "100vh", md: "650px", }}
    bg="white" boxShadow={{ base: "none", md: "lg", }}
    borderRadius={{ base: "none", md: "lg", }}
    mx="auto" p="6" spacing="6" marginTop="2%">
      <Text fontSize="20">Pitanje 1</Text>
      <PieChart width={300} height={300} >
            <Pie
            data={data1}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
            >
            {data1.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
            </Pie>
            <Legend />
      </PieChart>
      
    </VStack>
    <VStack
    align="center" minW={{base: "100vw",md: "400px",}}
    w="full" maxW={{ base: "100vw",  md: "1000px", }}
    minH={{base: "100vh", md: "400px", }}
    h="full" maxH={{ base: "100vh", md: "650px", }}
    bg="white" boxShadow={{ base: "none", md: "lg", }}
    borderRadius={{ base: "none", md: "lg", }}
    mx="auto" p="6" spacing="6" marginTop="2%">
      <Text fontSize="20">Pitanje 2</Text>
      <BarChart
          width={700}
          height={300}
          data={data2}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="pv" fill="#8884d8" />
        </BarChart>
    </VStack>
    <VStack align="center" minW={{base: "100vw",md: "400px",}}
    w="full" maxW={{ base: "100vw",  md: "1000px", }}
    minH={{base: "100vh", md: "400px", }}
    h="full" maxH={{ base: "100vh", md: "650px", }}
    bg="white" boxShadow={{ base: "none", md: "lg", }}
    borderRadius={{ base: "none", md: "lg", }}
    mx="auto" p="6" spacing="6" marginTop="2%">
      <Text fontSize="20">Pitanje 3</Text>
      <Text width="90%" bg="#dbdbdb" boxShadow={{ base: "none", md: "lg", }}
       borderRadius={{ base: "none", md: "lg", }} p="3">Odgovor</Text>
      <Text width="90%" bg="#dbdbdb" boxShadow={{ base: "none", md: "lg", }}
       borderRadius={{ base: "none", md: "lg", }} p="3">Odgovor</Text>
      <Text width="90%" bg="#dbdbdb" boxShadow={{ base: "none", md: "lg", }}
       borderRadius={{ base: "none", md: "lg", }} p="3">Odgovor</Text>
      <Text width="90%" bg="#dbdbdb" boxShadow={{ base: "none", md: "lg", }}
       borderRadius={{ base: "none", md: "lg", }} p="3">Odgovor</Text>
    </VStack>
    </div>   
        
  );
}