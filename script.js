let video = document.querySelector("video");
let recordBtnCont = document.querySelector(".record-btn-cont");
let recordBtn = document.querySelector(".record-btn");
let captureBtnCont = document.querySelector(".capture-btn-cont");
let captureBtn = document.querySelector(".capture-btn");

let recordFlag = false;
let recorder; 
let chunks = []; //media data in chunks

let transparentColor= "transparent";
let filterColor = "";

let constraints={
    video: true,
    audio: true
}

navigator.mediaDevices.getUserMedia(constraints)
.then((stream) =>{
    video.srcObject = stream;

    recorder = new MediaRecorder(stream); // initiated when recorder starts/stream starts, a cb
    recorder.addEventListener("start",(e) =>{
        chunks = []; //empty chunks every time recording starts
    })

    recorder.addEventListener("dataavailable", (e) =>{
        chunks.push(e.data); //add data 
    })

    recorder.addEventListener("stop",(e) =>{
        //conversion of media chunks data to video and downloading
        let blob = new Blob(chunks, {type : "video/mp4"});

        if(db){
            //transaction
            let videoID = shortid();
            
            let dbTransaction = db.transaction("video", "readwrite");
            let videoStore = dbTransaction.objectStore("video");

            let videoEntry ={
                id: `vid-${videoID}`, //same as keypatha name
                blobData : blob
            }
            videoStore.add(videoEntry);
           
        }

    })
})

//start and stop recording 
recordBtnCont.addEventListener("click", (e) => {
    if(!recorder) return;
    recordFlag = !recordFlag; 

    if(recordFlag){ //start
        recorder.start();
        recordBtn.classList.add("scale-record");
        startTimer();
    }
    else{ //stop
        recorder.stop();
        recordBtn.classList.remove("scale-record");
        stopTimer();
    }

})


captureBtnCont.addEventListener("click",(e) =>{
    
    captureBtn.classList.add("scale-capture");

    let canvas = document.createElement("canvas");
    canvas.width = video.videoWidth; 
    canvas.height = video.videoHeight;

     let tool = canvas.getContext("2d");

     tool.filter = filterColor;

    //drawing filtered video frame on the canvas
    tool.drawImage(video,0,0,canvas.width,canvas.height);

    tool.filter="none";

     //filtertering
     tool.fillStyle = transparentColor;
     tool.fillRect(0,0,canvas.width, canvas.height);

     let imageURL = canvas.toDataURL();

     if(db){
        //transaction
        let imageID = shortid();
        
        let dbTransaction = db.transaction("image", "readwrite");
        let imageStore = dbTransaction.objectStore("image");

        let imageEntry ={
            id: `img-${imageID}`, //same as keypath name
            url: imageURL
        }
        imageStore.add(imageEntry);
       
    }
    setTimeout(() => {
        captureBtn.classList.remove("scale-capture");
    },500)
    
    
})

//start timer
let timerID;
let counter = 0;//reps total seconds
let timer = document.querySelector(".timer");

function startTimer(){
    
    timer.style.display="block";
    function displayTimer(){
        let totalSeconds = counter
        let hours= Number.parseInt(totalSeconds/3600);
        totalSeconds = totalSeconds % 3600; //rem value

        let minutes = Number.parseInt(totalSeconds / 60);
        let seconds = (totalSeconds % 60);

        hours = (hours<10) ? `0${hours}`: hours;
        minutes = (minutes<10) ? `0${minutes}`: minutes;
        seconds = (seconds<10) ? `0${seconds}` : seconds;

        timer.innerText= `${hours}:${minutes}:${seconds}`;

        counter++;
    }

    timerID = setInterval(displayTimer, 1000);
}

//stop-timer
function stopTimer(){
    clearInterval(timerID);
    timer.display="none";
    timer.innerText = "00:00:00"
}

//bg-color filtering
let filterLayer = document.querySelector(".filter-layer");
let allFilters = document.querySelectorAll(".filter");

allFilters.forEach((filterElem) => {
    filterElem.addEventListener("click", (e) =>{
        //get style
        transparentColor= getComputedStyle(filterElem).getPropertyValue("background-color");
          
        //set style
        filterLayer.style.backgroundColor = transparentColor;
    })
})

//filters
allFilters.forEach((filterElem) => {
    filterElem.addEventListener("click", (e) => {
        // Get style
        filterColor = getComputedStyle(filterElem).getPropertyValue("filter");

        // Set filter to the video stream
        video.style.filter = filterColor;
    })
})