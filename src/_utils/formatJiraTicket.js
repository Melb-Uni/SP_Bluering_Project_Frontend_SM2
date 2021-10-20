
export function formatJiraTicket(response) {
    let rawData = response.data.count;
    // let labelDataMap = getlabelDataMap(rawData);
    let xaxis = [];
    let datasets = [{
        label: "All Tickets",
        data: [],
        fill: true,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)"
    }];

    // ,{
    //     label: "To Do",
    //     data: [],
    //     fill: true,
    //     backgroundColor: "rgba(224 102 102,0.2)",
    //     borderColor: "rgba(224 102 102,1)"
    // },{
    //     label: "In Progress",
    //     data: [],
    //     fill: true,
    //     backgroundColor: "rgba(246 178 107,0.2)",
    //     borderColor: "rgba(246 178 107,1)"
    // },{
    //     label: "In Review",
    //     data: [],
    //     fill: true,
    //     backgroundColor: "rgba(255 229 153,0.2)",
    //     borderColor: "rgba(255 229 153,1)"
    // },{
    //     label: "Done",
    //     data: [],
    //     fill: true,
    //     backgroundColor: "rgba(147 196 125,0.2)",
    //     borderColor: "rgba(147 196 125,1)"
    // }

    rawData.all.forEach(element => {
        xaxis.push(element.date)
        datasets[0].data.push(element.total)
    });

    // rawData.todo.forEach(element => {
    //     xaxis.push(element.date)
    //     datasets[1].data.push(element.total)
    // });

    // rawData.inprogress.forEach(element => {
    //     xaxis.push(element.date)
    //     datasets[2].data.push(element.total)
    // });

    // rawData.inreview.forEach(element => {
    //     xaxis.push(element.date)
    //     datasets[3].data.push(element.total)
    // });

    // rawData.done.forEach(element => {
    //     xaxis.push(element.date)
    //     datasets[4].data.push(element.total)
    // });

    console.log({
        labels: xaxis,
        datasets: datasets,
    })
    return {
        labels: xaxis,
        datasets: datasets,
    };
}
