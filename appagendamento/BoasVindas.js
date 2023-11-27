import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Share } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useFocusEffect } from '@react-navigation/native';

const BoasVindas = ({ navigation }) => {
  const [nomeEstabelecimentoCadastrado, setNomeEstabelecimentoCadastrado] = useState('');
  const [cnpjCadastrado, setCnpjCadastrado] = useState('');
  const [, forceUpdate] = useState(); // Utilizando um array destructuring para obter a função de forceUpdate

  const checkCadastro = async () => {
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
  };

  useFocusEffect(
    React.useCallback(() => {
      checkCadastro();
    }, [])
  );

  const handleOkClick = () => {
    navigation.navigate('Cadastro');
  };

  const handleEditarClick = () => {
    navigation.navigate('EditarCadastro');
  };

  const handleCadColaboradorClick = () => {
    navigation.navigate('CadastroColaborador');
  };

  const handleVisualizarAgendamentoClick = () => {
    navigation.navigate('VisualizarAgendamentos');
  };

  const handleRestaurarPadroesClick = async () => {
    Alert.alert(
      'Restaurar Padrões',
      'Tem certeza de que deseja apagar todos os dados e restaurar aos padrões iniciais?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Confirmar',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              navigation.replace('BoasVindas');
            } catch (error) {
              console.error('Erro ao restaurar os padrões:', error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleBackupClick = async () => {
    try {
      const allData = await AsyncStorage.getAllKeys();
      const dataToBackup = await AsyncStorage.multiGet(allData);

      const tempFilePath = `${FileSystem.documentDirectory}backup.json`;
      await FileSystem.writeAsStringAsync(tempFilePath, JSON.stringify(dataToBackup));

      await Share.share({
        title: 'Backup do App',
        message: 'Aqui está o backup do seu aplicativo.',
        url: `file://${tempFilePath}`,
      });

      Alert.alert('Backup Criado', 'O backup foi criado com sucesso e está pronto para ser compartilhado.');
    } catch (error) {
      console.error('Erro ao criar o backup:', error);
    }
  };

  const handleRestoreBackupClick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'application/json' });

      if (result.type === 'success') {
        const { uri } = result;
        const fileContent = await FileSystem.readAsStringAsync(uri);
        const dataToRestore = JSON.parse(fileContent);

        await AsyncStorage.multiSet(dataToRestore);

        Alert.alert('Backup Restaurado', 'O backup foi restaurado com sucesso.');
        navigation.replace('BoasVindas');

        
        // Forçar uma atualização para recarregar a página
        forceUpdate({});
      } else {
        console.log('User cancelled document picker');
      }
    } catch (error) {
      console.error('Erro ao restaurar o backup:', error);
      Alert.alert('Erro', 'Erro ao restaurar o backup.');
    }
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
        <Text style={styles.description}>
          Vamos Começar o cadastro do seu estabelecimento? Vai levar 5 minutinhos, só seu nome e CNPJ!
        </Text>
      ) : null}
      <TouchableOpacity style={styles.button} onPress={handleOkClick}>
        <Text style={styles.buttonText}>Agendar</Text>
      </TouchableOpacity>
      {nomeEstabelecimentoCadastrado ? (
        <TouchableOpacity style={styles.editButton} onPress={handleEditarClick}>
          <Text style={styles.editButtonText}>Editar Cadastro</Text>
        </TouchableOpacity>
      ) : null}
      <TouchableOpacity style={styles.additionalButton} onPress={handleCadColaboradorClick}>
        <Text style={styles.buttonText}>Cadastro de Colaborador</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.additionalButton} onPress={handleVisualizarAgendamentoClick}>
        <Text style={styles.buttonText}>Visualizar Agendamentos</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.additionalButton} onPress={handleRestaurarPadroesClick}>
        <Text style={styles.buttonText}>Restaurar Padrões</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.additionalButton} onPress={handleBackupClick}>
        <Text style={styles.buttonText}>Fazer Backup</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.additionalButton} onPress={handleRestoreBackupClick}>
        <Text style={styles.buttonText}>Restaurar Backup</Text>
      </TouchableOpacity>
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
    marginBottom: 32,
  },
  additionalButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 5,
    marginBottom: 16,
  },
  editButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default BoasVindas;
