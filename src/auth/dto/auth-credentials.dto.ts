import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

/**
 * See:
 * https://gist.github.com/arielweinberger/18a29bfa17072444d45adaeeb8e92ddc
 */

export class AuthCredentialsDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  /*
    - Passwords will contain at least 1 upper case letter
    - Passwords will contain at least 1 lower case letter
    - Passwords will contain at least 1 number or special character
    - There is no length validation (min, max) in this regex!
  */
  password: string;
}
