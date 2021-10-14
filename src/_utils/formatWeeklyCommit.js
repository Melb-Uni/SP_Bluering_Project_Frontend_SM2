import { unixToDate } from "./unixToDate.js";

export function formatWeeklyCommit(response) {
    let rawData = response.data;
    // let labelDataMap = getlabelDataMap(rawData);
    let xaxis = [];
    let datasets = [{
        label: "Weekly Commits",
        data: [],
        fill: true,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)"
    }];

    rawData.forEach(element => {
        xaxis.push(unixToDate(element.week))
        datasets[0].data.push(element.total)
    });

    console.log({
        labels: xaxis,
        datasets: datasets,
    })
    return {
        labels: xaxis,
        datasets: datasets,
    };
}