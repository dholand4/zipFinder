import React, { useState } from "react";
import { Alert } from "react-native";
import axios from "axios";
import styled from "styled-components/native";
import logo from "./assets/ZipFinder.png";
import { StatusBar } from "expo-status-bar";

interface Address {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
}

const Container = styled.View`
  flex: 1;
  justify-content: center;
  padding: 16px;
  background-color: black;
`;

const Header = styled.View`
  width: 100%;
  align-items: center;
`;

const Input = styled.TextInput`
  height: 40px;
  border-color: gray;
  border-width: 1px;
  margin-bottom: 16px;
  padding: 8px;
  color: white;
`;

const AddressContainer = styled.View`
  margin-top: 24px;
`;

const Label = styled.Text`
  font-weight: bold;
  margin-top: 15px;
  color: white;
`;

const Image = styled.Image`
  height: 90px;
  width: 200px;
`;

const Text = styled.Text`
  color: white;
`;

const Button = styled.TouchableOpacity`
  background-color: #0078a0;
  width: 100%;
  align-items: center;
  padding: 10px;
`;

const ButtonText = styled.Text`
  font-size: 15px;
  color: white;
  font-weight: 500;
`;

const App = () => {
  const [cep, setCep] = useState("");
  const [address, setAddress] = useState<Address | null>(null);

  const handleSearch = () => {
    if (cep.length === 8) {
      axios
        .get(`https://viacep.com.br/ws/${cep}/json/`)
        .then((response) => {
          if (response.data.erro) {
            // O CEP não foi encontrado ou não está correto
            Alert.alert(
              "CEP não encontrado",
              "O CEP não existe ou não está correto."
            );
            setAddress(null);
          } else {
            setAddress(response.data);
          }
        })
        .catch((error) => {
          console.error(error);
          // Ocorreu um erro durante a solicitação
          Alert.alert(
            "Erro",
            "Ocorreu um erro ao buscar o CEP. Por favor, tente novamente mais tarde."
          );
          setAddress(null);
        });
    } else {
      // CEP inválido
      Alert.alert(
        "CEP inválido",
        "Por favor, digite um CEP válido com 8 caracteres."
      );
      setAddress(null);
    }
  };

  return (
    <Container>
      <StatusBar style="light" />
      <Header>
        <Image source={logo} />
      </Header>

      <Input
        placeholder="Digite o CEP"
        value={cep}
        onChangeText={(text) => setCep(text)}
        keyboardType="numeric"
        maxLength={8}
      />
      <Button onPress={handleSearch}>
        <ButtonText>Buscar</ButtonText>
      </Button>

      {address && (
        <AddressContainer>
          <Label>Logradouro:</Label>
          <Text>{address.logradouro}</Text>

          <Label>Bairro:</Label>
          <Text>{address.bairro}</Text>

          <Label>Localidade:</Label>
          <Text>{address.localidade}</Text>

          <Label>UF:</Label>
          <Text>{address.uf}</Text>
        </AddressContainer>
      )}
    </Container>
  );
};

export default App;
