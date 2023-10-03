import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInputMask } from 'react-native-masked-text'; // Importe a biblioteca

const Cadastro = ({ navigation }) => {
  const [nomeEstabelecimento, setNomeEstabelecimento] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [ramoAtividade, setRamoAtividade] = useState('');
  const [servicos, setServicos] = useState([]);

  const tiposEstabelecimento = [
    'Escritório Contábil',
    'Advocacia',
    'Salão de Beleza',
    'Oficina Mecânica',
  ];

  const servicosPorRamo = {
    'Oficina Mecânica': ['Troca de Óleo', 'Troca de Pneu', 'Revisão', 'Balanceamento'],
    'Escritório Contábil': ['Contabilidade', 'Consultoria Financeira'],
    'Advocacia': ['Consultoria Jurídica', 'Assessoria Legal'],
    'Salão de Beleza': ['Corte de Cabelo', 'Manicure', 'Pedicure'],
  };

  useEffect(() => {
    const checkCadastroSalvo = async () => {
      try {
        const nomeSalvo = await AsyncStorage.getItem('nomeEstabelecimento');
        const cnpjSalvo = await AsyncStorage.getItem('cnpj');
        const ramoSalvo = await AsyncStorage.getItem('ramoAtividade');

        if (nomeSalvo && ramoSalvo) {
          navigation.navigate('Agendamento', {
            nomeEstabelecimento: nomeSalvo,
            cnpj: cnpjSalvo || '',
            ramoAtividade: ramoSalvo,
            servicos: servicosPorRamo[ramoSalvo] || [],
          });
        }
      } catch (error) {
        console.error('Erro ao verificar o cadastro salvo:', error);
      }
    };

    checkCadastroSalvo();
  }, []);

  const handleFinalizarCadastro = async () => {
    if (!nomeEstabelecimento) {
      Alert.alert('Erro', 'O nome do estabelecimento é obrigatório.');
      return;
    }

    // Salvar os dados no AsyncStorage
    try {
      await AsyncStorage.setItem('nomeEstabelecimento', nomeEstabelecimento);
      await AsyncStorage.setItem('cnpj', cnpj);
      await AsyncStorage.setItem('ramoAtividade', ramoAtividade);
    } catch (error) {
      console.error('Erro ao salvar os dados no AsyncStorage:', error);
    }

    navigation.navigate('Agendamento', {
      nomeEstabelecimento,
      cnpj,
      ramoAtividade,
      servicos: servicosPorRamo[ramoAtividade] || [],
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de Estabelecimento</Text>
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
      <Text>Ramo de Atividade:</Text>
      <View style={styles.buttonContainer}>
        {tiposEstabelecimento.map((tipo) => (
          <TouchableOpacity
            key={tipo}
            style={[styles.button, tipo === ramoAtividade && styles.selectedButton]}
            onPress={() => {
              setRamoAtividade(tipo);
              setServicos(servicosPorRamo[tipo] || []);
            }}
          >
            <Text style={[styles.buttonText, tipo === ramoAtividade && styles.selectedButtonText]}>{tipo}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.finalizarButton} onPress={handleFinalizarCadastro}>
        <Text style={styles.finalizarButtonText}>Finalizar Cadastro</Text>
      </TouchableOpacity>
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  button: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#007BFF',
  },
  buttonText: {
    fontSize: 16,
    color: '#333',
  },
  selectedButtonText: {
    color: '#fff',
  },
  finalizarButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 16,
  },
  finalizarButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Cadastro;
