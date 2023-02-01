import { Election, Class as _Class, Vote } from "@prisma/client";
import axios from "axios";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "chartjs-adapter-moment";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
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

const VotesByTimeChart: NextPage<VoteChartProps> = ({ election }) => {
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
        .get(`/api/admin/getVotes/?electionId=${election.id}`)
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

  classes.forEach((_class) => {
    _class.Votes.sort((a, b) => {
      return new Date(a.timeStamp).getTime() - new Date(b.timeStamp).getTime();
    });
  });

  const options = {
    response: true,
    scales: {
      x: {
        type: "time",
        time: {
          unit: "hour",
        },
      },
    },
  };

  const colors = [
    "rgb(38, 70, 83)",
    "rgb(42, 157, 143)",
    "rgb(233, 196, 106)",
    "rgb(244, 162, 97)",
    "rgb(231, 111, 81)",
  ];
  const values = classes
    .map((_class) => _class.Votes.map((vote) => vote.timeStamp))
    .flat()
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
    .map((date, index) => {
      return {
        x: date,
        y: index + 1,
      };
    });

  const choiceValues = classes.map((_class, colorIndex: number) => {
    return {
      label: _class.name,
      data: _class.Votes.map((vote, index) => {
        return {
          x: vote.timeStamp,
          y: index + 1,
        };
      }),
      borderColor: colors[colorIndex],
      backgroundColor: colors[colorIndex],
    };
  });

  const data = {
    datasets: [
      {
        label: "Összes szavazat",
        data: values,
        borderColor: "rgb(231, 111, 81)",
        backgroundColor: "rgb(231, 111, 81)",
      },
      ...choiceValues,
    ],
  };

  return (
    <div className="bg-base-300 p-2 rounded-md mt-10">
      {/* @ts-ignore mert buta Type 'string' is not assignable to type '"timeseries"'.ts(2322) marmint a lib, nem a ts*/}
      <Line data={data} options={options} />
    </div>
  );
};

export default VotesByTimeChart;
