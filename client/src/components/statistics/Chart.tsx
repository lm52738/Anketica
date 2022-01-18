import * as React from 'react';
import { PieChart, Pie, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Text,VStack } from "@chakra-ui/react";
import axios from "axios";
import { StatisticsHeader } from './StatisticsHeader';
import { useEffect, useState } from "react";
import { useParams } from 'react-router';
  
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
  interface OdabirPitanje {
    ime: string;
    id: number;
    tekst_pitanja: string;
    id_tip_pitanja: number;
    tekst_odgovora: Array<Odgovor>;
  }

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
  var [odgovor, setOdgovor] = useState<Odgovor>();

  const [pitanja, setPitanja] = useState<Pitanje[]>([]);

  var tekst = Array<Pitanje>();
  const [tekstPitanja, setTekstPitanja] = useState<Pitanje[]>([]);

  var [odabirPitanje, setOdabirPitanje] = useState<OdabirPitanje>();
  var odabir = Array<OdabirPitanje>();
  const [odabirPitanja, setOdabirPitanja] = useState<OdabirPitanje[]>([]);

  const getUserData = () => {
    console.log(id);
    const url = "http://localhost:9000/statistics/" + id;
    console.log(url);
    axios.get(url).then((response) => {
      console.log(response.data);
      setPitanja(response.data);

      for (pitanje of pitanja){
        setPitanje(pitanje);
        if (pitanje.id_tip_pitanja === 2){
          tekst.push(pitanje);
        } else{
          var map = new Map<string,number>();
          for(var odg of pitanje.tekst_odgovora){
            if (map.has(odg)){
              var oldV = map.get(odg);
              if (oldV){
                var value = oldV + 100;
                map.set(odg,value);
              }
            } else {
              map.set(odg,100);
            }
          }
          
          var odgovori = new Array<Odgovor>();
          for  (var entry of map.entries()){
            var odgovor = {name: entry[0], value: entry[1]};
            setOdgovor(odgovor);
            odgovori.push(odgovor);
          }

          var pitanjeO = {ime: pitanje.ime,id: pitanje.id,tekst_pitanja: pitanje.tekst_pitanja,
            id_tip_pitanja: pitanje.id_tip_pitanja,tekst_odgovora: odgovori};
          setOdabirPitanje(pitanjeO);
          odabir.push(pitanjeO);
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
                data={pitanje.tekst_odgovora}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                >
                {pitanje.tekst_odgovora.map((entry, index) => (
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
              data={pitanje.tekst_odgovora}
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
