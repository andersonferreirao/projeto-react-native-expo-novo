import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CadastroColaborador = () => {
  const [nomeColaborador, setNomeColaborador] = useState('');
  const [cpfColaborador, setCpfColaborador] = useState('');

  const handleSaveColaborador = async () => {
    if (!nomeColaborador) {
      Alert.alert('Erro', 'Coloque o nome do Colaborador.');
      return;
    }

    // Crie um objeto para representar o colaborador
    const colaborador = { nome: nomeColaborador, cpf: cpfColaborador };

    try {
      // Recupere os colaboradores existentes do AsyncStorage
      const colaboradoresSalvos = await AsyncStorage.getItem('colaboradores');
      const colaboradores = colaboradoresSalvos ? JSON.parse(colaboradoresSalvos) : [];

      // Adicione o novo colaborador à lista de colaboradores
      colaboradores.push(colaborador);

      // Salve a lista atualizada de colaboradores no AsyncStorage
      await AsyncStorage.setItem('colaboradores', JSON.stringify(colaboradores));

      setNomeColaborador('');
      setCpfColaborador('');
      Alert.alert('Sucesso', 'Colaborador cadastrado com sucesso.');
    } catch (error) {
      console.error('Erro ao salvar o colaborador:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de Colaborador</Text>
      <Text>Nome do Colaborador:</Text>
      <TextInput
        value={nomeColaborador}
        onChangeText={setNomeColaborador}
        placeholder="Informe o nome do colaborador"
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={handleSaveColaborador}>
        <Text style={styles.buttonText}>Cadastrar Colaborador</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,

  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CadastroColaborador;
