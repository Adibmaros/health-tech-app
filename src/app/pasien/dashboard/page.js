import React from "react";
import { getUser } from "@/lib/auth";
import PatientDashboard from "@/components/PatientDashboard";
import { getQuestionsByUser } from "./lib/data";

const page = async () => {
  const { user } = await getUser();
  // console.log(user);

  const username = user.name;
  const questions = await getQuestionsByUser();
  console.log(questions);

  return (
    <div>
      <PatientDashboard username={username} questions={questions} />
    </div>
  );
};

export default page;
