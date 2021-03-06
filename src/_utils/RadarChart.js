import React from 'react'
import { Radar } from 'react-chartjs-2'

// sample data format, see demo here https://www.chartjs.org/docs/latest/charts/doughnut.html
// const data = {
//     labels: [
//       'Red',
//       'Blue',
//       'Yellow'
//     ],
//     datasets: [{
//       label: 'My First Dataset',
//       data: [300, 50, 100],
//       backgroundColor: [
//         'rgb(255, 99, 132)',
//         'rgb(54, 162, 235)',
//         'rgb(255, 205, 86)'
//       ],
//       hoverOffset: 4
//     }]
//   };




export default function RadarChart(props) {
    const labels = [
        'GitHub by Commits',
        'GitHub by Code Modifications(Head)',
        'Confluence',
        'Jira',

    ];
    let datasets = [];
    function getRandomInt(min, max) {
        return (Math.floor(Math.random() * (max - min)) + min);
    }
    console.log("props data", props);

    let totalGitCommits = 0
    for (const [key, value] of Object.entries(props.data2)) {
        totalGitCommits += value
    }

    function getStudentCount(student) {
        for (const [key, value] of Object.entries(props.data2)) {
            if (student.includes(key.split(" ")[0])) {
                return (value / totalGitCommits) * 100
            }
        }
    }

    function getGitHubDataModifs(student) {
        for (const [key, value] of Object.entries(props.gitHubDataModifs)) {
            if (student.includes(key.split(" ")[0])) {
                return value
            }
            else {
                return getRandomInt(1, 10)
            }
        }
    }

    console.log("Jira Contribution Percent")
    for (const [key, value] of Object.entries(props.jiraData)) {
        console.log(key, (value.datasets[0].data[0] / value.datasets[0].data[1]) * 100);
    }


    props.data.forEach((student, index) => {
        const confluencePercent = (props.data3[student].datasets[0].data[0] / props.data3[student].datasets[0].data[1]) * 100
        const gitHubPercent = getStudentCount(student)
        const jiraPercent = getRandomInt(1, 20) // Random value generated for testing purpose
        const gitHubPercent2 = getGitHubDataModifs(student)
        datasets.push({
            label: student,
            hidden: index !== 0,
            data: [gitHubPercent, gitHubPercent2, confluencePercent, jiraPercent],
            fill: true,
            // backgroundColor: '#' + Math.floor(Math.random() * 16777215).toString(16),
            backgroundColor: `rgba(${getRandomInt(1, 255)}, ${getRandomInt(1, 255)}, ${getRandomInt(1, 255)}, ${0.2})`,
            borderColor: "black",
            pointBackgroundColor: "black",
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(255, 99, 132)'
        })
    });
    const data = {
        labels: labels,
        datasets: datasets
    };
    console.log(props);
    return (
        <div style={{ position: "relative", margin: "auto", width: "80vw" }}>
            <Radar
                data={data}
                options={{
                    legend: { display: true, position: "right", labels: { fontSize: 12 } },
                    scale: {
                        ticks: {
                            beginAtZero: true,
                            max: 100
                        }
                    }
                }}
            />
        </div>
    )
}