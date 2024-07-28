import React, { useState, useEffect } from "react";
import axios from "axios";

import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Notification from "@/components/Notification";
import AuthRoute from "@/components/AuthRoute";
import { Toaster } from "@/components/ui/toaster";
import { Home, ShareMovie, Movie } from "@/pages";
import { socket } from "./socket";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

function App() {
  const { toast } = useToast();
  const [notificationEvents, setNotificationEvents] = useState([]);

  useEffect(() => {
    function onConnect() {
      console.log("onConnect");
    }

    function onDisconnect() {
      console.log("onConnect");
    }

    function onNewMovie(value: any) {
      const notify = () =>
        toast({
          variant: "destructive",
          title: `${value.email} share new video`,
          description: value.title,
        });

      notify();
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("new_movie", onNewMovie);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("new_movie", onNewMovie);
    };
  }, [notificationEvents]);

  // axios.interceptors.response.use(
  //   function (response) {
  //     return response;
  //   },
  //   function (error) {
  //     if (401 === error.response.status) {
  //       window.location.href = "/";
  //     }

  //     throw error;
  //   }
  // );

  return (
    <React.StrictMode>
      <Router>
        <header>
          <Navbar />
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<Movie />} />
            <Route
              path="/share-movie"
              element={
                <AuthRoute>
                  <ShareMovie />
                </AuthRoute>
              }
            />
          </Routes>
        </main>
        <Toaster />
        <footer></footer>
      </Router>
    </React.StrictMode>
  );
}

export default App;
