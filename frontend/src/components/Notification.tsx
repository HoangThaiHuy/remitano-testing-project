import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

function Notification({ movie }) {
  const { toast } = useToast();
  toast({
    title: "xxx",
  });

  return <></>;
}

export default Notification;
