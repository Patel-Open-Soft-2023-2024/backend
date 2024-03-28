
const cloudFrontUrl = 'https://dge8ab9n7stt8.cloudfront.net/'

class MovieLinks {
    constructor(id, previewFile, premiumFile, standardFile, basicFile) {
        this.id = id;
        this.previewLink = cloudFrontUrl + previewFile;
        this.premiumLink = cloudFrontUrl + premiumFile;
        this.standardLink = cloudFrontUrl + standardFile
        this.basicLink = cloudFrontUrl + basicFile;
    }
    getLinkBySubscription(subscription) {
        switch (subscription) {
            case 'premium':
                return this.premiumLink;
            case 'standard':
                return this.standardLink;
            case 'basic':
                return this.basicLink;
            case 'preview':
                return this.previewLink;
        }
    }
}


// Creating instances of MovieLinks for each movie
const oppenheimer = new MovieLinks(
    1,
    "Oppenheimer/Oppenheimer_preview.mp4",
    "Oppenheimer/Oppenheimer_1080p.m3u8",
    "Oppenheimer/Oppenheimer_720p.m3u8",
    "Oppenheimer/Oppenheimer_540p.m3u8"
);

const bigBuckBunny = new MovieLinks(
    2,
    "BigBuckBunny/BigBuckBunny_preview.mp4",
    "BigBuckBunny/BigBuckBunny1080p.m3u8",
    "BigBuckBunny/BigBuckBunny720p.m3u8",
    "BigBuckBunny/BigBuckBunny540p.m3u8"
);

const roadHouse = new MovieLinks(
    3,
    "Video/preview_Road_House.mp4",
    "Video/sample_1080p.m3u8",
    "Video/sample_720p.m3u8",
    "Video/sample_540p.m3u8"
);

// Adding instances to a list
const movieLinksList = [oppenheimer, bigBuckBunny, roadHouse];



const rangeMax = 3;
function insertPreviewLink(movieList) {
    movieList.forEach(movie => {
        const objectId = movie._id;
        const decimalRepresentation = BigInt('0x' + objectId);
        const hashValue = (decimalRepresentation % BigInt(rangeMax)) + BigInt(1);
        movie.previewLink = movieLinksList[hashValue].previewLink;
    });

}


module.exports = { insertPreviewLink }