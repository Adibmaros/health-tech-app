import React from "react";
import { getUser } from "@/lib/auth";
import DokterDashboard from "@/components/DokterDashboard";
import { getQuestions } from "./lib/data";

const page = async () => {
  const { user } = await getUser();
  const username = user.name;
  const questions = await getQuestions();
  console.log(questions);

  return (
    <div>
      <DokterDashboard username={username} questions={questions} />
    </div>
  );
};

export default page;
