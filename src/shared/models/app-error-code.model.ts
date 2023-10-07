import { HttpStatus } from '@nestjs/common';

export class AppErrorCode {
  private constructor(
    public readonly httpStatus: HttpStatus,
    public readonly code: string,
    public readonly message: string,
  ) {}

  public static readonly ERR400000 = new AppErrorCode(HttpStatus.BAD_REQUEST, 'ERR400000', 'Bad Request!');
  public static readonly ERR401000 = new AppErrorCode(HttpStatus.UNAUTHORIZED, 'ERR401000', 'Unauthorized!');
  public static readonly ERR403000 = new AppErrorCode(HttpStatus.FORBIDDEN, 'ERR403000', 'Forbidden!');
  public static readonly ERR404000 = new AppErrorCode(HttpStatus.NOT_FOUND, 'ERR404000', 'Not Found!');
  public static readonly ERR500000 = new AppErrorCode(
    HttpStatus.INTERNAL_SERVER_ERROR,
    'ERR500000',
    'Internal Server Error',
  );

  public static readonly ERR409001 = new AppErrorCode(HttpStatus.CONFLICT, 'ERR409001', 'Username is already used!');

  public static readonly ERR500001 = new AppErrorCode(
    HttpStatus.INTERNAL_SERVER_ERROR,
    'ERR500001',
    'Failed to try to execute',
  );
}
