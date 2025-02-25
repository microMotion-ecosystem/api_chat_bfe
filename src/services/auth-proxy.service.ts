import { Injectable } from '@nestjs/common';
import { MyHttpService } from '../core/my-http-client-service/my-http.service';
import * as process from 'node:process';
import { firstValueFrom, last, lastValueFrom, map } from 'rxjs';

@Injectable()
export class AuthProxyService {
  constructor(private readonly httpService: MyHttpService) {}
  // reset-password-send-otp
  // reset-password-verify-otp

  baseUrl = process.env.URL_AUTH_SERVICE + '/api/v1/auth';

  async signIn(body: any, header: any) {
    return lastValueFrom(
      this.httpService.post(
        this.baseUrl + '/login',
        body,

        header,
      ),
    );
  }
  async signUp(body: any, header: any) {
    return lastValueFrom(
      this.httpService.post(
        this.baseUrl + '/register',
        body,

        header,
      ),
    );
  }
  async usersNumber(header: any) {
    return lastValueFrom(this.httpService.get(this.baseUrl + `/user-number`, header).pipe(map((item) => item.data)));
  }
  async getOneUser(id: string, header: any) {
    return lastValueFrom(this.httpService.get(this.baseUrl + `/${id}`, header).pipe(map((item) => item.data)));
  }
  async getAllUsers(header: any, query: any) {
    const queryStr = this.httpService.handelFilter(query);
    return lastValueFrom(this.httpService.get(`${this.baseUrl}?${queryStr}`, header).pipe(map((item) => item.data)));
  }
  async createUser(body: any, header: any) {
    return lastValueFrom(
      this.httpService.post(this.baseUrl + '/create-user', body, header).pipe(map((item) => item.data)),
    );
  }
  async updateUser(id: string, body: any, header: any) {
    return lastValueFrom(
      this.httpService.put(this.baseUrl + `/update-user/${id}`, body, header).pipe(map((item) => item.data)),
    );
  }
  async updateRole(id: string, body: any, header: any) {
    return lastValueFrom(
      this.httpService.put(this.baseUrl + `/update-role/${id}`, body, header).pipe(map((item) => item.data)),
    );
  }
  async updatePass(body: any, header: any) {
    return lastValueFrom(
      this.httpService.put(this.baseUrl + `/update-pass`, body, header).pipe(map((item) => item.data)),
    );
  }
  async deleteUser(id: string, header: any) {
    return lastValueFrom(
      this.httpService.delete(this.baseUrl + `/delete-user/${id}`, header).pipe(map((item) => item.data)),
    );
  }
  async sendOtp(data: any, header: any): Promise<any> {
    const url = `${this.baseUrl}/reset-password-send-otp`;
    return await firstValueFrom(this.httpService.post(url, data, header).pipe(map((item) => item.data)));
  }
  async validateOtp(data: any, header: any): Promise<any> {
    const url = `${this.baseUrl}/reset-password-verify-otp`;
    return await firstValueFrom(this.httpService.post(url, data, header).pipe(map((item) => item.data)));
  }
  async verifyPassword(data:any,header:any):Promise<any>{
    const url =`${this.baseUrl}/verify-password`;
    return await firstValueFrom(this.httpService.post(url, data, header).pipe(map((item) => item.data)));
  }
}
