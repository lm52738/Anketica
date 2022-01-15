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
      pv: 20,
    },
    {
      name: 'Page B',
      pv: 12,
    },
    {
      name: 'Page C',
      pv: 5,
    },
    {
      name: 'Page D',
      pv: 17,
    },
    {
      name: 'Page E',
      pv: 8,
    },
    {
      name: 'Page F',
      pv: 3,
    },
    {
      name: 'Page G',
      pv: 10,
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
  tekst_pitanja: string;
  id_tip_pitanja: number;
  tekst_odgovora: Array<string>;
}

interface Odgovor {
  name: string;
  value: number;
}

export default function Chart() {
  const { id }= useParams();
  var [pitanje, setPitanje] = useState<Pitanje>();
  const [pitanja, setPitanja] = useState<Pitanje[]>([]);

  var tekst = Array<Pitanje>();
  const [tekstPitanja, setTekstPitanja] = useState<Pitanje[]>([]);

  var odabir = Array<Pitanje>();
  const [odabirPitanja, setOdabirPitanja] = useState<Pitanje[]>([]);

  const getUserData = () => {
    console.log(id);
    const url = "http://localhost:9000/statistics/" + id;
    console.log(url);
    axios.get(url).then((response) => {
      console.log(response.data);
      setPitanja(response.data);

      for (pitanje of pitanja){
        if (pitanje.id_tip_pitanja === 2){
          tekst.push(pitanje);
        } else{
          odabir.push(pitanje);
        }
      }
      
      setTekstPitanja(tekst);
      setOdabirPitanja(odabir);

      console.log(tekstPitanja);
      console.log(odabirPitanja);

    });

  };

  // treba dohvatit
  useEffect(() => getUserData(), []);


  return (
    <div>
    <StatisticsHeader />
    {odabirPitanja.map(pitanje => (
      <div>
        <VStack
        align="center" minW={{base: "100vw",md: "400px",}}
        w="full" maxW={{ base: "100vw",  md: "1000px", }}
        minH={{base: "100vh", md: "400px", }}
        h="full" maxH={{ base: "100vh", md: "650px", }}
        bg="white" boxShadow={{ base: "none", md: "lg", }}
        borderRadius={{ base: "none", md: "lg", }}
        mx="auto" p="6" spacing="6" marginTop="2%">
          <Text fontSize="20">{pitanje.tekst_pitanja}</Text>
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
          <Text fontSize="20">{pitanje.tekst_pitanja}</Text>
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
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
      </VStack>

      </div>
    ))} 
    

    {tekstPitanja.map(pitanje => (
        <VStack align="center" minW={{base: "100vw",md: "400px",}}
        w="full" maxW={{ base: "100vw",  md: "1000px", }}
        minH={{base: "100vh", md: "400px", }}
        h="full" maxH={{ base: "100vh", md: "650px", }}
        bg="white" boxShadow={{ base: "none", md: "lg", }}
        borderRadius={{ base: "none", md: "lg", }}
        mx="auto" p="6" spacing="6" marginTop="2%">
          <Text fontSize="20">{pitanje.tekst_pitanja}</Text>
    
          {pitanje.tekst_odgovora.map(odgovor => (
            <Text width="90%" bg="#dbdbdb" boxShadow={{ base: "none", md: "lg", }}
            borderRadius={{ base: "none", md: "lg", }} p="3">{odgovor}</Text>
          ))}  
        </VStack>
    ))} 
    </div>   
        
  );
}
