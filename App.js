// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import BoasVindas from './BoasVindas';
import Cadastro from './Cadastro';
import Agendamento from './Agendamento';
import EditarCadastro from './EditarCadastro'; 
import VisualizarAgendamentos from './VisualizarAgendamentos';


const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="BoasVindas">
        <Stack.Screen name="BoasVindas" component={BoasVindas} />
        <Stack.Screen name="EditarCadastro" component={EditarCadastro} />
        <Stack.Screen
          name="VisualizarAgendamentos"
          component={VisualizarAgendamentos}
          options={{ title: 'Visualizar Agendamentos' }}
        />
        <Stack.Screen
          name="Cadastro"
          component={Cadastro}
          options={{
            headerLeft: null, // Isso remove o botão de volta na tela de Cadastro
          }}
        />
        <Stack.Screen
          name="Agendamento"
          component={Agendamento}
          options={{
            headerLeft: null, // Isso remove o botão de volta na tela de Agendamento
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
