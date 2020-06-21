import React from "react";
import { useEffect, useState } from "react"

import api from './services/api'

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from "react-native";

export default function App() {
  let [repositoryList, setRepositoryList] = useState([])

  useEffect(() => {
    api.get('/repositories').then(({ data }) => {
      setRepositoryList(data)
    })
  }, [])

  async function handleLikeRepository(id) {
    let { data: { likes } } = await api.post(`repositories/${id}/like`)
    let repositoryIndex = repositoryList.findIndex(repository => repository.id === id)
    let newRepositoryList = [...repositoryList]
    newRepositoryList[repositoryIndex] = { ...newRepositoryList[repositoryIndex], likes }
    setRepositoryList(newRepositoryList)
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.main}>
          {repositoryList.map(repository => (
            <View key={repository.id} style={styles.repositoryContainer}>
              <Text style={styles.repository}>{repository.title}</Text>

              {repository.techs.length > 0 && (
                <View style={styles.techsContainer}>
                  {repository.techs.map((tech, idx) => (
                    <Text key={`tech-${tech}-${idx}`} style={styles.tech}>
                      {tech}
                    </Text>
                  ))}
                </View>
              )}

              <View style={styles.likesContainer}>
                <Text
                  style={styles.likeText}
                  testID={`repository-likes-${repository.id}`}
                >
                  {repository.likes} curtidas
                </Text>
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={() => handleLikeRepository(repository.id)}
                testID={`like-button-${repository.id}`}
              >
                <Text style={styles.buttonText}>Curtir</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  main: {
    paddingTop: 16,
  },

  repositoryContainer: {
    marginBottom: 16,
    marginHorizontal: 16,
    backgroundColor: "#fff",
    padding: 32,
    borderRadius: 16,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 8,
    backgroundColor: "#04d361",
    paddingHorizontal: 8,
    paddingVertical: 8,
    color: "#fff",
    borderRadius: 4,
  },
  likesContainer: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 16,
    borderRadius: 8,
  },
});
