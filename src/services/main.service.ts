import {Injectable} from "@angular/core";
import {Http} from '@angular/http';
import {Observable} from "rxjs";
import 'rxjs/Rx';
import {Store} from "@ngrx/store";
import {AppStore} from "../store";
import {NavController} from "ionic-angular";
import {SET_ELECTION} from "../reducers/election.reducer";
import {InfoCard, SwipeCard} from "../pages/home/home";
import {Answer} from "../pages/swipe/swipe";

export interface DataElections {
  meta: {code: number},
  response: {elections: Election[]}
}

export interface DataPropositions {
  meta: {code: number},
  response: {proposition: Proposition[]}
}

export interface Election {
  id: string,
  name: string,
  namespace: string,
  published: boolean,
  date: string,
  candidacies: Candidacy[],
  country: {name: string, namespace: string},
  tags: Tag[]
}

export interface Candidacy {
  id: string,
  published: boolean,
  namespace: string,
  candidates: Candidate[],
  candidacy_candidate_profile: CandidacyCandidateProfile
}

export interface Candidate {
  id: string,
  namespace: string,
  firstName: string,
  lastName: string,
  photo: Photo
}

export interface CandidacyCandidateProfile {
  name: string,
  phone: number,
  birthday: string,
  email: string,
  address: string,
  postal_code: number,
  biography: string,
  introduction: string,
  twitter: string,
  facebook: string,
  youtube: string,
  wikipedia: string,
  website: string,
  cibul: string,
  political_party: string
}

export interface Photo {
  sizes: {
    small: {url: string},
    medium: {url: string},
    large: {url: string}
  }
}

export interface Tag {
  position: number,
  id: string,
  name: string,
  namespace: string,
  icon: Icon
}

export interface Icon {
  prefix: string,
  sizes: number[],
  name: string
}

export interface Proposition {
  id: string,
  text: string,
  favorite_users_count: number,
  against_users_count: number,
  support_users_count: number,
  tags: {id: string}[],
  comments: {count: number},
  favorite_users: {count: number, data: string[]},
  against_users: {count: number, data: string[]},
  support_users: {count: number, data: string[]},
  candidacy: {id: string},
  embeds: string[]
}

@Injectable()
export class MainService {
  server = "http://compare.voxe.org/api/v1/";
  electionNameSpace = "primaire-de-la-droite-2016";
  //electionNameSpace = "primaire-de-la-gauche-(à-venir)";
  election: Observable<Election>;
  nav: Observable<NavController>;
  cards: Observable<Array<InfoCard|SwipeCard>>;
  infoUrl: Observable<Array<string>>;
  answers: Observable<Array<Answer>>;

  constructor(private http: Http, private store: Store<AppStore>) {
    this.election = store.select('election');
    this.nav = store.select('nav');
    this.cards = store.select('cards');
    this.infoUrl = store.select('infoUrl');
    this.answers = store.select('answers');
  }

  // OK
  getElectionViaVoxe(): Observable<Election> {
    return this.http.get(this.server+'elections/search')
      .map(data => {
        //console.log("data:"+data.json());
        return data.json().response.elections;
      })
      .map(elections => {
        //console.log("elections:"+elections);
        return elections.filter(election => election.namespace == this.electionNameSpace)[0];
      });
  }

  // Helper which returns true if the 2 arrays have a common element
  // Pourquoi pas avec des indexOf() ?
  hasCommonElement(arr1: Array<any>, arr2: Array<any>): boolean {
    for(var i=0; i<arr1.length; i++) {
      for(var j=0; j<arr2.length; j++) {
        if(arr1[i] == arr2[j]) {
          // console.log("I'm about to return a true!");
          return true;
        }
      }
    }
    // console.log("And... that's a false again!");
    return false;
    // arr1.forEach(x1 => {
    //   arr2.forEach(x2 => {
    //     if(x1 == x2) {
    //       console.log("I'm about to return true!");
    //       return true;
    //     }
    //   });
    // });
    // console.log("And... that's a false again!");
    // return false;
  }

  // Helper which transforms an array of observables in an observable of an array
  arrObs2ObsArr(arrObs: Array<Observable<any>>): Observable<Array<any>> {
    return Observable.from(arrObs).flatMap(x => x);
  }

  getStars(cards: Array<InfoCard|SwipeCard>) {
    console.log("getStars");
    return cards.filter(card => card.isStar);
  }

  getNoArchive(cards: Array<InfoCard|SwipeCard>) {
    return cards.filter(card => !card.isArchive);
  }

  getArchives(cards: Array<InfoCard|SwipeCard>) {
    return cards.filter(card => card.isArchive);
  }

  // Takes an array of cards and returns an array of rows (a row is an array of 2 cards)
  putCardsInRows(cards: Array<InfoCard|SwipeCard>) {
    let rows: Array<InfoCard|SwipeCard>[] = [];
    for (let i=0; i<cards.length-1; i+=2) {
      rows.push([cards[i],cards[i+1]]);
    }
    if (cards.length==1) {
      rows.push([cards[0]]);
    }
    else if (cards.length%2!=0) {
      rows.push([cards[cards.length-1]]);
    }
    return rows;
  }

  // SALE HARD CODAGE TEMPORAIRE
  francoisFillonId = "578f480ab0bba9398100000b";
  alainJuppeId = "57962957793b3f868d000012";
  vincentPeillonId = "58511f947ab19e01d2000076";
  benoitHamonId = "5851168e7ab19e6a87000043";
  emploiId = "4ef479f9bc60fb000400009a";
  economieId = "4ef479f9bc60fb00040000aa";
  financeId = "4ef479f9bc60fb00040000be";
  europeId = "4ef479fcbc60fb0004000204";
  educationId = "4ef479f9bc60fb0004000052";
  cultureId = "578504e585b1a8f7f6000094";
  numeriqueId = "4ef479f8bc60fb000400002c";
  justiceId = "4ef479f9bc60fb00040000cc";

}
