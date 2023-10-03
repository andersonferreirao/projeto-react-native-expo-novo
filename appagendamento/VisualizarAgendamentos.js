import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const VisualizarAgendamentos = ({ navigation }) => {
  const [agendamentos, setAgendamentos] = useState([]);
  const [verFavoritos, setVerFavoritos] = useState(false);

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

  const salvarAgendamentos = async (novosAgendamentos) => {
    try {
      await AsyncStorage.setItem('agendamentos', JSON.stringify(novosAgendamentos));
    } catch (error) {
      console.error('Erro ao salvar os agendamentos:', error);
    }
  };

  const agendamentosExibidos = verFavoritos
    ? agendamentos.filter((agendamento) => agendamento.favorito)
    : agendamentos;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agendamentos</Text>
      <TouchableOpacity onPress={() => setVerFavoritos(!verFavoritos)}>
        <Text style={styles.botaoAlternar}>
          {verFavoritos ? 'Ver Todos' : 'Ver Favoritos'}
        </Text>
      </TouchableOpacity>
      {agendamentosExibidos.length > 0 ? (
        <FlatList
          data={agendamentosExibidos}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.agendamento}>
              <Text>Cliente: {item.nomeCliente}</Text>
              <Text>CPF: {item.cpf}</Text>
              <Text>Data: {item.data}</Text>
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
  botaoAlternar: {
    fontSize: 16,
    color: 'blue',
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default VisualizarAgendamentos;
