import React from "react";
import { getUser } from "@/lib/auth";
import PatientDashboard from "@/components/PatientDashboard";
import { getQuestionsByUser } from "./lib/data";

const Page = async () => {
  const { user } = await getUser();
  const username = user.name;
  const questions = await getQuestionsByUser();

  return <PatientDashboard username={username} questions={questions} />;
};

export default Page;
