import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, ScrollView } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Share } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useFocusEffect } from '@react-navigation/native';

const BoasVindas = ({ navigation, route }) => {
  const [nomeEstabelecimento, setNomeEstabelecimentoCadastrado] = useState('');
  const [cnpjCadastrado, setCnpjCadastrado] = useState('');
  const [logoUrl, setLogoUrl] = useState('');

  const checkCadastro = async () => {
    try {
      const nomeEstabelecimento = await AsyncStorage.getItem('nomeEstabelecimento');
      const logoUrl = await AsyncStorage.getItem('logoUrl');

      if (nomeEstabelecimento) {
        setNomeEstabelecimentoCadastrado(nomeEstabelecimento);
        setLogoUrl(logoUrl || ''); // Define o URL do logotipo no estado
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

  const servicosPorRamo = {
    'Oficina Mecânica': ['Troca de Óleo', 'Troca de Pneu', 'Revisão', 'Balanceamento'],
    'Escritório Contábil': ['Contabilidade', 'Consultoria Financeira'],
    'Advocacia': ['Consultoria Jurídica', 'Assessoria Legal'],
    'Salão de Beleza': ['Corte de Cabelo', 'Manicure', 'Pedicure'],
  };

  const handleOkClick = async () => {
    if (nomeEstabelecimento) {
      try {
        const nomeSalvo = await AsyncStorage.getItem('nomeEstabelecimento');
        const cnpjSalvo = await AsyncStorage.getItem('cnpj');
        const ramoSalvo = await AsyncStorage.getItem('ramoAtividade');

        if (nomeSalvo && ramoSalvo) {
          const servicos = servicosPorRamo && servicosPorRamo[ramoSalvo] ? servicosPorRamo[ramoSalvo] : [];
          navigation.navigate('Agendamento', {
            nomeEstabelecimento: nomeSalvo,
            cnpj: cnpjSalvo || '',
            ramoAtividade: ramoSalvo,
            servicos: servicos,
          });
        }
      } catch (error) {
        console.error('Erro ao obter os serviços:', error);
      }
    } else {
      navigation.navigate('Cadastro');
    }
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
      } else {
        console.log('User cancelled document picker');
      }
    } catch (error) {
      console.error('Erro ao restaurar o backup:', error);
      Alert.alert('Erro', 'Erro ao restaurar o backup.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          {logoUrl && <Image source={{ uri: logoUrl }} style={styles.logo} />}
        </View>
        <Text style={styles.title}>
          {nomeEstabelecimento
            ? `Bem-Vindo Novamente\n"${nomeEstabelecimento}"`
            : 'Bem-vindo à nossa aplicação!'}
        </Text>
        {cnpjCadastrado ? (
          <Text style={styles.cnpj}>CNPJ: {cnpjCadastrado}</Text>
        ) : null}
        {!nomeEstabelecimento ? (
          <Text style={styles.description}>
            Vamos começar o cadastro do seu estabelecimento? Vai levar 5 minutinhos, só seu nome e CNPJ!
          </Text>
        ) : null}
        {(!nomeEstabelecimento) ? (
          <>
            <TouchableOpacity style={styles.button} onPress={handleOkClick}>
              <Text style={styles.buttonText}>Cadastrar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.additionalButton} onPress={handleRestoreBackupClick}>
              <Text style={styles.buttonText}>Restaurar Backup</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity style={styles.button} onPress={handleOkClick}>
              <Text style={styles.buttonText}>
                {nomeEstabelecimento ? 'Agendar' : 'Cadastrar'}
              </Text>
            </TouchableOpacity>

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
            <TouchableOpacity style={styles.editButton} onPress={handleEditarClick}>
              <Text style={styles.editButtonText}>Editar Cadastro</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logoContainer: {
    borderRadius: 75, // metade do tamanho da largura e altura do logo
    overflow: 'hidden',
    marginBottom: 16,
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  cnpj: {
    fontSize: 15,
    marginBottom: 8,
    color: '#333',
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    marginBottom: 32,
    color: '#666',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007BFF',
    width: 200, // Ajuste o valor conforme necessário
    height: 40, // Ajuste o valor conforme necessário
    borderRadius: 5,
    marginBottom: 16,
    justifyContent: 'center', // Para centralizar o texto verticalmente
    alignItems: 'center', // Para centralizar o texto horizontalmente
  },
  buttonText: {
    fontSize: 15,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  editButton: {
    backgroundColor: '#333',
    width: 200, // Ajuste o valor conforme necessário
    height: 40, // Ajuste o valor conforme necessário
    borderRadius: 5,
    marginBottom: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  additionalButton: {
    backgroundColor: '#007BFF',
    width: 200, // Ajuste o valor conforme necessário
    height: 40, // Ajuste o valor conforme necessário
    borderRadius: 5,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default BoasVindas;