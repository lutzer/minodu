import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {

  getHello() {
    return {
      message: 'Minodu Backend API',
      statusCode: 200,
    };
  }
}
