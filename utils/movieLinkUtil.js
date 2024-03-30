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
  "BigBuckBunny/BigBuckBunny1080p.m3u8",
  "BigBuckBunny/BigBuckBunny720p.m3u8",
  "BigBuckBunny/BigBuckBunny540p.m3u8"
);

const roadHouse = new MovieLinks(
  "Video/preview_Road_House.mp4",
  "Video/sample_1080p.m3u8",
  "Video/sample_720p.m3u8",
  "Video/sample_540p.m3u8"
);

const baby_driver = new MovieLinks(
  "baby_drive/baby_driver_preview.mp4",
  "baby_driver/baby_driver_1080p.m3u8",
  "baby_driver/baby_driver_720p.m3u8",
  "baby_driver/baby_driver_540p.m3u8"
);

const singham = new MovieLinks(
  "singham/singham_preview.mp4",
  "singham/singham_1080p.m3u8",
  "singham/singham_720p.m3u8",
  "singham/singham_540p.m3u8"
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

const getLink = async (req, res) => {

  try {
    // const isNextServer = 
    const objectId = req.params.id;
    const decimalRepresentation = BigInt("0x" + objectId);
    const hashValue = Number(decimalRepresentation % BigInt(rangeMax));

    res
      .status(200)
      .json(movieLinksList[hashValue].getLinkBySubscription("premium"));
  } catch (error) {
    console.error(error);
  }
};
module.exports = { insertPreviewLink, getLink };
