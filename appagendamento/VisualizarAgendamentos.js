import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Clipboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar } from 'react-native-calendars';
import { format, parse } from 'date-fns';

const VisualizarAgendamentos = ({ navigation }) => {
  const [agendamentos, setAgendamentos] = useState([]);
  const [verFavoritos, setVerFavoritos] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [agendamentosExibidos, setAgendamentosExibidos] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState('TODOS'); // Adicionado estado para o filtro de status

  const loadAgendamentos = useCallback(async () => {
    try {
      const agendamentosSalvos = await AsyncStorage.getItem('agendamentos');
      if (agendamentosSalvos) {
        setAgendamentos(JSON.parse(agendamentosSalvos));
      }
    } catch (error) {
      console.error('Erro ao carregar os agendamentos:', error);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadAgendamentos();
    });

    return unsubscribe;
  }, [navigation, loadAgendamentos]);

  const handleExcluirAgendamento = (index) => {
    Alert.alert(
      'Excluir Agendamento',
      'Tem certeza de que deseja excluir este agendamento?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Confirmar',
          onPress: () => {
            const novosAgendamentos = [...agendamentos];
            novosAgendamentos.splice(index, 1);
            setAgendamentos(novosAgendamentos);
            salvarAgendamentos(novosAgendamentos);
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleEditarAgendamento = (index) => {
    const agendamentoEditado = agendamentos[index];
    navigation.navigate('EditarAgendamento', { agendamentoEditado, index });
  };

  const toggleFavorito = (index) => {
    const novosAgendamentos = [...agendamentos];
    novosAgendamentos[index].favorito = !novosAgendamentos[index].favorito;
    setAgendamentos(novosAgendamentos);
    salvarAgendamentos(novosAgendamentos);
  };

  const toggleMarcado = (index) => {
    const novosAgendamentos = [...agendamentos];
    novosAgendamentos[index].marcado = !novosAgendamentos[index].marcado;
    setAgendamentos(novosAgendamentos);
    salvarAgendamentos(novosAgendamentos);
  };

  const salvarAgendamentos = async (novosAgendamentos) => {
    try {
      await AsyncStorage.setItem('agendamentos', JSON.stringify(novosAgendamentos));
    } catch (error) {
      console.error('Erro ao salvar os agendamentos:', error);
    }
  };

  const handleDayPress = (day) => {
    setShowCalendar(false);
    setSelectedDate(format(parse(day.dateString, 'yyyy-MM-dd', new Date()), 'dd/MM/yyyy'));

    const agendamentosMarcados = agendamentos.map((agendamento) => ({
      ...agendamento,
      marcado: agendamento.data === selectedDate,
    }));
    setAgendamentos(agendamentosMarcados);
    salvarAgendamentos(agendamentosMarcados);
  };

  const formatarDataBrasileira = (data) => {
    if (data instanceof Date) {
      const day = data.getDate().toString().padStart(2, '0');
      const month = (data.getMonth() + 1).toString().padStart(2, '0');
      const year = data.getFullYear();
      return `${day}/${month}/${year}`;
    } else {
      return data;
    }
  };

  useEffect(() => {
    let agendamentosFiltrados = [];

    if (selectedDate) {
      agendamentosFiltrados = agendamentos.filter((agendamento) => agendamento.data === selectedDate);
    } else if (verFavoritos) {
      agendamentosFiltrados = agendamentos.filter((agendamento) => agendamento.favorito);
    } else {
      agendamentosFiltrados = agendamentos;
    }

    // Aplicar filtro de status
    if (filtroStatus === 'AGENDADOS') {
      agendamentosFiltrados = agendamentosFiltrados.filter((agendamento) => !agendamento.marcado);
    } else if (filtroStatus === 'FINALIZADOS') {
      agendamentosFiltrados = agendamentosFiltrados.filter((agendamento) => agendamento.marcado);
    }

    // Ordenar agendamentos por nome do cliente
    agendamentosFiltrados.sort((a, b) => a.nomeCliente.localeCompare(b.nomeCliente));

    setAgendamentosExibidos(agendamentosFiltrados);
  }, [selectedDate, verFavoritos, agendamentos, filtroStatus]);

  const handleCopyToClipboard = (texto) => {
    Clipboard.setString(texto);
    Alert.alert('Copiado para a Área de Transferência', 'Os dados foram copiados para a área de transferência.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agendamentos</Text>
      <TouchableOpacity onPress={() => setVerFavoritos(!verFavoritos)}>
        <Text style={styles.botaoAlternar}>
          {verFavoritos ? 'Ver Todos' : 'Ver Favoritos'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setShowCalendar(true)}>
        <Text style={styles.botaoFiltrar}>Escolher Data</Text>
      </TouchableOpacity>
      <View style={styles.filtroStatusContainer}>
        <TouchableOpacity
          style={[styles.botaoFiltroStatus, { backgroundColor: filtroStatus === 'TODOS' ? 'blue' : 'lightgray' }]}
          onPress={() => setFiltroStatus('TODOS')}
        >
          <Text style={styles.textoBotaoFiltroStatus}>Todos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.botaoFiltroStatus, { backgroundColor: filtroStatus === 'AGENDADOS' ? 'blue' : 'lightgray' }]}
          onPress={() => setFiltroStatus('AGENDADOS')}
        >
          <Text style={styles.textoBotaoFiltroStatus}>Agendados</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.botaoFiltroStatus, { backgroundColor: filtroStatus === 'FINALIZADOS' ? 'blue' : 'lightgray' }]}
          onPress={() => setFiltroStatus('FINALIZADOS')}
        >
          <Text style={styles.textoBotaoFiltroStatus}>Finalizados</Text>
        </TouchableOpacity>
      </View>
      {showCalendar && (
        <Calendar
          onDayPress={handleDayPress}
          markedDates={{
            [selectedDate]: { selected: true, selectedColor: 'blue' },
          }}
        />
      )}
      {agendamentosExibidos.length > 0 ? (
        <FlatList
          data={agendamentosExibidos}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.agendamento}>
              <Text>Cliente: {item.nomeCliente}</Text>
              <Text>CPF: {item.cpf}</Text>
              <Text>Data: {formatarDataBrasileira(item.data)}</Text>
              <Text>Horário: {item.horario}</Text>
              <Text>Serviço: {item.servicoSelecionado}</Text>
              {item.descricaoServico && (
                <Text>Descrição do Serviço: {item.descricaoServico}</Text>
              )}
              <Text>Colaborador: {item.colaborador}</Text>
              <TouchableOpacity
                style={styles.botaoExcluir}
                onPress={() => handleExcluirAgendamento(index)}
              >
                <Text style={styles.textoBotaoExcluir}>Excluir</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.botaoEditar}
                onPress={() => handleEditarAgendamento(index)}
              >
                <Text style={styles.textoBotaoEditar}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.botaoFavorito,
                  { backgroundColor: item.favorito ? 'gold' : 'lightgray' },
                ]}
                onPress={() => toggleFavorito(index)}
              >
                <Text style={styles.textoBotaoFavorito}>
                  {item.favorito ? 'Desfavoritar' : 'Favoritar'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.botaoMarcar,
                  { backgroundColor: item.marcado ? 'red' : 'lightgray' },
                ]}
                onPress={() => toggleMarcado(index)}
              >
                <Text style={styles.textoBotaoMarcar}>
                  {item.marcado ? 'FINALIZADO' : 'AGENDADO'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.botaoCopiarDados}
                onPress={() => handleCopyToClipboard(`Cliente: ${item.nomeCliente}\nCPF: ${item.cpf}\nData: ${formatarDataBrasileira(item.data)}\nHorário: ${item.horario}\nServiço: ${item.servicoSelecionado}\n${item.descricaoServico ? `Descrição do Serviço: ${item.descricaoServico}\n` : ''}Colaborador: ${item.colaborador}`)}
              >
                <Text style={styles.textoBotaoCopiarDados}>Copiar Dados</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <Text>Nenhum agendamento encontrado.</Text>
      )}
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
  agendamento: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 16,
    marginBottom: 16,
  },
  botaoExcluir: {
    backgroundColor: 'red',
    padding: 8,
    borderRadius: 5,
    marginTop: 8,
    alignItems: 'center',
  },
  textoBotaoExcluir: {
    color: '#fff',
  },
  botaoEditar: {
    backgroundColor: 'blue',
    padding: 8,
    borderRadius: 5,
    marginTop: 8,
    alignItems: 'center',
  },
  textoBotaoEditar: {
    color: '#fff',
  },
  botaoFavorito: {
    backgroundColor: 'lightgray',
    padding: 8,
    borderRadius: 5,
    marginTop: 8,
    alignItems: 'center',
  },
  textoBotaoFavorito: {
    color: '#000',
  },
  botaoMarcar: {
    backgroundColor: 'lightgray',
    padding: 8,
    borderRadius: 5,
    marginTop: 8,
    alignItems: 'center',
  },
  textoBotaoMarcar: {
    color: '#000',
  },
  botaoAlternar: {
    fontSize: 16,
    color: 'blue',
    marginBottom: 16,
    textAlign: 'center',
  },
  botaoFiltrar: {
    fontSize: 16,
    color: 'blue',
    marginBottom: 16,
    textAlign: 'center',
  },
  botaoCopiarDados: {
    backgroundColor: 'blue',
    padding: 12,
    borderRadius: 5,
    marginTop: 8,
    alignItems: 'center',
  },
  textoBotaoCopiarDados: {
    color: '#fff',
    fontWeight: 'bold',
  },
  filtroStatusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  botaoFiltroStatus: {
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
  },
  textoBotaoFiltroStatus: {
    color: '#000',
  },
});

export default VisualizarAgendamentos;
