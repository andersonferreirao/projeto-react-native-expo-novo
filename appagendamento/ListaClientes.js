import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const ListaClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadClientes();
  }, []);

  const loadClientes = async () => {
    try {
      const agendamentosSalvos = await AsyncStorage.getItem('agendamentos');
      const agendamentos = agendamentosSalvos ? JSON.parse(agendamentosSalvos) : [];
      const clientesAgendados = agendamentos.map((agendamento) => ({
        nomeCliente: agendamento.nomeCliente,
        telefone: agendamento.telefone,
      }));
      setClientes(clientesAgendados);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    }
  };

  const filteredClientes = clientes.filter((cliente) =>
    cliente.nomeCliente.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Pesquisar Cliente"
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />
      <FlatList
        data={filteredClientes}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.clienteItem}>
            <Text>{`Nome: ${item.nomeCliente}`}</Text>
            <Text>{`Telefone: ${item.telefone}`}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>Nenhum cliente encontrado.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
  },
  clienteItem: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 16,
  },
});

export default ListaClientes;
