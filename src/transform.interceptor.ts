/**
 * See:
 * https://gist.github.com/arielweinberger/f5c02406b48bb0e145e8542c7006649f
 */

import {
  NestInterceptor,
  ExecutionContext,
  Injectable,
  CallHandler,
} from '@nestjs/common';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  removeKeys(keys: string[], obj: any) {
    for (const prop in obj) {
      if (keys.includes(prop)) delete obj[prop];
      else if (typeof obj[prop] === 'object') this.removeKeys(keys, obj[prop]);
    }
    return obj;
  }

  intercept(_context: ExecutionContext, next: CallHandler<any>) {
    return next.handle().pipe(
      map((data) => {
        return this.removeKeys(['password', 'deletedAt'], data);
      }),
    );
  }
}
