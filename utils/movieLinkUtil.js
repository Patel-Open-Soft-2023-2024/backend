const cloudFrontUrl = "https://dge8ab9n7stt8.cloudfront.net/";

class MovieLinks {
  constructor(previewFile, premiumFile, standardFile, basicFile) {
    this.previewLink = cloudFrontUrl + previewFile;
    this.premiumLink = cloudFrontUrl + premiumFile;
    this.standardLink = cloudFrontUrl + standardFile;
    this.basicLink = cloudFrontUrl + basicFile;
  }
  getLinkBySubscription(subscription) {
    switch (subscription) {
      case "premium":
        return this.premiumLink;
      case "standard":
        return this.standardLink;
      case "basic":
        return this.basicLink;
      case "preview":
        return this.previewLink;
    }
  }
  getPreviewLink() {
    return this.previewLink;
  }
}

// Creating instances of MovieLinks for each movie
const oppenheimer = new MovieLinks(
  "Oppenheimer/Oppenheimer_preview.mp4",
  "Oppenheimer/Oppenheimer_1080p.m3u8",
  "Oppenheimer/Oppenheimer_720p.m3u8",
  "Oppenheimer/Oppenheimer_540p.m3u8"
);

const bigBuckBunny = new MovieLinks(
  "BigBuckBunny/BigBuckBunny_preview.mp4",
  "BigBuckBunny/BigBuckBunny_premium.m3u8",
  "BigBuckBunny/BigBuckBunny_standard.m3u8",
  "BigBuckBunny/BigBuckBunny_basic.m3u8"
);

const roadHouse = new MovieLinks(
  "Video/preview_Road_House.mp4",
  "Video/sample_premium.m3u8",
  "Video/sample_standard.m3u8",
  "Video/sample_basic.m3u8"
);

const baby_driver = new MovieLinks(
  "baby_driver/baby_driver_preview.mp4",
  "baby_driver/baby_driver_premium.m3u8",
  "baby_driver/baby_driver_standard.m3u8",
  "baby_driver/baby_driver_basic.m3u8"
);

const singham = new MovieLinks(
  "singham/singham_preview.mp4",
  "singham/singham_premium.m3u8",
  "singham/singham_standard.m3u8",
  "singham/singham_basic.m3u8"
);

// Adding instances to a list
const movieLinksList = [
  oppenheimer,
  bigBuckBunny,
  roadHouse,
  baby_driver,
  singham,
];

const rangeMax = movieLinksList.length;
function insertPreviewLink(movieList) {
  movieList.forEach((movie) => {
    const objectId = movie._id;
    const decimalRepresentation = BigInt("0x" + objectId);
    const hashValue = Number(decimalRepresentation % BigInt(rangeMax));

    movie.previewLink = movieLinksList[hashValue].getPreviewLink();
    movie.alternatePoster = "https://fontmeme.com/images/oppenheimer-font.jpg";
  });
}


const getLink = (movieId, subscription) => {
  console.log("Getting Link for: ", movieId, subscription)
  const decimalRepresentation = BigInt("0x" + movieId);
  const hashValue = Number(decimalRepresentation % BigInt(rangeMax));
  // const tier=req.user.subscription;//TODO: email -> user -> tier  [Done --> need Testing]
  return movieLinksList[hashValue].getLinkBySubscription(subscription);  
};

module.exports = { insertPreviewLink, getLink };
