import { HttpException, HttpStatus } from '@nestjs/common';

export class DocumentNotFoundError extends HttpException {
  name = 'DocumentNotFoundError';

  constructor(id: string, type: string) {
    super(`<${type}> document not found with ID: ${id}`, HttpStatus.NOT_FOUND);
  }
}
