import React, { useState } from "react";
import colors from "../assets/colors/colors";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthScreens from "../components/AuthScreens";
import InputField from "../components/InputField";
import CustomButton from "../components/CustomButton";
import Icons from "../components/Icons";
import axios from "axios";
import BottomTabNavigator from "../navigation/BottomTapNavigator";

const API_URL = process.env.API_URL;

const SignIn = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const onChangeUsername = (value) => {
    setUsername(value.replace(/[^a-z||^1-9||_]/g, ""));
  };
  const onChangePassword = (value) => {
    setPassword(value);
  };

  const signInBtnEvent = () => {
    if (username && password) {
      axios
        .post(`${API_URL}/user/login`, { username, password })
        .then(async (axiosResponse) => {
          if (axiosResponse.data.token) {
            try {
              await AsyncStorage.setItem("user", JSON.stringify(axiosResponse.data));
              setUser(() => axiosResponse.data);
            } catch (e) {
              console.log(e);
            }
          } else {
            alert(axiosResponse.data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      alert("Please Enter Username & Password!");
    }
  };

  const moveToSignUp = () => {
    navigation.navigate("SignUp");
  };

  if (user) {
    return <BottomTabNavigator />;
  } else {
    return (
      <AuthScreens>
        <View style={styles.container}>
          <View style={styles.InputContainer}>
            <InputField placeholder="User name" name="user-o" onChangeText={onChangeUsername} value={username} />
            <InputField placeholder="Password" name="lock" onChangeText={onChangePassword} value={password} />
          </View>
          <CustomButton title="Sign-in" btn={styles.btn} btnText={styles.btnText} onPress={signInBtnEvent} />
          <View style={styles.textContainer}>
            <Text>Don't have an account?</Text>
            <TouchableOpacity onPress={moveToSignUp}>
              <Text style={styles.signUp}>Sign-Up!</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.iconContainer}>
            <Icons
              name="facebook"
              iconBackground={{ backgroundColor: colors.primary }}
              icon={{ color: colors.lightGray }}
            />
            <Icons
              name="phone"
              iconBackground={{ backgroundColor: colors.primary }}
              icon={{ color: colors.lightGray }}
            />
            <Icons
              name="twitter"
              iconBackground={{ backgroundColor: colors.primary }}
              icon={{ color: colors.lightGray }}
            />
          </View>
        </View>
      </AuthScreens>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  InputContainer: {
    width: "90%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  btn: {
    backgroundColor: colors.secondary,
    width: "50%",
    marginVertical: 40,
  },
  btnText: {
    color: colors.primary,
  },
  textContainer: {
    flexDirection: "row",
  },
  signUp: {
    color: colors.primary,
    fontWeight: "bold",
    marginHorizontal: 5,
  },
  iconContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
});

export default SignIn;
