import React, { createContext, useState, useEffect } from "react";
import * as Google from "expo-auth-session/providers/google";
import {
  AuthRequestPromptOptions,
  AuthSessionResult,
  Prompt,
} from "expo-auth-session";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  EXPO_AUTH_CLIENT_ID,
  IOS_CLIENT_ID,
  EXPO_AUTH_CLIENT_SECRET,
  SERVER_BASE_URL,
} from "@env";

interface UserProfile {
  _id: string;
  email: string;
  name: string | undefined;
  picture: string | undefined;
  refreshToken: string | undefined;
}

interface AuthInfo {
  user: UserProfile | null;
  accessToken: string;
  isValidToken: boolean;
  promptLogin: (
    options?: AuthRequestPromptOptions | undefined
  ) => Promise<AuthSessionResult>;
  logout: () => void;
}

interface AuthWrapperProps {
  children: JSX.Element;
}

interface LoginResponse {
  user: UserProfile;
  token: string;
}

const defaultAuthContext: AuthInfo = {
  user: null,
  accessToken: "",
  isValidToken: false,
  promptLogin: () => new Promise((resolve, reject) => reject()),
  logout: () => {},
};

export const AuthContext = createContext(defaultAuthContext);

export const AuthProvider = ({ children }: AuthWrapperProps) => {
  const [accessToken, setAccessToken] = useState("");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isValidToken, setIsValidToken] = useState(false);

  const [request, response, promptLogin] = Google.useAuthRequest({
    clientId: EXPO_AUTH_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
    clientSecret: EXPO_AUTH_CLIENT_SECRET,
    //prompt: Prompt.Consent,
    extraParams: {
      access_type: "offline",
      approvalPrompt: "force",
    },
  });

  useEffect(() => {
    async function attemptGoogleLogin() {
      if (response && response.type === "success") {
        //console.log(response);
        const token = response.params.id_token;
        const hd = response.params.hd;
        const refreshToken = response.authentication?.refreshToken;
        //console.log("refresh token is: " + refreshToken);
        //store refresh token if it exists
        if (refreshToken) await storeRefreshToken(refreshToken);

        await attemptLogin(token, refreshToken);
        //     const loginResponse = await fetch(SERVER_BASE_URL + "/login", {
        //       method: "POST",
        //       headers: {
        //         "Content-Type": "application/json",
        //       },
        //       body: JSON.stringify({
        //         token: token,
        //       }),
        //     });
        //     if (loginResponse.status !== 200) {
        //       alert("Error logging in!");
        //       return;
        //     }
        //     const loginData = await loginResponse.json();
        //     console.log(loginData.user);
      }
    }
    attemptGoogleLogin();
  }, [response]);

  useEffect(() => {
    async function attemptLocalLogin() {
      const refreshToken = await getRefreshToken();
      //console.log("Refresh token is: " + refreshToken);
      //handle if no refreshtoken
      if (!refreshToken) {
        return;
      }
      console.log("Attempting local login!");
      attemptRefreshLogin(refreshToken);
    }
    attemptLocalLogin();
  }, []);

  async function attemptLogin(token: string, refreshToken?: string) {
    //console.log("now refresh token is: " + refreshToken);
    const validUser = await attemptServerLogin(token, refreshToken);
    if (!validUser) {
      alert("Error logging in!");
      return;
    }
    const profile_refresh = validUser.user.refreshToken;
    if (profile_refresh) {
      await storeRefreshToken(profile_refresh);
      console.log("Stored token: " + profile_refresh);
    }
    setUser(validUser.user);
    setAccessToken(validUser.token);
    setIsValidToken(true);
  }

  async function attemptRefreshLogin(refreshToken: string) {
    const validUser = await attemptRefreshServerLogin(refreshToken);
    if (!validUser) {
      //alert("Error logging in!");
      await removeRefreshToken();
      console.log("Invalid refresh token!");
      return;
    }
    setUser(validUser.user);
    setAccessToken(validUser.token);
    setIsValidToken(true);
  }

  async function logout() {
    setAccessToken("");
    setUser(null);
    await removeRefreshToken();
    setIsValidToken(false);
  }

  return (
    <AuthContext.Provider
      value={{
        accessToken: accessToken,
        isValidToken: isValidToken,
        logout: logout,
        promptLogin: promptLogin,
        user: user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

//either returns false or the user profile
async function attemptServerLogin(token: string, refreshToken?: string) {
  //console.log("Attempting server login with " + token + " and " + refreshToken);
  const reqBody = refreshToken
    ? {
        token: token,
        refreshToken: refreshToken,
      }
    : {
        token: token,
      };
  const loginRes = await fetch(SERVER_BASE_URL + "/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reqBody),
  });

  if (loginRes.status !== 200) {
    return false;
  }
  const loginResData: LoginResponse = await loginRes.json();
  return loginResData;
}

async function attemptRefreshServerLogin(refreshToken: string) {
  const loginRes = await fetch(SERVER_BASE_URL + "/refreshToken", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token: refreshToken,
    }),
  });

  if (loginRes.status !== 200) {
    return false;
  }
  const refreshData: LoginResponse = await loginRes.json();
  const token = refreshData.token;
  const data = await attemptServerLogin(token);
  return data;
}

const storeRefreshToken = async (refreshToken: string) => {
  try {
    await AsyncStorage.setItem("@refresh_token", refreshToken);
  } catch (e) {
    // saving error
    console.error(e);
  }
};

const removeRefreshToken = async () => {
  try {
    await AsyncStorage.removeItem("@refresh_token");
  } catch (e) {
    console.error(e);
  }
};

const getRefreshToken = async () => {
  try {
    const value = await AsyncStorage.getItem("@refresh_token");
    if (value !== null) {
      // value previously stored
      return value;
    } else return "";
  } catch (e) {
    // error reading value
  }
};
