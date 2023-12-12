import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInputMask } from 'react-native-masked-text';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect } from '@react-navigation/native';

const Agendamento = ({ route, navigation }) => {
  const { nomeEstabelecimento, cnpj, ramoAtividade, servicos } = route.params;
  const [nomeCliente, setNomeCliente] = useState('');
  const [telefone, setTelefone] = useState('');
  const [data, setData] = useState('');
  const [horario, setHorario] = useState('');
  const [servicoSelecionado, setServicoSelecionado] = useState('');
  const [outroServico, setOutroServico] = useState('');
  const [colaboradores, setColaboradores] = useState([]);
  const [colaboradorSelecionado, setColaboradorSelecionado] = useState('');
  const [descricaoServico, setDescricaoServico] = useState('');

  const checkDuplicateAppointment = async (agendamento) => {
    try {
      const agendamentosSalvos = await AsyncStorage.getItem('agendamentos');
      const agendamentos = agendamentosSalvos ? JSON.parse(agendamentosSalvos) : [];

      const isDuplicate = agendamentos.some((existingAgendamento) => {
        return (
          existingAgendamento.data === agendamento.data &&
          existingAgendamento.horario === agendamento.horario
        );
      });

      if (isDuplicate) {
        Alert.alert('Aviso', 'Já existe um agendamento no mesmo dia e horário.');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao verificar agendamentos duplicados:', error);
      return false;
    }
  };

  const handleAgendarServico = async () => {
    if (!nomeCliente || !telefone || !data || !horario) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios.');
      return;
    }

    if (!colaboradorSelecionado) {
      Alert.alert('Erro', 'Por favor, selecione um colaborador para o serviço.');
      return;
    }

   const agendamento = {
  nomeCliente,
  telefone,
  data,
  horario,
  servicoSelecionado,
  colaborador: colaboradorSelecionado,
  descricaoServico,
};


    const isNotDuplicate = await checkDuplicateAppointment(agendamento);

    if (isNotDuplicate) {
      try {
        const agendamentosSalvos = await AsyncStorage.getItem('agendamentos');
        const agendamentos = agendamentosSalvos ? JSON.parse(agendamentosSalvos) : [];
        agendamentos.push(agendamento);
        await AsyncStorage.setItem('agendamentos', JSON.stringify(agendamentos));
        setNomeCliente('');
        setTelefone('');
        setData('');
        setHorario('');
        setServicoSelecionado('');
        setOutroServico('');
        setColaboradorSelecionado('');
        setDescricaoServico('');
        Alert.alert('Sucesso', 'Agendamento realizado com sucesso.');
        navigation.navigate('VisualizarAgendamentos');
      } catch (error) {
        console.error('Erro ao salvar o agendamento:', error);
      }
    }
  };

  const handleNavigateToCadastroColaborador = () => {
    navigation.navigate('CadastroColaborador');
  };

  const loadColaboradores = async () => {
    try {
      const colaboradoresSalvos = await AsyncStorage.getItem('colaboradores');
      if (colaboradoresSalvos) {
        const colaboradoresArray = JSON.parse(colaboradoresSalvos);
        setColaboradores(colaboradoresArray);
      }
    } catch (error) {
      console.error('Erro ao carregar colaboradores:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadColaboradores();
    }, [])
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
      <Text>Telefone:</Text>
      <TextInputMask
        type={'cel-phone'}
        options={{
          maskType: 'BRL',
          withDDD: true,
          dddMask: '(99) ',
        }}
        value={telefone}
        onChangeText={(text) => {
          setTelefone(text);
        }}
        placeholder="Informe o Telefone do cliente"
        style={styles.input}
      />
      <Text>Data:</Text>
      <TextInputMask
        type={'datetime'}
        options={{
          format: 'DD/MM/YYYY',
        }}
        value={data}
        onChangeText={(text) => {
          setData(text);
        }}
        placeholder="Informe a data do serviço (DD/MM/AAAA)"
        style={styles.input}
      />
      <Text>Horário:</Text>
      <TextInputMask
        type={'datetime'}
        options={{
          format: 'HH:mm',
        }}
        value={horario}
        onChangeText={(text) => {
          setHorario(text);
        }}
        placeholder="Informe o horário do serviço"
        style={styles.input}
      />
     <Text>Serviço:</Text>
{servicos.length > 0 ? (
  <Picker
    selectedValue={servicoSelecionado}
    onValueChange={(itemValue) => setServicoSelecionado(itemValue)}
    style={styles.input}
  >
    <Picker.Item label="Selecione um serviço" value="" />
    {servicos.map((servicoOpcao) => (
      <Picker.Item key={servicoOpcao} label={servicoOpcao} value={servicoOpcao} />
    ))}
    <Picker.Item label="Outro" value="Outro" />
  </Picker>
) : (
  <Text>Nenhum serviço disponível.</Text>
)}


      {servicoSelecionado === 'Outro' && (
        <View style={styles.inputContainer}>
          <Text>Descrição do Serviço:</Text>
          <TextInput
            value={outroServico}
            onChangeText={setOutroServico}
            placeholder="Informe o serviço personalizado"
            style={styles.input}
          />
        </View>
      )}

      <Text>Descrição do Serviço (opcional):</Text>
      <TextInput
        value={descricaoServico}
        onChangeText={setDescricaoServico}
        placeholder="Informe a descrição do serviço (opcional)"
        style={styles.input}
      />

      <Text>Colaborador:</Text>
      <Picker
        selectedValue={colaboradorSelecionado}
        onValueChange={(itemValue) => setColaboradorSelecionado(itemValue)}
        style={styles.input}
      >
        <Picker.Item label="Selecione um colaborador" value="" />
        {colaboradores.map((colaborador) => (
          <Picker.Item key={colaborador.nome} label={colaborador.nome} value={colaborador.nome} />
        ))}
      </Picker>

      <TouchableOpacity style={styles.button} onPress={handleAgendarServico}>
        <Text style={styles.buttonText}>Agendar Serviço</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.navigate('VisualizarAgendamentos')}
      >
        <Text style={styles.buttonText}>Visualizar Agendamentos</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.tertiaryButton}
        onPress={handleNavigateToCadastroColaborador}
      >
        <Text style={styles.buttonText}>Cadastrar Colaborador</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
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
    width: '75%',
  },
  inputContainer: {
    marginBottom: 16,
    width: '75%',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 16,
    width: '75%',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#333',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 8,
    width: '75%',
  },
  tertiaryButton: {
    backgroundColor: '#33CC33',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 8,
    width: '75%',
  },
});

export default Agendamento;
