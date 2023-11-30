const arrayOFSegment = [
  [0, 40, "This is segment1"],
  [40, 80, "This is segment2"],
  [80, 120, "This is segment3"],
  [120, 160, "This is segment4"],
  [160, 200, "This is segment5"],
  [200, 210, "This is segment6"],
];

var player = videojs(
  "my-video",
  {
    controls: true,
    fluid: true,
    html5: {
      vhs: {
        overrideNative: true,
      },
    },
  },
  function () {
    var player = this;
    player.eme();
    player.src({
      src: "https://cdn.bitmovin.com/content/assets/art-of-motion_drm/mpds/11331.mpd",
      type: "application/dash+xml",
      keySystems: {
        "com.widevine.alpha": "https://cwip-shaka-proxy.appspot.com/no_auth",
      },
    });

    player.ready(function () {
      player.tech(true).on("keystatuschange", function (event) {
        console.log("event: ", event);
      });
    });

    player.on("loadedmetadata", function () {
      // Get the total duration of the video in seconds
      var totalDuration = player.duration();

      console.log("Total Duration:", totalDuration);
      createMarkers(arrayOFSegment, totalDuration);
    });
  }
);

function createMarkers(arrayOFSegment, totalDuration) {
  const progressControl = document.querySelector(".vjs-progress-holder");

  if (!progressControl) {
    console.log("Parent element not found");
    return;
  }

  const box = document.createElement("div");
  box.classList.add("box");
  box.style.width = "100%";
  box.style.height = "100%";
  box.style.display = "flex";
  box.style.backgroundColor = "white";
  box.style.alignItems = "center";
  box.style.zIndex = 1;
  box.style.position = "absolute";

  progressControl.insertBefore(box, progressControl.firstChild);

  arrayOFSegment.forEach((item) => {
    const width = ((item[1] - item[0]) / totalDuration) * 100;

    const segment = document.createElement("span");
    segment.style.width = `${width}%`;
    segment.style.position = "relative";
    segment.style.height = "150%";
    segment.style.backgroundColor = "grey";
    segment.style.margin = "0 1px";
    segment.style.cursor = "pointer";

    const hoverBox = document.createElement("span");
    hoverBox.className = "hoverBox";
    hoverBox.style.width = "fit-content";
    hoverBox.style.padding = "0.5em";
    hoverBox.style.backgroundColor = "black";
    hoverBox.style.display = "none";
    hoverBox.style.color = "white";
    hoverBox.textContent = item[2];
    hoverBox.style.position = "absolute";

    segment.appendChild(hoverBox);
    box.appendChild(segment);

    // Add event listener for mouseover
    segment.addEventListener("mouseover", function (e) {
      const parentRect = e.currentTarget.getBoundingClientRect();
      const mouseX = e.pageX - parentRect.left;
      hoverBox.style.left = `${mouseX}px`;
      hoverBox.style.top = `${-50}px`;
      hoverBox.style.display = "block";
    });

    // Add event listener for mouseout
    segment.addEventListener("mouseout", function () {
      hoverBox.style.display = "none";
    });
  });

  // console.log("box:", box);
}
