//Call Firebase
var trainData = new Firebase("https://train-schedule-timetable.firebaseio.com")

//function that recognized info input by user
function newInfo() {
    var name = $("#nameInput").val().trim();
    var dest = $("#destInput").val().trim();
    var freq = $("#freqInput").val().trim();
    var frst = $("#frstInput").val().trim();

    //Take first two digits of frst to get hours and 
    var time = moment({ hours: frst[0] + frst[1], minutes: frst[3] +  frst[4]}).format("hh:mm");


    //Pushes the above function info to firebase
    trainData.push({
        name: name,
        dest: dest,
        freq: freq,
        frst: time
    });
    //uploads train data to the database
    //trainData.ref().push(trainData);
    //console.log(trainData[0].name);
    // clears all the text-boxes
    $("#nameInput").val("");
    $("#destInput").val("");
    $("#freqInput").val("");
    $("#frstInput").val("");
    // Prevents moving to new page
    return false;
};

//Function that calculates the arrival time and time remaining until arrival based off of input
function arrive(freq, time) {
    var dif = moment().diff(moment(time, "hh:mm"), "minutes");
    var left = freq - (dif % freq);
    var upcoming = moment().add(left, "minutes");
    return { upcoming: upcoming.format("hh:mm"), remaining: left };
};

//Sets the wheels in motion with the main function
$(document).ready(function() {
    //Reads user input and add to Firebase
    $("#submit").on('click', newInfo);
    //newInfo();
    //Read data on Firebase
    trainData.on("child_added", function(childSnapshot) {
        console.log(childSnapshot.val())
        var name = childSnapshot.val().name;
        var dest = childSnapshot.val().dest;
        var freq = childSnapshot.val().freq;
        var time = childSnapshot.val().frst;
        console.log(arrive(freq, time));
        var upcoming = arrive(freq, time).upcoming
        var remaining = arrive(freq, time).remaining
        //variable below calculates the information together
        //var next = arrival(freq, time);
        //Append this mess to the html
        $("#table > tbody").append("<tr><td>" + name + "</td><td>" + dest + "</td><td>" + freq + "</td><td data-first-time=" + time + ">" + upcoming + "</td><td>" + remaining + "</td></tr>");
    });
    // return false;

});