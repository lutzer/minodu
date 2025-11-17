
export class Configuration {
    id: number;
    communityName: string;
    communityIntroduction: string;
    adresse: string;
    location: string;
    whatsappLink: string;
    stationLink: string;
    createdAt: string;

    constructor(id: number, communityName: string, communityIntroduction: string, adresse: string, location: string, whatsappLink: string, stationLink: string, createdAt: string) {
      this.id = id;
      this.communityName = communityName;
      this.communityIntroduction = communityIntroduction;
      this.adresse = adresse;
      this.location = location;
      this.whatsappLink = whatsappLink;
      this.stationLink = stationLink;
      this.createdAt = createdAt;
    }

    static fromJson(json: any): Configuration {
      return new Configuration(
        json.id,
        json.community_name,
        json.community_introduction,
        json.adresse,
        json.location,
        json.whatsapp_link,
        json.station_link,
        json.createdAt
      );
    }
  }