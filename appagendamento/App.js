import React, { useState, useEffect } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';
import BoasVindas from './BoasVindas';
import Cadastro from './Cadastro';
import Agendamento from './Agendamento';
import EditarCadastro from './EditarCadastro';
import VisualizarAgendamentos from './VisualizarAgendamentos';
import EditarAgendamento from './EditarAgendamento';
import CadastroColaborador from './CadastroColaborador';
import ThemeSelectionScreen from './ThemeSelectionScreen';

const Stack = createStackNavigator();

const App = () => {
  const [theme, setTheme] = useState(DefaultTheme);
  const [themeSelected, setThemeSelected] = useState(false);
  const [estabelecimentoCadastrado, setEstabelecimentoCadastrado] = useState(false);

  useEffect(() => {
    // Carregar a preferência do usuário para o tema
    loadThemePreference();
    // Verificar se o estabelecimento já foi cadastrado
    checkEstabelecimentoCadastrado();
  }, []);

  const loadThemePreference = async () => {
    try {
      const themePreference = await AsyncStorage.getItem('theme');
      if (themePreference) {
        setTheme(themePreference === 'dark' ? DarkTheme : DefaultTheme);
        setThemeSelected(true); // Indica que o tema já foi selecionado
      } else {
        // Use o tema do sistema operacional como padrão
        const systemTheme = Appearance.getColorScheme();
        setTheme(systemTheme === 'dark' ? DarkTheme : DefaultTheme);
      }
    } catch (error) {
      console.error('Erro ao carregar o tema:', error);
    }
  };

  const checkEstabelecimentoCadastrado = async () => {
    try {
      // Verifique se o estabelecimento já está cadastrado (defina estabelecimentoCadastrado como verdadeiro)
      // com base na sua lógica de verificação
      const estabelecimentoCadastrado = await AsyncStorage.getItem('estabelecimentoCadastrado');
      if (estabelecimentoCadastrado === 'true') {
        setEstabelecimentoCadastrado(true);
      }
    } catch (error) {
      console.error('Erro ao verificar estabelecimento cadastrado:', error);
    }
  };

  // Função para alternar entre temas claro e escuro
  const onSelectTheme = async (selectedTheme) => {
    try {
      setTheme(selectedTheme === 'dark' ? DarkTheme : DefaultTheme);
      // Salvar a preferência do usuário para o tema
      await AsyncStorage.setItem('theme', selectedTheme);
      setThemeSelected(true); // Indica que o tema já foi selecionado
    } catch (error) {
      console.error('Erro ao salvar o tema selecionado:', error);
    }
  };

  if (!themeSelected) {
    return <ThemeSelectionScreen onSelectTheme={onSelectTheme} />;
  }

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator initialRouteName={estabelecimentoCadastrado ? "Agendamento" : "BoasVindas"}>
        <Stack.Screen name="BoasVindas" component={BoasVindas} />
        {/* Verifique se o estabelecimento já foi cadastrado antes de permitir acesso à tela de Cadastro */}
        {!estabelecimentoCadastrado ? (
          <Stack.Screen name="Cadastro" component={Cadastro} />
        ) : null}
        <Stack.Screen name="Agendamento" component={Agendamento} />
        <Stack.Screen name="EditarCadastro" component={EditarCadastro} />
        <Stack.Screen name="VisualizarAgendamentos" component={VisualizarAgendamentos} />
        <Stack.Screen name="EditarAgendamento" component={EditarAgendamento} />
        <Stack.Screen name="CadastroColaborador" component={CadastroColaborador} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
