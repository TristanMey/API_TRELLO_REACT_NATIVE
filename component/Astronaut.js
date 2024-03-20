import React, { useEffect, useState } from "react";
import {
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  ImageBackground,
} from "react-native";
import { getAllOrganisations } from "../functions";

// Import your images
const astronautImages = [
  require("../assets/astronaut.png"),
  require("../assets/astronaut1.png"),
  require("../assets/astronaut2.png"),
  require("../assets/astronaut3.png"),
  require("../assets/astronaut4.png"),
];

const { width, height } = Dimensions.get("window");
const backgroundImage = require("../assets/indexPhoto.png");
const title = require("../assets/indexTitle.png");

const Astronaut = ({ navigation }) => {
  const [astronauts, setAstronauts] = useState([]);

  const handleAstronautSelect = (astronaut) => {
    navigation.navigate("Galaxy", {
      idOrganization: astronaut.id,
    });
  };

  useEffect(() => {
    getAllOrganisations()
      .then((organisations) => {
        setAstronauts(organisations);
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
      {astronauts.map((astronaut, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handleAstronautSelect(astronaut)}
          style={[styles[`astronaut${index}`], { width: 50 }]}
        >
          <Image
            source={astronautImages[index]}
            style={styles.astronautImage}
            resizeMode="contain"
          />
          <Text style={styles.astronautName}>{astronaut.displayName}</Text>
        </TouchableOpacity>
      ))}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  astronaut0: {
    top: height * 0.29,
    left: width * 0.4,
  },
  astronaut1: {
    top: height * -0.1,
    left: width * 0.1,
  },
  astronaut2: {
    top: height * -0.15,
    left: width * 0.8,
  },
  astronaut3: {
    top: height * 0.2,
    left: width * 0.05,
  },
  astronaut4: {
    top: height * 0.01,
    left: width * 0.7,
  },
  astronautImage: {
    width: width * 0.2,
    height: height * 0.1,
  },
  astronautName: {
    color: "white",
    fontSize: 15,
    textAlign: "center",
  },
  title: {
    width: width * 0.8,
    height: height * 0.1,
    top: height * 0.001,
    left: width * 0.12,
  },
  image: {
    flex: 1,
  },
});

export default Astronaut;
