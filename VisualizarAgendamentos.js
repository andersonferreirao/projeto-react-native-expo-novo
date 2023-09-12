import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const VisualizarAgendamentos = () => {
  const [agendamentos, setAgendamentos] = useState([]);

  useEffect(() => {
    async function carregarAgendamentos() {
      try {
        const agendamentosSalvos = await AsyncStorage.getItem('agendamentos');
        if (agendamentosSalvos) {
          setAgendamentos(JSON.parse(agendamentosSalvos));
        }
      } catch (error) {
        console.error('Erro ao carregar os agendamentos:', error);
      }
    }

    carregarAgendamentos();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agendamentos</Text>
      {agendamentos.length > 0 ? (
        <FlatList
          data={agendamentos}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.agendamento}>
              <Text>Cliente: {item.nomeCliente}</Text>
              <Text>CPF: {item.cpf}</Text>
              <Text>Data: {item.data}</Text>
              <Text>Horário: {item.horario}</Text>
              <Text>Serviço: {item.servicoSelecionado}</Text>
            </View>
          )}
        />
      ) : (
        <Text>Nenhum agendamento encontrado.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  agendamento: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 16,
    marginBottom: 16,
  },
});

export default VisualizarAgendamentos;
