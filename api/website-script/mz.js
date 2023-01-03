/**  INIT **/

if (!window.jQuery && !hasJqueryInHeadOrBody()) {
    console.log("Installing jquery 3.6.0");
    var script = document.createElement("script"); // create a script DOM node
    script.id = "mz-jquery";
    script.src = "https://code.jquery.com/jquery-3.6.0.min.js"; // set its src to the provided URL
    document.head.appendChild(script);
    document.querySelector("#mz-jquery").addEventListener(
      "load",
      loadJquery(script) //.bind({currentScript:this.currentScript})
    );
  } else {
    loadJquery(script);
  }
  
  function hasJqueryInHeadOrBody() {
    return Array.from(document.getElementsByTagName("script")).some(
      (element) => element.src.indexOf("jquery") >= 0
    );
  }
  
  function loadJquery(currentScript) {
    console.log("waiting to load jquery dom...");
    try {
      runMeetzy();
    } catch (e) {
      setTimeout(() => {
        loadJquery(currentScript);
      }, 300);
    }
  }
  
  /** END INIT **/
  
  function runMeetzy() {
    //JQUERY TEST
    $("div"); //do not delete this line
  
    //LOAD CSS INTO THE HS IFRAME
    var link = document.createElement("link"); // create a script DOM node
    link.id = "mz-css";
    link.rel = "stylesheet";
    link.href = "src/mz.css"; // set its src to the provided URL
    document.head.appendChild(link);
  
    //WAIT UNTIL HS FORM IS LOADED
    let interval = setInterval(() => {
      let btnSubmit = getSubmitButton();
      if (btnSubmit) {
        clearInterval(interval);
  
        setTimeout(() => {}, 2000);
  
        //GET CONTROL OF SUBMIT BUTTON
        btnSubmit.prop("type", "button");
        btnSubmit.css("background-color", "blue");
        btnSubmit.css("border-color", "blue");
        btnSubmit.click(() => {
          console.log("click captured!");
  
          //GET FORM PARENT
          let iframe = $("iframe[class=hs-form-iframe]");
          let parent = iframe.parent();
  
          //CHANGE THE CONTENT OF THE PARENT
          //HIDE IFRAME
          iframe.css("display", "none");
          //CREATE THE SCHEDULER
          let schedulerContainer = $("<div/>")
            .addClass("mz-scheduler")
            .html("saving data...")
            .appendTo(parent)
            .animate({ opacity: 1 }, 200);
          //SHOW THE SECOND MESSAGE
          setTimeout(() => {
            schedulerContainer.html("looking for a sales rep for you...");
            //SHOW THE THIRD MESSAGE
            setTimeout(() => {
              schedulerContainer.html("loading free slots...");
              //SHOW THE SCHEDULER
              setTimeout(() => {
                console.log(
                  "email",
                  $("#email-68680704-d75c-4aa6-9b8a-7fdae64b2d68").val()
                );
                let btnSubmitSecond = getSubmitButton();
                btnSubmitSecond.css("background-color", "green");
                btnSubmitSecond.html("agenda una demo");
              }, 1500);
            }, 1500);
          }, 1500);
        });
      }
    }, 100);
  }
  
  function getSubmitButton() {
    let btnSubmit;
  
    try {
      btnSubmit = $($("iframe[class=hs-form-iframe]")[0].contentDocument)
        .find("form")
        .find("input[type=submit]");
    } catch (e) {
      btnSubmit = $("form").find("input[type=submit]");
    }
  
    return btnSubmit;
  }
  
  function getLoadingIcon() {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-loader"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>';
  }
  