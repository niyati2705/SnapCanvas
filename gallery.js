let galleryCont = document.querySelector(".gallery-cont");
setTimeout(() => {
  if (db){

    //video retrieval
    let videoDBTransaction = db.transaction("video", "readonly");
    let videoStore = videoDBTransaction.objectStore("video");

    let videoRequest = videoStore.getAll(); //event driven
    videoRequest.onsuccess = (e) => {
      let videoResult = videoRequest.result;
      // let galleryCont = document.querySelector(".gallery-cont");

      
      if (videoResult.length === 0) {
        showNoMediaMessage();
        return;
    }

      //console.log(videoResult);
      videoResult.forEach((videoObj) => {
        let mediaElem = document.createElement("div");
        mediaElem.setAttribute("class", "media-cont");
        mediaElem.setAttribute("id", videoObj.id);

        let url = URL.createObjectURL(videoObj.blobData);

        mediaElem.innerHTML = `
        <div class="media">
        <video autoplay loop src="${url}"></video>
                </div>
                    <span class="material-icons action-btn delete">delete</span>
                   <span class="material-icons action-btn download">
                    download
            </span>

        `;
        galleryCont.appendChild(mediaElem);

        //listeners
        let deleteBtn = mediaElem.querySelector(".delete");
        deleteBtn.addEventListener("click", deleteListener);

        let downloadBtn = mediaElem.querySelector(".download");
        downloadBtn.addEventListener("click", downloadListener);
      });
    };

    //image retrieval

    let imageDBTransaction = db.transaction("image", "readonly");
    let imageStore = imageDBTransaction.objectStore("image");

    let imageRequest = imageStore.getAll(); //event driven
    imageRequest.onsuccess = (e) => {
      let imageResult = imageRequest.result;
      let galleryCont = document.querySelector(".gallery-cont");

      if (imageResult.length === 0 && galleryCont.innerHTML === "") {
        showNoMediaMessage();
        return;
    }

      imageResult.forEach((imageObj) => {
        let mediaElem = document.createElement("div");
        mediaElem.setAttribute("class", "media-cont");
        mediaElem.setAttribute("id", imageObj.id);

        let url = imageObj.url;

        mediaElem.innerHTML = `
        <div class="media">
         <image  src="${url}"/>
                </div>
                
                    <span class="material-icons delete">delete</span>
                <span class="material-icons download">
                    download
            </span>
        
        `;

        galleryCont.appendChild(mediaElem);

        //listeners
        let deleteBtn = mediaElem.querySelector(".delete");
        deleteBtn.addEventListener("click", deleteListener);

        let downloadBtn = mediaElem.querySelector(".download");
        downloadBtn.addEventListener("click", downloadListener);
      });
    };
  }
}, 100);

    // Function to display "No captured media" message
    function showNoMediaMessage() {
      // galleryCont.innerHTML = "<p>No captured media</p>";
      let messageContainer = document.querySelector(".no-media-message");
      if (!messageContainer) {
          messageContainer = document.createElement("div");
          messageContainer.classList.add("no-media-message");
          messageContainer.textContent = "No captured media";
          galleryCont.appendChild(messageContainer);
      }
  }

function downloadListener(e) {
  let id = e.target.parentNode.getAttribute("id");
  let type = id.slice(0, 3);
  if (type == "vid") {
    let videoDBTransaction = db.transaction("video", "readonly");
    let videoStore = videoDBTransaction.objectStore("video");
    let videoRequest = videoStore.get(id);
    videoRequest.onsuccess = (e) => {
      let videoResult = videoRequest.result; //obj

      let videoURL = URL.createObjectURL(videoResult.blobData);
      let a = document.createElement("a");
      a.href = videoURL;
      a.download = "stream.mp4";
      a.click();
    };
  } else if (type === "img") {
    let imageDBTransaction = db.transaction("image", "readonly");
    let imageStore = imageDBTransaction.objectStore("image");
    let imageRequest = imageStore.get(id);
    imageRequest.onsuccess = (e) => {
      let imageResult = imageRequest.result; //obj

      let a = document.createElement("a");
      a.href = imageResult.url;
      a.download = "image.jpg";
      a.click();
    };
  }
}

//ui remove db remove
function deleteListener(e) {
  //db removal
  
  let id = e.target.parentNode.getAttribute("id");

  let type = id.slice(0, 3);
  if (type === "vid") {
    //img- 0 based indexing, [0,3)
    let videoDBTransaction = db.transaction("video", "readwrite");
    let videoStore = videoDBTransaction.objectStore("video");
    videoStore.delete(id);
  } else if (type === "img") {
    let imageDBTransaction = db.transaction("image", "readwrite");
    let imageStore = imageDBTransaction.objectStore("image");
    imageStore.delete(id);
  }
  //UI removal
  e.target.parentNode.remove();
}
