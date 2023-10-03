import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

const EditarAgendamento = ({ route, navigation }) => {
  const { agendamentoEditado, index } = route.params;
  const [nomeCliente, setNomeCliente] = useState(agendamentoEditado.nomeCliente);
  const [cpf, setCpf] = useState(agendamentoEditado.cpf);
  const [data, setData] = useState(agendamentoEditado.data);
  const [horario, setHorario] = useState(agendamentoEditado.horario);
  const [servicoSelecionado, setServicoSelecionado] = useState(agendamentoEditado.servicoSelecionado);
  const [colaboradorSelecionado, setColaboradorSelecionado] = useState(agendamentoEditado.colaborador);
  const [colaboradores, setColaboradores] = useState([]); // Lista de colaboradores

  // Carregar a lista de colaboradores do AsyncStorage
  const loadColaboradores = async () => {
    try {
      const colaboradoresSalvos = await AsyncStorage.getItem('colaboradores');
      if (colaboradoresSalvos) {
        setColaboradores(JSON.parse(colaboradoresSalvos));
      }
    } catch (error) {
      console.error('Erro ao carregar os colaboradores:', error);
    }
  };

  useEffect(() => {
    loadColaboradores(); // Carregar a lista de colaboradores ao montar o componente
  }, []);

  const handleEditarAgendamento = async () => {
    if (!nomeCliente || !cpf || !data || !horario || !servicoSelecionado || !colaboradorSelecionado) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios.');
      return;
    }

    const agendamentoAtualizado = {
      nomeCliente,
      cpf,
      data,
      horario,
      servicoSelecionado,
      colaborador: colaboradorSelecionado,
    };

    try {
      const agendamentosSalvos = await AsyncStorage.getItem('agendamentos');
      const agendamentos = agendamentosSalvos ? JSON.parse(agendamentosSalvos) : [];
      agendamentos[index] = agendamentoAtualizado;

      await AsyncStorage.setItem('agendamentos', JSON.stringify(agendamentos));

      Alert.alert('Sucesso', 'Agendamento atualizado com sucesso.');

      navigation.navigate('VisualizarAgendamentos');
    } catch (error) {
      console.error('Erro ao atualizar o agendamento:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Agendamento</Text>
      <Text>Nome do Cliente:</Text>
      <TextInput
        value={nomeCliente}
        onChangeText={setNomeCliente}
        placeholder="Informe o nome do cliente"
        style={styles.input}
      />
      <Text>CPF:</Text>
      <TextInput
        value={cpf}
        onChangeText={setCpf}
        placeholder="Informe o CPF do cliente"
        style={styles.input}
      />
      <Text>Data:</Text>
      <TextInput
        value={data}
        onChangeText={setData}
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
      <TextInput
        value={servicoSelecionado}
        onChangeText={setServicoSelecionado}
        placeholder="Informe o serviço"
        style={styles.input}
      />
      <Text>Colaborador:</Text>
      <Picker
        selectedValue={colaboradorSelecionado}
        onValueChange={(itemValue) => setColaboradorSelecionado(itemValue)}
      >
        <Picker.Item label="Selecione um colaborador" value="" />
        {colaboradores.map((colaborador) => (
          <Picker.Item key={colaborador.nome} label={colaborador.nome} value={colaborador.nome} />
        ))}
      </Picker>
      <TouchableOpacity style={styles.salvarButton} onPress={handleEditarAgendamento}>
        <Text style={styles.salvarButtonText}>Salvar Edição</Text>
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
  salvarButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 16,
  },
  salvarButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default EditarAgendamento;
