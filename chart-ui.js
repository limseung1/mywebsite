// Initial Execution 

// Main Functions
async function plot_line_all(){
    const logd = await read();
    glob_logd = logd;

    const x = unique(get_field(logd, "year")).sort()
    const y1 = cumulative_average(logd, x);
    const y2 = yearly_average(logd, x);

    const specs = configure_specification_line()
    const opts = configure_option_line()

    const dataset = configure_dataset([y1,y2], ["Cumulative (%)", "Yearly (%)"], specs);   
    create_plot('line', x, dataset, opts);

    cum_status = 1
    yr_status = 1
}

async function plot_bar_average(){
    const logd = await read();

    const x =  get_field(logd, "code").reverse();

    x.forEach(course_code => {course_code[4] })
    const y1 = get_field(logd, "grade").reverse();
    const y2 = get_field(logd, "class_avg").reverse();

    const specs = configure_specification_bar()
    const opts = configure_option_bar()
    
    const dataset = configure_dataset([y1,y2], ["Seungwon Lim (%)", "Class Average (%)"], specs)

    create_plot('bar', x, dataset, opts);
}

async function plot_radar(){
    const logd = await read();
    const x = unique(get_field(logd,"faculty")).sort();
    const y1 = get_average_by_faculty(logd, x);

    const specs = configure_specification_radar()
    const opts = configure_option_radar()

    const dataset = configure_dataset([y1], ["Average Grade (%)"],specs);
                          
    create_plot('radar', x, dataset, opts);
}

function switch_line_method(class_name, bg_color, text_color) {
    document.querySelector(class_name).style.backgroundColor = bg_color;
    document.querySelector(class_name).style.color = text_color;
}

// Update chart functions
async function update_line(is_cumulative) {
    const logd = await read();
    const x = unique(get_field(logd, "year")).sort();

    if (is_cumulative) {
        if (cum_status === 1){
            removeData_line(is_cumulative);

            switch_line_method(".btn-line-cu", "rgb(68, 68, 68)", "#111111")    
            cum_status = 0;
        } else {
            const y1 = cumulative_average(logd, x);
            const specs = configure_specification_line();
            const dataset = configure_dataset([y1], ["Cumulative GPA"], [specs[0]]);  
            window.chart.data.datasets.unshift(dataset[0]);
            window.chart.update();

            switch_line_method(".btn-line-cu", "rgb(126, 126, 126)", "#f4f4f4")       
            cum_status = 1;
        }
    } else {
        if (yr_status === 1){
            removeData_line(is_cumulative);

            switch_line_method(".btn-line-yr", "rgb(68, 68, 68)", "#111111")
            yr_status = 0
        } else {
            const y2 = yearly_average(logd, x);
            const specs = configure_specification_line();
            const dataset = configure_dataset([y2], ["Yearly GPA"],  [specs[1]]);  
            window.chart.data.datasets.push(dataset[0]);
            window.chart.update();

            switch_line_method(".btn-line-yr", "rgb(126, 126, 126)", "#f4f4f4")   
            yr_status = 1
        }
    }
}

function removeData_line(is_cumulative) {
    if (is_cumulative) {
        window.chart.data.datasets.shift();
    } else {
        window.chart.data.datasets.pop();
    }
    window.chart.update();
}

function addData_line(is_cumulative,logs) {
    if (is_cumulative) {
        window.chart.data.datasets.push(logs);
    } else {
        window.chart.data.datasets.unshift(logs);
    }
    window.chart.update();
}


async function update_bar(year) {
    const logd = await read();
    const lol =  get_field(logd, "code");
    const logs = [get_field(logd, "grade"), get_field(logd, "class_avg")];

    // Switch Year
    if (year === 1){
        const start = 30
        const end = 37
        updateData(start, end, lol, logs)
    }
    else if (year === 2){
        const start = 21
        const end = 29
        updateData(start, end, lol, logs)
    }
    else if (year === 3){
        const start = 12
        const end = 20
        updateData(start, end, lol, logs)
    }
   else if (year === 4){
        const start = 0
        const end = 11
        updateData(start, end, lol, logs)
    }
}

function updateData(start, end, lol, logs) {
    removeData(0, 37);
    addData(start, end, lol, logs);
}

function removeData(start, end) {
    window.chart.data.labels.splice(start,end);
    window.chart.data.datasets.forEach((dataset) => {
        dataset.data.splice(start,end);
    });
    window.chart.update();
}

function addData(start,end,lol,logs) {
    lol.slice(start,end).reverse().forEach(l => {
            window.chart.data.labels.push(l);
        })
    window.chart.data.datasets.forEach((dataset, idx) => {
        logs[idx].slice(start,end).reverse().forEach(log => {
            dataset.data.push(log)
        })
    }); 
    window.chart.update();
}



//  Main display chart helpers
function create_plot(type, data_label, data, opt){
    var gradeChart = document.getElementById('gradeChart').getContext('2d');
    Chart.defaults.global.defaultFontSize = 11;
    Chart.defaults.global.defaultFontColor = 'white';

    renew_chart()
    window.chart = new Chart(gradeChart, {
        // properties
        type: type,
        data: {
            labels: data_label,
            datasets: data
        },
        options: opt
    });
}

function renew_chart() {
    // Check if chart is already created and exists, and if so, destroy the old chart.
    // Effectively prevents flickering old bar chart issue 
    if (window.chart && window.chart !== null){
        window.chart.destroy()
    }
}
read()
// Read Function
async function read() {
    // read csv file in fixed path, create gd object with its fields code, grade, letter, session, term, year class_avg fields
    // Append the result to logd or list of gradeDatas
    const logd = []
    const response = await fetch('data/grade.csv');
    const data = await response.text();
    const rows = data.split('\n').slice(1);
    rows.forEach(r => {
        const row = custom_split(r);
    
        // column specification:
        const gd = {code: row[0],
                    grade: parseInt(row[1]),
                    letter: row[2],
                    session: row[3],
                    term: parseInt(row[4]),
                    year: parseInt(row[5]),
                    class_avg: parseInt(row[7]),
                    faculty: row[8],
                    description: row[9]}
        logd.push(gd)
    });
    return logd
}

function get_field(logd, criteria) {
    // return a list of field of gd that matches given criteria

    // field stores list of field items of gd
    const field = [];
    
    if (criteria === "code") {
        logd.forEach(gd => field.push(gd.code));
    } else if (criteria === "grade") {
        logd.forEach(gd => field.push(gd.grade));
    } else if (criteria === "letter") {
        logd.forEach(gd => field.push(gd.letter));
    } else if (criteria === "session") {
        logd.forEach(gd => field.push(gd.session));
    } else if (criteria === "term") {
        logd.forEach(gd => field.push(gd.term));
    } else if (criteria === "year") {
        logd.forEach(gd => field.push(gd.year));
    } else if (criteria === "class_avg") {
        logd.forEach(gd => field.push(gd.class_avg));
    } else if (criteria === "faculty") {
        logd.forEach(gd => field.push(gd.faculty));
    } else if (criteria === "description") {
        logd.forEach(gd => field.push(gd.description));
    }
    return field;
}

function yearly_average(logd, loy) {
    const averages = []

    loy.forEach(y => {
        // match year
        const logd_yr = filter_gd_by_year(y, logd)
        const grades = get_field(logd_yr, "grade");
        const sum = get_sum(grades)

        averages.push(get_avg(sum, logd_yr.length))
    });

    return averages
}

function cumulative_average(logd, loy) {
    // return cumulative average if is_cumulative is true or yearly average if false.
    const averages = []
    let cum = 0
    let len = 0

    loy.forEach(y => {
        // match year
        const logd_yr = filter_gd_by_year(y, logd)
        const grades = get_field(logd_yr, "grade");
        
        len += logd_yr.length
        cum += get_sum(grades);

        averages.push(get_avg(cum, len))
    });

    return averages
}

function filter_gd_by_year(year, logd) {

    // acc stores a list of gd that matches year
    const acc = []
    logd.forEach(gd => {
        if (gd.year === year) {
            acc.push(gd)
        }
    });
    
    return acc
}

function get_sum(grades){
    let acc = 0
    grades.forEach(g => {
        acc += g
    });
    return acc 
}

function get_avg(sum, len) {
    return (sum / len)
}

function convert_year_name(year) {
    // convert year (1,2,3,4) into (freshman, sophomore, junior, senior)
    if (year === 1) {
        return "1st Year"
    } else if (year === 2){
        return "2nd Year"
    } else if (year === 3){
        return "3rd Year"
    } else if (year === 4){
        return "4th Year"
    }
}

function get_average_by_faculty(logd, lof){
    // List of faculty averages
    const lofa = []

    lof.forEach(f => {
        lofa.push(average_by_faculty(filter_by_faculty(f,logd)));
    });
    return lofa
}

function average_by_faculty(logd) {
    return get_avg(get_sum(get_field(logd, "grade")), logd.length);

}
function filter_by_faculty (f, logd) {
    // filter logd items by given faculty, f.
    const faculty_logd = []
    logd.forEach(gd => {
        if (check_faculty(gd, f)) {
            faculty_logd.push(gd)
        }
    })
    return faculty_logd
}

function check_faculty(gd, f) {
    // return true if gd.faculty matches f, false otherwise.
    return gd.faculty === f
}

function configure_dataset(ys, ls, specs) {
    const dataset = []
    ys.forEach((y, idx) => {

        const label_data = {label: ls[idx], data: y}
        const spec = specs[idx]
        const combined = Object.assign(label_data, spec)

        dataset.push(combined)
    })
    return dataset
}

function unique(loi){
    // return a list of items from loi that are unique among loi.
    return [...new Set(loi)]
}


// Chart Configuration
// ##################################################################
function configure_specification_bar () {
    const spec1 = {backgroundColor: "rgba(200,100,0,0.5)",
                    borderwidth:1,
                    xAxisID: "bar-x-axis1",
                    categoryPercentage: 0.4,
                    barPercentage: 1}
        

    const spec2 = {backgroundColor: "rgba(200,200,255,0.2)",
                    borderwidth:1,
                    xAxisID: "bar-x-axis2",
                    categoryPercentage: 0.5,
                    barPercentage: 0.5}    

    return [spec1, spec2]
}


function pull_description(desired_code) {
    let acc = ""
    glob_logd.forEach(gd => {
        if(gd.code === desired_code){
            acc = gd.description
        }
    });
    return acc;
}

function render_explain(course){
    // Get Grade data for course description
    const wrap = (s) => s.replace(
        /(?![^\n]{1,50}$)([^\n]{1,50})\s/g, '$1\n'
    );
    return wrap(pull_description(course));
}


function configure_option_bar () {
    opts = {
        tooltips: {
            xPadding: 6,
            // bodyFontColor: '#777777',
            mode: 'index',
            intersect: false,
            callbacks: {
                afterFooter:
                    function(t, d) {
                        const course = t[0].xLabel;
                        return render_explain(course)
                    }
            }
         },
         hover: {
            mode: 'index',
            intersect: false
         },
        responsive: true,
        maintainAspectRatio: true,
        scales: {
                xAxes: [{
                        id: "bar-x-axis2",
                        stacked: true,
                        scaleLabel: {
                            display: false,
                            labelString: 'Course'
                        }
                    },
                    {
                        display: false,
                        stacked: true,
                        id: "bar-x-axis1",
                        type: 'category',

                        gridLines: {
                            color: "#222222",
                            offsetGridLines: true
                        },
                        offset: true
                    }
                ],

                yAxes: [{
                    gridLines: {
                        display: true ,
                        color: "#222222"
                    },
                    id: "bar-y-axis1",
                    stacked: false,
                    ticks: {
                        suggestedMin: 0,
                        suggestedMax: 100,
                    },
                    scaleLabel: {
                            display: false,
                            labelString: 'Grade (%)'
                        }
                }]

            },
            animation: {
            tension: {
                duration: 0,
                easing: 'linear'
            }
        },
        }
    return opts
}

function configure_specification_line () {
    const spec1 = {
            fill: true,
            pointBackgroundColor: "#1F4287",
            borderColor: "#1F4287"}
        
    const spec2 = {
            fill: true,
            pointBackgroundColor: "#21E6C1",
            borderColor: "#21E6C1"}    

    return [spec1, spec2]
}
function configure_option_line () {
    opts = {
        responsive: true,
        maintainAspectRatio: true,
        legend: {
            position: 'top',
        },
        scales: {
                xAxes: [{
                    gridLines: {
                        display: true ,
                        color: "#222222"
                    },
                    scaleLabel: {
                        display: false,
                        labelString: 'Year'
                    },
                }],

                yAxes: [{
                    ticks: {
                        suggestedMin: 50,
                        suggestedMax: 100
                    },
                    gridLines: {
                        display: true ,
                        color: "#222222"
                    },
                    scaleLabel: {
                        display: false,
                        labelString: '(%)',
                    }
                }]

            }
    }
    return opts

}

function configure_specification_radar () {
    const spec1 = {backgroundColor: "rgba(0,255,255,0.2)"} 

    return [spec1]
}

function configure_option_radar () {
opts = {
    responsive: true,
    maintainAspectRatio: true,
        scale: {
            ticks: {display:false},
            gridLines: {
                display: true ,
                color: "#222222"
            },
            angleLines: {
                display: false
            },
        suggestedMin: 50,
        suggestedMax: 100
    }
}
return opts
}


// Event Listeners

const title = document.getElementById("chart-title");
const explanation = document.getElementById("chart-explanation");
const sub_title = document.getElementById("chart-subtitle");
const sub_controls = document.getElementById("sub-controls")


// Open Grade Chart
document.getElementById("open-ui").addEventListener("click", e => {
    //  Swich :   education-table <-> chart-table
    document.querySelector('.education-table').style.display = "none"
    document.querySelector('.chart-table').style.display = "block"

    update_header_sub_control(
        "Performance over Years",
        "Cumulative averages show sucessive grades over the entire academic years. Yearly averages show a grade received in a single academic year.",
        "Final Average: 77%",
        "cum-yearly"
        );
    plot_line_all();
    
e.preventDefault();
});

// Close Grade Chart
document.querySelector(".close-ui").addEventListener("click", e => {
    //  Swich :   education-table <-> chart-table
    document.querySelector('.chart-table').style.display = "none"
    document.querySelector('.education-table').style.display = "block"
e.preventDefault();
});


// Plot updated chart
document.getElementById("by_gpa").addEventListener("click", e => {    
    update_header_sub_control(
        "Performance over Years",
        "Cumulative averages show sucessive grades over the entire academic years. Yearly averages show a grade received in a single academic year.",
        "Final Average: 77%",
        "cum-yearly"
        );
    plot_line_all();
    
e.preventDefault();
});

document.getElementById("by_class").addEventListener("click", e => {
    update_header_sub_control(
                            "Performance by Course",
                            "The chart shows the final grades received in each course, and its description when hovered on each bin.",
                            "",
                            "college-years"
                            );
    plot_bar_average();

e.preventDefault();
});

document.getElementById("by_strength").addEventListener("click", e => {
    update_header_sub_control(
                            "Performance by Descipline",
                            "The chart shows average grades received in seven disciplines of study.",
                            "",
                            ""
                            );
    plot_radar();

e.preventDefault();
});

function update_header_sub_control(title_content, explanation_content, subtitle_content, id) {
    update_header(title_content, explanation_content, subtitle_content)
    reset_sub_control(sub_controls)
    show_sub_control(id);
}

function update_header(title_content, explanation_content, subtitle_content) {
    const title = document.getElementById("chart-title");
    const explanation = document.getElementById("chart-explanation");
    const sub_title = document.getElementById("chart-subtitle");

    title.innerHTML = title_content
    explanation.innerHTML = explanation_content
    sub_title.innerHTML = subtitle_content
};

function reset_sub_control(sub_controls){
    // hide all sub controls 
    for (child of sub_controls.children) {
        child.style.display = "none" 
    }
};

function show_sub_control(control_id){
    // Get desired control id
    if (control_id === ""){
        return
    } else {
        document.getElementById(control_id).style.display = "block";
    }
};

function custom_split(text) {
    const a = text.split(',');
    const b = a.slice(9)
    let acc = ""
    b.forEach(elem => {
        acc = acc + "," + elem
    });
    
    const combine1 = text.split(',', [9]);
    const combine2 = acc.slice(1,acc.length-1);
    
    let acc2 = []
    acc2 = combine1
    acc2.push(combine2)
    
    return acc2
};

