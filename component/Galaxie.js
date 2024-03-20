import React, { useEffect, useState } from "react";
import {
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  ImageBackground,
} from "react-native";
import { getAllBoards, getListsFromBoard } from "../functions";

// Import your images
const galaxyImages = [
  require("../assets/galaxy.png"),
  require("../assets/galaxy1.png"),
  require("../assets/galaxy2.png"),
  require("../assets/galaxy3.png"),
  require("../assets/galaxy4.png"),
];

const { width, height } = Dimensions.get("window");
const backgroundImage = require("../assets/indexPhoto.png");
const title = require("../assets/indexTitle.png");

const Galaxy = ({ navigation, route }) => {
  const { idOrganization } = route.params || {}; // Récupérez l'id de l'organisation
  const [galaxies, setGalaxies] = useState([]);

  const handleGalaxySelect = (galaxy) => {
    getListsFromBoard(galaxy.id)
      .then((lists) => {
        const listNames = lists.map((list) => list.name);
        const listId = lists.map((list) => list.id);
        // Naviguez vers l'écran AppScreen et passez les noms des listes
        navigation.navigate("Home", {
          planetNames: listNames,
          listIds: listId,
          boardId: galaxy.id,
          idOrganization: idOrganization,
        });
      })
      .catch(console.error);
  };

  useEffect(() => {
    getAllBoards(idOrganization)
      .then((boards) => {
        setGalaxies(boards);
      })
      .catch(console.error);
  }, []);

  return (
    <ImageBackground
      source={backgroundImage}
      resizeMode="cover"
      style={styles.image}
    >
      <Image source={title} style={styles.title} resizeMode="contain" />
      {galaxies.map((galaxy, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handleGalaxySelect(galaxy)}
          style={[styles[`galaxy${index}`], { width: 50 }]}
        >
          <Image
            source={galaxyImages[index]}
            style={styles.galaxyImage}
            resizeMode="contain"
          />
          <Text style={styles.galaxyName}>{galaxy.name}</Text>
        </TouchableOpacity>
      ))}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  image: {
    flex: 1,
  },
  galaxy0: {
    top: height * 0.55,
    left: width * 0.75,
  },
  galaxy1: {
    bottom: height * 0.15,
    left: width * 0.1,
  },
  galaxy2: {
    bottom: height * 0.25,
    left: width * 0.7,
  },
  galaxy3: {
    top: height * 0.1,
    left: width * 0.05,
  },
  galaxy4: {
    bottom: height * 0.4,
    left: width * 0.4,
  },
  galaxyImage: {
    width: width * 0.2,
    height: height * 0.1,
  },
  galaxyName: {
    fontSize: 15,
    color: "white",
  },
  title: {
    width: width * 0.8,
    height: height * 0.1,
    top: height * 0.001,
    left: width * 0.12,
  },
});

export default Galaxy;
