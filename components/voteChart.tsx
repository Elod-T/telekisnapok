import { Election, Class as _Class, Vote } from "@prisma/client";
import axios from "axios";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const socket = io(process.env.NEXT_PUBLIC_SOCKETIO_URL!);

interface VoteChartProps {
  election: Election;
}

interface Class extends _Class {
  Votes: Vote[];
}

const VoteChart: NextPage<VoteChartProps> = ({ election }) => {
  const [classes, setClasses] = useState<Class[]>();

  useEffect(() => {
    getVotes();
    socket.on("update", (electionId) => {
      if (electionId == election.id) {
        getVotes();
      }
    });

    function getVotes() {
      axios
        .get(`/api/admin/getVotes?electionId=${election.id}`)
        .then((res) => {
          setClasses(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [election.id]);

  if (!classes) {
    return <div></div>;
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `${election.title} szavazatok`,
      },
    },
  };

  const labels = classes.map((_class) => _class.name);

  const values = classes.map((_class) => _class.Votes.length);

  const data = {
    labels,
    datasets: [
      {
        label: "Online Szavazatok",
        data: values,
        backgroundColor: "rgb(42, 157, 143)",
      },
    ],
  };
  return (
    <div className="bg-base-300 p-2 rounded-md">
      <Bar data={data} options={options} />
    </div>
  );
};

export default VoteChart;
