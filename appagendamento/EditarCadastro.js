import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInputMask } from 'react-native-masked-text'; // Importe a biblioteca

const EditarCadastro = ({ navigation }) => {
  const [nomeEstabelecimento, setNomeEstabelecimento] = useState('');
  const [cnpj, setCnpj] = useState('');

  useEffect(() => {
    async function loadCadastro() {
      try {
        // Carregar nome e CNPJ do AsyncStorage, se existirem
        const nome = await AsyncStorage.getItem('nomeEstabelecimento');
        const cnpj = await AsyncStorage.getItem('cnpj');
        if (nome && cnpj) {
          setNomeEstabelecimento(nome);
          setCnpj(cnpj);
        }
      } catch (error) {
        console.error('Erro ao carregar o cadastro:', error);
      }
    }

    loadCadastro();
  }, []);

  const handleSalvarCadastro = async () => {
    try {
      // Validar os campos
      if (!nomeEstabelecimento) {
        Alert.alert('Erro', 'O nome do estabelecimento é obrigatório.');
        return;
      }

      // Salvar as informações no AsyncStorage
      await AsyncStorage.setItem('nomeEstabelecimento', nomeEstabelecimento);
      if (cnpj) {
        await AsyncStorage.setItem('cnpj', cnpj);
      } else {
        // Se o CNPJ estiver vazio, remova-o do AsyncStorage
        await AsyncStorage.removeItem('cnpj');
      }

      // Navegar de volta para a tela de boas-vindas
      navigation.navigate('BoasVindas');
    } catch (error) {
      console.error('Erro ao salvar o cadastro:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Cadastro</Text>
      <Text>Nome do Estabelecimento:</Text>
      <TextInput
        value={nomeEstabelecimento}
        onChangeText={setNomeEstabelecimento}
        placeholder="Informe o nome do estabelecimento"
        style={styles.input}
      />
      <Text>CNPJ:</Text>
      <TextInputMask
        type={'cnpj'} // Especifique o tipo de máscara como CNPJ
        value={cnpj}
        onChangeText={text => {
          setCnpj(text);
        }}
        placeholder="Informe o CNPJ (opcional)"
        style={styles.input}
      />
      <Button title="Salvar Cadastro" onPress={handleSalvarCadastro} />
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
});

export default EditarCadastro;
