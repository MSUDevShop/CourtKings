import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { BehaviorSubject, Observable } from 'rxjs/Rx';
import map from 'rxjs/add/operator/map';
import { Court, CourtDetail } from '../../types';


const QUERY_COURT_DETAIL_BY_ID = gql`
  query courtDetail($courtId: ID!) {
    Court(id: $courtId) {
      id
      courtKings {
        id
        teamName
        wins
        players {
          profilePic
        }
      }
      courtName
      latitude
      longitude
      standings {
        wins
        teamName
      }
      challenges {
        gameTime
        teams {
          teamName
        }
      }
    }
  }
`;

const QUERY_ALL_COURTS = gql`
  query{
    allCourts {
      id
      courtName
      latitude
      longitude
    }
  }
`;

@Injectable()
export default class CourtProvider {
  private _allCourts: BehaviorSubject<Array<Court>> = new BehaviorSubject([]);
  private readonly allCourts: Observable<Array<Court>> = this._allCourts.asObservable();
  private fetching = true;

  constructor(private http: HttpClient, private apollo: Apollo) {
    this.fetchCourts().subscribe((courts) => this.fetching = false);
  }

  fetchCourts(): Observable<Array<Court>> {
    const obs = this.apollo
      .query({ query: QUERY_ALL_COURTS })
      .map(({ data }: any) => data.allCourts);
    obs.subscribe(this._allCourts);
    return obs;
  }

  getAllCourts(): Observable<Array<Court>> {
    return this.allCourts;
  }

  getCourtById(id: string): Observable<CourtDetail> {
    return this.apollo
      .query({ query: QUERY_COURT_DETAIL_BY_ID, variables: { courtId: id } })
      .map(({ data }: any) => data.Court);
  }

}
