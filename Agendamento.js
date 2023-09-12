import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInputMask } from 'react-native-masked-text'; // Importe a biblioteca

const Agendamento = ({ route, navigation }) => {
  const { nomeEstabelecimento, cnpj, ramoAtividade, servicos } = route.params;
  const [nomeCliente, setNomeCliente] = useState('');
  const [cpf, setCpf] = useState('');
  const [data, setData] = useState('');
  const [horario, setHorario] = useState('');
  const [servicoSelecionado, setServicoSelecionado] = useState('');
  const [outroServico, setOutroServico] = useState(''); // Estado para o serviço personalizado

  const handleAgendarServico = async () => {
    if (!nomeCliente || !cpf || !data || !horario || !servicoSelecionado) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios.');
      return;
    }

    // Crie um objeto para representar o agendamento
    const agendamento = {
      nomeCliente,
      cpf,
      data,
      horario,
      servicoSelecionado: servicoSelecionado === 'Outro' ? outroServico : servicoSelecionado,
    };

    try {
      // Recupere os agendamentos existentes do AsyncStorage
      const agendamentosSalvos = await AsyncStorage.getItem('agendamentos');
      const agendamentos = agendamentosSalvos ? JSON.parse(agendamentosSalvos) : [];

      // Adicione o novo agendamento à lista de agendamentos
      agendamentos.push(agendamento);

      // Salve a lista atualizada de agendamentos no AsyncStorage
      await AsyncStorage.setItem('agendamentos', JSON.stringify(agendamentos));

      // Limpar campos após o agendamento
      setNomeCliente('');
      setCpf('');
      setData('');
      setHorario('');
      setServicoSelecionado('');
      setOutroServico('');

      // Exibir mensagem de sucesso
      Alert.alert('Sucesso', 'Agendamento realizado com sucesso.');

      // Navegar para a tela de visualização de agendamentos
      navigation.navigate('VisualizarAgendamentos');
    } catch (error) {
      console.error('Erro ao salvar o agendamento:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Agendamento de Serviço</Text>
      <Text>Nome do Estabelecimento: {nomeEstabelecimento}</Text>
      <Text>CNPJ: {cnpj || 'Não informado'}</Text>
      <Text>Nome do Cliente:</Text>
      <TextInput
        value={nomeCliente}
        onChangeText={setNomeCliente}
        placeholder="Informe o nome do cliente"
        style={styles.input}
      />
      <Text>CPF:</Text>
      <TextInputMask
        type={'cpf'} // Especifique o tipo de máscara como CPF
        value={cpf}
        onChangeText={text => {
          setCpf(text);
        }}
        placeholder="Informe o CPF do cliente"
        style={styles.input}
      />
      <Text>Data:</Text>
      <TextInputMask
        type={'datetime'} // Especifique o tipo de máscara como data e hora
        options={{
          format: 'DD/MM/YYYY',
        }}
        value={data}
        onChangeText={text => {
          setData(text);
        }}
        placeholder="Informe a data do serviço (DD/MM/AAAA)"
        style={styles.input}
      />
      <Text>Horário:</Text>
      <TextInput
        value={horario}
        onChangeText={setHorario}
        placeholder="Informe o horário do serviço"
        style={styles.input}
      />
      <Text>Serviço:</Text>
      {servicos.length > 0 ? (
        servicos.map((servicoOpcao) => (
          <TouchableOpacity
            key={servicoOpcao}
            style={[styles.button, servicoOpcao === servicoSelecionado && styles.selectedButton]}
            onPress={() => setServicoSelecionado(servicoOpcao)}
          >
            <Text style={[styles.buttonText, servicoOpcao === servicoSelecionado && styles.selectedButtonText]}>{servicoOpcao}</Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text>Nenhum serviço disponível.</Text>
      )}
      {/* Botão "Outro" para adicionar um serviço personalizado */}
      <TouchableOpacity
        style={[styles.button, servicoSelecionado === 'Outro' && styles.selectedButton]}
        onPress={() => setServicoSelecionado('Outro')}
      >
        <Text style={[styles.buttonText, servicoSelecionado === 'Outro' && styles.selectedButtonText]}>Outro</Text>
      </TouchableOpacity>
      {/* Caixa de texto para o serviço personalizado */}
      {servicoSelecionado === 'Outro' && (
        <TextInput
          value={outroServico}
          onChangeText={setOutroServico}
          placeholder="Informe o serviço personalizado"
          style={styles.input}
        />
      )}
      <Text>Serviço Selecionado: {servicoSelecionado || 'Nenhum'}</Text>
      <TouchableOpacity style={styles.agendarButton} onPress={handleAgendarServico}>
        <Text style={styles.agendarButtonText}>Agendar Serviço</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.visualizarButton}
        onPress={() => navigation.navigate('VisualizarAgendamentos')}
      >
        <Text style={styles.visualizarButtonText}>Visualizar Agendamentos</Text>
      </TouchableOpacity>
    </ScrollView>
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
  button: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginBottom: 8,
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
  agendarButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 16,
  },
  agendarButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  visualizarButton: {
    backgroundColor: '#333',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 16,
  },
  visualizarButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Agendamento;
