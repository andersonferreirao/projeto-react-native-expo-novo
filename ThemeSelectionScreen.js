// ThemeSelectionScreen.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const ThemeSelectionScreen = ({ onSelectTheme }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Escolha um Tema</Text>
      <Button
        title="Tema Claro"
        onPress={() => onSelectTheme('light')}
      />
      <Button
        title="Tema Escuro"
        onPress={() => onSelectTheme('dark')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default ThemeSelectionScreen;
