import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BoasVindas = ({ navigation }) => {
  const [nomeEstabelecimentoCadastrado, setNomeEstabelecimentoCadastrado] = useState('');
  const [cnpjCadastrado, setCnpjCadastrado] = useState('');

  useEffect(() => {
    async function checkCadastro() {
      try {
        const nomeEstabelecimento = await AsyncStorage.getItem('nomeEstabelecimento');
        if (nomeEstabelecimento) {
          setNomeEstabelecimentoCadastrado(nomeEstabelecimento);
          const cnpj = await AsyncStorage.getItem('cnpj');
          if (cnpj) {
            setCnpjCadastrado(cnpj);
          }
        }
      } catch (error) {
        console.error('Erro ao verificar o cadastro salvo:', error);
      }
    }

    checkCadastro().then(() => {
      // Verificar se a empresa já está cadastrada e redirecionar para Agendamento automaticamente
      if (nomeEstabelecimentoCadastrado) {
        navigation.replace('Agendamento');
      }
    });
  }, []);

  const handleOkClick = () => {
    navigation.navigate('Cadastro');
  };

  const handleEditarClick = () => {
    navigation.navigate('EditarCadastro');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {nomeEstabelecimentoCadastrado
          ? `Bem-Vindo Novamente\n"${nomeEstabelecimentoCadastrado}"`
          : 'Bem-vindo à nossa aplicação!'}
      </Text>
      {cnpjCadastrado ? (
        <Text style={styles.cnpj}>CNPJ: {cnpjCadastrado}</Text>
      ) : null}
      {!nomeEstabelecimentoCadastrado ? (
        <Text style={styles.description}>Vamos Começar o cadastro do seu estabelecimento? Vai levar 5 minutinhos, só seu nome e CNPJ!</Text>
      ) : null}
      <TouchableOpacity style={styles.button} onPress={handleOkClick}>
        <Text style={styles.buttonText}>Começar</Text>
      </TouchableOpacity>
      {nomeEstabelecimentoCadastrado ? (
        <TouchableOpacity style={styles.editButton} onPress={handleEditarClick}>
          <Text style={styles.editButtonText}>Editar Cadastro</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  cnpj: {
    fontSize: 18,
    marginBottom: 8,
    color: '#333',
    textAlign: 'center',
  },
  description: {
    fontSize: 18,
    marginBottom: 32,
    color: '#666',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 5,
    marginBottom: 16,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: '#333',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 5,
    marginBottom: 32, // Aumente essa margem inferior
  },
  editButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default BoasVindas;
